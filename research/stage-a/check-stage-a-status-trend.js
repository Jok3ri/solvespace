#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const historyPath = path.join(root, 'stage-a-status-history.jsonl');

function readHistory() {
  if (!fs.existsSync(historyPath)) return [];
  const lines = fs.readFileSync(historyPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean);

  return lines.map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (err) {
      throw new Error(`Invalid JSON at ${path.basename(historyPath)}:${index + 1} (${err.message})`);
    }
  });
}

function assertShape(snapshot, label) {
  const requiredPaths = [
    ['fixtureGates', 'gateOk'],
    ['fixtureGates', 'core', 'passed'],
    ['fixtureGates', 'edge', 'passed'],
    ['determinism', 'passed'],
    ['traceSession', 'pending'],
    ['generatedAt']
  ];

  for (const pathParts of requiredPaths) {
    let current = snapshot;
    for (const key of pathParts) {
      if (current == null || !(key in current)) {
        throw new Error(`Missing ${label}.${pathParts.join('.')}`);
      }
      current = current[key];
    }
  }
}

function main() {
  const history = readHistory();
  if (history.length < 2) {
    console.log('Not enough history entries to evaluate trend checks.');
    process.exit(0);
  }

  const prev = history[history.length - 2];
  const curr = history[history.length - 1];
  assertShape(prev, 'prev');
  assertShape(curr, 'curr');

  const failures = [];
  if (!curr.fixtureGates.gateOk) failures.push('latest overall gate is FAIL');
  if (curr.fixtureGates.core.passed < prev.fixtureGates.core.passed) failures.push('core passed count regressed');
  if (curr.fixtureGates.edge.passed < prev.fixtureGates.edge.passed) failures.push('edge passed count regressed');
  if (curr.determinism.passed < prev.determinism.passed) failures.push('determinism passed count regressed');
  if (curr.traceSession.pending > prev.traceSession.pending) failures.push('trace pending count increased');

  console.log(`Trend check previous=${prev.generatedAt} -> current=${curr.generatedAt}`);
  if (failures.length > 0) {
    for (const f of failures) console.error(`FAIL: ${f}`);
    process.exit(1);
  }

  console.log('Trend checks passed (no regressions vs previous snapshot).');
}

main();
