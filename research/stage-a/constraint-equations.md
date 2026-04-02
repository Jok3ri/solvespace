# Constraint Equations (v1)

## Unknown vector
Unknown vector `u` contains point coordinates `(x_i, y_i)` and optional scalar params (e.g., radii).

## Residual conventions
- Residual vector: `F(u)`
- Solve target: `F(u)=0`

## Priority constraints (Day 1)

### Coincident(Pa, Pb)
- `f1 = x_a - x_b = 0`
- `f2 = y_a - y_b = 0`
- Jacobian rows:
  - `df1/dx_a=1, df1/dx_b=-1`
  - `df2/dy_a=1, df2/dy_b=-1`

### Horizontal(Pa, Pb)
- `f = y_a - y_b = 0`
- Jacobian row: `df/dy_a=1, df/dy_b=-1`

### Vertical(Pa, Pb)
- `f = x_a - x_b = 0`
- Jacobian row: `df/dx_a=1, df/dx_b=-1`

### Distance(Pa, Pb, d)
- `f = (x_a-x_b)^2 + (y_a-y_b)^2 - d^2 = 0`
- Jacobian row:
  - `df/dx_a = 2(x_a-x_b)`
  - `df/dx_b = -2(x_a-x_b)`
  - `df/dy_a = 2(y_a-y_b)`
  - `df/dy_b = -2(y_a-y_b)`

## Open items
- Under/over-constrained detection strategy.
- Damping/line-search behavior for robustness near singularities.
