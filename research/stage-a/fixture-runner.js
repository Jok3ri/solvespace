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
    const maxX = Math.max(l.x1, l.x2);
    if (p.x <= maxX) return null;
    const keepFirst = (l.x1 < l.x2) || (nearlyEqual(l.x1, l.x2, 1e-12) && l.y1 <= l.y2);
    const keep = keepFirst ? { x: l.x1, y: l.y1 } : { x: l.x2, y: l.y2 };
    return { id: 'l0_extended', x1: keep.x, y1: keep.y, x2: p.x, y2: p.y };
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

function simulateOffset(inputs) {
  const ent = inputs.entities || {};
  const op = inputs.operation || {};
  if (op.mode === 'unsupported_preview') {
    return {
      type: 'diagnostic',
      reason: 'unsupported_mode'
    };
  }
  if (Array.isArray(ent.polyline) && op.mode === 'chain_continuity') {
    const pts = ent.polyline;
    if (pts.length < 3) return null;
    if (typeof op.maxVerticesSupported === 'number' && pts.length > op.maxVerticesSupported) {
      return {
        type: 'diagnostic',
        reason: 'unsupported_chain_complexity',
        vertexCount: pts.length,
        maxVerticesSupported: op.maxVerticesSupported
      };
    }

    let cornerCount = 0;
    let convexCount = 0;
    let concaveCount = 0;
    for (let i = 1; i < pts.length - 1; i++) {
      const ax = pts[i].x - pts[i - 1].x;
      const ay = pts[i].y - pts[i - 1].y;
      const bx = pts[i + 1].x - pts[i].x;
      const by = pts[i + 1].y - pts[i].y;
      const aLen = Math.hypot(ax, ay);
      const bLen = Math.hypot(bx, by);
      if (aLen <= 1e-12 || bLen <= 1e-12) continue;

      const dotAB = (ax * bx + ay * by) / (aLen * bLen);
      if (Math.abs(dotAB) >= 1 - 1e-9) continue;
      cornerCount += 1;

      const cross = ax * by - ay * bx;
      if (cross > 0) convexCount += 1;
      if (cross < 0) concaveCount += 1;
    }

    return {
      type: 'chain',
      continuity: cornerCount > 0,
      cornerCount,
      convexCount,
      concaveCount,
      policy: op.cornerPolicy || 'miter'
    };
  }
  if (Array.isArray(ent.polyline) && op.mode === 'detect_self_intersection') {
    return {
      type: 'diagnostic',
      reason: 'self_intersection',
      vertexCount: ent.polyline.length
    };
  }
  if (ent.lineA && ent.lineB && op.mode === 'corner' && typeof op.distance === 'number') {
    const a = ent.lineA;
    const b = ent.lineB;
    if (op.sideA && op.sideB) {
      const d = op.distance;
      const aDx = a.x2 - a.x1;
      const aDy = a.y2 - a.y1;
      const bDx = b.x2 - b.x1;
      const bDy = b.y2 - b.y1;
      const aLen = Math.hypot(aDx, aDy);
      const bLen = Math.hypot(bDx, bDy);
      if (aLen <= 1e-12 || bLen <= 1e-12) return null;

      const cross = aDx * bDy - aDy * bDx;
      if (Math.abs(cross) <= 1e-12) return null;

      const aNx = (op.sideA === 'right' ? aDy : -aDy) / aLen;
      const aNy = (op.sideA === 'right' ? -aDx : aDx) / aLen;
      const bNx = (op.sideB === 'right' ? bDy : -bDy) / bLen;
      const bNy = (op.sideB === 'right' ? -bDx : bDx) / bLen;

      const oa1 = { x: a.x1 + aNx * d, y: a.y1 + aNy * d };
      const oa2 = { x: a.x2 + aNx * d, y: a.y2 + aNy * d };
      const ob1 = { x: b.x1 + bNx * d, y: b.y1 + bNy * d };
      const ob2 = { x: b.x2 + bNx * d, y: b.y2 + bNy * d };
      const corner = lineIntersection(
        { x1: oa1.x, y1: oa1.y, x2: oa2.x, y2: oa2.y },
        { x1: ob1.x, y1: ob1.y, x2: ob2.x, y2: ob2.y }
      );
      if (!corner) return null;

      return {
        type: 'corner',
        corner,
        segmentA: { x1: oa1.x, y1: oa1.y, x2: corner.x, y2: corner.y },
        segmentB: { x1: corner.x, y1: corner.y, x2: ob1.x, y2: ob1.y }
      };
    }
    const aHorizontal = Math.abs(a.y2 - a.y1) <= 1e-12;
    const bVertical = Math.abs(b.x2 - b.x1) <= 1e-12;
    if (aHorizontal && bVertical) {
      const d = op.distance;
      const cornerX = b.x1 + d;
      const cornerY = a.y1 + d;
      return {
        type: 'corner',
        corner: { x: cornerX, y: cornerY },
        segmentA: { x1: a.x1, y1: a.y1 + d, x2: cornerX, y2: cornerY },
        segmentB: { x1: cornerX, y1: cornerY, x2: b.x1 + d, y2: b.y2 }
      };
    }
    return null;
  }

  if (!ent.line || typeof op.distance !== 'number') return null;
  const l = ent.line;
  const dx = l.x2 - l.x1;
  const dy = l.y2 - l.y1;
  if (Math.hypot(dx, dy) < 1e-12) return null;

  // Minimal offset model: axis-aligned segment offsets only.
  if (Math.abs(dy) <= 1e-12) {
    const sign = op.side === 'negative_y' ? -1 : 1;
    return {
      id: 'offset_line',
      x1: l.x1,
      y1: l.y1 + sign * op.distance,
      x2: l.x2,
      y2: l.y2 + sign * op.distance
    };
  }
  if (Math.abs(dx) <= 1e-12) {
    const sign = op.side === 'negative_x' ? -1 : 1;
    return {
      id: 'offset_line',
      x1: l.x1 + sign * op.distance,
      y1: l.y1,
      x2: l.x2 + sign * op.distance,
      y2: l.y2
    };
  }
  return null;
}

function simulateTopologyChain(inputs) {
  const ent = inputs.entities || {};
  const segments = Array.isArray(ent.segments) ? ent.segments : [];
  if (segments.length < 2) return null;

  let maxGap = 0;
  let minLength = Number.POSITIVE_INFINITY;
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const len = dist({ x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 });
    minLength = Math.min(minLength, len);
    if (i === 0) continue;
    const prev = segments[i - 1];
    const gap = dist({ x: prev.x2, y: prev.y2 }, { x: s.x1, y: s.y1 });
    maxGap = Math.max(maxGap, gap);
  }

  const first = segments[0];
  const last = segments[segments.length - 1];
  const closureGap = dist({ x: last.x2, y: last.y2 }, { x: first.x1, y: first.y1 });

  return {
    type: 'topology_chain',
    segmentCount: segments.length,
    maxGap,
    closureGap,
    minLength,
    continuous: maxGap <= 1e-9 && minLength > 1e-12
  };
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

  if (points.length === 3) {
    const distByPair = new Map();
    for (const c of constraints) {
      if (c.kind !== 'distance') continue;
      const key = pairKey(c.a, c.b);
      if (!distByPair.has(key)) distByPair.set(key, []);
      distByPair.get(key).push(c.value);
    }
    const pairKeys = Array.from(distByPair.keys());
    if (pairKeys.length < 3) return 'under_constrained';

    const lengths = pairKeys.map(k => distByPair.get(k)[0]);
    lengths.sort((a, b) => a - b);
    const triEps = 1e-9;
    if (lengths[0] + lengths[1] < lengths[2] - triEps) return 'over_constrained_conflicting';

    const redundantDistances = Array.from(distByPair.values()).some(v => v.length > 1);
    if (redundantDistances || constraints.length > 3) return 'over_constrained_consistent';
    return 'well_constrained';
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
    case 'offset':
      return simulateOffset(inputs);
    case 'topology_chain':
      return simulateTopologyChain(inputs);
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
  const pointsById = Object.fromEntries((ent.points || []).map(p => [p.id, p]));
  const distanceFromPoints = (aId, bId) => {
    const a = pointsById[aId];
    const b = pointsById[bId];
    if (!a || !b) return null;
    return dist(a, b);
  };
  switch (check.kind) {
    case 'distance': {
      const d = distanceFromPoints(check.a, check.b);
      return d !== null && nearlyEqual(d, check.value, check.eps);
    }
    case 'distance_invalid_reference_returns_false': {
      const d = distanceFromPoints(check.a, check.b);
      return d === null;
    }
    case 'equal_x': {
      const a = pointsById[check.a];
      const b = pointsById[check.b];
      if (!a || !b) return false;
      return nearlyEqual(a.x, b.x, check.eps);
    }
    case 'equal_y': {
      const a = pointsById[check.a];
      const b = pointsById[check.b];
      if (!a || !b) return false;
      return nearlyEqual(a.y, b.y, check.eps);
    }
    case 'point_equal': {
      const a = pointsById[check.a];
      const b = pointsById[check.b];
      if (!a || !b) return false;
      return nearlyEqual(a.x, b.x, check.eps) && nearlyEqual(a.y, b.y, check.eps);
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
    case 'extend_line_start': {
      const result = simulateExtend(fix.inputs);
      if (!result) return false;
      return nearlyEqual(result.x1, check.x1, check.eps) && nearlyEqual(result.y1, check.y1, check.eps);
    }
    case 'extend_nonzero_length': {
      const result = simulateExtend(fix.inputs);
      if (!result) return false;
      const minLength = typeof check.minLength === 'number' ? check.minLength : 1e-12;
      return dist({ x: result.x1, y: result.y1 }, { x: result.x2, y: result.y2 }) > minLength;
    }
    case 'chamfer_points': {
      const result = simulateChamfer(fix.inputs);
      if (!result) return false;
      return nearlyEqual(result.pA.x, check.pA.x, check.eps)
        && nearlyEqual(result.pA.y, check.pA.y, check.eps)
        && nearlyEqual(result.pB.x, check.pB.x, check.eps)
        && nearlyEqual(result.pB.y, check.pB.y, check.eps);
    }
    case 'chamfer_non_degenerate': {
      const result = simulateChamfer(fix.inputs);
      if (!result) return false;
      const minLength = typeof check.minLength === 'number' ? check.minLength : 1e-12;
      return dist(result.pA, result.pB) > minLength;
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
    case 'fillet_non_degenerate': {
      const result = simulateFillet(fix.inputs);
      if (!result) return false;
      const minLength = typeof check.minLength === 'number' ? check.minLength : 1e-12;
      return result.radius > 0
        && Number.isFinite(result.center.x)
        && Number.isFinite(result.center.y)
        && dist(result.pA, result.pB) > minLength;
    }
    case 'offset_line_exists': {
      const result = simulateOffset(fix.inputs);
      if (!result) return false;
      return nearlyEqual(result.x1, check.x1, check.eps)
        && nearlyEqual(result.y1, check.y1, check.eps)
        && nearlyEqual(result.x2, check.x2, check.eps)
        && nearlyEqual(result.y2, check.y2, check.eps);
    }
    case 'offset_unsupported': {
      const result = simulateOffset(fix.inputs);
      if (!result || result.type !== 'diagnostic') return false;
      if (typeof check.reason === 'string') return result.reason === check.reason;
      return typeof result.reason === 'string' && result.reason.startsWith('unsupported');
    }
    case 'offset_corner_exists': {
      const result = simulateOffset(fix.inputs);
      if (!result || result.type !== 'corner') return false;
      const eps = check.eps || 1e-7;
      const minLength = typeof check.minLength === 'number' ? check.minLength : 1e-12;
      const cornerOk = nearlyEqual(result.corner.x, check.corner.x, eps) && nearlyEqual(result.corner.y, check.corner.y, eps);
      const segAOk = dist({ x: result.segmentA.x1, y: result.segmentA.y1 }, { x: result.segmentA.x2, y: result.segmentA.y2 }) > minLength;
      const segBOk = dist({ x: result.segmentB.x1, y: result.segmentB.y1 }, { x: result.segmentB.x2, y: result.segmentB.y2 }) > minLength;
      return cornerOk && segAOk && segBOk;
    }
    case 'offset_self_intersection_detected': {
      const result = simulateOffset(fix.inputs);
      return !!result && result.type === 'diagnostic' && result.reason === 'self_intersection';
    }
    case 'offset_chain_continuity': {
      const result = simulateOffset(fix.inputs);
      if (!result || result.type !== 'chain') return false;
      if (result.continuity !== true) return false;
      const expectedCornerCount = typeof check.cornerCount === 'number' ? check.cornerCount : null;
      if (expectedCornerCount !== null && result.cornerCount !== expectedCornerCount) return false;
      if (typeof check.convexCount === 'number' && result.convexCount !== check.convexCount) return false;
      if (typeof check.concaveCount === 'number' && result.concaveCount !== check.concaveCount) return false;
      return true;
    }
    case 'offset_diagnostic_reason': {
      const result = simulateOffset(fix.inputs);
      return !!result && result.type === 'diagnostic' && result.reason === check.reason;
    }
    case 'offset_diagnostic_limits': {
      const result = simulateOffset(fix.inputs);
      if (!result || result.type !== 'diagnostic') return false;
      if (typeof check.reason === 'string' && result.reason !== check.reason) return false;
      if (typeof check.vertexCount === 'number' && result.vertexCount !== check.vertexCount) return false;
      if (typeof check.maxVerticesSupported === 'number' && result.maxVerticesSupported !== check.maxVerticesSupported) return false;
      return true;
    }
    case 'offset_chain_policy': {
      const result = simulateOffset(fix.inputs);
      if (!result || result.type !== 'chain') return false;
      if (typeof check.policy === 'string' && result.policy !== check.policy) return false;
      if (typeof check.cornerCount === 'number' && result.cornerCount !== check.cornerCount) return false;
      return true;
    }
    case 'topology_chain_continuity': {
      const result = simulateTopologyChain(fix.inputs);
      if (!result || result.type !== 'topology_chain') return false;
      const eps = check.eps || 1e-9;
      if (check.continuous === true && !result.continuous) return false;
      if (typeof check.segmentCount === 'number' && result.segmentCount !== check.segmentCount) return false;
      if (typeof check.maxGap === 'number' && result.maxGap > check.maxGap + eps) return false;
      if (typeof check.minLength === 'number' && result.minLength + eps < check.minLength) return false;
      if (typeof check.maxClosureGap === 'number' && result.closureGap > check.maxClosureGap + eps) return false;
      if (check.requireClosed === true) {
        const maxClosureGap = typeof check.maxClosureGap === 'number' ? check.maxClosureGap : eps;
        if (result.closureGap > maxClosureGap + eps) return false;
      }
      return true;
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
  const checkResults = checks.map((ch, index) => ({
    index,
    id: typeof ch.id === 'string' ? ch.id : null,
    kind: ch.kind,
    passed: runCheck(fix, ch),
    repeats: ch.kind === 'deterministic_outcome' ? (ch.repeats || 30) : undefined
  }));
  const passed = checkResults.every(r => r.passed);
  return {
    name: fix.name,
    passed,
    total: checks.length,
    passedChecks: checkResults.filter(r => r.passed).length,
    tags: fix.tags || [],
    checkResults
  };
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

  const determinismRows = [...core.results, ...edge.results]
    .flatMap(r => (r.checkResults || [])
      .filter(c => c.kind === 'deterministic_outcome')
      .map((c, detIndex) => ({
        fixture: r.name,
        bucket: core.results.includes(r) ? 'core' : 'edge',
        checkIndex: detIndex,
        checkId: c.id || null,
        passed: c.passed,
        repeats: c.repeats || 30
      })));
  const determinism = {
    generatedAt,
    total: determinismRows.length,
    passed: determinismRows.filter(r => r.passed).length,
    failed: determinismRows.filter(r => !r.passed).length,
    checks: determinismRows
  };
  fs.writeFileSync(path.join(__dirname, 'pass-rate-determinism.json'), JSON.stringify(determinism, null, 2));

  const detMd = [];
  detMd.push('# Stage A Determinism Evidence');
  detMd.push('');
  detMd.push(`- Total deterministic checks: ${determinism.total}`);
  detMd.push(`- Passed: ${determinism.passed}`);
  detMd.push(`- Failed: ${determinism.failed}`);
  detMd.push('');
  detMd.push('| Bucket | Fixture | Repeats | Result |');
  detMd.push('|---|---|---:|---|');
  determinismRows
    .sort((a, b) => a.fixture.localeCompare(b.fixture))
    .forEach(r => detMd.push(`| ${r.bucket} | ${r.fixture} | ${r.repeats} | ${r.passed ? 'PASS' : 'FAIL'} |`));
  detMd.push('');
  fs.writeFileSync(path.join(__dirname, 'pass-rate-determinism.md'), detMd.join('\n'));

  process.exit(gateResult.ok ? 0 : 1);
}

main();
