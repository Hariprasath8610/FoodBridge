import datetime
from sqlalchemy.orm import Session
from .models import Donor, Recipient, Prediction, RescueMission, PredictionFeedback, DonorWasteHistory

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Donor).count() > 0:
        return

    # 1. Donors
    donors = [
        Donor(
            name="Grand Palace Pavilion",
            donor_type="Wedding & Event Center",
            address="Sector 4, Downtown Metro Hub, Central Avenue",
            latitude=12.9716,
            longitude=77.5946,
            contact_person="Chef Marcus (Head of Banquets)",
            contact_phone="+1 (555) 234-5678",
            rating=4.9
        ),
        Donor(
            name="GreenLeaf Grand Hotel",
            donor_type="Luxury Hotel & Convention Center",
            address="88 Orchard Blvd, Tech Corridor",
            latitude=12.9750,
            longitude=77.5910,
            contact_person="F&B Director Rajiv",
            contact_phone="+1 (555) 345-6789",
            rating=4.8
        ),
        Donor(
            name="ABC College Hostel & Dining Hall",
            donor_type="Educational Institution",
            address="University Campus East, Block 3",
            latitude=12.9650,
            longitude=77.6000,
            contact_person="Mess Warden Suresh",
            contact_phone="+1 (555) 456-7890",
            rating=4.6
        ),
        Donor(
            name="City Catering Services",
            donor_type="Commercial Caterer",
            address="Industrial Estate Stage 2, North Hub",
            latitude=12.9820,
            longitude=77.5880,
            contact_person="Operations Manager Priya",
            contact_phone="+1 (555) 567-8901",
            rating=4.7
        )
    ]
    db.add_all(donors)
    db.commit()

    # 2. Verified Community Recipients
    recipients = [
        Recipient(
            name="Hope Community Kitchen",
            recipient_type="Community Kitchen",
            address="14 St. Jude Lane, East intake Ramp, Metro Ward 7",
            latitude=12.9780,
            longitude=77.6050,
            distance_km=1.8,
            contact_person="Sarah Jenkins (Intake Director)",
            contact_phone="+1 (555) 901-2345",
            capacity_people=120,
            current_demand_meals=70,
            dietary_preferences="Vegetarian",
            storage_type="Hot Holding + Refrigerated Cambros",
            verified=True,
            pickup_available=True,
            intake_window="7:00 PM - 10:00 PM",
            status="Active Dispatch"
        ),
        Recipient(
            name="St. Jude Care Center",
            recipient_type="Community Shelter",
            address="32 Horizon Road, West Wing, Sector 3",
            latitude=12.9690,
            longitude=77.5850,
            distance_km=2.4,
            contact_person="Brother Michael",
            contact_phone="+1 (555) 890-1234",
            capacity_people=80,
            current_demand_meals=45,
            dietary_preferences="Vegetarian",
            storage_type="Refrigerated Walk-in",
            verified=True,
            pickup_available=True,
            intake_window="6:30 PM - 9:30 PM",
            status="Active Dispatch"
        ),
        Recipient(
            name="CareBridge Community Shelter",
            recipient_type="Homeless Shelter",
            address="102 Pioneer Cross, Old Town Hub",
            latitude=12.9600,
            longitude=77.6100,
            distance_km=3.1,
            contact_person="David Miller",
            contact_phone="+1 (555) 789-0123",
            capacity_people=150,
            current_demand_meals=80,
            dietary_preferences="Any",
            storage_type="Deep Freezers & Hot Carts",
            verified=True,
            pickup_available=True,
            intake_window="7:00 PM - 11:00 PM",
            status="Active Dispatch"
        ),
        Recipient(
            name="Sunrise Children & Youth Home",
            recipient_type="Welfare Center",
            address="45 Meadow Lane, Green Park Area",
            latitude=12.9850,
            longitude=77.6120,
            distance_km=4.2,
            contact_person="Sister Clara",
            contact_phone="+1 (555) 678-9012",
            capacity_people=90,
            current_demand_meals=50,
            dietary_preferences="Vegetarian",
            storage_type="Cold Room",
            verified=True,
            pickup_available=False,
            intake_window="6:00 PM - 9:00 PM",
            status="Available"
        ),
        Recipient(
            name="Downtown Mission Kitchen",
            recipient_type="Soup Kitchen",
            address="78 Market Square, North Station",
            latitude=12.9890,
            longitude=77.5790,
            distance_km=3.8,
            contact_person="Pastor Thomas",
            contact_phone="+1 (555) 543-2109",
            capacity_people=110,
            current_demand_meals=60,
            dietary_preferences="Any",
            storage_type="Steam Tables & Chillers",
            verified=True,
            pickup_available=True,
            intake_window="7:30 PM - 10:30 PM",
            status="Active Dispatch"
        )
    ]
    db.add_all(recipients)
    db.commit()

    # 3. Seed Existing Prediction (Wedding Banquet Scenario)
    donor_palace = db.query(Donor).filter(Donor.name == "Grand Palace Pavilion").first()
    recipient_hope = db.query(Recipient).filter(Recipient.name == "Hope Community Kitchen").first()

    pred = Prediction(
        donor_id=donor_palace.id,
        event_type="Wedding Banquet",
        expected_guests=500,
        planned_meals=500,
        historical_attendance_rate=0.92,
        current_attendance=430,
        food_category="Vegetarian",
        weather="Heavy Rain",
        weather_risk_level="High",
        serving_window="7:30 PM (Dinner Shift)",
        dispatch_origin="Grand Palace Pavilion",
        expected_intake_min=425,
        expected_intake_max=440,
        predicted_surplus_min=60,
        predicted_surplus_max=75,
        surplus_quantity=70,
        surplus_percentage=14.0,
        confidence_score=0.84,
        risk_level="HIGH",
        explainability=[
            {
                "title": "Weather Impact",
                "impact": "-12% Arrival",
                "description": "Heavy downpour causes regional travel slowdowns; late arrivals typically forgo main buffet service.",
                "icon": "rainy",
                "color": "tertiary"
            },
            {
                "title": "Attendance Trajectory",
                "impact": "430 / 500 Guests",
                "description": "Check-in velocity flattened at 7:15 PM, projecting a final attendance ceiling well below planned meals.",
                "icon": "group_remove",
                "color": "secondary"
            },
            {
                "title": "Historical Pattern",
                "impact": "86% Consumption",
                "description": "Similar downtown banquets averaged 0.86 portions per checked-in guest with comparable multi-course vegetarian menus.",
                "icon": "history_edu",
                "color": "primary"
            }
        ],
        rescue_window_start="7:45 PM",
        rescue_window_optimal="8:30 PM",
        rescue_window_cutoff="9:15 PM"
    )
    db.add(pred)
    db.commit()

    # 4. Seed Active Rescue Mission #FB-2026-0042
    mission = RescueMission(
        mission_code="FB-2026-0042",
        donor_id=donor_palace.id,
        recipient_id=recipient_hope.id,
        prediction_id=pred.id,
        meals_quantity=70,
        food_category="Vegetarian",
        containment_type="3 Cambro Units (Thermal Insulated)",
        distance_km=1.8,
        estimated_transit_minutes=18,
        status="PICKUP_ASSIGNED",
        current_step=4,
        food_verified=True,
        core_temp_celsius=68.0,
        food_safety_notes="Core temp 68°C hold integrity verified. Packaging clean & sealed.",
        assigned_driver="Volunteer Elena R. (EV Van #12)",
        driver_phone="+1 (555) 019-2834",
        coordinator_name="Coordinator Marcus",
        coordinator_phone="+1 (800) 555-FOOD",
        pickup_token="SEC-TOKEN: FB-2026-0042-Q7X9A",
        pickup_otp="7492",
        delivery_token="DELIV-TOKEN: FB-2026-0042-DLV1",
        delivery_otp="8321",
        food_verified_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=25),
        pickup_assigned_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=15)
    )
    db.add(mission)
    db.commit()

    # 5. Seed Historical Waste Pattern for Grand Palace Pavilion (Hotel/Restaurant Recurring Waste)
    waste_records = [
        DonorWasteHistory(donor_id=donor_palace.id, day_of_week="Monday", event_type="Corporate Dinner", planned_meals=250, consumed_meals=232, surplus_meals=18, date="2026-09-14"),
        DonorWasteHistory(donor_id=donor_palace.id, day_of_week="Tuesday", event_type="Executive Luncheon", planned_meals=200, consumed_meals=188, surplus_meals=12, date="2026-09-15"),
        DonorWasteHistory(donor_id=donor_palace.id, day_of_week="Wednesday", event_type="Midweek Reception", planned_meals=320, consumed_meals=295, surplus_meals=25, date="2026-09-16"),
        DonorWasteHistory(donor_id=donor_palace.id, day_of_week="Thursday", event_type="Seminar Banquet", planned_meals=180, consumed_meals=170, surplus_meals=10, date="2026-09-17"),
        DonorWasteHistory(donor_id=donor_palace.id, day_of_week="Friday", event_type="Weekend Kickoff Banquet", planned_meals=400, consumed_meals=369, surplus_meals=31, date="2026-09-18"),
    ]
    db.add_all(waste_records)
    db.commit()

    # 6. Seed Past Closed-Loop Feedback Records
    past_feedbacks = [
        PredictionFeedback(
            prediction_id=pred.id,
            mission_id=mission.id,
            predicted_surplus=75,
            actual_surplus=78,
            prediction_error=3,
            error_percentage=4.0,
            notes="Grand Regency Banquet: 78 hot meals verified. Model calibrated successfully."
        )
    ]
    db.add_all(past_feedbacks)
    db.commit()
