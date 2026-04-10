#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const passRatePath = path.join(root, 'pass-rate-report.json');
const determinismPath = path.join(root, 'pass-rate-determinism.json');
const statusPath = path.join(root, 'stage-a-status-report.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assertEq(label, a, b) {
  if (a !== b) {
    throw new Error(`${label} mismatch: expected ${a}, got ${b}`);
  }
}

function main() {
  const passRate = readJson(passRatePath);
  const determinism = readJson(determinismPath);
  const status = readJson(statusPath);

  assertEq('core passed', passRate.core.passed, status.fixtureGates.core.passed);
  assertEq('core total', passRate.core.total, status.fixtureGates.core.total);
  assertEq('edge passed', passRate.edge.passed, status.fixtureGates.edge.passed);
  assertEq('edge total', passRate.edge.total, status.fixtureGates.edge.total);
  assertEq('gate ok', passRate.gateResult.ok, status.fixtureGates.gateOk);
  assertEq('determinism passed', determinism.passed, status.determinism.passed);
  assertEq('determinism total', determinism.total, status.determinism.total);

  console.log(
    `Status consistency check passed: core=${status.fixtureGates.core.passed}/${status.fixtureGates.core.total}, edge=${status.fixtureGates.edge.passed}/${status.fixtureGates.edge.total}, determinism=${status.determinism.passed}/${status.determinism.total}`
  );
}

main();
