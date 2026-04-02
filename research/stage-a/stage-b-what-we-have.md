# What do we have in Stage B?

Stage B is the **install + bring-up gate** after Stage A/D readiness.

## Stage B goals

1. Install/build SolveSpace in your environment.
2. Verify runtime bring-up (UI launches, sketch save/load works).
3. Confirm the environment is ready for Stage C runtime parity tracing.

## Entry criteria from Stage A

- Stage A artifacts and gates are complete.
- Baselines are stable.
- Stage D feasibility direction is known (or at least scoped).

## Stage B checklist

- Toolchain ready in WSL:
  - `cmake`
  - `ninja` or `make`
  - `gcc`/`clang`
  - `gdb`
- Configure out-of-tree `build/`
- Build SolveSpace in Debug mode
- Launch app UI
- Validate minimal sketch create/save/load roundtrip

## Stage B outputs

- Repeatable build and run commands
- Bring-up notes (runtime path/log locations)
- “Ready for Stage C” confirmation
