#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const manifestPath = path.join(root, 'stage-bc-trace-fixture-priority.json');
const fixturesRoot = path.join(root, 'fixtures');
const outputPath = path.join(root, 'stage-bc-trace-session-seed.md');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function fixtureFile(bucket, name) {
  return path.join(fixturesRoot, bucket, `${name}.json`);
}

function expectedSummary(fixtureJson) {
  const checks = (((fixtureJson || {}).expected || {}).checks) || [];
  const kinds = [...new Set(checks.map(c => c.kind).filter(Boolean))];
  if (kinds.length === 0) return 'no checks listed';
  return kinds.join(', ');
}

function main() {
  const manifest = readJson(manifestPath);
  const tiers = Array.isArray(manifest.tiers) ? manifest.tiers : [];

  const lines = [];
  lines.push('# Stage B/C Runtime Trace Session Seed');
  lines.push('');
  lines.push(`Generated from: \`research/stage-a/stage-bc-trace-fixture-priority.json\``);
  lines.push('');

  for (const tier of tiers) {
    lines.push(`## Tier: ${tier.name}`);
    lines.push('');
    if (tier.description) lines.push(`_${tier.description}_`);
    lines.push('');
    lines.push('| Scenario ID | Fixture | Capability ID | Stage A Expected (check kinds) | Runtime Observed | Match? | Delta Type | Delta Details | Action |');
    lines.push('|---|---|---|---|---|---|---|---|---|');

    const fixtures = Array.isArray(tier.fixtures) ? tier.fixtures : [];
    for (const fx of fixtures) {
      const p = fixtureFile(fx.bucket, fx.name);
      if (!fs.existsSync(p)) {
        throw new Error(`Missing fixture: ${fx.bucket}/${fx.name}`);
      }
      const fixtureJson = readJson(p);
      const capabilityId = `${fx.family}.${fx.name}`;
      const expected = expectedSummary(fixtureJson);
      lines.push(`| ${fx.name} | ${fx.bucket}/${fx.name}.json | ${capabilityId} | ${expected} |  |  |  |  |  |`);
    }

    lines.push('');
  }

  fs.writeFileSync(outputPath, lines.join('\n'));
  console.log(`Wrote ${outputPath}`);
}

main();
