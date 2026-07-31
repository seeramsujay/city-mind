"""CityMind - Baseline & Delta Logging Module."""

from typing import Dict, Any, List
from city_mind.models.commit import StateDiff


class DeltaLogger:
    def __init__(self):
        # Zone baselines
        self.zone_baselines: Dict[str, Dict[str, Any]] = {}

    def compute_diffs(self, zone_id: str, current_state: Dict[str, Any]) -> List[StateDiff]:
        if zone_id not in self.zone_baselines:
            self.zone_baselines[zone_id] = current_state.copy()
            return [
                StateDiff(
                    metric=key,
                    previous_value=None,
                    current_value=val,
                    delta=None
                )
                for key, val in current_state.items()
            ]

        baseline = self.zone_baselines[zone_id]
        diffs = []

        for key, curr_val in current_state.items():
            prev_val = baseline.get(key)
            if prev_val != curr_val:
                delta = None
                if isinstance(curr_val, (int, float)) and isinstance(prev_val, (int, float)):
                    delta = round(curr_val - prev_val, 2)
                
                diffs.append(
                    StateDiff(
                        metric=key,
                        previous_value=prev_val,
                        current_value=curr_val,
                        delta=delta
                    )
                )
                # Update baseline
                baseline[key] = curr_val

        return diffs


delta_logger = DeltaLogger()
