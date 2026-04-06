#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
}

function tracePendingCount(seedMarkdown) {
  const rows = seedMarkdown
    .split(/\r?\n/)
    .filter(line => line.startsWith('| ') && !line.startsWith('|---') && !line.includes('Scenario ID | Fixture | Capability ID'))
    .map(line => line.split('|').slice(1, -1).map(x => x.trim()));
  const total = rows.length;
  const observed = rows.filter(cols => (cols[4] || '').length > 0).length;
  return { total, observed, pending: total - observed };
}

function main() {
  const pass = readJson('pass-rate-report.json');
  const det = readJson('pass-rate-determinism.json');
  const seedMd = fs.readFileSync(path.join(root, 'stage-bc-trace-session-seed.md'), 'utf8');
  const trace = tracePendingCount(seedMd);

  const report = {
    generatedAt: new Date().toISOString(),
    fixtureGates: {
      core: pass.core,
      edge: pass.edge,
      gateOk: !!(pass.gateResult && pass.gateResult.ok)
    },
    determinism: {
      total: det.total,
      passed: det.passed,
      failed: det.failed
    },
    traceSession: trace
  };

  const jsonPath = path.join(root, 'stage-a-status-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const md = [];
  md.push('# Stage A Status Report');
  md.push('');
  md.push(`Generated: ${report.generatedAt}`);
  md.push('');
  md.push(`- Core gate: ${report.fixtureGates.core.passed}/${report.fixtureGates.core.total}`);
  md.push(`- Edge gate: ${report.fixtureGates.edge.passed}/${report.fixtureGates.edge.total}`);
  md.push(`- Overall gate: ${report.fixtureGates.gateOk ? 'PASS' : 'FAIL'}`);
  md.push(`- Determinism: ${report.determinism.passed}/${report.determinism.total} passed`);
  md.push(`- Stage B/C trace rows observed: ${report.traceSession.observed}/${report.traceSession.total}`);
  md.push(`- Stage B/C trace rows pending: ${report.traceSession.pending}`);
  md.push('');

  fs.writeFileSync(path.join(root, 'stage-a-status-report.md'), md.join('\n'));
  console.log('Wrote stage-a-status-report.json and stage-a-status-report.md');
}

main();
