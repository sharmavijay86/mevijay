---
layout: post
title: "AI-Driven Site Reliability: From Noise to Insight"
description: "Practical playbook for injecting AI into SRE workflows without creating black boxes."
category: "SRE"
tags:
  - AIOps
  - Incident Response
  - Observability
read_time: 6
featured_image:
  url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"
  small_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=70"
  alt: "Engineer dashboard with code and graphs"
  credit: "Photo by Luca Bravo on Unsplash"
---

AI for operations is often sold as magic. In reality, it works only when backed by clean telemetry, curated features, and strong feedback loops with humans in the loop. Here's how I introduced AI-driven reliability for a global SaaS platform processing 12B requests/day.

## 1. Consolidate telemetry first

Before touching AI, we standardized metrics, logs, traces, and events into a single data lake (OpenTelemetry collectors feeding ClickHouse + Kafka). AI models are only as good as the signals provided.

## 2. Label historical incidents

We exported five years of incidents from PagerDuty/Jira, clustered them by services and symptoms, then collaboratively labeled root causes. This became the supervised dataset for our triage model.

## 3. Apply ML where it helps

- **Anomaly detection:** Seasonal ARIMA + Prophet for capacity metrics; FB Prophet for business KPIs.
- **Incident triage:** Gradient boosted trees to map symptom clusters to likely ownership squads.
- **Runbook suggestions:** Retrieval-Augmented Generation (RAG) using a vector index of runbooks stored in Markdown.

Important: each model exposes confidence scores so responders know when to trust automation.

```python
from sentence_transformers import SentenceTransformer
from langchain.vectorstores import FAISS

model = SentenceTransformer("all-MiniLM-L6-v2")
runbooks = load_markdown_runbooks()
embeddings = model.encode([rb["content"] for rb in runbooks])

store = FAISS.from_embeddings(embeddings, metadatas=runbooks)

def suggest_runbook(symptom_summary: str):
  hits = store.similarity_search(symptom_summary, k=3)
  return [hit.metadata["title"] for hit in hits]
```

## 4. Close the feedback loop

Every incident response window has a "model verdict" panel. Engineers can mark suggestions as helpful or off-target, feeding a retraining pipeline. Drift detectors alert us when a model's precision drops below 80%.

## 5. Cultural change

AI is a co-pilot, not a replacement. We trained responders to treat AI outputs as hypotheses, not gospel. This mindset prevented over-reliance and kept on-call engineers in control.

### Results

- 27% reduction in MTTR for Severity-2 incidents.
- 35% fewer duplicate alerts thanks to smarter correlation.
- Faster onboarding because new engineers can query the RAG assistant instead of hunting through Confluence.

AI-driven SRE succeeds when it's transparent, measurable, and deeply integrated into human workflows—not when it's a mysterious box generating alerts at random.
