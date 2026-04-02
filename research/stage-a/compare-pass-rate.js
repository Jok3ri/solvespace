#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const currentPath = path.join(ROOT, 'pass-rate-report.json');
const baselinePath = path.join(ROOT, 'pass-rate-baseline.json');
const currentDetailPath = path.join(ROOT, 'pass-rate-detail.json');
const baselineDetailPath = path.join(ROOT, 'pass-rate-baseline-detail.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

if (!fs.existsSync(currentPath)) {
  console.error('Missing current report: pass-rate-report.json');
  process.exit(2);
}
if (!fs.existsSync(currentDetailPath)) {
  console.error('Missing current detail report: pass-rate-detail.json');
  process.exit(2);
}

const current = readJson(currentPath);
const currentDetail = readJson(currentDetailPath);

if (!fs.existsSync(baselinePath) || !fs.existsSync(baselineDetailPath)) {
  console.error('Missing baseline artifacts. Expected pass-rate-baseline.json and pass-rate-baseline-detail.json.');
  console.error('Run ./research/stage-a/update-baseline.sh explicitly to (re)create baselines.');
  process.exit(2);
}

const baseline = readJson(baselinePath);
const baselineDetail = readJson(baselineDetailPath);

function delta(cur, base) {
  return {
    passed: cur.passed - base.passed,
    total: cur.total - base.total,
    rate: cur.rate - base.rate,
  };
}

function mapByName(list = []) {
  return Object.fromEntries(list.map(x => [x.name, x]));
}

function fixtureRegressions(curList, baseList) {
  const cur = mapByName(curList);
  const base = mapByName(baseList);
  const names = [...new Set([...Object.keys(cur), ...Object.keys(base)])].sort();
  const flippedToFail = [];
  const flippedToPass = [];
  const missingInCurrent = [];
  const newInCurrent = [];
  for (const n of names) {
    const c = cur[n];
    const b = base[n];
    if (!c && b) {
      missingInCurrent.push(n);
      continue;
    }
    if (c && !b) {
      newInCurrent.push(n);
      continue;
    }
    if (b.passed && !c.passed) flippedToFail.push(n);
    if (!b.passed && c.passed) flippedToPass.push(n);
  }
  return { flippedToFail, flippedToPass, missingInCurrent, newInCurrent };
}

const dCore = delta(current.core, baseline.core);
const dEdge = delta(current.edge, baseline.edge);
const coreFx = fixtureRegressions(currentDetail.core, baselineDetail.core);
const edgeFx = fixtureRegressions(currentDetail.edge, baselineDetail.edge);

console.log('Pass-rate regression report');
console.log(`Core: baseline ${baseline.core.passed}/${baseline.core.total} (${(baseline.core.rate*100).toFixed(1)}%) -> current ${current.core.passed}/${current.core.total} (${(current.core.rate*100).toFixed(1)}%)`);
console.log(`      delta passed=${dCore.passed}, total=${dCore.total}, rate=${(dCore.rate*100).toFixed(1)} pp`);
console.log(`Edge: baseline ${baseline.edge.passed}/${baseline.edge.total} (${(baseline.edge.rate*100).toFixed(1)}%) -> current ${current.edge.passed}/${current.edge.total} (${(current.edge.rate*100).toFixed(1)}%)`);
console.log(`      delta passed=${dEdge.passed}, total=${dEdge.total}, rate=${(dEdge.rate*100).toFixed(1)} pp`);

if (coreFx.flippedToPass.length || edgeFx.flippedToPass.length) {
  console.log('Newly passing fixtures:');
  coreFx.flippedToPass.forEach(n => console.log(`  [CORE] ${n}`));
  edgeFx.flippedToPass.forEach(n => console.log(`  [EDGE] ${n}`));
}
if (coreFx.flippedToFail.length || edgeFx.flippedToFail.length) {
  console.log('Regressed fixtures (pass -> fail):');
  coreFx.flippedToFail.forEach(n => console.log(`  [CORE] ${n}`));
  edgeFx.flippedToFail.forEach(n => console.log(`  [EDGE] ${n}`));
}
if (coreFx.missingInCurrent.length || edgeFx.missingInCurrent.length) {
  console.log('Missing fixtures from current run (present in baseline):');
  coreFx.missingInCurrent.forEach(n => console.log(`  [CORE] ${n}`));
  edgeFx.missingInCurrent.forEach(n => console.log(`  [EDGE] ${n}`));
}
if (coreFx.newInCurrent.length || edgeFx.newInCurrent.length) {
  console.log('New fixtures in current run (not in baseline):');
  coreFx.newInCurrent.forEach(n => console.log(`  [CORE] ${n}`));
  edgeFx.newInCurrent.forEach(n => console.log(`  [EDGE] ${n}`));
}

const coreRegressed = current.core.rate < baseline.core.rate;
const edgeRegressed = current.edge.rate < baseline.edge.rate;
const fixtureRegressed = coreFx.flippedToFail.length > 0 || edgeFx.flippedToFail.length > 0;
const fixtureMissing = coreFx.missingInCurrent.length > 0 || edgeFx.missingInCurrent.length > 0;

if (coreRegressed || edgeRegressed || fixtureRegressed || fixtureMissing) {
  console.error('Regression detected vs baseline.');
  process.exit(1);
}

console.log('No regression detected vs baseline.');
process.exit(0);
