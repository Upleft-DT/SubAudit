# SubAudit — Research & Design Document

Single-page web app that analyzes a Google Takeout export and audits YouTube subscriptions into three categories: Dead, Dormant, and Active.

---

## Problem

YouTube users accumulate subscriptions over years. There is no built-in way to see which channels have gone inactive. SubAudit fills that gap: drop in your Takeout file, get a categorized report in seconds.

---

## Core Output

1. **Total subscriptions** — N
2. **Dead channels** (no upload in 12+ months) — count + list
3. **Dormant channels** (no upload in 3–12 months) — count + list
4. **Active channels** (uploaded in last 3 months) — count + list

Each channel row shows: thumbnail, name (linked to channel), subscriber count, last upload date, last video title.

---

## Architecture Decisions

### Hosting
**GitHub Pages** — static, free, zero config. Deploy by pushing. Future upgrade path: Netlify + custom domain (`subaudit.app`).

### Stack
**Vanilla JS + HTML + CSS** — no build step, no framework. The app is one interaction: drop file → show report. No routing or state management needed.

### Styling
**Pico.css via CDN** — single `<link>` tag, semantic HTML styled automatically, ~10KB, looks professional with minimal custom CSS.

### Dependencies
- **JSZip** (CDN) — parses `.zip` Takeout files in-browser
- **Pico.css** (CDN) — styling
- Everything else: vanilla

---

## API Strategy

### Data Source
Google Takeout → `YouTube and YouTube Music/subscriptions/subscriptions.csv`

CSV columns: `Channel Id`, `Channel Url`, `Channel Title`

Channel IDs feed directly into the YouTube Data API v3.

### API Key
- **Shared key, frontend-embedded** — no backend, seamless UX
- **Referer-restricted** to the GitHub Pages domain in Google Cloud Console
- Accepts casual abuse is possible via header spoofing; acceptable for day one
- Upgrade path: user-supplied key or proxied backend as v2

### API Calls Per Channel
1. `channels.list?part=snippet,contentDetails,statistics&id=ID1,ID2,...ID50` — batchable 50 at a time, 1 quota unit per batch → gets thumbnail, subscriber count, uploads playlist ID
2. `playlistItems.list?part=snippet&playlistId=UU...&maxResults=1` — 1 quota unit each → gets latest video title and publish date

**Effective cost:** ~1 quota unit per channel

### Quota
- Default: 10,000 units/day
- ~10,000 channel lookups/day across all users
- A user with 500 subs consumes ~510 units (~20 such users before cap)
- **Strategy:** fail gracefully — show partial results, label unresolved channels as "unknown", display a clear quota-exhausted message. Request quota increase once real usage is observed.

### Concurrency
**5 parallel requests** with automatic retry on 429. Balances speed vs. rate-limit safety.
- Sequential (200 channels): ~60s
- 5 concurrent (200 channels): ~5–10s

---

## File Input

**Auto-detect by extension:**
- `.zip` or `.tgz` → extract with JSZip, find `subscriptions.csv` automatically
- `.csv` → parse directly

Users can drop either the full Takeout zip or the extracted CSV. No extraction step required for the common case.

---

## Results Display

### Per-Channel Row
| Field | Source | Extra cost |
|---|---|---|
| Thumbnail (32px avatar) | `channels.list` snippet | Free |
| Channel name (linked) | `channels.list` snippet + channel ID | Free |
| Subscriber count | `channels.list` statistics | Free |
| Last upload date | `playlistItems.list` snippet | Free |
| Last video title | `playlistItems.list` snippet | Free |

All four fields come from the two API calls already being made — no extra quota cost.

### Sorting
- Dead: oldest last-upload first (most neglected at top)
- Dormant: oldest last-upload first
- Active: most recently uploaded first

---

## Export

**Single CSV download** — one button, one file.

Columns: `Channel Name, Channel URL, Subscriber Count, Last Upload Date, Last Video Title, Status`

Status values: `dead`, `dormant`, `active`, `unknown` (quota exhausted)

Implementation: `Blob` + `URL.createObjectURL` — trivial in vanilla JS.

---

## Post-Report Actions

**Informational only for v1.** Each channel name links directly to its YouTube page. No OAuth, no unsubscribe automation.

**v2 upgrade path:** YouTube OAuth write scope (`youtube`) + Google app verification → bulk unsubscribe. Not day-one due to Google's sensitive scope review process.

---

## Deferred (v2)

- **Shorts detection** — sample last 5 videos per channel, check duration ≤60s via `videos.list?part=contentDetails`. Doubles quota usage. Add as opt-in checkbox.
- **Bulk unsubscribe** — requires OAuth write scope
- **User-supplied API key** — removes shared key quota constraint
- **Custom domain** (`subaudit.app`)

---

## File Structure

```
SubAudit/
├── index.html
├── script.js
└── style.css
```

No build step. Push to `gh-pages` branch (or configure GitHub Pages to serve from `main`).

---

## Implementation Notes

- Batch `channels.list` calls: collect all channel IDs, chunk into groups of 50, fire in groups of 5 concurrently
- After getting uploads playlist IDs, fire `playlistItems.list` calls 5 at a time concurrently
- Show live progress counter during processing: `Checking channel 47 / 200...`
- Pico.css dark/light mode is automatic (respects system preference)
- Date thresholds: Dead = last upload > 365 days ago, Dormant = 90–365 days ago, Active = < 90 days ago
