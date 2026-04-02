# SolveSpace Deep-Dive Plan (Windows 11 + WSL)

> Note: This plan is now also split by stage under `developer_docs/solvespace-understanding-plan/`:
> - `README.md`
> - `stage-a-preinstall.md`
> - `stage-b-install-and-gate.md`
> - `stage-c-runtime-parity-and-tracing.md`
> - `stage-d-browser-typescript-feasibility.md`
> - Recommended stage order: **A -> D -> B -> C**.

This plan is designed to help you build a complete mental model of how SolveSpace works: rendering/canvas, sketch entities, constraints, trim behavior, planes/workplanes, solver pipeline, and overall architecture.

## Outcomes

By the end of this plan, you should be able to:

1. Build and run SolveSpace from source in your WSL workflow.
2. Trace a user action (draw line, add constraint, trim, create workplane) from UI event to model mutation to solver to redraw.
3. Locate and modify the code paths for drawing tools, trim operations, constraints, planes/workplanes, and canvas interaction.
4. Add lightweight instrumentation and targeted tests for behavior verification.
5. Prepare a safe path for your first functional change.

## Recommended execution order (reorganized: pre-install first)

Follow this order so all non-install tasks are completed before installing/running SolveSpace:

### Stage A — Pre-install only (do first)
1. Read-and-map tasks (file/function map for entities, constraints, trim, offsets, serialization).
2. Math extraction tasks (constraint equations, unknown vectors, Jacobians, convergence criteria).
3. Geometry algorithm tasks (intersections, trim/extend rules, chamfer/fillet formulas, offset rules).
4. TypeScript design tasks for `cnc-cam` (interfaces + operation signatures + tolerance policy).
5. Test-first tasks (golden fixtures + numerical regressions).
6. Portability/risk tasks (portable core vs app-specific behavior; parity policy).

### Stage B — Install/run SolveSpace only after Stage A exit criteria
Install and run SolveSpace when all are true:
- Entity + constraint TS interfaces drafted.
- 15–25 geometry/constraint fixtures passing in standalone TS harness.
- Written ambiguity policy for trim/extend/fillet decisions.

### Stage C — Runtime parity validation and deep trace
After installation, execute the original phase flow (environment/run checks, architecture trace, solver trace, edit-op trace, render/picking, persistence), but now as validation against your pre-built TS math model.

---

## Phase 0 — Environment + workflow baseline (Windows 11 + WSL, post-install)

### Goals
- Ensure you can iterate quickly and debug confidently.
- Decide where the executable runs (WSL/Linux GUI via WSLg vs native Windows build).

### Steps
1. Confirm toolchain in WSL:
   - `cmake`, `ninja`/`make`, `gcc` or `clang`, `gdb`, and required GUI/OpenGL dependencies.
2. Configure an out-of-tree build directory (`build/`).
3. Build in Debug mode first.
4. Launch SolveSpace from WSL (WSLg) and verify UI opens.
5. Create a minimal sample sketch and save/load it.

### Deliverables
- A single command sequence you can rerun anytime.
- A note on expected startup path and where logs/debug output appear.

---

## Phase 1 — High-level architecture map

### Goals
- Understand major subsystems before reading deep implementation.

### Steps
1. Read top-level docs (`README.md`, `developer_docs/`, build docs).
2. Build a module map of:
   - **UI/input** (menus, tools, command dispatch).
   - **Model/state** (entities, groups, constraints, params).
   - **Solver** (equation setup and solving loop).
   - **Rendering/canvas** (camera/projection, draw list, overlays).
   - **I/O** (`.slvs` serialization/deserialization).
3. Create a “data flow of one click” diagram: pointer event → command/tool state → model edits → solve → redraw.

### Deliverables
- A one-page architecture cheat sheet (files + responsibilities).

---

## Phase 2 — Domain model fundamentals (entities, params, constraints)

### Goals
- Understand the core internal representation of sketch geometry and constraints.

### Steps
1. Identify core classes/structs for:
   - Entities (point/line/arc/circle/spline/workplane/etc.).
   - Constraint objects and their typed variants.
   - Parameter/handle system and IDs.
2. Trace how entities and constraints are created, stored, and referenced.
3. Inspect how selection/picking references these objects.
4. Map lifecycle events:
   - Create
   - Edit
   - Delete
   - Regenerate/resolve after solve

### Deliverables
- A glossary: “if I need X behavior, look in Y files/types.”

---

## Phase 3 — Constraint engine deep dive

### Goals
- Understand how geometric intent becomes equations and solved values.

### Steps
1. Identify where each constraint type is defined and dispatched.
2. For at least 8 common constraints (distance, horizontal, vertical, coincident, angle, diameter/radius, parallel, perpendicular), trace:
   - UI command creation
   - Internal constraint object
   - Equation generation
   - Solve/update propagation
3. Identify failure/overconstraint handling:
   - diagnostics,
   - warning messages,
   - partial/failed solve behavior.
4. Add temporary debug prints or breakpoints around “add constraint” and “solve pass” boundaries.

### Deliverables
- Constraint trace notes with source file/function entry points.

---

## Phase 4 — Drawing tools pipeline

### Goals
- Understand how interactive tools create geometry.

### Steps
1. Enumerate primary drawing tools (line/rectangle/circle/arc/spline/text if applicable).
2. For each selected tool, trace:
   - Tool activation
   - Mouse move/down/up handling
   - Preview geometry
   - Commit to model
   - Auto-constraints (if any)
3. Capture the state machine for one tool (e.g., line tool: first click, second click, chained segments).

### Deliverables
- Tool lifecycle table: input events vs model mutations.

---

## Phase 5 — Trim behavior analysis

### Goals
- Fully understand how trim decides what to keep/remove and what is regenerated.

### Steps
1. Locate trim command implementation.
2. Trace selection logic:
   - What is selectable for trim?
   - How nearest hit is chosen.
3. Trace geometric split logic:
   - Which intersections are computed?
   - How segments/arcs are cut.
4. Track constraint reconciliation:
   - Which constraints survive, are rewritten, or are deleted.
5. Validate edge cases:
   - coincident endpoints,
   - near-tangent intersections,
   - trimming constrained geometry,
   - trimming projected/imported/reference geometry.

### Deliverables
- A trim algorithm walkthrough + list of risky edge cases.

---

## Phase 6 — Planes/workplanes and coordinate systems

### Goals
- Understand 2D-on-3D sketching context and transformations.

### Steps
1. Trace how a workplane is created/selected.
2. Inspect 3D↔2D mapping used for sketch input and rendering.
3. Understand normal/origin axes representation for planes.
4. Verify how constraints behave across planes.
5. Check how group operations (extrude/revolve/etc.) depend on plane context.

### Deliverables
- Coordinate system map with conversion call sites.

---

## Phase 7 — Canvas/rendering pipeline

### Goals
- Understand what gets drawn, when, and why.

### Steps
1. Identify rendering backend and draw entry points.
2. Trace viewport/camera setup (zoom, pan, rotate, projection mode).
3. Trace draw ordering:
   - solid model,
   - sketch geometry,
   - construction/reference geometry,
   - selection highlights,
   - tool previews/gizmos.
4. Map hit testing/picking path and tolerance settings.
5. Inspect invalidation/redraw triggers after model changes.

### Deliverables
- Rendering/picking flow diagram.

---

## Phase 8 — File format and persistence

### Goals
- Understand how internal objects map to `.slvs` data.

### Steps
1. Locate serialization/deserialization code.
2. Map entity and constraint IDs in memory vs file.
3. Verify load-time reconstruction and solve order.
4. Perform controlled edits in text/binary format (as applicable) to observe behavior.

### Deliverables
- Persistence notes for future migration-safe changes.

---

## Phase 9 — Tests, instrumentation, and safe modifications

### Goals
- Build confidence before nontrivial edits.

### Steps
1. Inventory existing tests/benchmarks.
2. Run full/targeted tests from WSL.
3. Add repeatable debug aids:
   - conditional logs,
   - tiny repro sketches,
   - scripted command sequences (if available).
4. Choose one tiny change (e.g., extra trim diagnostic) and implement end-to-end:
   - code,
   - test or repro steps,
   - verification.

### Deliverables
- “First safe change” checklist/template.

---

## Practical weekly cadence (recommended)

- **Week 1:** Phases 0–2 (build + architecture + model).
- **Week 2:** Phases 3–4 (constraints + drawing tools).
- **Week 3:** Phases 5–7 (trim + planes + rendering/canvas).
- **Week 4:** Phases 8–9 (persistence + tests + first change).

If you can spend only ~5–7 hours/week, stretch each week into two.

Before Week 1, complete **Stage A (Pre-install only)** from the reorganized execution order above.

---

## Tracing checklist for every feature (draw, trim, constraints, planes, canvas)

Use this exact checklist repeatedly:

1. **UI entry**: Which command/menu/tool starts it?
2. **Event path**: Which mouse/keyboard handlers run?
3. **Model edit**: Which entities/constraints/params are created or changed?
4. **Solver**: Which equations are added/updated and when solve is triggered?
5. **Render**: Which redraw path reflects the change?
6. **Persistence**: How is it saved/loaded?
7. **Tests**: What existing test covers it? If none, what minimal test/repro is possible?

---


## Addendum — Your context (Ubuntu 24.04 in WSL + future CNC-CAM integration)

Given your goal (potentially porting drawing/constraints/geometry-editing into **cnc-cam**), prioritize the deep-dive in this order:

1. **Constraint engine internals first** (what is mathematical core vs UI glue).
2. **Sketch entity model and IDs** (portable data model boundary).
3. **Geometry edit operations** (trim/split/extend style behaviors and side effects).
4. **Selection/picking contract** (needed for interactive editing parity).
5. **Rendering/canvas last** (often easiest to reimplement around an existing app framework).

### Portability objective

Treat SolveSpace as a reference architecture and extract a **portability map**:

- **Portable core candidates**
  - geometric primitives/intersections
  - constraint equation generation + solving
  - topological edit semantics (trim/split lifecycle)
- **Likely rewrite/adaptation zones**
  - UI command system and tool state machines tied to SolveSpace UX
  - rendering backend integration
  - app-level document/history/undo integration differences

### Phase 10 — CNC-CAM migration feasibility track

### Goals
- Decide whether to reuse, wrap, or reimplement each subsystem for cnc-cam.

### Steps
1. Define **target architecture** in cnc-cam:
   - language/runtime/toolkit constraints
   - existing scene/model structures
   - undo/redo model and command bus
2. Build a **feature parity matrix** (SolveSpace vs cnc-cam):
   - draw tools
   - constraints
   - trim/split/edit ops
   - plane/workplane semantics
3. Build an **API seam proposal** for imported functionality:
   - entity CRUD
   - constraint CRUD
   - solve trigger + diagnostics
   - selection query interface
4. Perform a **spike implementation** (small vertical slice):
   - create point/line
   - add coincident + horizontal constraints
   - solve + update view
5. Evaluate maintainability risks:
   - license compatibility
   - divergence cost from upstream SolveSpace
   - test strategy for numerical regressions

### Deliverables
- Go/No-Go recommendation for direct port vs clean-room reimplementation.
- Minimal technical spec for first production milestone in cnc-cam.

### Recommended immediate next session (for you)

Given Ubuntu 24.04 on WSL, next session should be:

1. Build SolveSpace in Debug on your machine.
2. Trace one end-to-end flow: **Line tool + Horizontal constraint + Trim**.
3. Write a 1-page portability note for cnc-cam with three columns:
   - Reuse as-is
   - Adapt with wrapper
   - Reimplement

That note will determine whether we continue with source-level extraction or interface-level emulation.

## What I’ll need from you next

Once you’re ready, send:

1. Your current WSL distro/version and whether WSLg is working.
2. Whether you want to run SolveSpace UI in WSL or do a native Windows build/debug.
3. Any specific subsystem you want first (trim, constraints, canvas/rendering, or planes).
4. Your editor/debugger preference (VS Code, CLion, gdb/lldb).

With that, I can produce a **repo-specific execution plan** with exact commands, key files, and first breakpoints to set.

---

## Math-First Deep Dive (requested focus)

Given your TypeScript-only `cnc-cam` target, this section focuses specifically on the computational geometry and constraint math you asked about.

### A. Geometry entities and topological tracking

### Goals
- Understand how lines/arcs/circles/fillets/chamfers are represented, referenced, and updated across edits.

### What to extract
1. **Canonical entity schema** for each primitive:
   - line: two points or point+direction+extent
   - arc: center, radius, start/end angles (or endpoints + orientation)
   - circle: center + radius
   - fillet/chamfer: derived edge transition entity with parent references
2. **Identity and references**:
   - stable IDs for entities
   - references from constraints to entities/points
   - dependency graph (derived entities know their sources)
3. **Mutation safety rules**:
   - split, merge, trim, extend should preserve/rewrite IDs predictably
   - downstream constraints either remap or invalidate with diagnostics

### Deliverable
- A TypeScript interface draft for portable entity/core constraint references.

### B. Constraint calculation pipeline (math)

### Goals
- Reconstruct the exact “constraint -> equation -> solve -> update” process.

### What to extract
1. **Variable selection**:
   - unknowns (point coordinates, radii, angles, plane parameters)
2. **Equation construction** examples:
   - distance(A,B)=d
   - horizontal/vertical
   - perpendicular/parallel
   - tangency (line-circle, circle-circle, arc-line)
   - coincident point-on-entity
3. **Solver mechanics**:
   - residual vector/Jacobian construction
   - iteration strategy, convergence thresholds, fallback behavior
4. **Numerical robustness**:
   - epsilon handling
   - singular/near-singular cases
   - over- and under-constrained diagnostics

### Deliverable
- A constraint equation catalog (with symbolic form) mapped to implementation entry points.

### C. Offsets (core CAM/CAD need)

### Goals
- Understand 2D offset construction and failure modes.

### What to extract
1. **Primitive offsets**:
   - line offset by signed distance via normal translation
   - arc/circle offset by radius +/- d
2. **Corner joining strategy**:
   - miter, round, bevel joins
   - join decision by angle and offset sign
3. **Self-intersection handling**:
   - detect loops, remove invalid branches
4. **Direction convention**:
   - CW/CCW path orientation determines left/right offset semantics

### Deliverable
- Offset algorithm note with pseudocode suitable for TypeScript porting.

### D. Trim, extend, chamfer, fillet algorithms

### Goals
- Build exact edit-operation math and side-effect rules.

### What to extract
1. **Trim**:
   - pick target sub-curve nearest click
   - compute intersections with eligible cutters
   - choose kept interval and rebuild entity segment
2. **Extend**:
   - project toward nearest valid intersection boundary
   - enforce domain limits for finite entities
3. **Chamfer**:
   - compute corner from two intersecting supports and distances
   - trim supports to chamfer endpoints
4. **Fillet (radius)**:
   - find tangent circle to two supports at radius r
   - solve for tangent points
   - trim originals and insert arc

### Deliverable
- Operation-by-operation math sheet + expected constraint remapping behavior.

### E. TypeScript porting blueprint for cnc-cam

### Goals
- Avoid hard-coupling TS app code to SolveSpace internals.

### Proposed modules in cnc-cam
1. `geom-core`:
   - primitives, intersections, projection, orientation tests, tolerances
2. `constraint-core`:
   - variables, equations, solve loop, diagnostics
3. `sketch-topology`:
   - entity graph, IDs, split/merge/replace helpers
4. `edit-ops`:
   - trim/extend/chamfer/fillet/offset as pure operations
5. `ui-adapter`:
   - hit-testing and interactive previews bound to app canvas

### Porting rule
- Keep ops pure and deterministic (`state_in + command -> state_out + diagnostics`) to simplify undo/redo and regression tests.

### Deliverable
- Initial TS package boundaries and a first milestone: line/arc/circle + coincident/horizontal/vertical/distance + trim + offset.

### F. Concrete study sequence for your next 3 sessions

1. **Session 1 (constraints):**
   - trace 4 constraints end-to-end (coincident, distance, horizontal, tangent)
   - write symbolic equations and note unknown vectors
2. **Session 2 (edit ops):**
   - trace trim + extend + fillet with edge cases
   - capture how entity IDs/constraints are rewritten
3. **Session 3 (offsets):**
   - map line/arc/circle offsets and corner joins
   - define TS data contracts and test vectors

After session 3, we should have enough to draft your first real `cnc-cam` geometry kernel spike.

---

## FAQ — Do you need SolveSpace installed to figure out the math?

Short answer: **No, not strictly**. You can understand most of the math (constraints, offsets, trim/fillet/chamfer geometry) by reading source code and running unit-level experiments.

### What you can do without installing/running the app UI

1. Read implementation and derive equations/algorithms directly.
2. Build small standalone checks (or TypeScript prototypes) for:
   - intersection math
   - tangency/fillet constructions
   - offset corner-join rules
   - constraint residual/Jacobian verification
3. Validate with deterministic numeric test vectors.

### What still benefits from running SolveSpace

1. Confirming interactive intent when click/selection behavior matters.
2. Observing edge-case UX behavior (which segment gets trimmed, how ambiguity is resolved).
3. Verifying diagnostics shown for under/over-constrained states.

### Recommended approach for your situation

Since `cnc-cam` is TypeScript and still maturing:

- Start with **source-level math extraction first** (no UI install required).
- Use SolveSpace runtime later only for **behavior parity checks** on ambiguous edit operations.
- Build a TS test corpus early (known-good geometry cases) so your port can evolve independently.

### Pre-install task list (high-value work you can do now)

If you want to delay SolveSpace installation, do these first:

1. **Read-and-map tasks**
   - Build a file/function map for entities, constraints, trim, offsets, and serialization.
   - Produce a call-flow map for: add line -> add constraint -> solve -> redraw.

2. **Math extraction tasks**
   - Write symbolic equations for your target constraints (coincident, distance, horizontal, vertical, tangent, parallel, perpendicular).
   - Document variable vectors, residual functions, Jacobian terms, and convergence criteria.

3. **Geometry algorithm tasks**
   - Define intersection routines (line-line, line-arc, arc-arc, circle-line, circle-circle).
   - Specify trim/extend interval-selection rules and ambiguity tie-breakers.
   - Specify fillet/chamfer construction formulas and side-selection logic.
   - Specify offset behavior: orientation conventions, join style rules, self-intersection pruning.

4. **TypeScript design tasks for cnc-cam**
   - Draft interfaces for entities, constraints, and solver diagnostics.
   - Draft pure-operation signatures (`trim`, `extend`, `fillet`, `chamfer`, `offset`).
   - Draft tolerance policy (`EPS`, angular tolerance, merge tolerance) and units policy.

5. **Test-first tasks**
   - Create a geometry golden-case corpus (JSON fixtures) with expected outputs.
   - Add deterministic numerical checks for intersections/offsets/fillets.
   - Add regression fixtures for pathological edge cases (near-parallel, near-tangent, tiny radii, overlapping segments).

6. **Portability/risk tasks**
   - Record what is likely portable core math vs SolveSpace-specific UI behavior.
   - Decide early if solver behavior must match exactly or only feature-equivalent outputs are acceptable.

### Exit criteria before installation

You are ready to install/run SolveSpace only when these are complete:

- Entity + constraint TS interfaces drafted.
- First 15–25 geometry/constraint fixtures passing in your standalone TS harness.
- A written ambiguity policy for trim/extend/fillet decisions.

At that point, running SolveSpace becomes a **parity-validation step**, not a blocker for progress.
