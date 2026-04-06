# Deterministic Repeat Protocol (Stage A -> Stage D)

Purpose: verify solver/edit-op determinism beyond one-pass fixture success.

## Protocol definition

1. For each deterministic scenario, run **N=30 repeats** in a single environment.
2. Capture for each repeat:
   - final geometric outputs,
   - derived check outputs,
   - solve status/convergence metadata.
3. Normalize outputs before comparison (key ordering, numeric formatting policy).
4. Compute diffs against repeat #1 baseline.
5. Record:
   - mismatch count,
   - max numeric delta,
   - first mismatch index,
   - mismatch field paths.

## Threshold policy

- Structural mismatch tolerance: **0**.
- Numeric delta tolerance: derived from `tolerance-policy.md`; record observed maxima.
- Determinism PASS requires:
  - zero structural mismatches,
  - all numeric deltas within policy bounds.

## Reporting schema (suggested)

```json
{
  "scenarioId": "...",
  "repeats": 30,
  "structuralMismatchCount": 0,
  "maxNumericDelta": 0.0,
  "firstMismatchRepeat": null,
  "mismatchPaths": [],
  "deterministic": true
}
```

## Execution cadence

- Run protocol on every fixture corpus expansion.
- Run protocol before any Stage D go/conditional-go/no-go decision update.
- Run protocol in at least two distinct execution environments in Stage D.
