#!/usr/bin/env bash
set -euo pipefail

cp research/stage-a/pass-rate-report.json research/stage-a/pass-rate-baseline.json
cp research/stage-a/pass-rate-detail.json research/stage-a/pass-rate-baseline-detail.json

echo "Updated Stage A baselines from current reports."
