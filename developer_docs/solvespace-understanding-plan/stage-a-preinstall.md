# Stage A — Pre-install only (do first)

Goal: make progress on math, geometry, constraints, and TypeScript design **without** installing/running SolveSpace.

## A1. Read-and-map tasks

- Build a file/function map for entities, constraints, trim, offsets, and serialization.
- Produce a call-flow map for: add line -> add constraint -> solve -> redraw.

## A2. Math extraction tasks

- Write symbolic equations for target constraints:
  - coincident
  - distance
  - horizontal
  - vertical
  - tangent
  - parallel
  - perpendicular
- Document variable vectors, residual functions, Jacobian terms, and convergence criteria.

## A3. Geometry algorithm tasks

- Define intersection routines:
  - line-line
  - line-arc
  - arc-arc
  - circle-line
  - circle-circle
- Specify trim/extend interval-selection rules and ambiguity tie-breakers.
- Specify fillet/chamfer construction formulas and side-selection logic.
- Specify offset behavior:
  - orientation conventions (CW/CCW)
  - join styles (miter/round/bevel)
  - self-intersection pruning

## A4. TypeScript design tasks for cnc-cam

- Draft interfaces for entities, constraints, and solver diagnostics.
- Draft pure-operation signatures:
  - `trim`
  - `extend`
  - `fillet`
  - `chamfer`
  - `offset`
- Draft tolerance policy:
  - positional EPS
  - angular EPS
  - merge tolerance
- Define units policy.

## A5. Test-first tasks

- Create a geometry golden-case corpus (JSON fixtures) with expected outputs.
- Add deterministic numerical checks for intersections/offsets/fillets.
- Add regression fixtures for pathological cases:
  - near-parallel
  - near-tangent
  - tiny radii
  - overlapping segments

## A6. Portability/risk tasks

- Record what is portable math/core versus SolveSpace-specific UI behavior.
- Decide parity policy early:
  - exact solver behavior parity, or
  - feature-equivalent output parity.

## Stage A deliverables

- TS interface draft for geometry + constraints.
- Constraint equation catalog (symbolic forms + unknown vectors + Jacobian notes).
- Geometry operation math notes (trim/extend/fillet/chamfer/offset).
- Initial JSON fixture corpus with deterministic expected outputs.

---

## Stage A research plan (execution-ready)

Use this as a concrete research program before any SolveSpace installation.

### Research duration

- Recommended: **10 working sessions** (90–150 minutes each).
- Output-driven: each session must end with at least one committed artifact (notes, equations, fixtures, or TS interfaces).

### Session-by-session plan

#### Session 1 — Scope and corpus setup
- Create research workspace in your cnc-cam repo (or notes repo):
  - `research/stage-a/notes/`
  - `research/stage-a/equations/`
  - `research/stage-a/fixtures/`
  - `research/stage-a/interfaces/`
- Define naming conventions for fixtures and equation notes.
- Write a one-page research charter (what “done” means for Stage A).

#### Session 2 — Entity representation study
- Draft TS types for point/line/arc/circle and shared IDs.
- Define canonical coordinate + orientation conventions.
- Decide derived-entity policy (fillet/chamfer parent references).

#### Session 3 — Constraint math set 1
- Write symbolic forms for:
  - coincident
  - horizontal
  - vertical
  - distance
- Define unknown vector layout and residual computation contract.

#### Session 4 — Constraint math set 2
- Write symbolic forms for:
  - parallel
  - perpendicular
  - tangent
- Document expected singularities and epsilon strategy.

#### Session 5 — Intersection engine specification
- Specify robust algorithms and edge-case handling for:
  - line-line
  - line-arc
  - arc-arc
  - circle-line
  - circle-circle
- Add first deterministic numeric fixtures.

#### Session 6 — Trim/extend semantics
- Define interval selection model and click disambiguation policy.
- Define rule table for constraint remapping after split/trim.
- Add at least 6 trim/extend fixtures.

#### Session 7 — Fillet/chamfer semantics
- Specify construction equations and side selection rules.
- Define failure diagnostics for impossible geometry.
- Add at least 6 fillet/chamfer fixtures.

#### Session 8 — Offset semantics
- Define signed offset conventions for open/closed curves.
- Define join behavior (miter/round/bevel) and pruning rules.
- Add at least 8 offset fixtures including self-intersection cases.

#### Session 9 — TS API and module boundaries
- Finalize module boundaries:
  - `geom-core`
  - `constraint-core`
  - `sketch-topology`
  - `edit-ops`
- Freeze function signatures and error/diagnostics schema.

#### Session 10 — Review + gate decision
- Run fixture suite and summarize pass/fail matrix.
- Produce Stage A closeout report:
  - known ambiguities
  - unresolved math risks
  - recommendation for Stage B readiness.

### Minimum artifacts checklist

By end of Stage A, you should have:

- `entity-schema.md`
- `constraint-equations.md`
- `intersection-spec.md`
- `trim-extend-spec.md`
- `fillet-chamfer-spec.md`
- `offset-spec.md`
- `api-boundaries.md`
- >= 25 JSON fixtures with expected outputs
- Stage A closeout report with Stage B go/no-go

### Quality bar for Stage B handoff

Stage A is considered complete when:

1. Constraint equations are explicit and internally consistent.
2. Geometry operation specs include ambiguity rules (not just formulas).
3. Fixture suite demonstrates deterministic behavior across edge cases.
4. TS interfaces are stable enough to survive first implementation spike.

---

## Assessment of Stage A (my view)

Stage A is strong and appropriately front-loaded for your browser TypeScript goal.

### What is good

1. **Correct order of work**
   - You are solving math and determinism first, which is exactly right for CAD/CAM kernels.
2. **Test-first bias**
   - Requiring fixtures before runtime parity will prevent many subjective debates later.
3. **Portability awareness**
   - Explicit separation of portable core math from UI-dependent behavior is excellent.
4. **Clear gate criteria**
   - Exit criteria reduce risk of jumping to implementation too early.

### What to watch out for

1. **Over-specification risk**
   - Avoid spending too long on perfect symbolic notes before validating with fixtures.
2. **Tolerance inconsistency**
   - Different operations may silently use different EPS assumptions unless centralized.
3. **Ambiguity creep in edit ops**
   - Trim/fillet decisions can become ad hoc without explicit tie-break hierarchy.
4. **Fixture blind spots**
   - Easy cases may pass while near-degenerate geometry still fails.

### Recommendations to tighten Stage A further

- Add a single `tolerance-policy.md` referenced by every spec.
- Add a mandatory “degenerate-case” fixture bucket for each operation.
- Track each unresolved ambiguity in a numbered decision log.
- Enforce a weekly Stage A checkpoint with a pass-rate trend chart.

### Bottom line

For your objective (browser-native cnc-cam in TypeScript), Stage A is the **most important stage** and this plan is directionally correct. If you execute it with strict fixture discipline, it will significantly reduce rework in later stages.

---

## Start Stage A now (Codex Web quickstart)

Yes — with the confirmed defaults, you can start Stage A immediately in Codex Web.

### First 90-minute kickoff block

1. Create artifact files:
   - `research/stage-a/entity-schema.md`
   - `research/stage-a/constraint-equations.md`
   - `research/stage-a/tolerance-policy.md`
   - `research/stage-a/fixtures/README.md`
2. Define v1 scope explicitly as “all listed entities/ops/constraints”.
3. Write first 4 constraint equations (coincident, horizontal, vertical, distance).
4. Add first 10 fixtures:
   - 6 core (easy deterministic)
   - 4 edge (near-parallel / near-tangent)
5. Record pass-rate report template (core vs edge buckets).

### Done criteria for kickoff block

- 4 markdown spec files created.
- 10 initial fixtures drafted with expected outputs.
- Constraint equations documented for first 4 constraints.
- Tolerance policy draft started (EPS and ambiguity rules).

After this kickoff block, continue with Session 2 in the Stage A research plan.
