# Stage A Day-1 Checklist (start here)

If you are starting Stage A now, do these steps in order.

## 0) Create workspace in this repo

```bash
mkdir -p research/stage-a/fixtures/{core,edge}
touch research/stage-a/entity-schema.md
touch research/stage-a/constraint-equations.md
touch research/stage-a/tolerance-policy.md
touch research/stage-a/fixtures/README.md
```

## 1) Seed the 4 starter docs

- Copy/paste from `stage-a-starter-templates.md` into:
  - `research/stage-a/entity-schema.md`
  - `research/stage-a/constraint-equations.md`
  - `research/stage-a/tolerance-policy.md`
  - `research/stage-a/fixtures/README.md`

## 2) Add initial fixture pack (10 files)

- Copy starter JSON fixtures from:
  - `templates/fixtures/core/*.json`
  - `templates/fixtures/edge/*.json`
- Place them in:
  - `research/stage-a/fixtures/core/`
  - `research/stage-a/fixtures/edge/`

## 3) Fill first real math content

In `constraint-equations.md`, complete these first:

1. coincident
2. horizontal
3. vertical
4. distance

Include residual form and Jacobian notes.

## 4) Define tolerance + ambiguity policy

In `tolerance-policy.md`, define:

- `EPS_POS`, `EPS_ANG`, `EPS_REL`
- trim ambiguity tie-break rule
- fillet side-selection rule

## 5) First status report (same day)

Write a short note containing:

- number of core fixtures
- number of edge fixtures
- which constraints are fully specified
- open ambiguities

## Day-1 done criteria

- 4 docs created and populated with first draft content.
- 10 starter fixtures copied into `research/stage-a/fixtures/`.
- First 4 constraints documented with equations.
- Tolerance defaults written.
