# Stage A Closeout (Final)

Date: 2026-04-08
Status: **Complete / Ready for Stage D**

## 1) Completed scope

- Pre-install math/spec workspace established under `research/stage-a/`.
- Deterministic fixture corpus implemented and automated.
- Gate automation in place:
  - fixture runner
  - regression comparison against baseline
  - CI-style one-command check
- Tag-aware pass-rate thresholds enforced.

## 2) Gate results at closeout

- Core pass-rate: 11/11 (100%)
- Edge pass-rate: 48/48 (100%)
- Tag-aware gates: PASS

## 3) Handoff package for Stage D

Use these files as Stage D inputs:

1. `research/stage-a/fixtures/` (correctness corpus)
2. `research/stage-a/gates.json` (quality thresholds)
3. `research/stage-a/pass-rate-baseline.json`
4. `research/stage-a/pass-rate-baseline-detail.json`
5. `research/stage-a/pass-rate-summary.md`
6. `research/stage-a/constraint-equations.md`
7. `research/stage-a/tolerance-policy.md`
8. `research/stage-a/entity-schema.md`

## 4) Known limitations (carry into Stage D)

- Extend/chamfer/fillet checks currently cover representative but limited geometry families.
- Solver internals (iteration traces/conditioning) are not yet benchmarked.
- Browser runtime performance and cross-browser determinism are not yet measured.

## 5) Stage D immediate actions

1. Run Stage A fixtures in browser runtime harness (Chrome/Edge/Firefox).
2. Record latency budgets for interactive and heavy recompute paths.
3. Compare deterministic outcomes against Stage A baselines.
4. Produce Go / Go-Hybrid / No-Go recommendation.

## 6) Confidence statement (important)

This Stage A work gives a **strong working model**, not a perfect/full understanding of all SolveSpace internals.

- We have validated a focused subset of constraint/edit-op math with deterministic fixtures.
- We have **not** yet traced every SolveSpace solver path, degeneracy handler, or UI-driven constraint edge case in runtime code.
- Full confidence requires Stage C runtime tracing against actual SolveSpace behavior and additional solver-path coverage.

## 7) Should we do more Stage A research before advancing?

Short answer: **only a small amount, targeted**.

### Recommended before Stage D (lightweight)

1. Add 2–4 more fixtures for non-axis-aligned extend/chamfer/fillet variants.
2. Add at least one “known difficult” solver-style case (near-singular geometry).
3. Document one-page ambiguity policy examples (trim + fillet tie-breaks).

### Not required before Stage D

- Full solver internals reverse-engineering.
- Exhaustive coverage of every SolveSpace edge case.

### Decision rule

Proceed to Stage D now if all are true:

- Core/edge/tag gates are passing.
- Baselines are stable.
- Remaining Stage A gaps are explicitly logged (they are).

Current status meets that bar, so Stage D can start while Stage A expands incrementally.
