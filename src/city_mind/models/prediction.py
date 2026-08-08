"""CityMind - Predictive Intelligence Data Models."""

from datetime import datetime, timezone
from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class ForecastHorizon(str, Enum):
    ONE_HOUR = "1h"
    FOUR_HOURS = "4h"
    TWELVE_HOURS = "12h"
    TWENTY_FOUR_HOURS = "24h"


class PredictiveAlert(BaseModel):
    alert_id: str
    target_system: str
    location_zone: str
    risk_level: str
    probability: float = Field(ge=0.0, le=1.0)
    estimated_timeframe: str
    details: str
    lat: float
    lng: float
    recommended_mitigation: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TimeSeriesForecastPoint(BaseModel):
    timestamp: datetime
    predicted_value: float
    lower_bound: float
    upper_bound: float


class DomainForecast(BaseModel):
    domain: str
    zone_id: str
    horizon: ForecastHorizon
    metric_name: str
    forecast_points: List[TimeSeriesForecastPoint]
    risk_assessment: str
    confidence: float
