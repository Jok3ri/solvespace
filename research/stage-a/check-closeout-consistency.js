#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const closeoutPath = path.join(root, 'stage-a-closeout-final.md');
const summaryPath = path.join(root, 'pass-rate-summary.md');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function parsePair(markdown, label) {
  const re = new RegExp(`- ${label}:\\s*(\\d+)\\/(\\d+)`, 'i');
  const match = markdown.match(re);
  if (!match) {
    throw new Error(`Could not parse "${label}" ratio from markdown.`);
  }
  return { passed: Number(match[1]), total: Number(match[2]) };
}

function assertEqual(name, a, b) {
  if (a.passed !== b.passed || a.total !== b.total) {
    throw new Error(
      `${name} mismatch: closeout=${a.passed}/${a.total} vs summary=${b.passed}/${b.total}`
    );
  }
}

function main() {
  const closeout = read(closeoutPath);
  const summary = read(summaryPath);

  const closeoutCore = parsePair(closeout, 'Core pass-rate');
  const closeoutEdge = parsePair(closeout, 'Edge pass-rate');
  const summaryCore = parsePair(summary, 'Core');
  const summaryEdge = parsePair(summary, 'Edge');

  assertEqual('Core', closeoutCore, summaryCore);
  assertEqual('Edge', closeoutEdge, summaryEdge);

  console.log(
    `Closeout consistency check passed: core=${summaryCore.passed}/${summaryCore.total}, edge=${summaryEdge.passed}/${summaryEdge.total}`
  );
}

main();
