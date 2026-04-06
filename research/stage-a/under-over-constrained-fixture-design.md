# Under/Over-Constrained Fixture Design (Research Draft)

Goal: define the next fixture family that validates solver classification and diagnostic behavior.

## Classification targets

- `well_constrained`
- `under_constrained`
- `over_constrained_consistent`
- `over_constrained_conflicting`

## Scenario set (initial)

## U1: Under-constrained line endpoint
- Entities: two points with one line relation, no fixed distance.
- Expected classification: `under_constrained`.
- Expected diagnostic: free DOF > 0.

## U2: Under-constrained triangle with one missing edge constraint
- Entities: three points, two distances, no closing constraint.
- Expected classification: `under_constrained`.
- Expected diagnostic: rotational/shape ambiguity.

## O1: Over-constrained but consistent duplicate distance
- Entities: two points with duplicated identical distance constraints.
- Expected classification: `over_constrained_consistent`.
- Expected diagnostic: redundant constraints detected.

## O2: Over-constrained conflicting distance
- Entities: same two points with contradictory distance constraints.
- Expected classification: `over_constrained_conflicting`.
- Expected diagnostic: unsatisfied/conflict set includes both distance constraints.

## O3: Horizontal + vertical + nonzero distance contradiction
- Entities: two distinct points with horizontal and vertical constraints plus fixed nonzero distance.
- Expected classification: `over_constrained_conflicting`.
- Expected diagnostic: mutually incompatible relation set.

## W1: Well-constrained baseline pair
- Entities: two points with exact distance + one axis lock.
- Expected classification: `well_constrained`.
- Expected diagnostic: no unresolved DOF beyond permitted global transforms.

## JSON fixture shape additions (proposed)

Add optional expected metadata block:

```json
{
  "expectedSolver": {
    "classification": "under_constrained",
    "freeDofMin": 1,
    "conflictConstraintIds": []
  }
}
```

## Harness implications

To support this family, `fixture-runner.js` will need:
1. classifier output channel (`classification`, `freeDofEstimate`),
2. redundancy/conflict reporting,
3. new check kinds for solver diagnostics.

## Acceptance criteria for this research task

1. At least 6 scenarios implemented (U1/U2/O1/O2/O3/W1).
2. Deterministic repeat protocol applied to all 6.
3. Baseline report includes classification pass-rate by bucket.
