"""CityMind - Threshold Detection Engine."""

from typing import Dict, Any, Optional, Tuple
from city_mind.models.telemetry import SensorReading, DomainType
from city_mind.models.commit import TriggerType


DEFAULT_THRESHOLDS = {
    "traffic_speed_kmh": {"warning_below": 25.0, "critical_below": 12.0},
    "water_level_m": {"warning_above": 2.0, "critical_above": 2.8},
    "aqi": {"warning_above": 150.0, "critical_above": 220.0},
    "noise_db": {"warning_above": 75.0, "critical_above": 85.0},
    "power_grid_load_pct": {"warning_above": 85.0, "critical_above": 94.0},
    "waste_fill_pct": {"warning_above": 80.0, "critical_above": 95.0},
}


class ThresholdEngine:
    def __init__(self, thresholds: Optional[Dict[str, Any]] = None):
        self.thresholds = thresholds or DEFAULT_THRESHOLDS

    def evaluate(self, reading: SensorReading, previous_value: Optional[float]) -> Tuple[bool, Optional[TriggerType], str]:
        metric = reading.metric_name
        val = reading.value

        if metric not in self.thresholds:
            return False, None, ""

        rules = self.thresholds[metric]

        # Check critical / warning thresholds
        if "critical_above" in rules and val >= rules["critical_above"]:
            if previous_value is None or previous_value < rules["critical_above"]:
                return True, TriggerType.THRESHOLD_CROSSING, f"CRITICAL: {metric} ({val} {reading.unit}) breached upper threshold of {rules['critical_above']}"
        elif "warning_above" in rules and val >= rules["warning_above"]:
            if previous_value is None or previous_value < rules["warning_above"]:
                return True, TriggerType.THRESHOLD_CROSSING, f"WARNING: {metric} ({val} {reading.unit}) breached warning threshold of {rules['warning_above']}"
        elif "critical_below" in rules and val <= rules["critical_below"]:
            if previous_value is None or previous_value > rules["critical_below"]:
                return True, TriggerType.THRESHOLD_CROSSING, f"CRITICAL: {metric} ({val} {reading.unit}) dropped below critical threshold of {rules['critical_below']}"
        elif "warning_below" in rules and val <= rules["warning_below"]:
            if previous_value is None or previous_value > rules["warning_below"]:
                return True, TriggerType.THRESHOLD_CROSSING, f"WARNING: {metric} ({val} {reading.unit}) dropped below warning threshold of {rules['warning_below']}"

        # Anomaly detection (sudden large delta drop or spike)
        if previous_value is not None:
            delta = abs(val - previous_value)
            rel_delta = delta / max(1.0, abs(previous_value))
            if rel_delta > 0.35 and delta > 5.0:
                return True, TriggerType.ANOMALY_DETECTED, f"ANOMALY: Sudden shift in {metric} from {previous_value} to {val} (delta: {round(delta, 2)})"

        return False, None, ""


threshold_engine = ThresholdEngine()
