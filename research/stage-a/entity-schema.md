# Entity Schema (v1)

## Scope
- Version: v1
- Coordinate system: 2D Cartesian (X right, Y up)
- Units: millimeters
- Orientation convention: CCW positive

## Shared identity model
- `EntityId`: string
- `ConstraintId`: string
- IDs remain stable unless topology-changing ops (trim/split/extend) replace entities.

## Core entities
- Point: `{ id, x, y }`
- Line: `{ id, p1, p2, construction? }`
- Arc: `{ id, center, radius, startAngle, endAngle, ccw }`
- Circle: `{ id, center, radius }`

## Derived entities
- Fillet: `{ sourceA, sourceB, arcId }`
- Chamfer: `{ sourceA, sourceB, lineId }`

## Edit invariants
- Trim/split generate new entity IDs for resulting segments.
- Constraints referencing replaced entities must remap to successor entities or be marked invalid with diagnostic.
