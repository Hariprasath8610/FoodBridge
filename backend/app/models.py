import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Donor(Base):
    __tablename__ = "donors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    donor_type = Column(String(100), nullable=False)  # Hotel, Wedding Hall, College Hostel, Restaurant, Caterer
    address = Column(String(300), nullable=False)
    latitude = Column(Float, default=12.9716)
    longitude = Column(Float, default=77.5946)
    contact_person = Column(String(100))
    contact_phone = Column(String(50))
    rating = Column(Float, default=4.8)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    predictions = relationship("Prediction", back_populates="donor")
    missions = relationship("RescueMission", back_populates="donor")
    waste_history = relationship("DonorWasteHistory", back_populates="donor")


class Recipient(Base):
    __tablename__ = "recipients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    recipient_type = Column(String(100), nullable=False)  # Community Kitchen, Homeless Shelter, Care Center, Orphanage
    address = Column(String(300), nullable=False)
    latitude = Column(Float, default=12.9780)
    longitude = Column(Float, default=77.6050)
    distance_km = Column(Float, default=1.8)  # Default/approx distance from center
    contact_person = Column(String(100))
    contact_phone = Column(String(50))
    capacity_people = Column(Integer, default=100)
    current_demand_meals = Column(Integer, default=70)
    dietary_preferences = Column(String(100), default="Vegetarian")  # Vegetarian, Any, Vegan
    storage_type = Column(String(100), default="Hot Holding + Refrigerated")
    verified = Column(Boolean, default=True)
    pickup_available = Column(Boolean, default=True)
    intake_window = Column(String(100), default="7:00 PM - 10:00 PM")
    status = Column(String(50), default="Active Dispatch")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    missions = relationship("RescueMission", back_populates="recipient")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("donors.id"), nullable=True)
    event_type = Column(String(100), nullable=False)  # Wedding Banquet, Corporate Gala, Hotel Buffet, College Hostel
    expected_guests = Column(Integer, nullable=False)
    planned_meals = Column(Integer, nullable=False)
    historical_attendance_rate = Column(Float, default=0.90)
    current_attendance = Column(Integer, default=0)
    food_category = Column(String(100), default="Vegetarian")
    weather = Column(String(100), default="Rain")  # Clear, Cloudy, Rain, Heavy Rain
    weather_risk_level = Column(String(50), default="High")
    serving_window = Column(String(100), default="7:30 PM (Dinner Shift)")
    dispatch_origin = Column(String(200), default="Grand Palace Pavilion")

    # AI outputs
    expected_intake_min = Column(Integer, default=0)
    expected_intake_max = Column(Integer, default=0)
    predicted_surplus_min = Column(Integer, default=0)
    predicted_surplus_max = Column(Integer, default=0)
    surplus_quantity = Column(Integer, default=0)  # midpoint
    surplus_percentage = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.84)
    risk_level = Column(String(50), default="HIGH")  # LOW, MEDIUM, HIGH, CRITICAL
    explainability = Column(JSON, default=dict)  # breakdown of weather, attendance, historical factors
    rescue_window_start = Column(String(50), default="7:45 PM")
    rescue_window_optimal = Column(String(50), default="8:30 PM")
    rescue_window_cutoff = Column(String(50), default="9:15 PM")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    donor = relationship("Donor", back_populates="predictions")
    missions = relationship("RescueMission", back_populates="prediction")
    feedback = relationship("PredictionFeedback", back_populates="prediction", uselist=False)


class RescueMission(Base):
    __tablename__ = "rescue_missions"

    id = Column(Integer, primary_key=True, index=True)
    mission_code = Column(String(50), unique=True, index=True)  # e.g. FB-2026-0042
    donor_id = Column(Integer, ForeignKey("donors.id"), nullable=True)
    recipient_id = Column(Integer, ForeignKey("recipients.id"), nullable=False)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=True)

    meals_quantity = Column(Integer, nullable=False)
    food_category = Column(String(100), default="Vegetarian")
    containment_type = Column(String(100), default="3 Cambro Units (Thermal Insulated)")
    distance_km = Column(Float, default=1.8)
    estimated_transit_minutes = Column(Integer, default=18)

    # Status timeline
    # CREATED -> FOOD_VERIFIED -> PICKUP_ASSIGNED -> PICKED_UP -> IN_TRANSIT -> DELIVERED
    status = Column(String(50), default="FOOD_VERIFIED")
    current_step = Column(Integer, default=4)  # 1..6

    # Human-in-the-loop Food Safety Verification
    food_verified = Column(Boolean, default=True)
    core_temp_celsius = Column(Float, default=68.0)
    food_safety_notes = Column(String(300), default="Core temp 68°C hold integrity verified. Packaging clean & sealed.")

    # Driver & Logistics
    assigned_driver = Column(String(100), default="Volunteer Elena R. (EV Van #12)")
    driver_phone = Column(String(50), default="+1 (555) 019-2834")
    coordinator_name = Column(String(100), default="Coordinator Marcus")
    coordinator_phone = Column(String(50), default="+1 (800) 555-FOOD")

    # Air-Gapped QR & Token Tracking
    pickup_token = Column(String(100), default="SEC-TOKEN: FB-2026-0042-Q7X9A")
    pickup_otp = Column(String(10), default="7492")
    delivery_token = Column(String(100), default="DELIV-TOKEN: FB-2026-0042-DLV1")
    delivery_otp = Column(String(10), default="8321")

    # Timestamps
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    food_verified_at = Column(DateTime, nullable=True)
    pickup_assigned_at = Column(DateTime, nullable=True)
    picked_up_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)

    donor = relationship("Donor", back_populates="missions")
    recipient = relationship("Recipient", back_populates="missions")
    prediction = relationship("Prediction", back_populates="missions")
    feedback = relationship("PredictionFeedback", back_populates="mission", uselist=False)


class PredictionFeedback(Base):
    __tablename__ = "prediction_feedback"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False)
    mission_id = Column(Integer, ForeignKey("rescue_missions.id"), nullable=True)
    predicted_surplus = Column(Integer, nullable=False)
    actual_surplus = Column(Integer, nullable=False)
    prediction_error = Column(Integer, nullable=False)
    error_percentage = Column(Float, nullable=False)
    notes = Column(String(300), default="Operational verification confirmed. Fed back into model weights.")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    prediction = relationship("Prediction", back_populates="feedback")
    mission = relationship("RescueMission", back_populates="feedback")


class DonorWasteHistory(Base):
    __tablename__ = "donor_waste_history"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("donors.id"), nullable=False)
    day_of_week = Column(String(20), nullable=False)  # Monday, Tuesday, etc.
    event_type = Column(String(100), default="Buffet")
    planned_meals = Column(Integer, default=300)
    consumed_meals = Column(Integer, default=275)
    surplus_meals = Column(Integer, default=25)
    date = Column(String(30))

    donor = relationship("Donor", back_populates="waste_history")
