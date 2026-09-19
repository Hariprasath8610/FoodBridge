import datetime
import random
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Donor, Recipient, Prediction, RescueMission, PredictionFeedback
from ..ml_model import ml_service
from ..matcher import calculate_recipient_matches

router = APIRouter(prefix="/api/demo", tags=["demo"])

@router.post("/run")
def run_autonomous_demo(db: Session = Depends(get_db)):
    """
    Executes the complete Wedding Banquet Heavy Rain scenario end-to-end
    through actual database models and real ML predictions.
    """
    steps = []

    # Step 1: Ingest Wedding Banquet Specs
    donor = db.query(Donor).filter(Donor.name == "Grand Palace Pavilion").first()
    if not donor:
        donor = db.query(Donor).first()

    steps.append({
        "step": "Step 1/5",
        "title": "Ingesting Event Telemetry",
        "text": f"> Ingested Wedding Banquet: 500 Guests, 500 Planned Meals @ {donor.name}."
    })

    # Step 2: Weather and ML Prediction
    pred_inputs = {
        "event_type": "Wedding Banquet",
        "expected_guests": 500,
        "planned_meals": 500,
        "historical_attendance_rate": 0.92,
        "current_attendance": 430,
        "food_category": "Vegetarian",
        "weather": "Heavy Rain",
        "day_of_week": "Friday"
    }
    ml_output = ml_service.predict(pred_inputs)

    prediction = Prediction(
        donor_id=donor.id if donor else None,
        event_type="Wedding Banquet",
        expected_guests=500,
        planned_meals=500,
        historical_attendance_rate=0.92,
        current_attendance=430,
        food_category="Vegetarian",
        weather="Heavy Rain",
        weather_risk_level="High",
        serving_window="7:30 PM (Dinner Shift)",
        dispatch_origin=donor.name if donor else "Grand Palace Pavilion",
        expected_intake_min=ml_output["expected_intake_min"],
        expected_intake_max=ml_output["expected_intake_max"],
        predicted_surplus_min=ml_output["predicted_surplus_min"],
        predicted_surplus_max=ml_output["predicted_surplus_max"],
        surplus_quantity=ml_output["surplus_quantity"],
        surplus_percentage=ml_output["surplus_percentage"],
        confidence_score=ml_output["confidence_score"],
        risk_level=ml_output["risk_level"],
        explainability=ml_output["explainability"],
        rescue_window_start="7:45 PM",
        rescue_window_optimal="8:30 PM",
        rescue_window_cutoff="9:15 PM"
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    steps.append({
        "step": "Step 2/5",
        "title": "Weather & AI Prediction",
        "text": f"> Weather: Heavy Rain (-14% arrival). AI predicts surplus: ~{ml_output['predicted_surplus_min']}–{ml_output['predicted_surplus_max']} hot meals ({ml_output['risk_level']} RISK)."
    })

    # Step 3: Recipient Matching
    recipients = db.query(Recipient).all()
    matches = calculate_recipient_matches(recipients, ml_output["surplus_quantity"], "Vegetarian", max_radius_km=5.0)
    top_match = matches[0] if matches else None

    if top_match:
        rec_name = top_match["recipient"].name
        match_score = top_match["match_score"]
        dist = top_match["distance_km"]
    else:
        rec_name = "Hope Community Kitchen"
        match_score = 94
        dist = 1.8

    steps.append({
        "step": "Step 3/5",
        "title": "Algorithmic Recipient Matching",
        "text": f"> Matched with {rec_name} ({match_score}% Fit, {dist} km away, dock intake ready)."
    })

    # Step 4: Create Rescue Mission & QR Handshake
    recipient_obj = db.query(Recipient).filter(Recipient.name == rec_name).first() or db.query(Recipient).first()

    mission = RescueMission(
        mission_code=f"FB-2026-{random.randint(100, 999)}",
        donor_id=donor.id if donor else None,
        recipient_id=recipient_obj.id,
        prediction_id=prediction.id,
        meals_quantity=ml_output["surplus_quantity"],
        food_category="Vegetarian",
        containment_type="3 Cambro Units (Thermal Insulated)",
        distance_km=dist,
        estimated_transit_minutes=18,
        status="DELIVERED",
        current_step=6,
        food_verified=True,
        core_temp_celsius=68.0,
        food_safety_notes="Core temp 68°C hold integrity verified. Food safety validated.",
        assigned_driver="Volunteer Elena R. (EV Van #12)",
        driver_phone="+1 (555) 019-2834",
        coordinator_name="Coordinator Marcus",
        coordinator_phone="+1 (800) 555-FOOD",
        pickup_token="SEC-TOKEN: FB-DEMO-VERIFIED",
        pickup_otp="7492",
        delivery_token="DELIV-TOKEN: FB-DEMO-DELIV",
        delivery_otp="8321",
        food_verified_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=20),
        pickup_assigned_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=15),
        picked_up_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=8),
        delivered_at=datetime.datetime.utcnow()
    )
    db.add(mission)
    db.commit()
    db.refresh(mission)

    steps.append({
        "step": "Step 4/5",
        "title": "Dispatch & Cryptographic Verification",
        "text": f"> Mission #{mission.mission_code} created. Core temp 68°C verified. Air-gapped QR token: SEC-TOKEN: FB-DEMO-VERIFIED."
    })

    # Step 5: Closed-Loop Learning & Impact
    actual_meals = ml_output["surplus_quantity"] + random.choice([0, 2, -1])
    err = abs(actual_meals - ml_output["surplus_quantity"])
    err_pct = round((err / max(1, ml_output["surplus_quantity"])) * 100, 1)

    fb = PredictionFeedback(
        prediction_id=prediction.id,
        mission_id=mission.id,
        predicted_surplus=ml_output["surplus_quantity"],
        actual_surplus=actual_meals,
        prediction_error=err,
        error_percentage=err_pct,
        notes="Automated demo scenario completed. Feedback recorded for model recalibration."
    )
    db.add(fb)
    db.commit()

    steps.append({
        "step": "Step 5/5",
        "title": "Closed-Loop Feedback Stored",
        "text": f"> Handoff completed. Actual: {actual_meals} meals. Model feedback recorded (error: {err_pct}%). Dashboard updated!"
    })

    return {
        "success": True,
        "mission_code": mission.mission_code,
        "prediction_id": prediction.id,
        "surplus_meals": ml_output["surplus_quantity"],
        "recipient": rec_name,
        "steps": steps
    }
