# Stage C — Runtime parity validation + deep tracing

Goal: validate behavior against your pre-install TS math model and finish full system understanding.

## C1. Architecture + data flow tracing

- Map one-click flow end to end:
  - input event
  - command/tool state
  - model mutation
  - solver trigger
  - redraw

## C2. Constraint engine tracing

For representative constraints (distance, coincident, horizontal, vertical, angle, tangent, parallel, perpendicular):

- Trace UI creation path.
- Trace internal constraint representation.
- Trace equation generation and solver update.
- Record over/under-constrained diagnostics behavior.

## C3. Geometry editing tracing

- Draw pipeline: activation -> preview -> commit -> auto-constraints.
- Trim pipeline: hit-testing -> interval selection -> split/rebuild -> constraint remap.
- Extend/chamfer/fillet behaviors and edge cases.

## C4. Planes/workplanes + canvas/rendering

- Trace 3D<->2D mapping and plane context behavior.
- Trace viewport/camera/projection and draw ordering.
- Trace picking/hit tolerance and redraw invalidation points.

## C5. Persistence and verification

- Map in-memory IDs to file representation.
- Verify load-time reconstruction order.
- Confirm parity using TS fixtures for selected scenarios.

## Stage C deliverables

- Behavior parity notes (SolveSpace runtime vs TS expectations).
- Mismatch list with prioritized fixes.
- Recommendation: reuse/adapt/reimplement boundaries for cnc-cam.
