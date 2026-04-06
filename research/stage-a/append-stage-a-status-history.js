#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const reportPath = path.join(root, 'stage-a-status-report.json');
const historyPath = path.join(root, 'stage-a-status-history.jsonl');

function readHistory() {
  if (!fs.existsSync(historyPath)) return [];
  return fs.readFileSync(historyPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

function main() {
  if (!fs.existsSync(reportPath)) {
    console.error(`Missing status report: ${reportPath}`);
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const history = readHistory();

  const exists = history.some(h => h.generatedAt === report.generatedAt);
  if (!exists) {
    history.push(report);
  }

  fs.writeFileSync(historyPath, history.map(h => JSON.stringify(h)).join('\n') + '\n');

  const latest = history[history.length - 1];
  console.log(`Status history entries: ${history.length}`);
  console.log(`Latest: ${latest.generatedAt} core=${latest.fixtureGates.core.passed}/${latest.fixtureGates.core.total} edge=${latest.fixtureGates.edge.passed}/${latest.fixtureGates.edge.total} pendingTrace=${latest.traceSession.pending}`);
}

main();
