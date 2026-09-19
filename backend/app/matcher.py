from typing import List, Dict, Any
from .models import Recipient
import math

def calculate_recipient_matches(
    recipients: List[Recipient],
    surplus_quantity: int,
    food_category: str = "Vegetarian",
    max_radius_km: float = 5.0
) -> List[Dict[str, Any]]:
    """
    Multi-criteria matching algorithm combining:
    - Quantity compatibility (30%)
    - Distance / Proximity efficiency (25%)
    - Time window / Urgency alignment (20%)
    - Food dietary safety match (15%)
    - Recipient verification & status (10%)
    """
    results = []

    for recipient in recipients:
        # Distance calculation
        dist = recipient.distance_km if recipient.distance_km is not None else 2.0
        if dist > max_radius_km:
            # Skip if beyond selected radius
            continue

        # 1. Quantity compatibility (0-100)
        # Perfect match if surplus covers 85% to 110% of current demand
        demand = recipient.current_demand_meals
        if demand > 0:
            coverage = min(1.0, surplus_quantity / demand)
            excess_penalty = max(0.0, (surplus_quantity - demand) / demand) * 0.5
            quantity_score = max(0.2, (coverage - excess_penalty)) * 100
        else:
            quantity_score = 50.0
        quantity_score = min(100.0, max(20.0, quantity_score))

        # 2. Distance efficiency (0-100)
        # Closer is higher: 1km -> ~98%, 2km -> ~92%, 4km -> ~75%, 5km -> ~60%
        distance_score = max(20.0, min(100.0, 100.0 - (dist * 7.5)))

        # 3. Time window / Urgency alignment (0-100)
        # If pickup is available and status is Active Dispatch -> 91-96%
        time_score = 95.0 if recipient.pickup_available else 65.0

        # 4. Food dietary safety match (0-100)
        if recipient.dietary_preferences.lower() in ["any", food_category.lower()]:
            dietary_score = 100.0
        elif "veg" in recipient.dietary_preferences.lower() and "veg" in food_category.lower():
            dietary_score = 100.0
        else:
            dietary_score = 40.0

        # 5. Verification status (0-100)
        verification_score = 100.0 if recipient.verified else 60.0

        # Weighted aggregate score
        total_score = (
            0.30 * quantity_score +
            0.25 * distance_score +
            0.20 * time_score +
            0.15 * dietary_score +
            0.10 * verification_score
        )

        match_score = int(round(total_score))

        # Badges
        badges = []
        if recipient.verified:
            badges.append("Verified NGO")
        if dietary_score == 100:
            badges.append(f"{food_category} requirement")
        if recipient.pickup_available:
            badges.append("Available for immediate pickup")

        coverage_pct = int(min(100, round((surplus_quantity / max(1, demand)) * 100)))

        # Estimated transit time
        transit_mins = max(4, int(round(dist * 4.2)))

        results.append({
            "recipient": recipient,
            "match_score": match_score,
            "is_recommended": False,  # will assign to highest rank
            "distance_km": round(dist, 1),
            "transit_mins": transit_mins,
            "coverage_percentage": coverage_pct,
            "compatibility": {
                "quantity_score": round(quantity_score, 1),
                "distance_score": round(distance_score, 1),
                "time_window_score": round(time_score, 1),
                "dietary_safety_score": round(dietary_score, 1),
                "verification_score": round(verification_score, 1),
            },
            "badges": badges
        })

    # Sort descending by match score
    results.sort(key=lambda x: x["match_score"], reverse=True)

    if results:
        results[0]["is_recommended"] = True

    return results
