const API_KEY = 'AIzaSyDEiWzqxnCDsSg-MF0Hv3-FdyS4BZos1J8';

const ACTIVE_THRESHOLD_DAYS = 90;
const DEAD_THRESHOLD_DAYS = 365;
const BATCH_SIZE = 50;
const CONCURRENCY_LIMIT = 5;

// ── File Parser ───────────────────────────────────────────────

async function parseFile(file) {
    const name = file.name.toLowerCase();
    if (name.endsWith('.csv')) {
        return parseSubscriptionsCSV(await file.text());
    }
    if (name.endsWith('.zip')) {
        const zip = await JSZip.loadAsync(file);
        const entry = Object.values(zip.files).find(f => f.name.endsWith('subscriptions.csv') && !f.dir);
        if (!entry) throw new Error('subscriptions.csv not found in the ZIP. Make sure this is a Google Takeout export.');
        return parseSubscriptionsCSV(await entry.async('text'));
    }
    if (name.endsWith('.tgz') || name.endsWith('.tar.gz')) {
        throw new Error('.tgz files are not supported. Extract subscriptions.csv from the archive and drop it directly.');
    }
    throw new Error('Unsupported file type. Drop a Google Takeout .zip or the extracted subscriptions.csv.');
}

function parseSubscriptionsCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const header = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
    const idIdx    = header.indexOf('channel id');
    const urlIdx   = header.indexOf('channel url');
    const titleIdx = header.indexOf('channel title');
    if (idIdx === -1) throw new Error('Missing "Channel Id" column. Is this a Google Takeout subscriptions.csv?');

    return lines.slice(1)
        .map(line => {
            const f = parseCSVLine(line);
            return {
                channelId:    (f[idIdx]    ?? '').trim(),
                channelUrl:   (f[urlIdx]   ?? '').trim(),
                channelTitle: (f[titleIdx] ?? '').trim(),
            };
        })
        .filter(r => r.channelId);
}

function parseCSVLine(line) {
    const fields = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
            if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
            else inQ = !inQ;
        } else if (c === ',' && !inQ) {
            fields.push(cur); cur = '';
        } else {
            cur += c;
        }
    }
    fields.push(cur);
    return fields;
}

// ── Channel Classifier ────────────────────────────────────────

function classifyChannel(lastUploadDate) {
    if (!lastUploadDate) return 'unknown';
    const days = (Date.now() - new Date(lastUploadDate).getTime()) / 86_400_000;
    if (days < ACTIVE_THRESHOLD_DAYS) return 'active';
    if (days < DEAD_THRESHOLD_DAYS)   return 'dormant';
    return 'dead';
}

// ── Progress Tracker ──────────────────────────────────────────

const ProgressTracker = {
    update(current, total) {
        const bar = document.getElementById('progress-bar');
        bar.value = current;
        bar.max   = total;
        document.getElementById('progress-text').textContent = `Checking channel ${current} of ${total}…`;
    },
    done() {
        document.getElementById('progress-text').textContent = 'Analysis complete!';
    },
};

// ── YouTube API Client ────────────────────────────────────────

async function fetchChannelData(channels, onProgress) {
    let quotaExhausted = false;
    const channelInfoMap = new Map();

    for (const batch of chunk(channels, BATCH_SIZE)) {
        if (quotaExhausted) break;
        try {
            const data = await apiRequest(
                `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${batch.map(c => c.channelId).join(',')}&maxResults=${BATCH_SIZE}&key=${API_KEY}`
            );
            for (const item of data.items ?? []) {
                channelInfoMap.set(item.id, {
                    channelTitle:       item.snippet?.title ?? null,
                    thumbnail:          item.snippet?.thumbnails?.default?.url ?? null,
                    subscriberCount:    item.statistics?.subscriberCount ?? null,
                    uploadsPlaylistId:  item.contentDetails?.relatedPlaylists?.uploads ?? null,
                });
            }
        } catch (err) {
            if (err.quotaExhausted) { quotaExhausted = true; break; }
            throw err;
        }
    }

    let completed = 0;
    const results = [];

    const tasks = channels.map(channel => async () => {
        const info = channelInfoMap.get(channel.channelId);
        let lastUploadDate = null;
        let lastVideoTitle = null;

        if (info?.uploadsPlaylistId && !quotaExhausted) {
            try {
                const data = await apiRequest(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${info.uploadsPlaylistId}&maxResults=1&key=${API_KEY}`
                );
                const item = data.items?.[0];
                if (item) {
                    lastUploadDate = item.snippet?.publishedAt ?? null;
                    lastVideoTitle = item.snippet?.title       ?? null;
                }
            } catch (err) {
                if (err.quotaExhausted) quotaExhausted = true;
            }
        }

        results.push({
            channelId:      channel.channelId,
            channelUrl:     channel.channelUrl,
            channelTitle:   info?.channelTitle || channel.channelTitle,
            thumbnail:      info?.thumbnail ?? null,
            subscriberCount: info?.subscriberCount ?? null,
            lastUploadDate,
            lastVideoTitle,
            status: info && !quotaExhausted ? classifyChannel(lastUploadDate) : 'unknown',
        });

        onProgress(++completed, channels.length);
    });

    await parallelLimit(tasks, CONCURRENCY_LIMIT);
    return { results, quotaExhausted };
}

async function apiRequest(url, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
        const res = await fetch(url);
        if (res.status === 429) {
            await sleep(1000 * 2 ** attempt);
            continue;
        }
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            if (res.status === 403 && body.error?.errors?.[0]?.reason === 'quotaExceeded') {
                const err = new Error('Quota exceeded');
                err.quotaExhausted = true;
                throw err;
            }
            throw new Error(`API error ${res.status}: ${body.error?.message ?? res.statusText}`);
        }
        return res.json();
    }
    throw new Error('Request failed after retries');
}

// ── Results Renderer ──────────────────────────────────────────

function renderResults(channels) {
    const groups = { dead: [], dormant: [], active: [], unknown: [] };
    for (const ch of channels) groups[ch.status].push(ch);

    groups.dead.sort((a, b)    => +new Date(a.lastUploadDate ?? 0) - +new Date(b.lastUploadDate ?? 0));
    groups.dormant.sort((a, b) => +new Date(a.lastUploadDate ?? 0) - +new Date(b.lastUploadDate ?? 0));
    groups.active.sort((a, b)  => +new Date(b.lastUploadDate ?? 0) - +new Date(a.lastUploadDate ?? 0));

    document.getElementById('total-count').textContent = channels.length;

    for (const status of ['dead', 'dormant', 'active', 'unknown']) {
        document.querySelector(`#${status}-section .count`).textContent = groups[status].length;
        const container = document.getElementById(`${status}-channels`);
        container.innerHTML = '';
        for (const ch of groups[status]) container.appendChild(buildChannelRow(ch));
    }
}

function buildChannelRow(ch) {
    const row = document.createElement('div');
    row.className = 'channel-row';
    row.innerHTML = `
        <div class="channel-thumb">
            ${ch.thumbnail
                ? `<img src="${ch.thumbnail}" alt="" width="36" height="36" loading="lazy">`
                : '<div class="thumb-placeholder"></div>'}
        </div>
        <div class="channel-info">
            <a href="${ch.channelUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(ch.channelTitle || ch.channelId)}</a>
            <span class="sub-count">${ch.subscriberCount != null ? formatNumber(Number(ch.subscriberCount)) + ' subscribers' : 'subscribers hidden'}</span>
        </div>
        <div class="channel-video" title="${escapeHtml(ch.lastVideoTitle ?? '')}">${escapeHtml(ch.lastVideoTitle ?? '—')}</div>
        <div class="channel-date">${ch.lastUploadDate ? formatDate(ch.lastUploadDate) : '—'}</div>
        <span class="status-badge ${ch.status}">${ch.status}</span>
    `;
    return row;
}

// ── Export ────────────────────────────────────────────────────

function exportCSV(channels) {
    const headers = ['Channel Name', 'Channel URL', 'Subscriber Count', 'Last Upload Date', 'Last Video Title', 'Status'];
    const rows = channels.map(ch => [
        ch.channelTitle || ch.channelId,
        ch.channelUrl,
        ch.subscriberCount ?? '',
        ch.lastUploadDate ? formatDate(ch.lastUploadDate) : '',
        ch.lastVideoTitle ?? '',
        ch.status,
    ]);
    const csv = [headers, ...rows].map(r => r.map(csvEscape).join(',')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(blob),
        download: 'subaudit-results.csv',
    });
    a.click();
    URL.revokeObjectURL(a.href);
}

// ── Helpers ───────────────────────────────────────────────────

function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

async function parallelLimit(fns, limit) {
    let i = 0;
    async function worker() {
        while (i < fns.length) await fns[i++]();
    }
    await Promise.all(Array.from({ length: Math.min(limit, fns.length) }, worker));
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatNumber(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toString();
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function csvEscape(val) {
    const s = String(val ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
}

// ── Main ──────────────────────────────────────────────────────

let allResults = [];

async function handleFile(file) {
    const errorEl = document.getElementById('error-message');
    errorEl.hidden = true;
    errorEl.textContent = '';

    try {
        document.getElementById('progress-section').hidden = false;
        document.getElementById('results-section').hidden  = true;
        document.getElementById('quota-warning').hidden    = true;

        const channels = await parseFile(file);
        if (!channels.length) throw new Error('No channels found. Check that this is the correct file.');

        ProgressTracker.update(0, channels.length);

        const { results, quotaExhausted } = await fetchChannelData(channels, ProgressTracker.update.bind(ProgressTracker));
        ProgressTracker.done();

        if (quotaExhausted) document.getElementById('quota-warning').hidden = false;

        allResults = results;
        renderResults(results);
        document.getElementById('results-section').hidden = false;

    } catch (err) {
        document.getElementById('progress-section').hidden = true;
        errorEl.textContent = err.message;
        errorEl.hidden = false;
    }
}

if (typeof module !== 'undefined') {
    module.exports = { parseFile, parseSubscriptionsCSV, parseCSVLine, classifyChannel, csvEscape, exportCSV };
}

document.addEventListener('DOMContentLoaded', () => {
    const dropzone  = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    let dragCounter = 0;

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });

    dropzone.addEventListener('dragenter', e => { e.preventDefault(); dragCounter++; dropzone.classList.add('drag-over'); });
    dropzone.addEventListener('dragleave', () => { if (--dragCounter === 0) dropzone.classList.remove('drag-over'); });
    dropzone.addEventListener('dragover',  e => e.preventDefault());
    dropzone.addEventListener('drop', e => {
        e.preventDefault();
        dragCounter = 0;
        dropzone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    fileInput.addEventListener('change', e => {
        if (e.target.files[0]) handleFile(e.target.files[0]);
    });

    document.getElementById('export-btn').addEventListener('click', () => exportCSV(allResults));
});
