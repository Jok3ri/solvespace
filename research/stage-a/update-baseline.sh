#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp "${SCRIPT_DIR}/pass-rate-report.json" "${SCRIPT_DIR}/pass-rate-baseline.json"
cp "${SCRIPT_DIR}/pass-rate-detail.json" "${SCRIPT_DIR}/pass-rate-baseline-detail.json"

echo "Updated Stage A baselines from current reports."
