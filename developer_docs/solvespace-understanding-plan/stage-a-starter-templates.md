# Stage A Starter Templates (copy/paste)

Use these templates to bootstrap Stage A artifacts quickly.

---

## 1) `research/stage-a/entity-schema.md`

```md
# Entity Schema (v1)

## Scope
- Version: v1
- Coordinate system: [define]
- Units: [mm/in]
- Orientation convention: [CW/CCW]

## Shared identity model
- `EntityId`: [string/number/uuid]
- `ConstraintId`: [string/number/uuid]
- Stability rule for IDs across edits: [define]

## Core entities

### Point
- Fields:
  - `id`
  - `x`
  - `y`
  - `meta` (optional)

### Line
- Representation: [endpoint-endpoint | point+direction+extent]
- Fields:
  - `id`
  - `p1: EntityId`
  - `p2: EntityId`
  - `construction?: boolean`

### Arc
- Representation: center+radius+angles OR endpoints+bulge
- Fields:
  - `id`
  - `center: EntityId`
  - `radius`
  - `startAngle`
  - `endAngle`
  - `ccw: boolean`

### Circle
- Fields:
  - `id`
  - `center: EntityId`
  - `radius`

## Derived entities

### Fillet
- Parent refs:
  - `sourceA: EntityId`
  - `sourceB: EntityId`
- Generated refs:
  - `arcId: EntityId`

### Chamfer
- Parent refs:
  - `sourceA: EntityId`
  - `sourceB: EntityId`
- Generated refs:
  - `lineId: EntityId`

## Edit invariants
- Split/trim/extend ID rewrite policy: [define]
- Constraint remap policy on topology change: [define]
```

---

## 2) `research/stage-a/constraint-equations.md`

```md
# Constraint Equations (v1)

## Unknown vector
Let unknowns be:
- Point coordinates: `(x_i, y_i)`
- Optional scalar params: `r_i`, `theta_i`

## Residual conventions
- Residual vector `F(u)`
- Goal: `F(u) = 0`
- Tolerance: `||F(u)|| <= eps_residual`

## Constraints

### Coincident(Pa, Pb)
- Equation:
  - `x_a - x_b = 0`
  - `y_a - y_b = 0`

### Horizontal(Pa, Pb)
- Equation:
  - `y_a - y_b = 0`

### Vertical(Pa, Pb)
- Equation:
  - `x_a - x_b = 0`

### Distance(Pa, Pb, d)
- Equation:
  - `(x_a - x_b)^2 + (y_a - y_b)^2 - d^2 = 0`

### Tangent(Line L, Circle C)
- Equation:
  - `distance(center(C), line(L)) - radius(C) = 0`

## Jacobian notes
- Document partial derivatives per constraint row.
- Record singularity risks (parallel/overlapping/near-zero lengths).

## Diagnostics
- Under-constrained detection: [define]
- Over-constrained detection: [define]
- Failure messaging: [define]
```

---

## 3) `research/stage-a/tolerance-policy.md`

```md
# Tolerance Policy (v1)

## Global defaults
- `EPS_POS = [e.g., 1e-7 in model units]`
- `EPS_ANG = [e.g., 1e-9 rad]`
- `EPS_REL = [e.g., 1e-9]`

## Rule hierarchy
1. Operation-specific EPS overrides global only when justified.
2. Comparisons should use absolute + relative checks where needed.
3. Tie-breakers must be deterministic.

## Operation policies
- Intersection threshold: [define]
- Trim ambiguity policy: [nearest click | shortest segment | stable-id]
- Fillet side selection policy: [define]
- Offset self-intersection pruning threshold: [define]

## Browser consistency
- Required browser set: Chrome + Edge + Firefox
- Numeric determinism strategy: [define normalization/rounding]

## Change control
- Any EPS change requires:
  1. fixture impact report
  2. before/after pass-rate summary
```

---

## 4) `research/stage-a/fixtures/README.md`

```md
# Stage A Fixtures

## Layout
- `core/` : must-pass deterministic baseline cases
- `edge/` : difficult/near-degenerate cases

## Fixture format (example)
```json
{
  "name": "distance_basic_01",
  "type": "constraint",
  "inputs": {
    "entities": [],
    "constraints": []
  },
  "expected": {
    "status": "ok",
    "checks": []
  }
}
```

## Pass-rate gates
- Core fixtures: 100% pass required
- Edge fixtures: >=95% pass required

## Initial target
- First batch: 10 fixtures
  - 6 core
  - 4 edge

## Required edge classes
- near-parallel
- near-tangent
- tiny radius
- almost-coincident points

## Reporting
- Track:
  - total pass/fail
  - core pass-rate
  - edge pass-rate
  - new regressions introduced
```
