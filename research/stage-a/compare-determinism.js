#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const currentPath = path.join(ROOT, 'pass-rate-determinism.json');
const baselinePath = path.join(ROOT, 'pass-rate-determinism-baseline.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

if (!fs.existsSync(currentPath)) {
  console.error('Missing current determinism report: pass-rate-determinism.json');
  process.exit(2);
}
if (!fs.existsSync(baselinePath)) {
  console.error('Missing determinism baseline: pass-rate-determinism-baseline.json');
  console.error('Run ./research/stage-a/update-baseline.sh explicitly to (re)create baselines.');
  process.exit(2);
}

const current = readJson(currentPath);
const baseline = readJson(baselinePath);

function checkKey(row = {}) {
  const bucket = row.bucket || 'unknown';
  const fixture = row.fixture || 'unknown_fixture';
  const checkIndex = Number.isInteger(row.checkIndex) ? row.checkIndex : 0;
  return `${bucket}::${fixture}::check_${checkIndex}`;
}

function mapByFixture(list = []) {
  return Object.fromEntries(list.map(x => [checkKey(x), x]));
}

const cur = mapByFixture(current.checks || []);
const base = mapByFixture(baseline.checks || []);
const names = [...new Set([...Object.keys(cur), ...Object.keys(base)])].sort();

const regressions = [];
const missingInCurrent = [];
const newInCurrent = [];
const newFailingInCurrent = [];
for (const n of names) {
  const c = cur[n];
  const b = base[n];
  if (!c && b) {
    missingInCurrent.push(n);
    continue;
  }
  if (c && !b) {
    newInCurrent.push(n);
    if (!c.passed) newFailingInCurrent.push(n);
    continue;
  }
  if (b.passed && !c.passed) regressions.push(n);
}

console.log('Determinism regression report');
console.log(`Baseline: ${baseline.passed}/${baseline.total} passed`);
console.log(`Current: ${current.passed}/${current.total} passed`);
if (newInCurrent.length) {
  console.log('New deterministic fixtures in current run:');
  newInCurrent.forEach(n => console.log(`  ${n}`));
}
if (newFailingInCurrent.length) {
  console.log('New failing deterministic checks in current run:');
  newFailingInCurrent.forEach(n => console.log(`  ${n}`));
}
if (missingInCurrent.length) {
  console.log('Missing deterministic fixtures from current run:');
  missingInCurrent.forEach(n => console.log(`  ${n}`));
}
if (regressions.length) {
  console.log('Determinism regressions (pass -> fail):');
  regressions.forEach(n => console.log(`  ${n}`));
}

if (regressions.length || missingInCurrent.length || newFailingInCurrent.length || current.passed < baseline.passed) {
  console.error('Determinism regression detected vs baseline.');
  process.exit(1);
}

console.log('No determinism regression detected vs baseline.');
process.exit(0);
