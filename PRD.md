# PRD: SubAudit — YouTube Subscription Auditor

## Problem Statement

YouTube users accumulate subscriptions over years with no built-in way to identify which channels have gone inactive. A user with hundreds of subscriptions has no visibility into which creators have stopped posting, making it impossible to keep their subscription list meaningful. The only option today is manually clicking through each channel — an approach that doesn't scale beyond a handful of channels.

## Solution

SubAudit is a single-page web app that accepts a Google Takeout export and produces an instant audit of all subscriptions, sorted into three categories: Dead (no upload in 12+ months), Dormant (no upload in 3–12 months), and Active (uploaded in last 3 months). No account login required. All processing happens in-browser using the YouTube Data API v3. The user gets a visual report with per-channel details and a CSV export they can act on.

## User Stories

1. As a YouTube user, I want to drop my Google Takeout ZIP file onto the page and immediately see my subscriptions analyzed, so that I don't need to manually extract files or run any setup.
2. As a YouTube user, I want to drop the extracted `subscriptions.csv` directly if I already have it, so that I can skip the ZIP extraction step.
3. As a YouTube user, I want to see my total subscription count at a glance, so that I know the full scope of what's being analyzed.
4. As a YouTube user, I want channels with no upload in over 12 months clearly labeled as Dead, so that I can decide whether to unsubscribe from them.
5. As a YouTube user, I want channels with no upload in 3–12 months labeled as Dormant, so that I can monitor them before deciding to unsubscribe.
6. As a YouTube user, I want channels that uploaded within the last 3 months labeled as Active, so that I can confirm they're still producing content.
7. As a YouTube user, I want to see each channel's thumbnail, so that I can visually identify familiar channels quickly.
8. As a YouTube user, I want each channel name to link directly to its YouTube page, so that I can visit and review a channel in one click.
9. As a YouTube user, I want to see each channel's subscriber count, so that I can gauge a channel's current reach alongside its activity status.
10. As a YouTube user, I want to see the date of each channel's last upload, so that I know exactly how long it's been since they posted.
11. As a YouTube user, I want to see the title of each channel's most recent video, so that I know what kind of content they last published.
12. As a YouTube user, I want Dead channels sorted by oldest last-upload first, so that the most neglected channels appear at the top.
13. As a YouTube user, I want Dormant channels sorted by oldest last-upload first, so that the ones closest to becoming Dead appear at the top.
14. As a YouTube user, I want Active channels sorted by most recently uploaded first, so that the most prolific creators appear at the top.
15. As a YouTube user, I want to see a live progress counter while the app is fetching data, so that I know the analysis is working and how far along it is.
16. As a YouTube user, I want the analysis to complete in under 15 seconds for 200 subscriptions, so that I don't have to wait an unreasonable amount of time.
17. As a YouTube user, I want to download all results as a CSV file with one click, so that I can process or share the data in a spreadsheet.
18. As a YouTube user, I want the exported CSV to include channel name, URL, subscriber count, last upload date, last video title, and status, so that I have everything I need in one file.
19. As a YouTube user, I want channels that couldn't be resolved due to API quota exhaustion to appear as "unknown" in the export, so that I know which channels weren't checked rather than silently missing them.
20. As a YouTube user, I want to see a clear message if the API quota is exhausted mid-analysis, so that I understand why some channels show as unknown.
21. As a YouTube user, I want partial results shown even when quota is exhausted, so that I get value from the channels that were successfully checked.
22. As a YouTube user, I want the app to work on both dark and light system themes, so that it matches my display preferences without any manual toggle.
23. As a YouTube user, I want the app to work entirely in-browser without creating an account, so that I don't need to hand over my credentials.

## Implementation Decisions

### Module: File Parser
Accepts the dropped file and returns a structured list of channel records. Handles three input types: `.zip` (full Takeout archive), `.tgz` (gzip-compressed Takeout), and `.csv` (extracted subscriptions file). For archive types, it locates `subscriptions.csv` automatically by path suffix. Produces `{ channelId, channelUrl, channelTitle }` records. Uses JSZip for in-browser ZIP parsing. This module has no network or DOM dependency — it is a pure transformation.

### Module: YouTube API Client
Single public interface: given a list of channel IDs, return enriched channel data for each. Internally: batches IDs into groups of 50 for `channels.list` (1 quota unit per batch), then fires `playlistItems.list` for each channel's uploads playlist to get the latest video (1 quota unit each). Enforces a concurrency limit of 5 parallel in-flight requests. Retries automatically on HTTP 429 with backoff. On quota exhaustion (HTTP 403 with `quotaExceeded` reason), marks remaining channels as unknown and surfaces a quota-exhausted flag to the caller. The API key is embedded and restricted by HTTP Referer in Google Cloud Console.

### Module: Channel Classifier
Pure function. Accepts a last-upload date (or `null` for unknown) and returns one of four statuses:
- `active` — uploaded within 90 days
- `dormant` — uploaded 90–365 days ago
- `dead` — no upload in 365+ days
- `unknown` — date unavailable (quota exhausted or channel has no uploads)

Thresholds are constants, not magic numbers.

### Module: Results Renderer
Takes the full list of classified channel data, splits into three groups, sorts each group (Dead/Dormant: oldest first; Active: newest first), and renders them into three collapsible sections in the DOM. Each row contains thumbnail, linked channel name, subscriber count, formatted last upload date, and last video title. Updates the DOM in one pass after all data is ready.

### Module: Export Module
Pure transformation: takes the classified channel list and serializes it to a CSV string with columns `Channel Name, Channel URL, Subscriber Count, Last Upload Date, Last Video Title, Status`. Triggers a browser download via `Blob` + `URL.createObjectURL`. No DOM side effects beyond creating a transient `<a>` element.

### Module: Progress Tracker
Thin wrapper around a DOM element. Exposes `update(current, total)` and `done()`. Called by the API Client as each channel resolves. No business logic.

### Hosting & Deployment
GitHub Pages, served from the `main` branch. No build step. Three files: `index.html`, `script.js`, `style.css`.

### Dependencies
- JSZip (CDN) for ZIP parsing
- Pico.css (CDN) for styling — auto dark/light via system preference

## Testing Decisions

Good tests for this project verify behavior from the outside — they don't assert on internal structure, variable names, or implementation order. A test should break only when observable behavior changes.

### Modules to test

**File Parser** — highest priority. Pure function with well-defined inputs (file bytes) and outputs (channel record list). Test: valid Takeout ZIP containing `subscriptions.csv` → correct record list; direct CSV input → correct record list; ZIP missing the expected file → meaningful error; malformed CSV → graceful handling.

**Channel Classifier** — second priority. Pure function, trivial to test exhaustively. Test all four branches: date within 90 days → `active`; date 91–364 days → `dormant`; date 365+ days → `dead`; `null` input → `unknown`. Test boundary dates exactly at 90 and 365 days.

**Export Module** — third priority. Pure function from data to string. Test: correct CSV header row; correct row count; special characters (commas, quotes) in channel names are properly escaped; `unknown` status channels render correctly.

**YouTube API Client** and **Results Renderer** are not targeted for unit tests in v1 — the former requires mocking HTTP (adds test infrastructure complexity for limited gain), the latter is DOM-heavy. Integration or end-to-end tests are a better fit for v2.

## Out of Scope

- **Shorts detection** — checking whether a channel's recent uploads are YouTube Shorts (≤60s). Doubles quota usage. Deferred to v2 as an opt-in checkbox.
- **Bulk unsubscribe** — requires YouTube OAuth write scope and Google's sensitive scope review process. Deferred to v2.
- **User-supplied API key** — removes shared-key quota constraint. Deferred to v2.
- **Custom domain** (`subaudit.app`) — straightforward Netlify upgrade, not day-one.
- **Backend/proxy** — for quota protection and key hiding. Not needed for v1's acceptance of casual abuse.
- **OAuth login** — app works without any Google account sign-in.

## Further Notes

- The shared API key will be restricted by HTTP Referer (GitHub Pages domain) in Google Cloud Console. Header spoofing is a known, accepted risk for v1.
- Default quota is 10,000 units/day. A user with 500 subscriptions consumes ~510 units. Roughly 20 such users exhaust the daily quota. A quota increase request should be filed once real usage is observed.
- Date thresholds (90 days, 365 days) are the source of truth for classification and must match between the Channel Classifier and any UI copy describing the categories.
