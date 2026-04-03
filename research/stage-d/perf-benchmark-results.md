# Performance Benchmark Results (Stage D)

Status: Draft (no real browser benchmark data yet)
Date: 2026-04-02

## Test environment template

- Machine:
- OS:
- Browser/version:
- Build mode:
- Worker enabled:

## Scenarios

1. Interactive drag/update loop
2. Standard recompute edit
3. Heavy recompute/stress case

## Results table

| Scenario | Target | Observed median | Observed p95 | Pass/Fail | Notes |
|---|---|---:|---:|---|---|
| Interactive | <=16ms | TBD | TBD | TBD | |
| Normal recompute | <=50ms | TBD | TBD | TBD | |
| Heavy recompute | <=150ms | TBD | TBD | TBD | |

## Follow-up actions

- If p95 exceeds target, record root cause hypothesis and mitigation (worker split, algorithm change, batching).
