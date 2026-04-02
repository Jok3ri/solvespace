# Ambiguity Policy Examples (Stage A)

## Trim tie-break examples

1. **Nearest click wins**
   - If multiple trim candidates exist, choose the segment nearest pointer location.
2. **If tie remains: smallest parametric distance**
   - Use curve parameter distance from click projection.
3. **If still tie: stable lowest entity ID**
   - Deterministic fallback for reproducibility.

## Fillet side-selection examples

1. Use pointer-side hint when available.
2. If unavailable, choose minimal-turn interior solution.
3. If dual valid interiors remain, choose deterministic lowest-ID edge order.

## Why this matters

These rules prevent nondeterministic edits and make fixture results stable across runs and environments.
