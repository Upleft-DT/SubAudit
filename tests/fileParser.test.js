const JSZip = require('jszip');
global.JSZip = JSZip;

const { parseFile, parseSubscriptionsCSV } = require('../script.js');

const VALID_CSV = [
    'Channel Id,Channel Url,Channel Title',
    'UCabc,https://www.youtube.com/channel/UCabc,Channel Alpha',
    'UCxyz,https://www.youtube.com/channel/UCxyz,Channel Beta',
].join('\n');

// ── parseSubscriptionsCSV ──────────────────────────────────────

describe('parseSubscriptionsCSV', () => {
    test('parses valid CSV into channel records', () => {
        const result = parseSubscriptionsCSV(VALID_CSV);
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
            channelId: 'UCabc',
            channelUrl: 'https://www.youtube.com/channel/UCabc',
            channelTitle: 'Channel Alpha',
        });
        expect(result[1]).toEqual({
            channelId: 'UCxyz',
            channelUrl: 'https://www.youtube.com/channel/UCxyz',
            channelTitle: 'Channel Beta',
        });
    });

    test('returns empty array for header-only CSV', () => {
        expect(parseSubscriptionsCSV('Channel Id,Channel Url,Channel Title')).toEqual([]);
    });

    test('returns empty array for empty/whitespace input', () => {
        expect(parseSubscriptionsCSV('   ')).toEqual([]);
        expect(parseSubscriptionsCSV('')).toEqual([]);
    });

    test('throws for missing Channel Id column', () => {
        expect(() => parseSubscriptionsCSV('Name,URL\nfoo,bar')).toThrow(/Channel Id/i);
    });

    test('handles quoted fields containing commas', () => {
        const csv = 'Channel Id,Channel Url,Channel Title\nUCabc,https://youtube.com,"Channel, With Comma"';
        const result = parseSubscriptionsCSV(csv);
        expect(result[0].channelTitle).toBe('Channel, With Comma');
    });

    test('handles quoted fields containing double quotes', () => {
        const csv = 'Channel Id,Channel Url,Channel Title\nUCabc,https://youtube.com,"Channel ""Quoted"""';
        const result = parseSubscriptionsCSV(csv);
        expect(result[0].channelTitle).toBe('Channel "Quoted"');
    });

    test('handles CRLF line endings', () => {
        const csv = 'Channel Id,Channel Url,Channel Title\r\nUCabc,https://youtube.com,Alpha\r\n';
        const result = parseSubscriptionsCSV(csv);
        expect(result).toHaveLength(1);
        expect(result[0].channelId).toBe('UCabc');
    });

    test('filters out rows with empty channel ID', () => {
        const csv = 'Channel Id,Channel Url,Channel Title\nUCabc,url1,Valid\n,,No ID';
        const result = parseSubscriptionsCSV(csv);
        expect(result).toHaveLength(1);
        expect(result[0].channelId).toBe('UCabc');
    });

    test('handles rows with fewer fields than the header', () => {
        const csv = 'Channel Id,Channel Url,Channel Title\nUCabc';
        const result = parseSubscriptionsCSV(csv);
        expect(result).toHaveLength(1);
        expect(result[0].channelId).toBe('UCabc');
        expect(result[0].channelUrl).toBe('');
        expect(result[0].channelTitle).toBe('');
    });
});

// ── parseFile ─────────────────────────────────────────────────

describe('parseFile', () => {
    test('parses a direct CSV file', async () => {
        const mockFile = {
            name: 'subscriptions.csv',
            text: () => Promise.resolve(VALID_CSV),
        };
        const result = await parseFile(mockFile);
        expect(result).toHaveLength(2);
        expect(result[0].channelId).toBe('UCabc');
    });

    test('extracts subscriptions.csv from a Takeout ZIP', async () => {
        const zip = new JSZip();
        zip.file('Takeout/YouTube and YouTube Music/subscriptions/subscriptions.csv', VALID_CSV);
        const buf = await zip.generateAsync({ type: 'nodebuffer' });
        buf.name = 'takeout-export.zip';
        const result = await parseFile(buf);
        expect(result).toHaveLength(2);
        expect(result[1].channelTitle).toBe('Channel Beta');
    });

    test('throws a clear error when ZIP is missing subscriptions.csv', async () => {
        const zip = new JSZip();
        zip.file('unrelated.txt', 'nothing useful here');
        const buf = await zip.generateAsync({ type: 'nodebuffer' });
        buf.name = 'takeout-export.zip';
        await expect(parseFile(buf)).rejects.toThrow(/subscriptions\.csv not found/);
    });

    test('throws for unsupported file types', async () => {
        const mockFile = { name: 'export.json', text: () => Promise.resolve('{}') };
        await expect(parseFile(mockFile)).rejects.toThrow(/Unsupported file type/);
    });

    test('throws a helpful error for .tgz files', async () => {
        const mockFile = { name: 'takeout.tgz', text: () => Promise.resolve('') };
        await expect(parseFile(mockFile)).rejects.toThrow(/\.tgz/);
    });
});
