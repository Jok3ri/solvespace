#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const seedPath = path.join(root, 'stage-bc-trace-session-seed.md');
const outDir = path.join(root, 'trace-sessions');

function argValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

function sanitizeId(id) {
  return id.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function main() {
  const idRaw = argValue('--id');
  if (!idRaw) {
    console.error('Usage: node research/stage-a/init-trace-session.js --id <trace_id> [--output <file>]');
    process.exit(1);
  }
  const traceId = sanitizeId(idRaw);

  if (!fs.existsSync(seedPath)) {
    console.error(`Missing seed file: ${seedPath}`);
    process.exit(1);
  }

  const outputArg = argValue('--output');
  const outPath = outputArg
    ? path.resolve(outputArg)
    : path.join(outDir, `${traceId}.md`);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const now = new Date().toISOString();
  const seed = fs.readFileSync(seedPath, 'utf8');

  const lines = [];
  lines.push(`# Runtime Trace Session: ${traceId}`);
  lines.push('');
  lines.push(`- Trace ID: ${traceId}`);
  lines.push(`- Created At: ${now}`);
  lines.push('- SolveSpace version/commit:');
  lines.push('- OS:');
  lines.push('- Recorder/tooling:');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(seed);
  lines.push('');

  fs.writeFileSync(outPath, lines.join('\n'));
  console.log(`Wrote trace session file: ${outPath}`);
}

main();
