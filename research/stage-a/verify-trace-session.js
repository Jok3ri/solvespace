#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const manifestPath = path.join(root, 'stage-bc-trace-fixture-priority.json');
const seedPath = path.join(root, 'stage-bc-trace-session-seed.md');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function expectedScenarioCount(manifest) {
  const tiers = Array.isArray(manifest.tiers) ? manifest.tiers : [];
  return tiers.reduce((sum, tier) => sum + ((tier.fixtures || []).length || 0), 0);
}

function actualScenarioCount(seedMarkdown) {
  const lines = seedMarkdown.split(/\r?\n/);
  return lines.filter(line =>
    line.startsWith('| ') &&
    !line.startsWith('|---') &&
    !line.includes('Scenario ID | Fixture | Capability ID')
  ).length;
}

function main() {
  if (!fs.existsSync(seedPath)) {
    console.error(`Missing seed file: ${seedPath}`);
    process.exit(1);
  }

  const manifest = readJson(manifestPath);
  const expected = expectedScenarioCount(manifest);
  const seedMarkdown = fs.readFileSync(seedPath, 'utf8');
  const actual = actualScenarioCount(seedMarkdown);

  console.log(`Trace-session rows: expected=${expected}, actual=${actual}`);
  if (expected !== actual) {
    console.error('Mismatch detected: regenerate seed with node research/stage-a/generate-trace-session.js');
    process.exit(1);
  }

  console.log('Trace-session seed row count matches fixture-priority manifest.');
}

main();
