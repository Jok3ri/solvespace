# Browser Feasibility Matrix

Status: Draft (awaiting real browser runs)
Date: 2026-04-02

| Dimension | Target | Chrome | Edge | Firefox | Notes |
|---|---|---|---|---|---|
| Stage A fixture parity | 100% core, >=95% edge | TBD | TBD | TBD | Compare against Stage A baseline |
| Determinism (repeat runs) | Stable within epsilon | TBD | TBD | TBD | Run same suite multiple times |
| Interactive latency | <=16ms median | TBD | TBD | TBD | Drag/update loop |
| Normal recompute | <=50ms | TBD | TBD | TBD | Typical edit recompute |
| Heavy recompute | <=150ms | TBD | TBD | TBD | Stress paths |
| UI responsiveness | No blocking/jank spikes | TBD | TBD | TBD | Monitor frame drops |
| Worker offload viability | Required if needed | TBD | TBD | TBD | Main thread load check |

## Initial assumptions from Stage A

- Stage A baseline gate is PASS.
- Correctness corpus is available in `research/stage-a/fixtures/`.
