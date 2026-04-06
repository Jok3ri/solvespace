# Stage A Day-4 Status

## Completed
- Added regression diff reporting script: `compare-pass-rate.js`.
- Added CI-style one-command gate script: `stage-a-ci-check.sh`.
- Added initial baseline snapshot: `pass-rate-baseline.json`.

## Current workflow
1. Run fixture checks -> updates `pass-rate-report.json`.
2. Compare against baseline -> fail on regression.
3. Use `stage-a-ci-check.sh` for one-command gating.

## Next
- Add per-fixture regression listing (which fixture changed pass/fail state).
- Add optional baseline update command after intentional improvements.
