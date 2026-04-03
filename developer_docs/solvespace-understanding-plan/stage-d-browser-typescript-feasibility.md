# Stage D — Browser-first TypeScript feasibility analysis (post-research)

Goal: immediately after Stage A (and before install/runtime stages), decide whether constraints/math/edit-ops can run fully in-browser in TypeScript for `cnc-cam`.

Prerequisite: Stage A artifacts complete.

## D1. Decision question

Can `cnc-cam` implement constraints, geometry math, and edit operations **entirely in browser TypeScript** with acceptable accuracy, performance, and maintainability?

## D2. Feasibility dimensions (critical)

Evaluate each subsystem on a 1–5 scale (5 = strong fit):

1. **Numerical stability**
   - Constraint convergence behavior under browser JS number model (`float64`).
   - Tolerance/epsilon behavior for near-singular cases.
2. **Performance**
   - Solve latency target per interaction (e.g., <16ms for smooth interaction, <100ms acceptable for heavier updates).
   - Geometry edit-op throughput for realistic sketch sizes.
3. **Determinism/reproducibility**
   - Repeatability across Chrome/Edge/Firefox.
   - Deterministic fixture pass rates.
4. **Architecture fit**
   - Clean separation of pure kernels from UI framework.
   - Ease of worker offloading and incremental solving.
5. **Developer velocity**
   - Debuggability in TS.
   - Testability and maintenance cost.

## D3. Browser constraints and mitigations

### Constraints
- Single-threaded UI main thread can stall under heavy solve operations.
- Floating-point edge cases can cause jitter/flaky edge behavior.
- Large fixture suites may become slow in dev-mode if not partitioned.

### Mitigations
- Run solver/edit kernels in **Web Workers**.
- Keep all geometry operations pure and side-effect free.
- Use deterministic tolerances and normalization rules.
- Add operation budgets/timeouts and graceful degradation diagnostics.
- Batch expensive recomputation; prefer incremental updates.

## D4. Required benchmark suite

Run these in-browser (not just Node):

1. **Constraint solve benchmarks**
   - Small: 20–50 constraints
   - Medium: 100–300 constraints
   - Large: 500+ constraints (stress)
2. **Geometry operations benchmarks**
   - batch trim/extend
   - batch fillet/chamfer
   - offsets on mixed line/arc paths
3. **Stability benchmarks**
   - near-parallel, near-tangent, tiny radius, almost coincident points
4. **Responsiveness benchmarks**
   - UI frame drop rate during drag/solve loops

## D5. Output artifacts (must produce)

- `browser-feasibility-matrix.md`
- `perf-benchmark-results.md`
- `numerical-risk-register.md`
- `worker-architecture-proposal.md`
- `go-no-go-browser-ts.md`

## D6. Go / No-Go criteria

Recommend **Go (TS in browser)** only if all are true:

1. >= 95% pass rate on deterministic fixture corpus including edge cases.
2. Interactive constraint updates meet defined latency budgets on target hardware.
3. No blocker-level numerical instability remains open.
4. Worker-based architecture demonstrates smooth UI under medium scenarios.

Else choose one of:

- **Go with hybrid path**: TS orchestration + WASM math kernel.
- **No-Go**: re-scope feature set or relax interactivity constraints.

## D7. Recommendation template

At Stage D closeout, produce a one-page recommendation:

- Decision: Go TS / Go Hybrid / No-Go
- Top 5 risks
- 90-day implementation plan
- Milestone acceptance criteria
