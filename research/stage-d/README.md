# Stage D Workspace (Browser Feasibility)

This folder is for Stage D execution artifacts.

## Purpose

Validate whether the Stage A math/constraint/edit-op kernel can run reliably and fast enough in browser TypeScript.

## Planned artifacts

- `browser-feasibility-matrix.md`
- `perf-benchmark-results.md`
- `go-no-go-browser-ts.md`

## Execution note

Codex Web is used for orchestration and reporting.
Actual browser performance/determinism measurements must be run in real browser environments.

- `browser-required-now.md` clarifies when real browser execution is mandatory.

- `browser-test-runbook.md` explains how much of Stage D can be fully automated and how to run browser tests.
  It also includes a recommended way to use Google Antigravity Chrome runs as execution infrastructure.

- `antigravity-gemini-prompts.md` provides a full-scope copy/paste prompt program for SolveSpace-parity evidence collection in Antigravity and structured JSON handoff back here.
