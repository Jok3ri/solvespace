# Stage A Kickoff Questions (ask before starting)

Use this checklist before beginning Stage A. If most answers are clear, you can start immediately.

## Priority 5 questions (answer these first)

1. What are the **mandatory v1 entities** in cnc-cam? (e.g., point/line/arc/circle/spline)
2. What are the **mandatory v1 edit operations**? (trim, extend, fillet, chamfer, offset, etc.)
3. What are the **mandatory v1 constraints**? (coincident, distance, horizontal/vertical, tangent, etc.)
4. What is your **browser + performance target**? (supported browsers and interaction latency budget)
5. What is your **go-forward pass-rate gate** for Stage A fixtures? (e.g., >=95%)

## 1) Product and scope

1. For v1 of `cnc-cam`, which entities are mandatory?
   - point, line, arc, circle, polyline, spline?
2. Which edit ops are mandatory in v1?
   - trim, extend, fillet, chamfer, offset, mirror?
3. Which constraints are mandatory in v1?
   - coincident, horizontal/vertical, distance, angle, tangent, parallel, perpendicular?
4. Is 2D sketching enough for v1, or do you need 3D/workplanes immediately?

## 2) Browser/runtime constraints

5. What is your minimum supported browser set (Chrome/Edge/Firefox/Safari)?
6. Is Web Worker usage allowed by your app architecture?
7. Is WebAssembly acceptable if TypeScript-only performance is insufficient?
8. Are there hard interaction budgets (e.g., drag update under 16ms)?

## 3) Numerical behavior

9. Do you require deterministic results across browsers?
10. What numeric tolerance policy do you prefer (global EPS vs operation-specific EPS)?
11. How should ambiguous trim/fillet choices be resolved (nearest click, shortest path, stable ID preference)?
12. What failure behavior do you want for unsatisfied constraints (soft warning vs blocked action)?

## 4) Data model and integration

13. What is the current `cnc-cam` document model and undo/redo strategy?
14. Do you want immutable operation results (`state_in -> state_out`) everywhere?
15. How are IDs generated and persisted today?
16. Do you need collaboration/multiplayer considerations for geometry edits?

## 5) Verification strategy

17. Where will fixture corpus live (repo path)?
18. Should fixture runner execute in browser, Node, or both?
19. What is your initial pass-rate gate to proceed (e.g., >=95%)?
20. Who signs off Stage A completion and Stage D go/no-go?

## Start decision

You can start Stage A now if:

- Mandatory v1 entity/ops/constraint scope is defined.
- Browser/runtime constraints are clear enough (worker + perf targets).
- Tolerance and ambiguity policies are at least draft-level.
- Fixture ownership and pass-rate gate are assigned.

If any of the above are missing, spend one short kickoff session resolving them first.


## Clarifications for Q4 and Q5

### Q4: How to define performance targets

Use simple user-visible budgets first:

- **Drag/interactive update budget:** target <= 16 ms per update for very smooth feel (60 FPS).
- **Normal edit recompute budget:** target <= 50 ms (generally feels instant).
- **Heavy recompute budget:** target <= 100–150 ms (acceptable for complex operations).
- **Worst-case guardrail:** avoid sustained operations > 300 ms without progress/feedback.

For browser coverage, test on your top 3 browsers and at least one mid-range machine.

### Q5: What pass-rate gate means

Pass-rate gate = the minimum percentage of Stage A fixtures that must pass before moving forward.

Example:
- If you have 100 fixtures and gate is **>=95%**, then at least 95 must pass.
- Recommended starting gate:
  - **Core fixtures:** 100% pass required.
  - **Extended/edge fixtures:** >=95% pass to proceed, with failures tracked in risk log.

This gate is used as a quality threshold before Stage D/B/C decisions.

## Confirmed defaults (current decision)

The following defaults are accepted for starting Stage A:

- Browsers: **Chrome + Edge + Firefox**.
- Performance targets:
  - drag/interactive <= 16 ms
  - normal recompute <= 50 ms
  - heavy recompute <= 150 ms
- Fixture pass-rate gate:
  - core fixtures: **100%**
  - edge fixtures: **>=95%**

With these defaults confirmed, Stage A can begin immediately.
