# Stage B/C Runtime Trace Capture Template

Use this template when comparing Stage A expected behavior with actual SolveSpace runtime traces.

## Trace session metadata

- Trace ID:
- Date:
- SolveSpace version/commit:
- OS:
- Scenario group:
- Recorder/tooling:

## Scenario trace rows

| Scenario ID | Capability ID | Stage A Expected | Runtime Observed | Match? | Delta Type | Delta Details | Action |
|---|---|---|---|---|---|---|---|
| example_01 | constraints.distance.basic | endpoint distance = 25.0 | endpoint distance = 25.0 | yes | none | n/a | none |

## Delta type taxonomy

- `numeric`: numeric value differs beyond tolerance.
- `structural`: topology/entity structure differs.
- `classification`: solver classification differs (e.g., conflict vs converged).
- `workflow`: operation sequencing or side-effects differ.

## Required outputs per trace session

1. Completed scenario trace table.
2. List of newly discovered edge cases.
3. Fixture update candidates (new/changed JSON fixtures).
4. Decision: does this block parity confidence? (yes/no + rationale)
