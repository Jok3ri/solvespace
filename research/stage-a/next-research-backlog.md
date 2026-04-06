# Stage A+ Research Backlog (Required for Full SolveSpace Parity)

## Short answer

Yes. More research is required to reach full SolveSpace-equivalent confidence.

## Why more research is required

Current Stage A proves a strong baseline, but parity confidence still needs:
- broader capability coverage,
- deeper solver conflict/degeneracy evidence,
- runtime trace validation,
- long-chain edit-op stress behavior,
- cross-browser/hardware repeatability.

## Priority backlog

## P0 — Must complete before parity claim

1. Capability matrix expansion
   - Enumerate must-have behaviors and map each to one or more fixtures.
2. Solver edge-family expansion
   - Add under-constrained, over-constrained, conflicting, and near-singular numeric scenarios.
3. Runtime trace parity
   - Collect Stage B/C traces and compare against fixture expectations.
4. Stage D full-scope evidence run
   - Execute full-scope Antigravity prompt program and ingest structured outputs.
5. Regression governance
   - Enforce gate checks after every fixture corpus expansion.

## P1 — Strongly recommended

1. Large sketch workload suite
   - Add realistic chained operations for cnc-cam style workloads.
2. Determinism stress
   - Increase repeat counts and run across multiple browser channels.
3. Memory/stability campaign
   - Add longer soak tests with incident taxonomy.

## Exit criteria for “research complete enough for implementation hardening”

All criteria below must be true:

1. Must-have capability matrix coverage >= 95% with documented exceptions.
2. No unresolved critical solver divergence in parity comparisons.
3. Performance/risk profile classified as `go` or `conditional-go` with mitigations accepted.
4. Reliability/stability runs pass with no critical unresolved incidents.
5. Decision docs updated with evidence links and signed go/no-go rationale.
