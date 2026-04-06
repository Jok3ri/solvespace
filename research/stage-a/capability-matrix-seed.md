# Stage A Capability Matrix Seed (SolveSpace Parity Research)

This is the initial full-scope capability map for parity research.
It separates what is already covered in Stage A fixtures from what still needs evidence.

## Status legend
- **covered**: fixture evidence exists now.
- **partial**: some evidence exists, but depth/breadth is insufficient.
- **missing**: no meaningful evidence yet.

## Capability matrix

| Category | Capability | Current Evidence | Status | Next Research Action |
|---|---|---|---|---|
| Entities | Point/line/circle primitive behavior | Core fixture set (`distance`, `horizontal`, `vertical`, tangent line-circle basics) | partial | Add arc/spline/compound sketch entity families and parameter edge cases |
| Constraints | Coincident/distance/horizontal/vertical basic solve outcomes | Core fixtures + gate checks | partial | Expand to multi-constraint systems, conflicting constraints, and redundancy handling |
| Constraints | Under/over-constrained classification | Limited indirect coverage | missing | Add explicit fixtures and expected classification outputs |
| Solver | Convergence consistency under repeat runs | Pass-rate implies basic consistency | partial | Add repeated-run deterministic delta checks with numeric tolerances |
| Solver | Degenerate numeric stability (near-singular, near-parallel, tiny radii) | Edge fixtures exist for several families | partial | Expand family permutations and chained operations |
| Intersections | Line-line / line-circle / near-tangent outcomes | Existing edge/core fixtures | partial | Add more intersection multiplicity and topological transition scenarios |
| Edit-ops | Trim/extend/chamfer/fillet basic outcomes | Core + edge edit-op fixtures | partial | Add chained edit-op workflows and failure-mode expectations |
| Topology | Sketch graph integrity after edits | Minimal explicit checks | missing | Add invariants: entity count, connectivity, endpoint continuity |
| Offsets | Offset behavior and corner handling | No direct fixtures found | missing | Add offset geometry fixtures including self-intersection edge cases |
| Runtime parity | Comparison vs actual SolveSpace runtime traces | No trace-backed parity evidence yet | missing | Stage B/C tracing and side-by-side result comparison |
| Performance | Latency/jitter benchmarks in browser targets | Stage D scaffold exists, no consolidated evidence yet | missing | Execute full Stage D campaign and ingest outputs |
| Reliability | Long-session stability/memory behavior | No soak evidence yet | missing | Add soak protocol and incident taxonomy artifacts |

## Immediate research queue (next 5 tasks)

1. Add explicit under/over/constrained fixtures and expected diagnostics.
2. Add topology invariants to edit-op fixture outputs.
3. Add offset operation fixture family (simple, corner, self-intersection).
4. Define deterministic repeat protocol (N runs, numeric-delta thresholds).
5. Start Stage B/C trace capture template for parity comparison rows.
