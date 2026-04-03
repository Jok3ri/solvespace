# Stage B — Install/run SolveSpace gate

Goal: install/run SolveSpace only after Stage A has reduced ambiguity.

## Entry criteria (must be true)

- Entity + constraint TypeScript interfaces drafted.
- 15–25 geometry/constraint fixtures passing in standalone TS harness.
- Written ambiguity policy for trim/extend/fillet decisions.

## B1. Environment setup (Windows 11 + WSL)

- Confirm WSL toolchain:
  - `cmake`
  - `ninja` or `make`
  - `gcc` or `clang`
  - `gdb`
- Configure out-of-tree `build/` directory.
- Build in Debug mode.

## B2. Runtime bring-up

- Launch SolveSpace UI via WSLg (or chosen runtime path).
- Open/create a minimal sketch.
- Verify save/load round trip.

## Stage B deliverables

- Repeatable build/run command sequence.
- Bring-up notes (runtime path, logs/debug output location).
- Confirmation that runtime is ready for Stage C parity checks.
