# LUMA Creators V6 — ML/NLP Pulse Research Engine

V6 removes the generative-AI research dependency. LUMA Pulse now builds its weekly candidate set with a deterministic, inspectable research pipeline implemented in Node.js.

## Pipeline

```text
20 curated public sources
        ↓
RSS / Google News RSS collection
        ↓
relevance + safety filters
        ↓
text normalization / tokenization / light stemming
        ↓
TF-IDF vectors
        ↓
cosine-similarity + Jaccard clustering
        ↓
TextRank extractive summary
        ↓
category / region / audience classification
        ↓
LUMA Signal scoring
        ↓
10–18 candidate signals
        ↓
/admin human editorial review
        ↓
published Pulse edition
```

There is **no OpenAI API key, LLM, generative summary, or autonomous AI agent** in this version.

## Algorithms implemented

- TF-IDF vectorization for article/topic representation.
- Cosine similarity + title Jaccard similarity for cross-source trend clustering.
- TextRank for extractive summaries from source text.
- Weighted classification for market category, geography and Gen Z / Millennial affinity.
- Recency decay, source authority, source diversity, search-volume evidence and commercial relevance for LUMA Signal scoring.
- Deterministic six-week editorial index generation so the UI does not fabricate platform history.
- Cross-source evidence trace stored on every trend.
- Source-health telemetry in the admin.
- Political/crime/disaster filtering so a breaking-news spike does not automatically become a marketing trend.

The audience classifier is intentionally conservative: unless source evidence explicitly names a cohort or the topic has strong affinity signals, it returns `Both`. It must not be treated as measured demographic data.

## Curated source stack (20)

1. Google Trends México
2. TikTok Newsroom LATAM
3. YouTube Culture & Trends
4. Pinterest Business / Pinterest Predicts
5. Think with Google LATAM
6. AMVO
7. IAB México
8. Kantar Latinoamérica
9. NielsenIQ México
10. Vogue México
11. GQ México y Latinoamérica
12. Glamour México
13. ELLE México
14. Chilango
15. Time Out México
16. Spotify Newsroom
17. Mintel Insights
18. TrendWatching
19. Exploding Topics
20. WGSN public insights

The source registry lives in `api/_lib/sources.js`. Add, remove, weight or retag sources there. Except for Google Trends' public RSS feed, the engine discovers recent source articles through Google News RSS constrained to each curated domain. This avoids brittle page scraping while keeping the original publication as the evidence source.

## Admin

Open `/admin` and authenticate with `LUMA_ADMIN_TOKEN`.

The editor now shows:

- research pipeline metrics;
- health of all 20 sources;
- candidate clusters and LUMA score;
- ML/NLP trace (`momentum`, `evidence`, `authority`, age);
- evidence links used for each signal;
- editable title, summary, impact, audience, score, stage, source and editorial copy;
- selection and publication of 1–10 signals.

The machine researches and ranks. The human editor decides what LUMA says publicly.

## Deploy on Vercel

1. Import this folder into Vercel.
2. Create and connect a **Private Vercel Blob** store.
3. Add production environment variables:

```text
LUMA_ADMIN_TOKEN=<long-random-secret>
CRON_SECRET=<another-long-random-secret>
```

Vercel supplies `BLOB_READ_WRITE_TOKEN` when the Blob store is connected.

4. Redeploy.
5. Open `/admin` and click **Ejecutar research engine**.
6. Inspect source health and candidate evidence.
7. Edit/select 5–8 signals and publish.

No third-party AI key is required.

## Weekly automation

`vercel.json` runs `/api/cron-refresh` every Monday at 13:00 UTC (07:00 Mexico City). The job updates `pulse/candidate.json` only; it never auto-publishes.

## Storage

```text
pulse/candidate.json
pulse/published.json
pulse/history/<timestamp>.json
```

## Important limitations

- Public websites and RSS/search surfaces can change, throttle or block automated requests. The admin source-health panel makes failures visible instead of silently inventing data.
- Google News RSS is used as a discovery layer for many editorial domains. It is not treated as the underlying evidence source; each item retains the original publisher identity and link path.
- Instagram does not expose a general public organic-trending API. The engine therefore does not claim direct Instagram trend measurements.
- `LUMA Signal`, channel scores and the six-week line are LUMA model outputs, not raw metrics from TikTok, Meta, Google, YouTube or Pinterest.
- Extractive summaries can be less elegant than generative copy. That is intentional in V6: the admin editor is the final editorial layer.
