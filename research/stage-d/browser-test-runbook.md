# Stage D Browser Test Runbook

## Can this be fully controlled end-to-end?

Short answer: **mostly yes for orchestration**, but full fidelity requires real browser execution environments.

## Control model

### What can be fully automated in-repo

1. Fixture execution scripts
2. Result collection into markdown/json artifacts
3. Gate checks and pass/fail decisions
4. Report generation and Go/No-Go draft updates

### What depends on external environment

1. Real browser runtime behavior (Chrome/Edge/Firefox)
2. Hardware-specific latency/jank characteristics
3. Local browser configuration and power/thermal effects

## Recommended execution pipeline

1. Run fixture bundle in each browser target.
2. Save raw results (`json`) per browser.
3. Aggregate into Stage D reports:
   - `browser-feasibility-matrix.md`
   - `perf-benchmark-results.md`
4. Apply decision rubric in `go-no-go-browser-ts.md`.

## Practical options

- **Option A: local/manual browsers**
  - You run scripted commands locally and commit results.
- **Option B: CI browser automation**
  - Use Playwright/Puppeteer in CI for repeatable runs.
- **Option C: hybrid**
  - CI for baseline + local stress/perf validation.

## Using Google Antigravity as the browser executor

Yes — you can use Google Antigravity (VS Code + Gemini + Chrome execution) as the
**browser execution layer** for Stage D automation.

Recommended pattern:

1. Keep this repo as source of truth for fixtures, gates, and report schemas.
2. Run scripted browser suites in Antigravity Chrome.
3. Export raw run artifacts (JSON + traces/summaries).
4. Commit artifacts here and run the local gate pipeline.

Operational guardrails:

- Pin browser version + OS image for baseline runs.
- Record environment metadata with every run (browser version, CPU tier, power mode).
- Keep at least one independent rerun path (local or CI) for spot verification.
- Treat Antigravity as execution infra, not policy ownership: pass/fail logic stays in-repo.

## Suggested minimum automation boundary

Automate everything from result ingestion onward, even if browser execution is local:

- parse results
- compute pass-rate deltas
- update decision docs
- fail gate when thresholds are missed
