# Do we need a real browser now?

Short answer: **Yes, for Stage D execution.**

## Why

Stage D asks questions that cannot be fully answered by static analysis alone:

- real interaction latency
- real browser engine numeric behavior
- cross-browser determinism (Chrome/Edge/Firefox)
- UI responsiveness under load

These require running in real browser environments.

## What can still be done in Codex Web

- prepare scripts and fixture packs
- define benchmark protocols
- collect and summarize outputs

## Practical split

1. Use Codex Web to orchestrate and manage artifacts.
2. Run benchmark commands in actual browsers on target hardware.
3. Commit measured results back into `research/stage-d/*.md`.
