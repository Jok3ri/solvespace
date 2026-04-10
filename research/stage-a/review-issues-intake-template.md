# Code Review Issues Intake Template

Use this template to paste Codex/GitHub review findings so they can be converted into research tasks.

## Reviewer metadata

- PR URL:
- Reviewer:
- Review date:
- Scope:

## Issue list

| Issue ID | File/Area | Severity | Summary | Suggested Fix | Research Impact | Owner | Status |
|---|---|---|---|---|---|---|---|
| ex-001 | research/stage-a/fixture-runner.js + fixtures/edge | high | Missing solver conflict classification checks | Add classification output + checks | Blocks parity confidence | stage-a-research | resolved (fixtures added through quadrilateral conflict coverage) |

## Severity policy

- `critical`: must be resolved before Stage D decision.
- `high`: should be resolved before Stage B/C parity claims.
- `medium`: planned in next research sprint.
- `low`: backlog item.

## Triage notes

- Confirm reproducibility for each issue.
- Link issue to capability matrix row.
- Add/update fixture if behavior-related.
- Record whether gate thresholds are affected.

## Completion criteria

1. Every issue mapped to an owner and status.
2. High/critical issues mapped to concrete artifacts (doc/fixture/script changes).
3. Updated research backlog references each unresolved high/critical issue.
