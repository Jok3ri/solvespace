# Stage A Progress Status

## Current status (not finished)

Stage A is **in progress**.

- Baseline fixture gates are green.
- Regression protections were hardened (missing baseline + missing fixture detection).
- Determinism/research process docs are in place.
- Full parity-level fixture coverage is still incomplete.

## What is complete

1. Core fixture harness and CI-style gate scripts.
2. Baseline pass-rate artifacts and comparator checks.
3. Initial capability matrix seed and research backlog.
4. Determinism repeat protocol and Stage B/C trace template.
5. First executable under/over-constrained slice implemented (U1/O2/W1 class checks).

## What remains for Stage A completion

1. Expand under/over-constrained fixture families beyond initial slice.
2. Add topology invariant checks (connectivity/entity continuity).
3. Add offset fixture family (simple/corner/self-intersection).
4. Add deterministic repeat execution outputs into reports.
5. Close open high-severity review findings from code-review intake.

## Stage A definition of done

Stage A is considered complete when all are true:

1. Must-have fixture families are implemented and gated.
2. Comparator rejects coverage loss and baseline drift.
3. Determinism protocol has recorded evidence for fixture families.
4. Remaining high/critical review issues are resolved or explicitly deferred with rationale.
5. Stage A closeout updated with evidence links.

## Next research action (starting now)

Expand solver classification fixtures to cover redundant-consistent and 3-point ambiguity scenarios.
