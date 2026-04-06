#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

node "${SCRIPT_DIR}/validate-trace-priority.js"
node "${SCRIPT_DIR}/generate-trace-session.js"
node "${SCRIPT_DIR}/verify-trace-session.js"
node "${SCRIPT_DIR}/trace-session-progress.js"

echo "Stage B/C trace-session preparation complete."
