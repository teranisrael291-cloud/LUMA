# LUMA Pulse — V8 weekly ML/NLP editorial workflow

## Monday — automated research

The Vercel cron runs the deterministic research engine across 45 curated sources. It creates candidates only; publishing remains a human decision.

## What the engine does

1. **Collect** recent public items across signal, evidence, foresight, trade and culture sources.
2. **Normalize** text, remove boilerplate and duplicates, tokenize and apply light stemming.
3. **Represent** documents with weighted TF-IDF features.
4. **Compare** documents with hybrid similarity: cosine, IDF-weighted overlap, title overlap and phrase overlap.
5. **Cluster** evidence with a diversity-aware unsupervised grouping step designed to reduce broad transitive clusters.
6. **Summarize** with TextRank using redundancy control. Summaries are extractive, not generated.
7. **Classify** category, geography, Gen Z/Millennial affinity, lifecycle stage and cultural horizon.
8. **Measure** recency, temporal burst, source diversity, role diversity, source agreement, novelty, persistence and commercial whitespace.
9. **Compare with history** using the latest published editions stored in `history-index.json` to estimate persistence and week-over-week velocity.
10. **Score** LUMA Signal and Confidence separately.
11. **Diversify** candidate ranking with an MMR-style selection step so one publisher or category is less likely to dominate.
12. **Trace** every signal back to its evidence links and model components.

No generative AI, LLM or autonomous AI agent is required.

## Human review

Before publishing:

- open the evidence behind every high-priority signal;
- verify observed claims, dates and geography;
- rewrite awkward extractive summaries;
- keep the Gen Z/Millennial label conservative when demographic evidence is indirect;
- reject tragedy, politics, crime and one-day breaking-news noise;
- distinguish a **cultural moment** from an **emerging trend** and a **structural shift**;
- avoid presenting editorial coverage as proof of adoption without corroboration;
- select 5–8 signals with a useful Mexico-first mix plus LATAM and global context.

## LUMA Signal vs. Confidence

**LUMA Signal** prioritizes opportunity. It combines momentum, Mexico/LATAM relevance, evidence, authority, commercial usefulness, persistence and novelty.

**Confidence** measures evidence quality. It emphasizes source diversity, evidence-role diversity, authority, agreement and recency.

A signal can therefore be high-opportunity but low-confidence. That distinction should remain visible in the published edition.
