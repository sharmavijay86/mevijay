---
layout: post
title: "Cloudflare's 18 Nov 2025 Outage: What SREs Should Learn"
description: "Breakdown of the Bot Management feature-file bug that took a fifth of the Internet offline and the guardrails every platform team should copy."
category: "SRE"
tags:
  - Postmortem
  - Resilience
  - ClickHouse
read_time: 7
featured_image:
  url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"
  small_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=70"
  alt: "Server racks with warning light"
  credit: "Photo by Luca Bravo on Unsplash"
---

On 18 November 2025 at 11:20 UTC, Cloudflare's core proxy started returning HTTP 5xx errors across large parts of its network. The root cause, documented in [Cloudflare's official postmortem](https://blog.cloudflare.com/18-november-2025-outage/), was not a DDoS attack but a subtle database permission change that doubled the size of a Bot Management feature file. That was enough to panic both generations of their frontline proxy (FL and FL2) and briefly stall a hefty portion of the Internet.

## What actually failed

1. **ClickHouse permission rollout** exposed metadata for the underlying `r0` schema, not just the `default` schema.
2. **Feature file generator** queried `system.columns` without constraining the database, so the response contained duplicated columns.
3. **Bot Management feature file** exceeded a hard-coded 200-feature limit, triggering a panic in the FL2 Rust module and forcing 5xx responses.
4. **Propagation loop** kept stamping the bad file every five minutes, meaning the fleet would oscillate between healthy and broken states depending on which ClickHouse shard built the file.
5. **Collateral damage** rippled to Workers KV, Cloudflare Access, Turnstile, and their dashboard logins.

## Timeline (UTC)

| Time | Event |
| --- | --- |
| 11:05 | ClickHouse permission change deployed. |
| 11:20 | First wave of 5xx errors as bad feature file hits the edge. |
| 11:28 | Incident declared; oscillating failures create suspicion of an external attack. |
| 13:05 | Workers KV and Access routed around the new proxy to limit impact. |
| 14:24 | Automatic generation of the bad feature file halted. |
| 14:30 | Known-good feature file pushed globally; traffic flow largely restored. |
| 17:06 | Long-tail cleanup completed; all services stable. |

## Chain reaction explained

- **Database layer**: granting visibility into `r0` tables doubled the rows returned by `system.columns`.
- **Config build**: the generator assumed a fixed row count, so the exported feature file now carried >200 features.
- **Runtime guardrail**: Bot Management pre-allocates memory for 200 features; the overflow tripped a panic (`Result::unwrap()` on `Err`).
- **Control plane**: feature files propagate every five minutes, so bad data self-sustained until the pipeline was halted.
- **Edge variability**: FL customers saw incorrect bot scores (zeros), FL2 customers saw outright 5xx errors.

## Safeguards to steal

1. **Schema-aware queries** – always filter by database or namespace when touching shared system tables.
2. **Config linting** – parse and validate any generated configuration before distributing it. Limits should be enforced pre-publish, not only at runtime.
3. **Kill switches** – Cloudflare is adding more global feature kill switches; every platform needs the same lever to stop propagation in seconds.
4. **Out-of-band verification** – store golden config snapshots and make it trivial to reinsert a known-good payload.
5. **Observability budgets** – their debugging systems added CPU pressure while errors spiked. Cap the overhead so telemetry never worsens the incident.

## Drop-in guardrail example

One simple practice: size-check and schema-check your feature files before release.

```python
import json
from pathlib import Path

MAX_FEATURES = 200
REQUIRED_COLUMNS = {"name", "type", "source"}

def validate_feature_file(path: Path):
    data = json.loads(path.read_text())
    features = data.get("features", [])

    if len(features) > MAX_FEATURES:
        raise ValueError(f"Feature budget exceeded: {len(features)} > {MAX_FEATURES}")

    for feature in features:
        missing = REQUIRED_COLUMNS - feature.keys()
        if missing:
            raise ValueError(f"Feature missing columns: {missing}")

    return True

if __name__ == "__main__":
    validate_feature_file(Path("bot_features.json"))
```

## My takeaways for platform teams

- **Treat internal config like untrusted input.** Cloudflare is hardening its ingestion path exactly like they would for customer-supplied data.
- **Automate rollback muscle memory.** They eventually reinserted a known good file, but it took nearly three hours; practice this so it becomes a 5-minute drill.
- **Segment observability workloads.** Debug tooling crushed CPU and latency while users already faced errors—dedicate capacity or move heavy analysis out-of-band.
- **Multi-version deployments still share fate.** Even running both FL and FL2 didn’t help once the same bad artifact hit both; redundancy must include data-path isolation.

Cloudflare’s transparency is commendable, and their remedial roadmap (ingestion hardening, broader kill switches, error-budget policing) is solid. If your own platform relies on generated configuration, now is the time to review validation, propagation, and rollback controls—before a “harmless” metadata tweak can domino into hours of downtime.
