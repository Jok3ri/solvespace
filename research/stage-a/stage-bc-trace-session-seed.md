# Stage B/C Runtime Trace Session Seed

Generated from: `research/stage-a/stage-bc-trace-fixture-priority.json`

## Tier: p0_runtime_parity

_Minimum fixture set to capture first-pass SolveSpace runtime parity traces._

| Scenario ID | Fixture | Capability ID | Stage A Expected (check kinds) | Runtime Observed | Match? | Delta Type | Delta Details | Action |
|---|---|---|---|---|---|---|---|---|
| distance_basic_01 | core/distance_basic_01.json | constraint.distance_basic_01 | distance |  |  |  |  |  |
| coincident_basic_01 | core/coincident_basic_01.json | constraint.coincident_basic_01 | point_equal |  |  |  |  |  |
| trim_basic_01 | core/trim_basic_01.json | edit-op.trim_basic_01 | line_exists, line_removed |  |  |  |  |  |
| extend_oblique_01 | core/extend_oblique_01.json | edit-op.extend_oblique_01 | extend_line_end |  |  |  |  |  |
| fillet_oblique_01 | core/fillet_oblique_01.json | edit-op.fillet_oblique_01 | fillet_geometry |  |  |  |  |  |
| fillet_oblique_small_angle_01 | edge/fillet_oblique_small_angle_01.json | edit-op.fillet_oblique_small_angle_01 | deterministic_outcome |  |  |  |  |  |
| over_constrained_mixed_conflict_01 | edge/over_constrained_mixed_conflict_01.json | classification.over_constrained_mixed_conflict_01 | solver_classification |  |  |  |  |  |
| well_constrained_coincident_pair_01 | edge/well_constrained_coincident_pair_01.json | classification.well_constrained_coincident_pair_01 | solver_classification |  |  |  |  |  |
| offset_chain_round_policy_01 | edge/offset_chain_round_policy_01.json | offset.offset_chain_round_policy_01 | offset_chain_continuity, offset_chain_policy, deterministic_outcome |  |  |  |  |  |
| offset_chain_multisegment_zigzag_01 | edge/offset_chain_multisegment_zigzag_01.json | offset.offset_chain_multisegment_zigzag_01 | offset_chain_continuity, deterministic_outcome |  |  |  |  |  |
| topology_closed_loop_square_continuity_01 | edge/topology_closed_loop_square_continuity_01.json | topology.topology_closed_loop_square_continuity_01 | topology_chain_continuity, deterministic_outcome |  |  |  |  |  |
| topology_segment_count_guard_01 | edge/topology_segment_count_guard_01.json | topology.topology_segment_count_guard_01 | topology_chain_continuity, deterministic_outcome |  |  |  |  |  |
| near_singular_distance_01 | edge/near_singular_distance_01.json | numeric-stability.near_singular_distance_01 | distance |  |  |  |  |  |
