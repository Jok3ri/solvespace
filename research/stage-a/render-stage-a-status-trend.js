#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const historyPath = path.join(root, 'stage-a-status-history.jsonl');
const trendPath = path.join(root, 'stage-a-status-trend.md');

function readHistory() {
  if (!fs.existsSync(historyPath)) return [];
  return fs.readFileSync(historyPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

function main() {
  const history = readHistory();
  const lines = [];
  lines.push('# Stage A Status Trend');
  lines.push('');
  lines.push(`Entries: ${history.length}`);
  lines.push('');
  lines.push('| Generated At | Core | Edge | Determinism | Trace Observed | Trace Pending | Gate |');
  lines.push('|---|---:|---:|---:|---:|---:|---|');

  for (const h of history) {
    lines.push(`| ${h.generatedAt} | ${h.fixtureGates.core.passed}/${h.fixtureGates.core.total} | ${h.fixtureGates.edge.passed}/${h.fixtureGates.edge.total} | ${h.determinism.passed}/${h.determinism.total} | ${h.traceSession.observed}/${h.traceSession.total} | ${h.traceSession.pending} | ${h.fixtureGates.gateOk ? 'PASS' : 'FAIL'} |`);
  }

  lines.push('');
  fs.writeFileSync(trendPath, lines.join('\n'));
  console.log(`Wrote ${trendPath}`);
}

main();
