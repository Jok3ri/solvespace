# Stage D Kickoff Checklist (from Stage A outputs)

## Preconditions
- [x] Stage A gates passing
- [x] Baselines refreshed
- [x] Closeout package assembled

## Browser benchmark kickoff
- [ ] Run fixture set in Chrome
- [ ] Run fixture set in Edge
- [ ] Run fixture set in Firefox
- [ ] Record pass-rate and runtime per browser

## Performance targets
- [ ] Interactive update median <= 16ms
- [ ] Normal recompute <= 50ms
- [ ] Heavy recompute <= 150ms

## Determinism checks
- [ ] Compare fixture pass/fail parity across browsers
- [ ] Compare key numeric outputs within epsilon bounds

## Decision outputs
- [ ] `research/stage-d/browser-feasibility-matrix.md`
- [ ] `research/stage-d/perf-benchmark-results.md`
- [ ] `research/stage-d/go-no-go-browser-ts.md`
