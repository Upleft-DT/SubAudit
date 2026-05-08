# YouTube API App & Extension Ideas — Research Notes

A working document capturing 20 ideas for apps and extensions built on the YouTube API, with competitive analysis and deep dives on the most promising candidates. Compiled through iterative research with attention to existing competitors.

---

## Part 1: First Batch of 10 Ideas

### 1. AI Transcript-Based Video Q&A Bot
Browser extension or web app where you paste a video or channel URL and ask questions, get summaries, extract steps, or build study notes from the transcript.

**Competition:** Crowded. Eightify, NoteGPT, YouTube Summary with ChatGPT, Glasp, Recall, plus YouTube's own native AI summaries are now rolling out. Most saturated YouTube+AI category.

**Verdict:** Skip unless you have a sharp niche.

### 2. "Ask This Channel Anything" — RAG over an entire creator's library
Pick a creator, query their *entire body of work* via chat. Returns synthesized answers with timestamped clips.

**Competition:** Lighter. Some general tools (Recall, ChatYTB) exist but most are per-video. Creators themselves don't typically offer this.

**Verdict:** Promising — especially as a white-label widget sold *to creators* for their own site/Patreon. Lower B2C competition than per-video tools.

### 3. Subscription Detox / Channel Audit Tool
OAuth connect, analyzes subscriptions, shows which channels you actually watch, dormant subs, channels that pivoted niches, watch-time per channel, one-click bulk unsubscribe.

**Competition:** Basic bulk-unsubscribe extensions exist (low ratings, mostly broken). Nothing polished combines OAuth analytics + AI categorization + watch-pattern analysis.

**Verdict:** Real potential. Low-hanging fruit. *(Deep dive below.)*

### 4. Smart Watch Later — auto-categorized with deadlines
Replace YouTube's broken Watch Later with auto-tagging by topic, viewing schedule based on duration, "you've had this for 90 days" prompts.

**Competition:** Heavy. PocketTube dominates. Dozens of Chrome extensions cover the basics.

**Verdict:** Crowded. Niche only.

### 5. Sponsorship & Brand Deal Tracker for Viewers
Detects sponsor segments, tracks which brands sponsor which creators, shows a dashboard of "brands trying to reach you this week."

**Competition:** SponsorBlock dominates skipping. Nobody is doing brand-tracking dashboards for viewers, or the marketer-side flip.

**Verdict:** Niche but interesting. B2B pivot (selling brand-creator deal data to marketing agencies) is where the money is.

### 6. Outlier/Viral Video Finder for a Niche
Flags videos dramatically over-performing a channel's normal views.

**Competition:** **1of10** and **OutlierKit** do exactly this. VidIQ has similar "outlier" features.

**Verdict:** Skip — late to the party.

### 7. Personal Knowledge Base from Your Watch History
OAuth/Takeout import of watch history + transcripts, build searchable knowledge graph. *"What was that video where someone explained the carry trade?"*

**Competition:** Glasp does manual highlights. Recall does saving for later. Nothing fully passive that ingests entire watch history into a personal RAG system.

**Verdict:** Strong concept, real pain point. Privacy story matters. *(Deep dive below.)*

### 8. Live Stream / Premiere Calendar Aggregator
Unified calendar of upcoming premieres, scheduled live streams, uploads from subscriptions.

**Competition:** YouTube's native bell is broken; Schedule tab is mediocre. Twitch tools dominate streaming alerts but not YouTube specifically.

**Verdict:** Underserved. Best as freemium extension or PWA.

### 9. Family / Kids Co-Viewing Curation Tool
Parents pre-approve videos/channels. Kid sees curated, ad-free, recommendation-free interface.

**Competition:** YouTube Kids is widely criticized. Kinzoo and a few self-hosted options exist; nothing dominant.

**Verdict:** Strong demand but high regulatory barrier (COPPA). Real business if you can navigate compliance.

### 10. Niche Comment Intelligence for Creators
Beyond sentiment analysis. Clusters comments into themes, surfaces video ideas requested in comments, tracks recurring critics vs. superfans, drafts thoughtful responses.

**Competition:** VidIQ and TubeBuddy have basic comment tools. Nobody does deep clustering + idea extraction + relationship tracking well.

**Verdict:** **Top pick for monetizable creator tool.** Mid-size creators (10k–500k) drown in comments and would pay $20–50/mo.

---

## Part 2: Second Batch of 10 Ideas

### 11. Channel Pivot Detector
Browser extension showing a badge: *"This channel pivoted 3 months ago — used to be 18-min essays, now mostly 60s Shorts."*

**Competition:** None directly viewer-side.

**Verdict:** Niche. Better as a feature inside the Subscription Audit tool than standalone.

### 12. Sync-Watch Rooms with Voice Chat
Watch parties with voice chat overlaid.

**Competition:** Heavy. Teleparty, Watch2Gether, SyncTube, Discord's Watch Together, plus YouTube's own Watch Party in Premium.

**Verdict:** Skip. Saturated.

### 13. Chapter Generator for Creators
Auto-generates YouTube chapter markers from transcript.

**Competition:** Significant. YouTube auto-generates chapters now. TubeBuddy, vidIQ, Eklipse, plus standalone tools all do this. ChatGPT + transcript already solves it for free.

**Verdict:** Skip — commodity.

### 14. AI-Powered Comment Drafting Assistant for Viewers
Helps you write thoughtful comments on videos using transcript context.

**Competition:** Almost none for thoughtful engagement. AI comment generators that exist are spam tools for growth-hackers.

**Verdict:** Interesting niche but hard to monetize. Better as a free tool with upsell or feature of broader product.

### 15. YouTube → Podcast Feed Converter
Generate audio-only RSS feeds of channels for podcast apps.

**Competition:** **Listenbox** dominates. PodSync, AntennaPod's YouTube integration. YouTube Music supports RSS for podcasts on the publishing side.

**Verdict:** Crowded by beloved incumbent. Only worth pursuing with a specific differentiator (see #18).

### 16. Video Diff — "What Changed Between These Two Tutorials?"
Side-by-side transcript diff with semantic understanding. *"React routing 2023" vs "React routing 2026."*

**Competition:** Doesn't seem to exist for YouTube specifically.

**Verdict:** Genuinely novel but very niche use case. Hard to imagine recurring user. Maybe a viral free tool, not a standalone business.

### 17. Spaced-Repetition Course Builder from Playlists
Paste playlist URL → ingest transcripts, auto-generate flashcards, schedule reviews via spaced repetition.

**Competition:** More crowded than first pass suggested. AnkiDecks, NovaCards, Limbiks, Slay School, Wisdolia, Quizatic, Jungle, StudyBoost all do "video to flashcards with SR." SyncStudy turns playlists into structured courses (no SR). NotebookLM accepts playlists, generates flashcards, no SR.

**Verdict:** Real opportunity but in a different framing. *(Deep dive below.)*

### 18. Sponsor-Skipping Audio Podcast Layer
YouTube → podcast feed with sponsor reads, intros, outros, patron shoutouts auto-removed via SponsorBlock data + audio splicing.

**Competition:** SponsorBlock for video doesn't generate audio feeds. Listenbox doesn't skip sponsors. The combination is unbuilt.

**Verdict:** **Strong, focused niche.** Heavy podcast listeners hate sponsor reads. Easy pitch.

### 19. Live-Stream Aggregator for News Junkies
Multi-pane dashboard for tracking news livestreams with real-time transcript monitoring and keyword alerts. *"The Fed mentioned 'inflation' just now."*

**Competition:** Multi-stream viewers exist (MultiView.world, Multistream.watch, Streams Charts) but they're dumb grids. YouTube's native multiview is locked to NFL Sunday Ticket. None do real-time transcript monitoring.

**Verdict:** Real differentiation possible — the transcript-keyword-alert layer is the moat. Could sell to small hedge funds, journalists, political operatives.

### 20. Semantic Channel Discovery — "Find me a creator like X"
Multi-dimensional filtered search across topic, vibe, format, cadence, size, monetization style.

**Competition:** More than first pass suggested. **ChannelsLike.com** and **VideoDubber's Similar Channel Finder** exist. Tube2Vec academic embeddings (44k channels) are public.

**Verdict:** Real product gap (multi-dimensional and video-level search), but well-funded incumbents on B2B side. *(Deep dive below.)*

---

## Cross-Batch Top Picks

After applying realistic competitive analysis to both batches:

1. **#10 — Comment Intelligence for Creators** — clearest willingness to pay, defensible
2. **#7 — Personal Knowledge Base from Watch History** — novel angle, real pain, no dominant player
3. **#17 — Spaced-Repetition Course Builder** (repositioned as a curriculum coach, not flashcard tool)
4. **#18 — Sponsor-skipping podcast feed** — tight niche with clear "I'd pay for this"
5. **#3 — Subscription Detox** — strong B2C validation play (good first build)

---

## Deep Dive: #3 Subscription Detox / Channel Audit Tool

### The Marie Kondo of YouTube subscriptions

Most people have 50–500 YouTube subscriptions accumulated over a decade. They watch maybe 10–20 regularly. The rest is noise: dead channels, channels that pivoted, channels that started uploading 12 Shorts a day after you subscribed for their long-form essays.

OAuth connect → 30-second scan → report:

- *47 channels haven't uploaded in over a year*
- *23 channels you've never watched a video from*
- *18 channels pivoted from long-form to Shorts*
- *12 channels you used to watch but haven't opened in 6 months*
- *Your 10 "real" channels — these are the ones you actually engage with*

Killer phrase: *"Which channels do I actually watch?"*

### Competition reality

**Crowded category — bulk unsubscribers.** YouTube Bulk Unsubscribe, Unsubscribe All for YouTube, Unsubscriby, YouTube Mass Unsubscribe — 15+ Chrome extensions doing the same thing. Mostly:
- Console scripts wrapped in a UI
- Free or aggressively freemium
- Plagued by shoddy reviews
- Mechanical: scan → checkbox → click

**Empty category — actual subscription analytics.** Nobody combines: watch history correlation, engagement decay detection, niche-pivot detection, format-shift detection, behavior-based recommendations. Closest analog is Cleanfox (email) or Truebill (subscriptions) — succeeded by reframing "delete things" as "audit + reclaim."

Real positioning: not "bulk unsubscribe with extra features" but **a yearly checkup for your YouTube life**.

### Why this is harder than existing tools think

**1. Watch history is the linchpin and not on the API.** Subscriptions are easily fetched (1 unit per page). Watch history only comes from Google Takeout. Same Takeout-flow constraint as #7. No competitor in the unsubscribe-extension space does this.

**2. Channel pivot detection requires content analysis.** Comparing recent uploads to older ones — title patterns, thumbnails, frequency, length distribution, transcript-level shifts. LLM job. Don't run on all 200 channels at once.

**3. The "what should I keep" recommendation is the hard part.** *"You've watched 4 videos from this channel in the past month, all from the same playlist, none of their new uploads — they're a back-catalog channel for you, consider unsubscribing and bookmarking the playlist instead."* That insight justifies pricing.

### API quota math

- `subscriptions.list`: 1 unit per page of 50 → ~10 units for 500 subs
- `channels.list` for latest activity: ~10 units for 500 channels (batched)
- `playlistItems.list` for upload history: ~500 units for 500 channels
- **Total per audit: ~500–600 units**
- Default 10,000 units/day = **15–18 audits per day**

Mitigations: aggressive caching of channel data across users (same channel queried by 100 users only fetched once), request quota increase, or BYOK.

### The product

**Three layers:**

**Layer 1: The "wow" report.** OAuth connect → 30-second scan → beautifully designed report. Spotify Wrapped energy. Categories: Dead, Pivoted, Outgrown, Watch-Once Wonders, Hidden Gems. Shareable and viral.

**Layer 2: The cleanup interface.** Not a checkbox list. Guided flow, one screen per category, peek at recent uploads before deciding, undo, "demote, don't unsubscribe" option.

**Layer 3: Ongoing health.** Quarterly check-ins, pivot alerts, new-channel onboarding. Turns one-time tool into subscription.

### Pricing

- **Freemium with sharp paywall on the audit itself.** Free: see the report. Pay $5–$10 one-time to act on it. Pay $4–$6/mo for ongoing health monitoring. Truebill model.
- Pure subscription, $5/mo
- One-time $15 desktop app

### Risks

- YouTube Data API may further restrict subscription data
- Mass-unsubscribe extensions have a sketchy reputation (advantage for someone who builds it seriously)
- YouTube ships their own — plausible-but-unlikely; reduces algorithm signal
- Casual viewers don't care; target power users (devs, learners, news/finance viewers)

### Validation steps

1. Mock the report. Make a fake "Subscription Wrapped" landing page. $200 of ads. Measure email signups.
2. Build a Takeout-only MVP. No OAuth, no API quota. Charge $5 for the cleanup PDF.
3. Add OAuth + automation only after step 2 validates.

---

## Deep Dive: #7 Personal Knowledge Base from Watch History

### The product

A passive, semantic memory layer for everything you've watched on YouTube. User doesn't add sources manually. They just ask:

- *"What was that video where someone explained the carry trade?"*
- *"Show me every recipe I've watched that uses miso."*
- *"What were the three book recommendations from videos I watched in March?"*

Behind the scenes: ingested watch history, pulled transcripts, embedded into vector DB, RAG over corpus. Output is answer with timestamped citations and links back to moments.

**Not a "summarize this video" tool.** The unit of value is *your accumulated watch history as a queryable corpus*.

### Competitive landscape

**NotebookLM (Google).** Closest analog. Manual source addition; 50-source cap (300 on Plus). Workspace, not passive memory layer.

**Watch history visualizers.** youtubewatchhistoryanalysis.com, Google Takeout viz tools, GitHub projects. Quantitative analysis only — top channels, viewing patterns. None touch transcripts or semantic search.

**Glasp, Recall, Reflect, Heptabase.** Highlight/note tools. Manual.

**Per-video chat tools.** Eightify, ChatYTB, NoteGPT. Single video, no corpus.

**Recall.ai.** Most overlapping. Auto-saves things you watch/read; AI search across them. But YouTube integration is opt-in per video via extension, not passive ingestion.

The precise gap: **passive ingestion of full watch history + transcript-level semantic search across the corpus + timestamped retrieval.**

### Three engineering challenges (and the moat)

**1. Watch history access.** Not on the API. Only Google Takeout. Solve the Takeout UX painfully well: *"Paste your email, we'll walk you through the 4-click export, then drag the file here."*

**2. Transcripts at scale.** Official API doesn't expose them usable. For 5,000 videos:
- Supadata-style: ~$0.01–$0.05 per transcript = $50–$250 per user
- Embeddings: ~$0.02–$0.10 per user
- Storage of vector DB

Real per-user COGS that needs to inform pricing.

**3. Incremental updates.** Extension that detects new watches, or periodic re-import workflow.

### The product

**Surface 1: Web app.** Onboarding is Takeout import. After ingestion, search bar + chat interface. Three killer queries:
- *"Find that video about X"* — fuzzy semantic recall
- *"Make me a reading list of everything I've watched on Y"* — clusters
- *"What did I learn about Z this month?"* — synthesis with citations

**Surface 2: Browser extension.** (a) Capture new watches automatically. (b) Inject contextual recall into YouTube — sidebar shows *"you've watched 4 related videos"* with timestamps. Daily-use hook.

### Privacy positioning

Watch history is intimate (politics, health searches, mental health, embarrassing rabbit holes). Three architectures:
- **Fully local.** Vector DB and LLM in-browser via WebGPU/WebAssembly, or desktop app. Hardest to build, easiest to market.
- **E2E encrypted cloud.** User holds key, embeddings client-side, ciphertext storage.
- **Standard cloud + clear policy.** Cheapest, trust burden heavy.

Start E2E encrypted cloud, migrate to local as WebGPU matures.

### Pricing

- **Freemium SaaS.** Free: last 6 months. Paid ($8–$15/mo): full history, chat, extension, exports.
- **One-time + storage subscription.** $30 to ingest, $3/mo to keep updated.
- **Local-first paid app.** $40–$60 one-time, like Obsidian.

### Buyers

- Lifelong learners / "YouTube university" users
- Researchers and students
- Content creators doing research
- Professionals in fast-moving fields (devs, designers, finance, medicine)

Probably not: casual entertainment viewers, mostly music/sports/shorts watchers.

### Risks

- **Google ships this themselves.** Plausible — NotebookLM is half the product. Counter: more privacy-forward, multi-source support, better extension UX.
- **Transcript economics break at scale.** Mitigations: lazy ingestion, aggressive cross-user caching, tiered storage.
- **TOS friction.** Stick to Takeout + Data API + extension for own activity (not scraping).
- **Cold-start for new users.** First query has to wow.

### Validation

1. Takeout-to-CSV-to-search MVP in a weekend. Keyword search over titles + descriptions. Post on r/selfhosted, r/productivity, HN. Measure interest.
2. Add transcripts for last 100 watched videos, semantic search. Watch what people search for.
3. Manually onboard 20 users. Charge $20. If 10 pay, you have a product.

---

## Deep Dive: #20 Semantic Creator Discovery

### Honest revision

Initial rating overstated the gap. Real competitors:

- **ChannelsLike.com.** Free. Paste channel URL, get ranked similar channels. Three signals: SERP overlap, semantic similarity, appearance frequency.
- **VideoDubber's Similar Channel Finder.** Free, AI-based, marketed at creators/marketers/agencies.
- **Tube2Vec (EPFL, 2023).** Public embeddings for 44,000 channels using content embeddings (MiniLM), recommendation graph embeddings, Reddit-sharing embeddings. Recommendation embeddings performed best.

The tech is cheap *and people are doing it*.

### What's still missing

Existing tools answer: *"channels semantically similar to X."* That's not what most people want.

When someone says *"find me a creator like Mustard who posts more often,"* they're filtering on:
1. Semantic similarity (what they're about)
2. Vibe/tone (analytical vs reactive, calm vs hyped, scripted vs improvised)
3. Format (long-form vs Shorts vs livestream)
4. Cadence (weekly, monthly, dormant)
5. Production quality (solo phone-cam vs polished studio)
6. Audience size band
7. Monetization style

ChannelsLike returns "similar channels." Doesn't return *"channels similar in topic but different in format"* or *"this exact vibe but smaller channels."*

Other gap: **everyone returns channels, nobody returns videos.** If you love one specific documentary, you want *the 12 best videos like that one* across all of YouTube. Embeddings on transcripts can do this.

### Repositioned product

Drop "find similar channels." Lead with three queries existing tools fail on:

**Query A — multi-dimensional filtered discovery.** *"Channels covering geopolitics, more analytical than ranty, posting at least monthly, 50k–500k subs, English."*

**Query B — video-level discovery.** Paste one URL → 20 videos like it across many channels.

**Query C — 2D map of a niche.** Plot channels by axis X and axis Y. Goes viral on Twitter.

### Architecture

**Layer 1: Corpus.** Top ~500K English channels, refreshed monthly. YouTube Data API for metadata, yt-dlp/transcript service for transcripts.

**Layer 2: Embeddings.** Three vectors per channel/video:
- Content embedding (titles, descriptions, transcript samples)
- Recommendation-graph embedding (Tube2Vec method — performed best)
- Optional thumbnail embedding via CLIP

**Layer 3: Filtered vector search.** Pinecone/Qdrant/Turbopuffer. Metadata filters are the UX advantage.

Core technical risk: **freshness.** Re-embedding pipeline running on schedule.

### Business model — harder than first claimed

**Viewer-side discovery rarely makes money.** ChannelsLike is free. VideoDubber's tool is free.

Three paths:
1. **B2B for creators and marketers.** $20–$80/mo. Crowded but real WTP.
2. **B2B for brands/agencies for influencer marketing.** Direct competition with YouTube's Insights Finder, Tagger, CreatorIQ. Enterprise sales.
3. **Free consumer + affiliate/referral.** Hardest path.

Right move: ship free consumer tool to validate it's better than ChannelsLike, layer paid creator/marketer tools on same backend.

### Verdict

Downgraded from "best idea." Realistically **Tier 2**: real gap, real lift, unclear consumer monetization, well-funded B2B incumbents. Target creators/marketers from day one; viewer-facing free tool is marketing surface.

---

## Deep Dive: #17 Spaced-Repetition Course Builder

### Honest revision

The "YouTube → flashcards" piece is heavily commodified:

- **AnkiDecks** — paste YouTube URL → flashcards. Built-in study mode using FSRS. Free tier, paid Pro.
- **NovaCards** — Anki cards from notes; Anki plugin.
- **Limbiks, Slay School, Wisdolia, Quizatic, Jungle, StudyBoost** — all do "input → flashcards → study with SR."
- **SyncStudy** — playlists into structured courses with progress tracking; no SR.
- **NotebookLM** — playlists, generates flashcards/quizzes, no SR scheduling.

Space is actively contested.

### What's still missing

The narrower, more interesting gap: **none of these tools take a playlist and treat it as a curriculum.**

What every existing tool does: video in → flashcards out → study them. Each video independent.

What none do well:

1. **Sequence the playlist into a learning path.** Intro/intermediate/advanced detection.
2. **Connect concepts across videos.** Video 3 introduces a concept that video 8 builds on. Cross-video prerequisite reasoning is unsolved.
3. **Distinguish lecture-style from tutorial-style.** Flashcards for facts, *coding exercises* for code tutorials. Currently every tool produces flashcards regardless.
4. **Watch-then-review cadence.** *"Watch the 4-minute clip again, then answer."* Decoupled from re-watching.
5. **Don't quiz things the user already knows.** Adaptive curriculum trimming.

These aren't "minor improvements" — they're a different product. Existing tools are *flashcard generators*. The opportunity is **a coach that uses YouTube as its textbook**.

### Repositioned product

Brand as *"Learn from any YouTube playlist like it's a real course."*

Three differentiators:

**1. Curriculum mode, not flashcard mode.** Output is a learning *plan*. *"Today: watch videos 1–2, complete checkpoint quiz. Tomorrow: review key concepts, watch video 3."* Adapts to performance.

**2. Multi-modal exercises.** Auto-detect content type. Lecture → flashcards + concept questions. Code tutorial → forks of actual code with intentional bugs to fix. Math → worked-problem variations. Language → fill-in-the-blank from real video clips. **The tool that knows when *not* to make a flashcard wins.**

**3. Re-watch loops.** Spaced review isn't just "see this question again in 4 days." It's "watch this 90-second clip again, then answer."

### The actual moat

Not the SR algorithm (FSRS is open source). Not transcript ingestion (commoditized). It's the **content-type classifier and curriculum sequencer** — requires editorial taste, prompt engineering, iteration on real learners.

Existing flashcard tools are run by generalist AI-content companies treating YouTube as one input among many. A team that goes deep on "YouTube as curriculum" can win.

Bad news: moat is execution, not technology. Can't sit on a head start.

### Audience and pricing

- Self-taught technical learners (devs)
- University students
- Career-changers and adult learners
- Language learners (compete with LingQ, Lingopie)

$8–$15/mo polished SaaS, $5/mo with student discount, $40 one-time per-course unbundled.

### Validation path

1. Build the dumb version first — playlist URL → flashcards → SR. Two weekends.
2. Pick one vertical (e.g., learning React) — hand-craft curriculum mode for top 5 React playlists. See if learners stick.
3. Generalize cautiously. Each new vertical (history, language, math) has different exercise types.

### Verdict

Real opportunity, different framing. Not "no one does this" — many people do flashcards-from-video. Opportunity is **abandoning the flashcard frame entirely** and building a curriculum coach. Harder to build well, harder to copy, clearer buyers.

Now rated **slightly above** Semantic Creator Discovery as a standalone business — clearer monetization, easier focus, smaller-but-realer moat through editorial execution.

---

## One-Day Build Analysis

Most ideas above are *not* one-day builds. The ones with real moats are weeks of work minimum. But several can be stripped down to useful one-day MVPs.

### Truly one-day builds

- **Video Diff (#16).** Two URLs in, transcript diff out, LLM tagging. No accounts, no DB. Single page. Doable in a focused day. Tradeoff: lowest-rated idea.
- **AI Comment Drafting Assistant (#14).** Browser extension. Day one is mostly fighting Chrome's manifest v3 boilerplate.
- **Channel Pivot Detector (#11).** Scoped down: paste URL, fetch last 20 + 20 prior video titles, LLM analysis. Single-page web app.

### One-day if ruthless about scope

- **Subscription Detox (#3).** Skip OAuth, take Takeout file as input. Parse subscriptions JSON, fetch last upload date per channel, group into Dead/Dormant/Active. Pure metadata report. Real product takes a month.
- **Personal Knowledge Base (#7).** Skip OAuth, take Takeout watch-history, keyword search over titles + descriptions only — no transcripts, no embeddings. Dumbest version of the product but lets you feel the shape.
- **Sponsor-Skipping Podcast Feed (#18).** Single-channel POC: hardcode one channel's RSS, yt-dlp + SponsorBlock + ffmpeg, host as static RSS feed.
- **Sync-Watch Rooms (#12).** Bare-bones text-chat with YouTube IFrame API + websocket. Skip — saturated market with no day-one differentiation.

### Not one-day builds despite looking simple

- Semantic Creator Discovery — corpus ingestion is the entire product
- Spaced-Repetition Course Builder — curriculum sequencer is the moat
- Comment Intelligence for Creators — clustering UX needs real product work
- Channel-level RAG / "Ask this channel anything" — ingestion + vector DB
- News-junkie livestream dashboard — keyword-alert layer needs real infra

### Recommendation

For a one-day project that **teaches you about the space**: stripped-down Subscription Detox report from Takeout file.

For one that **might go viral**: Channel Pivot Detector.

For one that **could become a business**: single-channel Sponsor-Skipping Podcast Feed.

---

## Implementation Plan: Subscription Detox One-Day Build

### What ships at end of day

Single-page web app. User drops Takeout file, waits 10–60s, sees report:
- Total subscriptions: N
- Dead channels (no upload 12+ months): N — list with last-upload dates
- Dormant (3–12 months): N — list
- Active (last 3 months): N — list
- Optional: Shorts vs long-form pivot detection

Zero auth. Zero database. Stateless.

### Two valid input paths

**Path A: subscriptions.csv** (simpler) — `Takeout/YouTube and YouTube Music/subscriptions/subscriptions.csv` with `Channel Id`, `Channel Url`, `Channel Title`. All you need to start.

**Path B: subscriptions.csv + watch-history.json** (richer) — adds *"you haven't watched these channels in X months"* — the actually surprising insight.

Build A first, add B as second drop zone.

### Takeout flow walkthrough (the friction)

Show numbered screenshots of:
1. Go to takeout.google.com
2. "Deselect all"
3. Find "YouTube and YouTube Music," check it
4. "All YouTube data included" → Deselect all → check "subscriptions" (and "history" if Path B)
5. "Multiple formats" — set History to JSON
6. Next → Create export → wait for email

Use JSZip to accept the whole zip and extract client-side. Worth the extra hour vs asking user to unzip.

### Backend or no backend

**Browser-only for v1.** Reasons:
- Privacy story: "your file never leaves your device"
- No infrastructure costs
- No quota concerns
- Faster to ship

Constraint: API key exposed. Mitigate with HTTP referer restrictions on the key.

### YouTube API calls

**channels.list** — batched up to 50 IDs, 1 unit per call. Returns `contentDetails.relatedPlaylists.uploads`.

**playlistItems.list** — given uploads playlist ID, returns recent uploads with publish dates. 1 unit per call. First page (50 items) only.

**Quota math for 200-sub user:**
- channels.list: 4 units
- playlistItems.list: 200 units
- **Total: ~204 units per audit**
- Default 10K/day = ~48 audits/day

Tip: use `fields=` parameter to limit response shape.

### Shorts vs long-form detection

Lazy heuristic: in `playlistItems.list`, follow up with `videos.list` (1 unit per batch of 50) for duration. ≤60s = Short.

Skip for v1 if squeezed. "Dead/dormant/active" alone is enough.

### Code structure

Single-file approach:

```
1. File drop component
   - accept .zip or specific files
   - extract subscriptions.csv (and watch-history.json)
   - parse CSV → array of {channelId, channelTitle, channelUrl}

2. Channel data fetcher
   - chunk channelIds into batches of 50
   - channels.list?part=snippet,contentDetails,statistics
   - collect uploads playlist IDs

3. Activity fetcher
   - playlistItems.list per uploads playlist
   - record latest publish date per channel
   - (optional) videos.list for duration

4. Categorizer
   - days-since-last-upload buckets
   - if watch history present: days-since-user-last-watched
   - Dead / Dormant / Active / (Watched / Unwatched)

5. Report renderer
   - hero stat: "N subs but only watch X"
   - collapsible lists per category
   - export-as-CSV button
```

### Engineering notes

- Use Papa Parse for CSV. Don't roll your own.
- watch-history.json can be 50–500 MB. Stream-parse. Filter to last N months early.
- Handle deleted channels — surface as "channel deleted" insight, not error.
- Rate-limit batched requests.
- Show progress: "fetching channel 80 of 200..."

### What to watch for

- **Visually striking report.** Spotify Wrapped energy. Hero numbers, big type, color coding, graph. CSV with extra steps loses.
- **Don't gate anything yet.** No paywall, no email, no accounts. Day one goal: validate.
- **Privacy copy is part of product.** *"Your Takeout file is processed in your browser. Nothing is uploaded."* Trust is bottleneck.
- **Test with own account first.** Three bugs you wouldn't catch with synthetic data.

### Stretch goals (in bang-for-buck order)

1. **Watch-history correlation** — killer feature none of the bulk-unsub tools have. Match watch-history channelIds against subscription channelIds. *"Subscribed to 200, watched 14 in last 90 days."* Headline insight.
2. **Shareable result image** — "Subscription Wrapped" PNG. Twitter-shareable.
3. **CSV/JSON export** of channels to consider unsubscribing.
4. **Bulk-unsubscribe link generator** — direct deep links.

### Time budget

- 1h: scaffolding, file drop, CSV parsing
- 1h: API integration, batching, errors
- 1h: activity fetching, categorization
- 2h: report UI (eats more time than expected)
- 1h: copy, privacy, Takeout instructions
- 1h: test on own data, fix bugs
- 1h: deploy

8h focused = 12h day with breaks and rabbit holes.

### Soft launch strategy

Show to 10–20 specific people whose YouTube use you can ask about. Watch what they do. Signal: "I sent this to three friends" or "can you make it do X next?"

---

## Technical Decisions for the Build

### API key strategy: shared vs BYOK vs backend

**v1: shared key, frontend-embedded, with referer restrictions.**

Three options analyzed:

**1. Shared key in frontend.** Visible in DevTools. Referer restrictions are soft wall. Protects from casual scraping; not from determined bad actor running browser automation. Quota: 48 audits/day before everyone hits errors. Cost: $0.

**2. BYOK.** UX cost: 60–80% of users bounce at "create a Google Cloud project." Each user gets own 10K units. Scales infinitely. Cost: $0. Only acceptable if audience is "developers and power users."

**3. Backend proxy.** Same UX as #1. Server complexity. Can implement per-IP rate limiting, aggressive caching (channel data shared across users). Privacy story shifts — split work pattern is clean: browser parses Takeout, sends only `["UCxxx", ...]` to backend, backend returns enriched data.

Setup for shared key:
- HTTP referrer restrictions (production domain + localhost)
- YouTube Data API v3 only
- Budget alert in Cloud Console

When to switch to backend:
1. Hit quota daily (caching solves)
2. Need to charge (auth/billing/gating)
3. Real-time monitoring (server-side cron)

Graceful degradation: if quota exhausted, show partial report from Takeout alone. *"Come back tomorrow for full version."*

### Hosting: GitHub Pages vs Vercel

**Vercel.** Reasons:
- Custom domains trivial and free
- Environment variables for API key (out of Git history)
- Escape hatch when adding backend (`/api/` folder)
- Build pipelines just work
- Preview deploys per branch

GitHub Pages better if: pure static HTML, want to signal open-source, worried about platform lock-in.

Cloudflare Pages and Netlify roughly equivalent. Don't shop for "best" host today.

Setup:
1. Push to GitHub
2. Sign into Vercel with GitHub
3. Import repo, accept defaults
4. Add `NEXT_PUBLIC_YOUTUBE_API_KEY` in Vercel dashboard
5. (Optional) Buy domain on Cloudflare or Namecheap, point at Vercel

Total: 15–20 minutes.

Note: `NEXT_PUBLIC_*` env vars are embedded in bundle at build time. Not actually secret. Fine for YouTube API key with referer restrictions. "Env var" means "not in Git," not "hidden from users."

For day-one validation with 10–20 people: free `your-project.vercel.app` is fine.

### Vanilla vs framework

**Vanilla.** Reasons:
- App is genuinely small (~500 lines logic)
- Hard parts aren't UI
- Framework startup cost: 30–60 min on a one-day build
- Build steps tax all day
- Vanilla deploys easier (drop `index.html` into Vercel)

Stack:
- Papa Parse for CSV
- JSZip for Takeout zip extraction
- Pico.css or Water.css (classless framework, 80% of "designed" with zero CSS)

Files:
```
index.html       # ~200 lines
script.js        # ~300-500 lines
style.css        # ~50 lines
```

Can fold into single `index.html` for one-day build.

When framework wins:
- You think faster in React/Vue (real argument — cognitive familiarity > theoretical simplicity)
- Want shadcn/ui for fast-good-looking output
- Building past day one (auth, billing, multiple pages within two weeks)

Argument against React for this: Takeout flow has linear state (1 → 2 → 3 → 4). No branching. Linear flows are exactly what vanilla DOM is good at. React shines when state is interconnected.

If interactivity needed in report: **don't make it interactive in v1.** Static lists, no sort, no filter, screenshot-friendly. If users want sort/filter, that's signal for v2.

If you must add reactivity: Alpine.js (~15KB, no build step).

---

## Compiled Recommendations

**Pick the project that matches your goal:**
- Learn the space → Subscription Detox MVP
- Go viral → Channel Pivot Detector
- Build a business → single-channel Sponsor-Skipping Podcast Feed

**For Subscription Detox one-day build:**
- Vanilla HTML/JS/CSS
- Papa Parse + JSZip + Pico.css
- Vercel with shared API key (referer-restricted)
- Static report, no interactivity
- Soft launch to 10–20 people

**Cross-batch top picks for real products:**
1. Comment Intelligence for Creators
2. Personal Knowledge Base from Watch History
3. Spaced-Repetition Course Builder (as curriculum coach)
4. Sponsor-skipping podcast feed
5. Subscription Detox

**Important caveat:** First-pass competitive analysis tends to overstate gaps. The "empty-spot illusion." Always do deeper search before committing.

---

*Compiled from iterative exploration. Take the rankings as starting points; market conditions shift, and competitors emerge constantly. The one-day Subscription Detox build is the recommended first step regardless of which idea you pursue long-term — it teaches the API, the Takeout flow, and the validation muscle.*