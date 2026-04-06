#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

node "${SCRIPT_DIR}/fixture-runner.js"
node "${SCRIPT_DIR}/compare-pass-rate.js"
node "${SCRIPT_DIR}/compare-determinism.js"

echo "Stage A CI-style check passed."

node "${SCRIPT_DIR}/validate-trace-priority.js"
node "${SCRIPT_DIR}/generate-trace-session.js"
node "${SCRIPT_DIR}/verify-trace-session.js"
