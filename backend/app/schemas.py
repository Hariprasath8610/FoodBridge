from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Donor Schemas
class DonorBase(BaseModel):
    name: str
    donor_type: str
    address: str
    latitude: Optional[float] = 12.9716
    longitude: Optional[float] = 77.5946
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    rating: Optional[float] = 4.8

class DonorCreate(DonorBase):
    pass

class DonorOut(DonorBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Recipient Schemas
class RecipientBase(BaseModel):
    name: str
    recipient_type: str
    address: str
    latitude: Optional[float] = 12.9780
    longitude: Optional[float] = 77.6050
    distance_km: Optional[float] = 1.8
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    capacity_people: int = 100
    current_demand_meals: int = 70
    dietary_preferences: str = "Vegetarian"
    storage_type: str = "Hot Holding + Refrigerated"
    verified: bool = True
    pickup_available: bool = True
    intake_window: str = "7:00 PM - 10:00 PM"
    status: str = "Active Dispatch"

class RecipientCreate(RecipientBase):
    pass

class RecipientOut(RecipientBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Prediction Schemas
class PredictionInput(BaseModel):
    donor_id: Optional[int] = None
    event_type: str = "Wedding Banquet"
    expected_guests: int = 500
    planned_meals: int = 500
    historical_attendance_rate: Optional[float] = 0.90
    current_attendance: Optional[int] = 430
    food_category: str = "Vegetarian"
    weather: str = "Heavy Rain"
    serving_window: str = "7:30 PM (Dinner Shift)"
    dispatch_origin: str = "Grand Palace Pavilion"

class ExplainabilityFactor(BaseModel):
    title: str
    impact: str
    description: str
    icon: str
    color: str

class PredictionOut(BaseModel):
    id: int
    donor_id: Optional[int]
    event_type: str
    expected_guests: int
    planned_meals: int
    historical_attendance_rate: float
    current_attendance: int
    food_category: str
    weather: str
    serving_window: str
    dispatch_origin: str

    expected_intake_min: int
    expected_intake_max: int
    predicted_surplus_min: int
    predicted_surplus_max: int
    surplus_quantity: int
    surplus_percentage: float
    confidence_score: float
    risk_level: str
    explainability: List[Dict[str, Any]]
    rescue_window_start: str
    rescue_window_optimal: str
    rescue_window_cutoff: str
    created_at: datetime

    class Config:
        from_attributes = True

# Matcher Schemas
class MatchCompatibility(BaseModel):
    quantity_score: float
    distance_score: float
    time_window_score: float
    dietary_safety_score: float
    verification_score: float

class MatchResult(BaseModel):
    recipient: RecipientOut
    match_score: int
    is_recommended: bool
    distance_km: float
    transit_mins: int
    coverage_percentage: int
    compatibility: MatchCompatibility
    badges: List[str]

# Rescue Mission Schemas
class RescueMissionCreate(BaseModel):
    prediction_id: Optional[int] = None
    donor_id: Optional[int] = None
    recipient_id: int
    meals_quantity: int
    food_category: str = "Vegetarian"
    containment_type: str = "3 Cambro Units (Thermal Insulated)"
    distance_km: Optional[float] = 1.8
    notes: Optional[str] = None

class FoodVerificationRequest(BaseModel):
    core_temp_celsius: float = 68.0
    verified: bool = True
    notes: Optional[str] = "Core temp 68°C hold integrity verified. Packaging clean & sealed."

class PickupVerificationRequest(BaseModel):
    token_or_otp: str

class DeliveryVerificationRequest(BaseModel):
    token_or_otp: str

class RescueMissionOut(BaseModel):
    id: int
    mission_code: str
    donor_id: Optional[int]
    recipient_id: int
    prediction_id: Optional[int]
    donor_name: Optional[str] = None
    recipient_name: Optional[str] = None

    meals_quantity: int
    food_category: str
    containment_type: str
    distance_km: float
    estimated_transit_minutes: int

    status: str
    current_step: int

    food_verified: bool
    core_temp_celsius: float
    food_safety_notes: Optional[str]

    assigned_driver: str
    driver_phone: str
    coordinator_name: str
    coordinator_phone: str

    pickup_token: str
    pickup_otp: str
    delivery_token: str
    delivery_otp: str

    created_at: datetime
    food_verified_at: Optional[datetime]
    pickup_assigned_at: Optional[datetime]
    picked_up_at: Optional[datetime]
    delivered_at: Optional[datetime]

    class Config:
        from_attributes = True

# Feedback Schemas
class PredictionFeedbackCreate(BaseModel):
    prediction_id: int
    mission_id: Optional[int] = None
    actual_surplus: int
    notes: Optional[str] = None

class PredictionFeedbackOut(BaseModel):
    id: int
    prediction_id: int
    mission_id: Optional[int]
    predicted_surplus: int
    actual_surplus: int
    prediction_error: int
    error_percentage: float
    notes: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# Dashboard & Impact Schemas
class DashboardStats(BaseModel):
    predicted_surplus_today: int
    food_rescued: int
    people_served: int
    waste_avoided_kg: float
    co2e_saved_tonnes: float
    water_saved_liters: float
    active_rescue_missions: int
    rescue_success_rate: float
    active_donors_count: int
    verified_recipients_count: int
    pipeline_capacity_percent: int

class DonorValueStats(BaseModel):
    donor_name: str
    total_food_rescued_meals: int
    estimated_food_value_preserved_inr: float
    waste_avoided_kg: float
    rescue_missions_count: int
    impact_credits: int
    recurring_pattern_summary: str
    ai_prevention_recommendation: str
