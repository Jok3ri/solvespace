#!/usr/bin/env bash
set -euo pipefail

node research/stage-a/fixture-runner.js
node research/stage-a/compare-pass-rate.js

echo "Stage A CI-style check passed."
