# How to use Stage A templates

## Quick start

1. Copy the starter markdown templates from:
   - `stage-a-starter-templates.md`
2. Create your working files in your cnc-cam repo:
   - `research/stage-a/entity-schema.md`
   - `research/stage-a/constraint-equations.md`
   - `research/stage-a/tolerance-policy.md`
   - `research/stage-a/fixtures/README.md`
3. Copy starter fixture JSON files from:
   - `templates/fixtures/core/*.json`
   - `templates/fixtures/edge/*.json`
4. Rename/edit each fixture to include real entity coordinates and expected numeric checks.
5. Run your fixture harness and record:
   - core pass-rate
   - edge pass-rate
   - regressions

## Suggested workflow

- Start by making all **core** fixtures pass (target 100%).
- Then improve **edge** fixtures (target >=95%).
- Any tolerance change must update `tolerance-policy.md` and include a pass-rate diff note.

## Minimal first run checklist

- [ ] 4 markdown spec files created
- [ ] 10 fixture files copied and customized
- [ ] first pass/fail report generated
- [ ] unresolved ambiguities logged

## Where should these files live?

Short answer: choose one source of truth; by current team decision it is **this repository**.

- This SolveSpace repo is currently the active Stage A workspace.
- Keep active artifacts under `research/stage-a/*` here until migration is needed.

### Practical split

- Keep in **SolveSpace repo**:
  - plan docs and starter template references
  - optional snapshots of findings relevant to SolveSpace internals
- Keep in **cnc-cam repo**:
  - evolving `research/stage-a/*.md` specs
  - executable fixture JSON corpus used by tests
  - fixture runner code and CI pass-rate reports

If you only want one source of truth, use `cnc-cam` as primary and treat this repo as read-only guidance.

## Why teams often keep active files in cnc-cam? (alternative model)

Because it reduces integration friction:

1. Your executable harness, CI checks, and runtime code live in `cnc-cam`.
2. Specs and fixtures evolve together with implementation changes.
3. Pass/fail trends are visible where decisions are made.
4. It avoids duplicate sources of truth across two repos.

If your team later prefers implementation-first ownership, you can switch to this model.


## Project decision (current)

Per current team decision, Stage A artifacts will be kept in **this repository** for now.

### Working paths in this repo

- `research/stage-a/entity-schema.md`
- `research/stage-a/constraint-equations.md`
- `research/stage-a/tolerance-policy.md`
- `research/stage-a/fixtures/`

### Revisit point

If/when implementation starts in `cnc-cam`, we can migrate or mirror these artifacts there. Until then, this repo is the active Stage A workspace.
