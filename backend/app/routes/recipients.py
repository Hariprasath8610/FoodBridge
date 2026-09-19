from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Recipient, Prediction
from ..schemas import RecipientOut, RecipientCreate, MatchResult
from ..matcher import calculate_recipient_matches

router = APIRouter(prefix="/api/recipients", tags=["recipients"])

@router.get("", response_model=List[RecipientOut])
def list_recipients(
    verified_only: bool = False,
    food_category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Recipient)
    if verified_only:
        query = query.filter(Recipient.verified == True)
    if food_category and food_category.lower() != "all":
        query = query.filter(
            (Recipient.dietary_preferences.ilike(f"%{food_category}%")) |
            (Recipient.dietary_preferences.ilike("%any%"))
        )
    return query.order_by(Recipient.distance_km.asc()).all()

@router.post("", response_model=RecipientOut)
def create_recipient(payload: RecipientCreate, db: Session = Depends(get_db)):
    rec = Recipient(**payload.model_dump())
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

@router.get("/matches/{prediction_id}", response_model=List[MatchResult])
def get_recipient_matches(
    prediction_id: int,
    max_radius_km: float = Query(default=5.0, ge=1.0, le=20.0),
    db: Session = Depends(get_db)
):
    prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    recipients = db.query(Recipient).all()
    if not recipients:
        return []

    surplus_qty = prediction.surplus_quantity or 70
    food_cat = prediction.food_category or "Vegetarian"

    matches = calculate_recipient_matches(
        recipients=recipients,
        surplus_quantity=surplus_qty,
        food_category=food_cat,
        max_radius_km=max_radius_km
    )

    return matches
