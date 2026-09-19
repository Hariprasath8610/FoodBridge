from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Prediction, Donor
from ..schemas import PredictionInput, PredictionOut
from ..ml_model import ml_service

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

@router.post("", response_model=PredictionOut)
def create_prediction(payload: PredictionInput, db: Session = Depends(get_db)):
    # Run prediction via real scikit-learn ML pipeline
    pred_results = ml_service.predict(payload.model_dump())

    # Find or default donor
    donor_id = payload.donor_id
    if not donor_id:
        donor = db.query(Donor).filter(Donor.name.ilike(f"%{payload.dispatch_origin.split()[0]}%")).first()
        if not donor:
            donor = db.query(Donor).first()
        if donor:
            donor_id = donor.id

    prediction = Prediction(
        donor_id=donor_id,
        event_type=payload.event_type,
        expected_guests=payload.expected_guests,
        planned_meals=payload.planned_meals,
        historical_attendance_rate=payload.historical_attendance_rate or 0.90,
        current_attendance=pred_results["current_attendance"],
        food_category=payload.food_category,
        weather=payload.weather,
        weather_risk_level=pred_results["risk_level"],
        serving_window=payload.serving_window,
        dispatch_origin=payload.dispatch_origin,
        expected_intake_min=pred_results["expected_intake_min"],
        expected_intake_max=pred_results["expected_intake_max"],
        predicted_surplus_min=pred_results["predicted_surplus_min"],
        predicted_surplus_max=pred_results["predicted_surplus_max"],
        surplus_quantity=pred_results["surplus_quantity"],
        surplus_percentage=pred_results["surplus_percentage"],
        confidence_score=pred_results["confidence_score"],
        risk_level=pred_results["risk_level"],
        explainability=pred_results["explainability"],
        rescue_window_start="7:45 PM",
        rescue_window_optimal="8:30 PM",
        rescue_window_cutoff="9:15 PM"
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction

@router.get("", response_model=List[PredictionOut])
def list_predictions(limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Prediction).order_by(Prediction.created_at.desc()).limit(limit).all()

@router.get("/{id}", response_model=PredictionOut)
def get_prediction(id: int, db: Session = Depends(get_db)):
    pred = db.query(Prediction).filter(Prediction.id == id).first()
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return pred
