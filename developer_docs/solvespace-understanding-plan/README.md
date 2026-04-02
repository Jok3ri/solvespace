# SolveSpace Understanding Plan (Split by Stage)

This is the split version of the deep-dive plan, organized into independent task documents.

## Stages

1. **Stage A (Pre-install only):** do all source/math/TS design work before installing SolveSpace.
   - `stage-a-preinstall.md`
2. **Stage D (Browser TS feasibility):** post-Stage-A critical analysis for full browser execution in `cnc-cam` (done before install/runtime stages).
   - `stage-d-browser-typescript-feasibility.md`
3. **Stage B (Install + bring-up gate):** install/run SolveSpace only after Stage A criteria are met.
   - `stage-b-install-and-gate.md`
4. **Stage C (Runtime parity + deep tracing):** use SolveSpace runtime to validate parity and trace behavior.
   - `stage-c-runtime-parity-and-tracing.md`

## How to use

- Complete Stage A first.
- Execute Stage D immediately after Stage A to decide Go/No-Go for full browser TypeScript execution.
- Move to Stage B only when Stage A exit criteria are satisfied (and Stage D decision is recorded).
- Execute Stage C as validation and behavior-parity work for `cnc-cam`.

## Kickoff aid

- Before Stage A, review `stage-a-kickoff-questions.md` to confirm scope, numeric policy, and verification ownership.

- Use `stage-a-starter-templates.md` for copy/paste starter artifact files.
- See `how-to-use-templates.md` for step-by-step usage instructions and fixture starter pack.
- Start with `stage-a-day1-checklist.md` for an immediate Day-1 action plan.
