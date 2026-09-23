# LUMA Pulse — Weekly ML/NLP Editorial Workflow

## Monday — automated research

The Vercel cron executes the deterministic research engine. It checks the curated source registry, collects recent items, normalizes text, filters irrelevant/breaking-news noise, clusters similar evidence and scores candidate signals.

No generative AI is used.

## What the model does

1. **Research** — collect recent public items from 20 curated sources.
2. **Normalize** — decode/clean text, lowercase, remove accents/punctuation, remove stop words and apply light stemming.
3. **Represent** — create TF-IDF vectors.
4. **Cluster** — combine cosine similarity with title Jaccard overlap.
5. **Summarize** — use TextRank to select representative source sentences.
6. **Classify** — infer category, region and conservative Gen Z/Millennial affinity.
7. **Score** — combine recency, source diversity, Mexico relevance, authority, search evidence and commercial usefulness.
8. **Trace** — keep evidence links and model components for editor review.

## Human review

Before publishing:

- open every important evidence link;
- verify the observed claim and date;
- rewrite awkward extractive summaries;
- confirm that a Gen Z/Millennial label is supported or keep `Both`;
- reject tragedy, politics, crime or one-day noise;
- avoid treating a single editorial article as proof of mass adoption;
- select 5–8 signals with a useful mix of Mexico, LATAM and global context.

## LUMA Signal

The score is a LUMA model output. It is not a platform metric. Current components are:

- momentum / recency;
- Mexico or LATAM relevance;
- cross-source evidence and source-type diversity;
- source authority weight;
- commercial usefulness;
- search-volume boost when a Google Trends RSS item contains traffic.

The admin may override the final editorial score after reviewing the evidence.
