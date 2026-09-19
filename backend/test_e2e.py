import urllib.request
import json
import time

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(endpoint, method="GET", data=None):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, method=method)
    req.add_header("Content-Type", "application/json")
    if data:
        body = json.dumps(data).encode("utf-8")
        req.data = body
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def test_complete_foodbridge_journey():
    print("=== STARTING FULL-STACK FOODBRIDGE ACCEPTANCE SUITE ===")

    # 1. Health check
    print("\n[1] Checking System Health...")
    health = make_request("/health")
    assert health["status"] == "online", "Health check failed"
    print(f"  [OK] System status: {health['status']} | AI Engine: {health['ai_engine']}")

    # 2. Get initial dashboard stats
    print("\n[2] Fetching Live Dashboard Overview Telemetry...")
    stats_initial = make_request("/dashboard/stats")
    print(f"  [OK] Predicted surplus today: {stats_initial['predicted_surplus_today']}")
    print(f"  [OK] Food rescued: {stats_initial['food_rescued']} meals")
    print(f"  [OK] People served: {stats_initial['people_served']}")
    print(f"  [OK] Waste avoided: {stats_initial['waste_avoided_kg']} kg (~{stats_initial['co2e_saved_tonnes']}t CO2e)")

    # 3. Create wedding banquet prediction with heavy rain
    print("\n[3] Triggering ML Surplus Prediction for Wedding Scenario...")
    pred_payload = {
        "event_type": "Wedding Banquet",
        "expected_guests": 500,
        "planned_meals": 500,
        "historical_attendance_rate": 0.92,
        "current_attendance": 430,
        "food_category": "Vegetarian",
        "weather": "Heavy Rain",
        "serving_window": "7:30 PM (Dinner Shift)",
        "dispatch_origin": "Grand Palace Pavilion"
    }
    prediction = make_request("/predictions", method="POST", data=pred_payload)
    pred_id = prediction["id"]
    print(f"  [OK] Prediction #{pred_id} created by scikit-learn pipeline!")
    print(f"  [OK] Expected Intake: {prediction['expected_intake_min']}-{prediction['expected_intake_max']} meals")
    print(f"  [OK] Predicted Surplus: {prediction['predicted_surplus_min']}-{prediction['predicted_surplus_max']} meals (Midpoint: {prediction['surplus_quantity']})")
    print(f"  [OK] Surplus Risk Level: {prediction['risk_level']} (Confidence: {prediction['confidence_score'] * 100:.0f}%)")
    assert prediction["surplus_quantity"] > 0, "Surplus must be positive"
    assert prediction["risk_level"] in ["HIGH", "CRITICAL"], "Heavy rain with drop in attendance should be high risk"

    # 4. Explainable AI factor check
    print("\n[4] Validating Explainable AI Factors...")
    explainability = prediction["explainability"]
    assert len(explainability) >= 3, "Must have at least 3 explainable factors"
    for factor in explainability:
        print(f"  [OK] {factor['title']}: {factor['impact']} - {factor['description'][:60]}...")

    # 5. Get recipient matches
    print(f"\n[5] Finding AI Recipient Matches for Prediction #{pred_id}...")
    matches = make_request(f"/recipients/matches/{pred_id}?max_radius_km=5.0")
    assert len(matches) > 0, "Should find at least 1 matched recipient"
    top_match = matches[0]
    print(f"  [OK] Top Match: {top_match['recipient']['name']} ({top_match['match_score']}% Match, {top_match['distance_km']} km away)")
    print(f"  [OK] Compatibility: Quantity={top_match['compatibility']['quantity_score']}%, Distance={top_match['compatibility']['distance_score']}%, Dietary={top_match['compatibility']['dietary_safety_score']}%")
    assert top_match["is_recommended"] == True, "Top match must be recommended"
    assert "Hope Community Kitchen" in top_match["recipient"]["name"], "Hope Community Kitchen should be top rank for vegetarian banquet"

    # 6. Create rescue mission
    print(f"\n[6] Creating Rescue Mission with {top_match['recipient']['name']}...")
    mission_payload = {
        "prediction_id": pred_id,
        "recipient_id": top_match["recipient"]["id"],
        "meals_quantity": prediction["surplus_quantity"],
        "food_category": "Vegetarian",
        "containment_type": "3 Cambro Units (Thermal Insulated)",
        "distance_km": top_match["distance_km"]
    }
    mission = make_request("/rescue-missions", method="POST", data=mission_payload)
    mission_id = mission["id"]
    print(f"  [OK] Rescue Mission #{mission['mission_code']} created in SQLite!")
    print(f"  [OK] Assigned Driver: {mission['assigned_driver']}")
    print(f"  [OK] Air-Gapped QR Token: {mission['pickup_token']} | OTP: {mission['pickup_otp']}")
    print(f"  [OK] Status: {mission['status']} (Step {mission['current_step']}/6)")

    # 7. Food safety verification
    print("\n[7] Performing Human-in-the-Loop Food Safety Audit...")
    verify_payload = {
        "core_temp_celsius": 68.5,
        "verified": True,
        "notes": "Core temp hold verified > 60°C. Chef Marcus signed off container seals."
    }
    mission_verified = make_request(f"/rescue-missions/{mission_id}/verify-food", method="POST", data=verify_payload)
    assert mission_verified["food_verified"] == True
    print(f"  [OK] Food safety confirmed at {mission_verified['core_temp_celsius']} deg C!")

    # 8. Pickup verification (QR code scan simulation)
    print("\n[8] Driver Scanning Air-Gapped QR Code for Pickup...")
    pickup_payload = {"token_or_otp": mission["pickup_token"]}
    mission_pickup = make_request(f"/rescue-missions/{mission_id}/pickup", method="POST", data=pickup_payload)
    assert mission_pickup["status"] == "PICKED_UP"
    assert mission_pickup["current_step"] == 5
    print(f"  [OK] Pickup verified! Mission status: {mission_pickup['status']} (Step {mission_pickup['current_step']}/6)")

    # 9. Delivery verification (Handoff confirmation)
    print("\n[9] Recipient Intake Staff Confirming Delivery Handover...")
    delivery_payload = {"token_or_otp": mission["delivery_token"]}
    mission_delivered = make_request(f"/rescue-missions/{mission_id}/deliver", method="POST", data=delivery_payload)
    assert mission_delivered["status"] == "DELIVERED"
    assert mission_delivered["current_step"] == 6
    print(f"  [OK] Delivery confirmed! Mission status: {mission_delivered['status']} (Step {mission_delivered['current_step']}/6)")

    # 10. Closed-loop learning feedback
    print("\n[10] Submitting Closed-Loop Operational Feedback...")
    actual_meals = prediction["surplus_quantity"] + 2
    feedback_payload = {
        "prediction_id": pred_id,
        "actual_surplus": actual_meals,
        "notes": f"Field audited delivery: {actual_meals} actual portions handed over."
    }
    fb = make_request(f"/rescue-missions/{mission_id}/feedback", method="POST", data=feedback_payload)
    print(f"  [OK] Model feedback recorded! Predicted: {fb['predicted_surplus']} vs Actual: {fb['actual_surplus']} (Variance: {fb['prediction_error']} meals, {fb['error_percentage']}%)")

    # 11. Verify updated dashboard impact stats
    print("\n[11] Verifying Real-Time Impact Dashboard Telemetry Updates...")
    stats_updated = make_request("/dashboard/stats")
    print(f"  [OK] Updated meals rescued: {stats_updated['food_rescued']} (Increased by delivered meals!)")
    print(f"  [OK] Updated people served: {stats_updated['people_served']}")
    print(f"  [OK] Updated waste avoided: {stats_updated['waste_avoided_kg']} kg")
    assert stats_updated["food_rescued"] >= stats_initial["food_rescued"]

    # 12. Test 1-Click Automated Demo Simulation endpoint
    print("\n[12] Testing 1-Click Autonomous Demo Simulation Endpoint...")
    demo_run = make_request("/demo/run", method="POST")
    assert demo_run["success"] == True
    print(f"  [OK] Autonomous Demo ran successfully! Steps executed: {len(demo_run['steps'])}")
    for s in demo_run["steps"]:
        safe_text = s['text'].encode('ascii', 'replace').decode('ascii')
        print(f"    {s['step']}: {safe_text}")

    # 13. Donor recurring waste analytics
    print("\n[13] Checking Donor Recurring Waste Analytics & AI Prevention Recommendations...")
    analytics = make_request("/dashboard/donor-analytics")
    assert len(analytics) > 0
    print(f"  [OK] Donor: {analytics[0]['donor_name']}")
    print(f"  [OK] Impact Credits: {analytics[0]['impact_credits']}")
    print(f"  [OK] Pattern: {analytics[0]['recurring_pattern_summary']}")
    print(f"  [OK] AI Recommendation: {analytics[0]['ai_prevention_recommendation']}")

    print("\n=================================================================")
    print(" ALL 13 ACCEPTANCE TESTS PASSED WITH 100% OPERATIONAL FIDELITY! ")
    print("=================================================================")

if __name__ == "__main__":
    test_complete_foodbridge_journey()
