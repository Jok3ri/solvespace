#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const manifestPath = path.join(root, 'stage-bc-trace-fixture-priority.json');
const fixturesRoot = path.join(root, 'fixtures');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function fixturePath(bucket, name) {
  return path.join(fixturesRoot, bucket, `${name}.json`);
}

function main() {
  const manifest = readJson(manifestPath);
  const tiers = Array.isArray(manifest.tiers) ? manifest.tiers : [];
  let checked = 0;
  const missing = [];

  for (const tier of tiers) {
    const fixtures = Array.isArray(tier.fixtures) ? tier.fixtures : [];
    for (const fx of fixtures) {
      checked += 1;
      const bucket = fx.bucket;
      const name = fx.name;
      const p = fixturePath(bucket, name);
      if (!fs.existsSync(p)) {
        missing.push({ tier: tier.name || 'unknown', bucket, name, path: p });
      }
    }
  }

  console.log(`Trace-priority fixture entries checked: ${checked}`);
  if (missing.length === 0) {
    console.log('All trace-priority fixtures resolve to existing fixture JSON files.');
    process.exit(0);
  }

  console.log('Missing fixture references detected:');
  for (const m of missing) {
    console.log(`  [${m.tier}] ${m.bucket}/${m.name} -> ${m.path}`);
  }
  process.exit(1);
}

main();
