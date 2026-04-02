# Tolerance Policy (v1)

## Defaults
- `EPS_POS = 1e-7` (model units, mm)
- `EPS_ANG = 1e-9` (radians)
- `EPS_REL = 1e-9`

## Determinism rules
1. Use the same EPS constants across all core operations unless explicitly overridden.
2. Any operation-specific EPS override must be documented with fixture evidence.
3. Use deterministic tie-breakers when multiple valid results exist.

## Ambiguity policies (Day 1 draft)
- Trim tie-break: nearest click, then smallest parameter distance, then lowest stable entity ID.
- Fillet side selection: choose side closest to pointer hint; fallback to minimal-turn solution.

## Change control
- EPS change requires fixture pass-rate diff report.
