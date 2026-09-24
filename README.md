# LUMA Creators V8

V8 expands LUMA Pulse into a richer cultural-intelligence product while keeping the research engine independent from generative AI.

## Research pipeline

1. Collect from 45 curated sources across five evidence roles.
2. Normalize and deduplicate titles, descriptions and article text.
3. Build weighted lexical representations with TF-IDF.
4. Compare documents with a hybrid similarity model: cosine similarity, IDF-weighted overlap, title overlap and phrase overlap.
5. Cluster related evidence with unsupervised graph grouping.
6. Generate extractive summaries with TextRank and redundancy control.
7. Estimate temporal burst, persistence, novelty, source agreement and cross-source diversity.
8. Classify audience, category, geography, lifecycle stage and cultural horizon.
9. Calibrate LUMA Signal and Confidence separately.
10. Use MMR-style selection to preserve category and source diversity.
11. Human editor reviews, rewrites and selects the weekly edition.
12. Published editions are added to a compact history index so future runs can detect persistence and week-over-week velocity.

No OpenAI key, LLM or autonomous AI agent is required.

## Source architecture

The source catalog is organized into five roles:

- **Signal:** Google Trends, TikTok, YouTube, Pinterest, Meta, Spotify.
- **Evidence:** AMVO, IAB México, Comscore, Kantar, NIQ, Ipsos, GWI, Euromonitor, EMARKETER, Mintel and Think with Google.
- **Foresight:** WGSN, The Future Laboratory, TrendWatching, Stylus, Canvas8, Contagious, Springwise, Trend Hunter and Exploding Topics.
- **Trade:** Digiday, Glossy, Marketing Brew, The Drum, ADWEEK, Campaign and Modern Retail.
- **Culture:** Vogue México, GQ México, Glamour México, ELLE México, Chilango, Time Out México, Vogue Business, Business of Fashion, Highsnobiety, Dazed and Hypebeast.

Sources are not treated equally. Authority, geography, role diversity, recency and agreement contribute differently to Confidence and LUMA Signal.

## Pulse V8 surfaces

- Editor's Cut
- Signal Map: momentum vs. confidence
- Cultural Horizon: cultural moment / emerging trend / structural shift
- Momentum Board
- Channel Read
- Category Brief
- Mexico-first market framing
- Evidence architecture and full curated source directory
- Signal Anatomy inside each trend detail

The UI avoids emoji glyphs. Icons, arrows, states and decorative marks are built with CSS geometry and SVG.

## Vercel configuration

Required:

- Private Vercel Blob connected to the project, using OIDC or `BLOB_READ_WRITE_TOKEN`.
- `LUMA_ADMIN_TOKEN`
- `CRON_SECRET`

The weekly cron remains defined in `vercel.json`. Research creates candidates; it does not publish automatically.

## Storage

- `pulse/candidate.json`
- `pulse/published.json`
- `pulse/history-index.json`
- `pulse/history/<timestamp>.json`

`history-index.json` stores compact metadata for the latest 16 published editions and is used by the ML/NLP engine for persistence and velocity.
