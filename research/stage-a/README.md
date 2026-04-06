# Stage A Research Workspace

## Run fixture checks

```bash
node research/stage-a/fixture-runner.js
```

This validates fixtures in:
- `research/stage-a/fixtures/core/*.json`
- `research/stage-a/fixtures/edge/*.json`

It writes pass-rate output to:
- `research/stage-a/pass-rate-report.json`
- `research/stage-a/pass-rate-detail.json`
- `research/stage-a/pass-rate-summary.md`

## Current gates
- Core target: 100%
- Edge target: >=95%

## Regression + CI-style gate

```bash
./research/stage-a/stage-a-ci-check.sh
```

This runs fixture checks and then compares `pass-rate-report.json` against `pass-rate-baseline.json`.
It fails if pass-rate regresses.

## Baseline update (intentional changes)

```bash
./research/stage-a/update-baseline.sh
```

Use this only when fixture behavior changes are intentional and reviewed.

## Tag-aware gates

Gate thresholds are configured in `research/stage-a/gates.json` (overall + per-tag minimum rates).

Current implemented geometric checks include: `distance`, `equal_x`, `equal_y`, `point_equal`, `line_circle_distance`, `intersection_count`, `classified_as_parallel`, `line_exists`, `line_removed`, `extend_line_end`, `chamfer_points`, `fillet_geometry`, `topology_chain_continuity` (including `segmentCount`, optional `requireClosed`, and `maxClosureGap`), `offset_chain_policy`, and `offset_diagnostic_limits`.

Stage A handoff draft: `research/stage-a/stage-a-closeout-draft.md`.

Stage A final closeout: `research/stage-a/stage-a-closeout-final.md`.
Stage A sufficiency assessment: `research/stage-a/stage-a-sufficiency-assessment.md`.
Stage A progress status: `research/stage-a/stage-a-progress-status.md`.
Stage A+ required research backlog: `research/stage-a/next-research-backlog.md`.
Stage A capability matrix seed: `research/stage-a/capability-matrix-seed.md`.
Deterministic repeat protocol: `research/stage-a/deterministic-repeat-protocol.md`.
Stage B/C priority fixture seed: `research/stage-a/stage-bc-trace-fixture-priority.json`.
Validate Stage B/C seed references: `node research/stage-a/validate-trace-priority.js`.
Generate Stage B/C trace session sheet: `node research/stage-a/generate-trace-session.js`.
Verify Stage B/C trace session sheet: `node research/stage-a/verify-trace-session.js`.
Report Stage B/C trace session progress: `node research/stage-a/trace-session-progress.js`.
Prepare Stage B/C trace session (all-in-one): `./research/stage-a/prepare-trace-session.sh`.
Generate Stage A status report: `node research/stage-a/generate-stage-a-status-report.js`.
Append Stage A status history: `node research/stage-a/append-stage-a-status-history.js`.
Initialize runtime trace session: `node research/stage-a/init-trace-session.js --id <trace_id>`.
Stage B/C trace capture template: `research/stage-a/stage-bc-trace-capture-template.md`.
Under/over-constrained fixture design draft: `research/stage-a/under-over-constrained-fixture-design.md`.
Code-review issues intake template: `research/stage-a/review-issues-intake-template.md`.
Stage D kickoff: `research/stage-a/stage-d-kickoff-checklist.md`.

Stage D explainer: `research/stage-a/stage-d-what-happens.md`.

Stage B explainer: `research/stage-a/stage-b-what-we-have.md`.

Ambiguity examples: `research/stage-a/ambiguity-policy-examples.md`.

Stage D Codex Web note: `research/stage-a/stage-d-codex-web-note.md`.
