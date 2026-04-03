#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadGates() {
  const p = path.join(__dirname, 'gates.json');
  if (!fs.existsSync(p)) {
    return { core_rate_min: 1.0, edge_rate_min: 0.95, tag_rate_min: {} };
  }
  return readJson(p);
}

function nearlyEqual(a, b, eps = 1e-7) {
  return Math.abs(a - b) <= eps;
}

function dist(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function lineCircleDistance(line, circle) {
  const A = line.y2 - line.y1;
  const B = line.x1 - line.x2;
  const C = line.x2 * line.y1 - line.x1 * line.y2;
  return Math.abs(A * circle.cx + B * circle.cy + C) / Math.hypot(A, B);
}

function normalizeAngle(a) {
  const twoPi = 2 * Math.PI;
  let x = a % twoPi;
  if (x < 0) x += twoPi;
  return x;
}

function angleInArc(theta, a0, a1) {
  theta = normalizeAngle(theta);
  a0 = normalizeAngle(a0);
  a1 = normalizeAngle(a1);
  if (a0 <= a1) return theta >= a0 && theta <= a1;
  return theta >= a0 || theta <= a1;
}

function lineCircleIntersectionCount(line, arc) {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  const fx = line.x1 - arc.cx;
  const fy = line.y1 - arc.cy;

  const A = dx * dx + dy * dy;
  const B = 2 * (fx * dx + fy * dy);
  const C = fx * fx + fy * fy - arc.r * arc.r;
  const D = B * B - 4 * A * C;
  const discEps = 1e-12;
  if (D < -discEps) return 0;
  const Dn = Math.abs(D) <= discEps ? 0 : D;

  const ts = Dn === 0 ? [-B / (2 * A)] : [(-B - Math.sqrt(Dn)) / (2 * A), (-B + Math.sqrt(Dn)) / (2 * A)];
  let count = 0;
  for (const t of ts) {
    if (t < -1e-12 || t > 1 + 1e-12) continue; // segment-only intersection
    const x = line.x1 + t * dx;
    const y = line.y1 + t * dy;
    const th = Math.atan2(y - arc.cy, x - arc.cx);
    if (angleInArc(th, arc.a0, arc.a1)) count++;
  }
  return count;
}

function classifyParallel(lineA, lineB, eps) {
  const ux = lineA.x2 - lineA.x1;
  const uy = lineA.y2 - lineA.y1;
  const vx = lineB.x2 - lineB.x1;
  const vy = lineB.y2 - lineB.y1;
  const cross = Math.abs(ux * vy - uy * vx);
  const denom = Math.hypot(ux, uy) * Math.hypot(vx, vy);
  return denom > 0 && cross / denom <= eps;
}

function simulateTrim(inputs) {
  const l = inputs.entities.line;
  const c = inputs.entities.cutter;
  if (!l || !c) return { segments: [] };
  const vertical = nearlyEqual(c.x1, c.x2, 1e-12);
  const horizontalLine = nearlyEqual(l.y1, l.y2, 1e-12);
  if (!(vertical && horizontalLine)) return { segments: [] };
  const ix = c.x1;
  const clickRight = inputs.operation && inputs.operation.click && inputs.operation.click.x > ix;
  if (clickRight) {
    return { segments: [{ id: 'l0_left', x1: l.x1, y1: l.y1, x2: ix, y2: l.y2 }] };
  }
  return { segments: [{ id: 'l0_right', x1: ix, y1: l.y1, x2: l.x2, y2: l.y2 }] };
}


function simulateExtend(inputs) {
  const l = inputs.entities.line;
  const b = inputs.entities.boundary;
  const op = inputs.operation || {};
  if (!l || !b) return null;

  const p = lineIntersection(l, b);
  if (!p) return null;

  const vx = l.x2 - l.x1;
  const vy = l.y2 - l.y1;

  if (op.direction === 'positive_x') {
    if (p.x <= l.x2) return null;
    return { id: 'l0_extended', x1: l.x1, y1: l.y1, x2: p.x, y2: p.y };
  }

  if (op.direction === 'forward') {
    const wx = p.x - l.x2;
    const wy = p.y - l.y2;
    if (dot(wx, wy, vx, vy) <= 0) return null;
    return { id: 'l0_extended', x1: l.x1, y1: l.y1, x2: p.x, y2: p.y };
  }

  return null;
}

function normalize(vx, vy) {
  const n = Math.hypot(vx, vy);
  if (n === 0) return [0, 0];
  return [vx / n, vy / n];
}

function lineIntersection(l1, l2) {
  const x1=l1.x1, y1=l1.y1, x2=l1.x2, y2=l1.y2;
  const x3=l2.x1, y3=l2.y1, x4=l2.x2, y4=l2.y2;
  const d=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
  if (Math.abs(d) < 1e-12) return null;
  const px=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/d;
  const py=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/d;
  return {x:px,y:py};
}

function simulateChamfer(inputs) {
  const a = inputs.entities.lineA;
  const b = inputs.entities.lineB;
  const op = inputs.operation || {};
  if (!a || !b) return null;
  const p = lineIntersection(a,b);
  if (!p) return null;
  const [uax,uay]=rayFromIntersection(a, p);
  const [ubx,uby]=rayFromIntersection(b, p);
  const dA = op.distanceA || 0;
  const dB = op.distanceB || 0;
  return {
    pA:{x:p.x + uax*dA, y:p.y + uay*dA},
    pB:{x:p.x + ubx*dB, y:p.y + uby*dB}
  };
}


function dot(ax, ay, bx, by) {
  return ax * bx + ay * by;
}

function rayFromIntersection(line, p) {
  const e1 = { x: line.x1, y: line.y1 };
  const e2 = { x: line.x2, y: line.y2 };
  const d1 = Math.hypot(e1.x - p.x, e1.y - p.y);
  const d2 = Math.hypot(e2.x - p.x, e2.y - p.y);
  if (d1 > d2 + 1e-12) return normalize(e1.x - p.x, e1.y - p.y);
  if (d2 > d1 + 1e-12) return normalize(e2.x - p.x, e2.y - p.y);
  const pickE1 = (e1.x < e2.x) || (nearlyEqual(e1.x, e2.x, 1e-12) && e1.y <= e2.y);
  const e = pickE1 ? e1 : e2;
  return normalize(e.x - p.x, e.y - p.y);
}

function simulateFillet(inputs) {
  const a = inputs.entities.lineA;
  const b = inputs.entities.lineB;
  const op = inputs.operation || {};
  if (!a || !b || typeof op.radius !== 'number') return null;
  const p = lineIntersection(a, b);
  if (!p) return null;

  const [uax, uay] = rayFromIntersection(a, p);
  const [ubx, uby] = rayFromIntersection(b, p);
  let c = dot(uax, uay, ubx, uby);
  c = Math.max(-1, Math.min(1, c));
  const phi = Math.acos(c);
  if (phi <= 1e-9 || Math.abs(Math.PI - phi) <= 1e-9) return null;

  const r = op.radius;
  const d = r / Math.tan(phi / 2);
  const pA = { x: p.x + uax * d, y: p.y + uay * d };
  const pB = { x: p.x + ubx * d, y: p.y + uby * d };

  const [bx, by] = normalize(uax + ubx, uay + uby);
  const centerDist = r / Math.sin(phi / 2);
  const center = { x: p.x + bx * centerDist, y: p.y + by * centerDist };

  return { pA, pB, center, radius: r };
}

function pairKey(a, b) {
  return [a, b].sort().join('::');
}

function classifyConstraintScenario(inputs) {
  const constraints = inputs.constraints || [];
  const points = (inputs.entities && inputs.entities.points) || [];

  const distancesByPair = new Map();
  const horizontalByPair = new Set();
  const verticalByPair = new Set();
  for (const c of constraints) {
    const key = pairKey(c.a, c.b);
    if (c.kind === 'distance') {
      if (!distancesByPair.has(key)) distancesByPair.set(key, []);
      distancesByPair.get(key).push(c.value);
    } else if (c.kind === 'horizontal') {
      horizontalByPair.add(key);
    } else if (c.kind === 'vertical') {
      verticalByPair.add(key);
    }
  }

  let hasConsistentDuplicate = false;
  for (const values of distancesByPair.values()) {
    if (values.length < 2) continue;
    const first = values[0];
    const hasConflict = values.some(v => !nearlyEqual(v, first, 1e-9));
    if (hasConflict) return 'over_constrained_conflicting';
    hasConsistentDuplicate = true;
  }
  for (const [key, values] of distancesByPair.entries()) {
    const hasNonZeroDistance = values.some(v => Math.abs(v) > 1e-9);
    if (hasNonZeroDistance && horizontalByPair.has(key) && verticalByPair.has(key)) {
      return 'over_constrained_conflicting';
    }
  }

  if (hasConsistentDuplicate) {
    return 'over_constrained_consistent';
  }

  if (points.length === 2) {
    const distanceCount = constraints.filter(c => c.kind === 'distance').length;
    const horizontalCount = constraints.filter(c => c.kind === 'horizontal').length;
    const verticalCount = constraints.filter(c => c.kind === 'vertical').length;
    if (distanceCount >= 1 && (horizontalCount + verticalCount) >= 1) return 'well_constrained';
    return 'under_constrained';
  }

  return 'under_constrained';
}

function simulateOperation(inputs) {
  const op = inputs.operation || {};
  switch (op.kind) {
    case 'trim':
      return simulateTrim(inputs);
    case 'extend':
      return simulateExtend(inputs);
    case 'chamfer':
      return simulateChamfer(inputs);
    case 'fillet':
      return simulateFillet(inputs);
    default:
      return null;
  }
}

function stableStringify(x) {
  if (Array.isArray(x)) return `[${x.map(stableStringify).join(',')}]`;
  if (x && typeof x === 'object') {
    const keys = Object.keys(x).sort();
    return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(x[k])}`).join(',')}}`;
  }
  return JSON.stringify(x);
}

function checkDeterministicOutcome(inputs, repeats = 30) {
  const r = Math.max(2, repeats);
  let baseline = null;
  for (let i = 0; i < r; i++) {
    const outcome = simulateOperation(inputs);
    if (outcome == null) return false;
    const encoded = stableStringify(outcome);
    if (baseline === null) {
      baseline = encoded;
      continue;
    }
    if (encoded !== baseline) return false;
  }
  return true;
}

function runCheck(fix, check) {
  const ent = (fix.inputs && fix.inputs.entities) || {};
  switch (check.kind) {
    case 'distance': {
      const pts = Object.fromEntries((ent.points || []).map(p => [p.id, p]));
      return nearlyEqual(dist(pts[check.a], pts[check.b]), check.value, check.eps);
    }
    case 'equal_x': {
      const pts = Object.fromEntries((ent.points || []).map(p => [p.id, p]));
      return nearlyEqual(pts[check.a].x, pts[check.b].x, check.eps);
    }
    case 'equal_y': {
      const pts = Object.fromEntries((ent.points || []).map(p => [p.id, p]));
      return nearlyEqual(pts[check.a].y, pts[check.b].y, check.eps);
    }
    case 'point_equal': {
      const pts = Object.fromEntries((ent.points || []).map(p => [p.id, p]));
      return nearlyEqual(pts[check.a].x, pts[check.b].x, check.eps) && nearlyEqual(pts[check.a].y, pts[check.b].y, check.eps);
    }
    case 'line_circle_distance':
      return nearlyEqual(lineCircleDistance(ent.line, ent.circle), check.value, check.eps);
    case 'intersection_count':
      return lineCircleIntersectionCount(ent.line, ent.arc) === check.value;
    case 'classified_as_parallel':
      return classifyParallel(ent.lineA, ent.lineB, check.eps || 1e-9);
    case 'solver_classification':
      return classifyConstraintScenario(fix.inputs) === check.value;
    case 'deterministic_outcome':
      return checkDeterministicOutcome(fix.inputs, check.repeats || 30);
    case 'line_exists': {
      const result = simulateTrim(fix.inputs);
      return result.segments.some(s =>
        s.id === check.id &&
        nearlyEqual(s.x1, check.x1, check.eps) &&
        nearlyEqual(s.y1, check.y1, check.eps) &&
        nearlyEqual(s.x2, check.x2, check.eps) &&
        nearlyEqual(s.y2, check.y2, check.eps));
    }
    case 'line_removed': {
      const result = simulateTrim(fix.inputs);
      return !result.segments.some(s => s.id === check.id);
    }
    case 'segment_endpoint_match': {
      const result = simulateTrim(fix.inputs);
      const seg = result.segments.find(s => s.id === check.id);
      if (!seg) return false;
      const x = check.endpoint === 'start' ? seg.x1 : seg.x2;
      const y = check.endpoint === 'start' ? seg.y1 : seg.y2;
      return nearlyEqual(x, check.x, check.eps) && nearlyEqual(y, check.y, check.eps);
    }
    case 'segment_nonzero_length': {
      const result = simulateTrim(fix.inputs);
      const seg = result.segments.find(s => s.id === check.id);
      if (!seg) return false;
      const minLength = typeof check.minLength === 'number' ? check.minLength : 1e-12;
      return dist({ x: seg.x1, y: seg.y1 }, { x: seg.x2, y: seg.y2 }) > minLength;
    }
    case 'extend_line_end': {
      const result = simulateExtend(fix.inputs);
      if (!result) return false;
      return nearlyEqual(result.x2, check.x2, check.eps) && nearlyEqual(result.y2, check.y2, check.eps);
    }
    case 'chamfer_points': {
      const result = simulateChamfer(fix.inputs);
      if (!result) return false;
      return nearlyEqual(result.pA.x, check.pA.x, check.eps)
        && nearlyEqual(result.pA.y, check.pA.y, check.eps)
        && nearlyEqual(result.pB.x, check.pB.x, check.eps)
        && nearlyEqual(result.pB.y, check.pB.y, check.eps);
    }
    case 'fillet_geometry': {
      const result = simulateFillet(fix.inputs);
      if (!result) return false;
      return nearlyEqual(result.pA.x, check.pA.x, check.eps)
        && nearlyEqual(result.pA.y, check.pA.y, check.eps)
        && nearlyEqual(result.pB.x, check.pB.x, check.eps)
        && nearlyEqual(result.pB.y, check.pB.y, check.eps)
        && nearlyEqual(result.center.x, check.center.x, check.eps)
        && nearlyEqual(result.center.y, check.center.y, check.eps)
        && nearlyEqual(result.radius, check.radius, check.eps);
    }
    default:
      return false;
  }
}

function runFixture(file) {
  const fix = readJson(file);
  const checks = (fix.expected && fix.expected.checks) || [];
  const allowNoChecks = !!(fix.expected && fix.expected.allowNoChecks);
  if (checks.length === 0 && !allowNoChecks) {
    return {
      name: fix.name,
      passed: false,
      total: 0,
      passedChecks: 0,
      tags: fix.tags || [],
      error: 'Fixture has no expected.checks'
    };
  }
  const results = checks.map(ch => runCheck(fix, ch));
  const passed = results.every(Boolean);
  return { name: fix.name, passed, total: checks.length, passedChecks: results.filter(Boolean).length, tags: fix.tags || [] };
}

function listJson(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(dir, f))
    .sort();
}

function runBucket(root, bucket) {
  const dir = path.join(root, bucket);
  const files = listJson(dir);
  const results = files.map(runFixture);
  const passed = results.filter(r => r.passed).length;
  return { bucket, total: results.length, passed, rate: results.length ? passed / results.length : 0, results };
}


function aggregateByTag(results) {
  const stats = {};
  for (const r of results) {
    for (const tag of (r.tags || [])) {
      if (!stats[tag]) stats[tag] = { total: 0, passed: 0 };
      stats[tag].total += 1;
      if (r.passed) stats[tag].passed += 1;
    }
  }
  return stats;
}

function markdownSummary(core, edge, tagStats, gates, gateResult) {
  const lines = [];
  lines.push('# Stage A Fixture Summary');
  lines.push('');
  lines.push(`- Core: ${core.passed}/${core.total} (${(core.rate*100).toFixed(1)}%)`);
  lines.push(`- Edge: ${edge.passed}/${edge.total} (${(edge.rate*100).toFixed(1)}%)`);
  lines.push(`- Gate status: ${gateResult.ok ? 'PASS' : 'FAIL'}`);
  lines.push('');
  lines.push('## Category (tag) pass-rates');
  lines.push('');
  lines.push('| Tag | Passed | Total | Rate |');
  lines.push('|---|---:|---:|---:|');
  for (const tag of Object.keys(tagStats).sort()) {
    const s = tagStats[tag];
    const rate = s.total ? ((s.passed/s.total)*100).toFixed(1) : '0.0';
    lines.push(`| ${tag} | ${s.passed} | ${s.total} | ${rate}% |`);
  }
  lines.push('');
  lines.push('## Gate thresholds');
  lines.push('');
  lines.push(`- Core min: ${(gates.core_rate_min*100).toFixed(1)}%`);
  lines.push(`- Edge min: ${(gates.edge_rate_min*100).toFixed(1)}%`);
  for (const [tag, v] of Object.entries(gates.tag_rate_min || {})) {
    lines.push(`- Tag ${tag} min: ${(v*100).toFixed(1)}%`);
  }
  lines.push('');
  return lines.join('\n');
}

function main() {
  const root = path.join(__dirname, 'fixtures');
  const core = runBucket(root, 'core');
  const edge = runBucket(root, 'edge');

  const fmt = b => `${b.passed}/${b.total} (${(b.rate * 100).toFixed(1)}%)`;
  console.log(`Core: ${fmt(core)}`);
  core.results.forEach(r => console.log(`  [${r.passed ? 'PASS' : 'FAIL'}] ${r.name}`));
  console.log(`Edge: ${fmt(edge)}`);
  edge.results.forEach(r => console.log(`  [${r.passed ? 'PASS' : 'FAIL'}] ${r.name}`));

  const generatedAt = new Date().toISOString();
  const gates = loadGates();
  const tagStats = aggregateByTag([...core.results, ...edge.results]);

  const tagFailures = [];
  for (const [tag, minRate] of Object.entries(gates.tag_rate_min || {})) {
    const s = tagStats[tag] || { passed: 0, total: 0 };
    const rate = s.total ? s.passed / s.total : 0;
    if (rate < minRate) tagFailures.push({ tag, rate, minRate });
  }

  const gateResult = {
    core_ok: core.rate >= gates.core_rate_min,
    edge_ok: edge.rate >= gates.edge_rate_min,
    tag_failures: tagFailures,
  };
  gateResult.ok = gateResult.core_ok && gateResult.edge_ok && gateResult.tag_failures.length === 0;

  const out = {
    generatedAt,
    core: { passed: core.passed, total: core.total, rate: core.rate },
    edge: { passed: edge.passed, total: edge.total, rate: edge.rate },
    gates,
    gateResult
  };
  const detail = {
    generatedAt,
    core: core.results,
    edge: edge.results,
    tags: tagStats,
    gates,
    gateResult
  };
  fs.writeFileSync(path.join(__dirname, 'pass-rate-report.json'), JSON.stringify(out, null, 2));
  fs.writeFileSync(path.join(__dirname, 'pass-rate-detail.json'), JSON.stringify(detail, null, 2));
  fs.writeFileSync(path.join(__dirname, 'pass-rate-summary.md'), markdownSummary(core, edge, tagStats, gates, gateResult));

  process.exit(gateResult.ok ? 0 : 1);
}

main();
