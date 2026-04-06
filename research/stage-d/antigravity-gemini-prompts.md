# Stage D Full-Scope Prompt Pack for Google Antigravity (Gemini)

This prompt pack is for a **full SolveSpace parity program**, not a lightweight smoke test.
Use the prompts in order and paste Gemini outputs back here.

---

## Prompt 1 — Program charter and non-negotiable scope

```text
You are the execution copilot for a full SolveSpace parity program.

Objective:
Define and execute evidence needed to reproduce SolveSpace-grade behavior in a browser TypeScript implementation for cnc-cam workflows.

Non-negotiable scope:
1) Geometric entities and parameterization behavior
2) Constraint solving behavior and conflict handling
3) Sketch edit operations (trim/extend/chamfer/fillet/split/merge style operations)
4) Topology and intersection robustness on edge cases
5) Determinism across repeated runs
6) Performance under realistic workloads
7) Stability for sustained sessions
8) Migration/readability of outputs into repository decision artifacts

Rules:
- Do not invent metrics.
- Output machine-readable JSON before any narrative.
- Include explicit assumptions and unknowns.
- If data is unavailable, mark it null and explain why.

Now restate this charter as a JSON object `program_charter`.
```

## Prompt 2 — Capability parity matrix (SolveSpace-equivalent scope)

```text
Build a full capability matrix in JSON named `capability_matrix`.

Schema:
{
  "runId": "",
  "capabilities": [
    {
      "capabilityId": "",
      "category": "entities|constraints|edit_ops|intersections|topology|io|solver_behavior|ui_critical_workflows",
      "description": "",
      "mustHave": true,
      "testScenarios": [""],
      "acceptanceCriteria": [""],
      "status": "not-tested"
    }
  ]
}

Requirements:
- Cover full scope required for SolveSpace-equivalent behavior, not a subset.
- Include explicit must-have items for cnc-cam relevant workflows.
- Include pass/fail criteria that are measurable.

Return ONLY pretty JSON.
```

## Prompt 3 — Environment and reproducibility envelope

```text
Create JSON object `reproducibility_envelope` with:
- runId
- platformName
- osVersion
- browserName
- browserVersion
- cpuInfo
- memoryInfo
- powerMode
- displayRefreshHz
- thermalNotes
- tracingSupport
- knownLimitations

Then create JSON object `run_controls` with:
- warmupPolicy
- iterationPolicy
- retryPolicy
- timeoutPolicy
- randomSeedPolicy
- artifactNamingConvention

Return both JSON objects only.
```

## Prompt 4 — Determinism and solver-consistency campaign

```text
Execute a determinism and solver-consistency campaign for all must-have capabilities.

Requirements:
- Minimum 20 repeats per deterministic scenario.
- Include under-constrained, over-constrained, and conflicting constraint cases.
- Capture solver convergence outcomes and conflict diagnostics.
- Report structural diffs and numeric deltas.

Output JSON `determinism_solver_report` schema:
{
  "runId": "",
  "browserName": "",
  "browserVersion": "",
  "scenarios": [
    {
      "scenarioId": "",
      "capabilityId": "",
      "repeats": 20,
      "deterministic": true,
      "convergenceClass": "converged|conflict|diverged|timeout",
      "maxNumericDelta": 0,
      "mismatchCount": 0,
      "diagnostics": ""
    }
  ],
  "overallPass": true
}

Then provide max 12 markdown bullets summarizing highest risk findings.
```

## Prompt 5 — Performance and scalability campaign

```text
Execute performance/scalability testing for must-have capabilities.

Requirements:
- Warmup excluded from measured metrics.
- At least 50 measured iterations per micro-scenario.
- Include representative larger sketches/operation chains.
- Report p50, p95, p99, mean, stddev, and worst-case latency.
- Identify jitter clusters and probable root causes.

Output JSON `performance_scalability_report` schema:
{
  "runId": "",
  "browserName": "",
  "browserVersion": "",
  "workloads": [
    {
      "workloadId": "",
      "capabilityId": "",
      "iterations": 50,
      "p50_ms": 0,
      "p95_ms": 0,
      "p99_ms": 0,
      "mean_ms": 0,
      "stddev_ms": 0,
      "worst_ms": 0,
      "jitterClusterCount": 0,
      "notes": ""
    }
  ],
  "overallAssessment": "good|watch|bad"
}

Then provide max 12 markdown bullets of performance risks.
```

## Prompt 6 — Stability, memory, and long-session reliability

```text
Execute a long-session reliability run covering realistic operation sequences.

Requirements:
- Minimum 30-minute soak.
- Minute-level checkpoints.
- Include repeated edit-op chains and constraint updates.
- Record memory trend, stalls, resets, and recoveries.

Output JSON `reliability_report` schema:
{
  "runId": "",
  "browserName": "",
  "browserVersion": "",
  "durationMinutes": 30,
  "checkpoints": [
    {
      "minute": 1,
      "status": "ok|degraded|stalled|recovered|failed",
      "memoryEstimate": "",
      "latencyDriftNote": "",
      "notes": ""
    }
  ],
  "incidents": [
    {
      "minute": 0,
      "severity": "low|medium|high|critical",
      "type": "crash|hang|timeout|numeric-instability|other",
      "description": "",
      "recovered": true
    }
  ],
  "overallPass": true
}

Then provide max 12 markdown bullets with reliability conclusions.
```

## Prompt 7 — Parity decision package for repository docs

```text
Create two JSON objects:

1) `parity_decision_inputs`:
- runId
- determinismPass
- solverConsistencyPass
- performanceAssessment
- reliabilityPass
- unresolvedMustHaveCount
- topRisks (string array)
- recommendedDecision ("go"|"conditional-go"|"no-go")
- requiredMitigations (string array)

2) `stage_d_raw_results` with top-level keys:
- program_charter
- capability_matrix
- reproducibility_envelope
- run_controls
- determinism_solver_report
- performance_scalability_report
- reliability_report
- parity_decision_inputs
- generatedAt

Return JSON only.
```

## Prompt 8 — Paste-back bundle format (strict)

```text
Reformat all final outputs into one paste-ready response with exact section headers:

PROGRAM_CHARTER_JSON
CAPABILITY_MATRIX_JSON
REPRODUCIBILITY_ENVELOPE_JSON
RUN_CONTROLS_JSON
DETERMINISM_SOLVER_REPORT_JSON
PERFORMANCE_SCALABILITY_REPORT_JSON
RELIABILITY_REPORT_JSON
PARITY_DECISION_INPUTS_JSON
STAGE_D_RAW_RESULTS_JSON

After JSON sections, add:
MARKDOWN_TABLES_FOR_REPO

Table requirements:
- One table for browser-feasibility-matrix.md
- One table for perf-benchmark-results.md
- Include runId, browserVersion, must-have coverage, determinism/solver/perf/reliability status, and final decision

Do not add extra commentary.
```
