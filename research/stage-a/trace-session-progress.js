#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const seedPath = path.join(root, 'stage-bc-trace-session-seed.md');

function parseRows(markdown) {
  return markdown
    .split(/\r?\n/)
    .filter(line => line.startsWith('| ') && !line.startsWith('|---') && !line.includes('Scenario ID | Fixture | Capability ID'))
    .map(line => line.split('|').slice(1, -1).map(x => x.trim()))
    .map(cols => ({
      scenarioId: cols[0] || '',
      runtimeObserved: cols[4] || '',
      match: cols[5] || '',
      deltaType: cols[6] || '',
      action: cols[8] || ''
    }));
}

function main() {
  if (!fs.existsSync(seedPath)) {
    console.error(`Missing seed file: ${seedPath}`);
    process.exit(1);
  }

  const md = fs.readFileSync(seedPath, 'utf8');
  const rows = parseRows(md);
  const total = rows.length;
  const withObserved = rows.filter(r => r.runtimeObserved.length > 0).length;
  const withMatch = rows.filter(r => r.match.length > 0).length;
  const withAction = rows.filter(r => r.action.length > 0).length;

  console.log(`Trace-session progress: ${withObserved}/${total} runtime observations captured.`);
  console.log(`Match decisions filled: ${withMatch}/${total}.`);
  console.log(`Action fields filled: ${withAction}/${total}.`);

  const pending = rows.filter(r => r.runtimeObserved.length === 0).map(r => r.scenarioId);
  if (pending.length > 0) {
    console.log('Pending scenario IDs:');
    for (const id of pending) console.log(`  - ${id}`);
  }
}

main();
