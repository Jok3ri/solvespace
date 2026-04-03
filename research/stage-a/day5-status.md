# Stage A Day-5 Status

## Completed
- Added per-fixture regression tracking in `compare-pass-rate.js`.
- Added detailed runner output file `pass-rate-detail.json`.
- Added baseline update helper `update-baseline.sh`.

## Current workflow
1. `node research/stage-a/fixture-runner.js`
2. `node research/stage-a/compare-pass-rate.js`
3. `./research/stage-a/stage-a-ci-check.sh`
4. (if intentional change) `./research/stage-a/update-baseline.sh`

## Next
- Add fixture tags (constraint/edit-op/intersection) for category-level reporting.
- Add markdown summary export for easier review in PRs.
