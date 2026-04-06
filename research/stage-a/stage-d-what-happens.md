# What happens in Stage D?

Stage D is the **browser feasibility validation stage**. You use Stage A outputs to decide whether `cnc-cam` can run constraints/math/edit-ops fully in browser TypeScript.

## Inputs from Stage A

- `fixtures/` corpus (correctness scenarios)
- pass-rate baselines
- tolerance policy
- constraint equations/entity schema

## Main activities

1. **Browser parity runs**
   - Run the same fixture corpus in Chrome, Edge, and Firefox.
   - Compare pass/fail and key numeric outputs against Stage A baseline.

2. **Performance profiling**
   - Measure interactive update latency (target <= 16 ms median).
   - Measure normal recompute (target <= 50 ms).
   - Measure heavy recompute (target <= 150 ms).

3. **Determinism analysis**
   - Check if browser engines produce stable, repeatable numeric outcomes.
   - Identify epsilon-sensitive fixtures and document variance.

4. **Architecture decision test**
   - Evaluate pure TS in browser vs hybrid (TS + WASM kernel) for bottlenecks.
   - Validate worker-based execution for responsiveness.

## Outputs

- `browser-feasibility-matrix.md`
- `perf-benchmark-results.md`
- `go-no-go-browser-ts.md`

## Decision outcomes

- **Go TS**: full browser TypeScript is viable now.
- **Go Hybrid**: keep TS orchestration but move heavy math to WASM/native module.
- **No-Go (for now)**: revise scope or defer some features.
