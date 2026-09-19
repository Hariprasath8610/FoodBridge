const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface DashboardStats {
  predicted_surplus_today: number;
  food_rescued: number;
  people_served: number;
  waste_avoided_kg: number;
  co2e_saved_tonnes: number;
  water_saved_liters: number;
  active_rescue_missions: number;
  rescue_success_rate: number;
  active_donors_count: number;
  verified_recipients_count: number;
  pipeline_capacity_percent: number;
}

export interface ExplainabilityFactor {
  title: string;
  impact: string;
  description: string;
  icon: string;
  color: string;
}

export interface Prediction {
  id: number;
  donor_id?: number;
  event_type: string;
  expected_guests: number;
  planned_meals: number;
  historical_attendance_rate: number;
  current_attendance: number;
  food_category: string;
  weather: string;
  serving_window: string;
  dispatch_origin: string;
  expected_intake_min: number;
  expected_intake_max: number;
  predicted_surplus_min: number;
  predicted_surplus_max: number;
  surplus_quantity: number;
  surplus_percentage: number;
  confidence_score: number;
  risk_level: string;
  explainability: ExplainabilityFactor[];
  rescue_window_start: string;
  rescue_window_optimal: string;
  rescue_window_cutoff: string;
  created_at: string;
}

export interface Recipient {
  id: number;
  name: string;
  recipient_type: string;
  address: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  contact_person?: string;
  contact_phone?: string;
  capacity_people: number;
  current_demand_meals: number;
  dietary_preferences: string;
  storage_type: string;
  verified: boolean;
  pickup_available: boolean;
  intake_window: string;
  status: string;
}

export interface MatchCompatibility {
  quantity_score: number;
  distance_score: number;
  time_window_score: number;
  dietary_safety_score: number;
  verification_score: number;
}

export interface MatchResult {
  recipient: Recipient;
  match_score: number;
  is_recommended: boolean;
  distance_km: number;
  transit_mins: number;
  coverage_percentage: number;
  compatibility: MatchCompatibility;
  badges: string[];
}

export interface RescueMission {
  id: number;
  mission_code: string;
  donor_id?: number;
  recipient_id: number;
  prediction_id?: number;
  donor_name?: string;
  recipient_name?: string;
  meals_quantity: number;
  food_category: string;
  containment_type: string;
  distance_km: number;
  estimated_transit_minutes: number;
  status: string;
  current_step: number;
  food_verified: boolean;
  core_temp_celsius: number;
  food_safety_notes?: string;
  assigned_driver: string;
  driver_phone: string;
  coordinator_name: string;
  coordinator_phone: string;
  pickup_token: string;
  pickup_otp: string;
  delivery_token: string;
  delivery_otp: string;
  created_at: string;
  food_verified_at?: string;
  pickup_assigned_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
}

export interface PredictionFeedback {
  id: number;
  prediction_id: number;
  mission_id?: number;
  predicted_surplus: number;
  actual_surplus: number;
  prediction_error: number;
  error_percentage: number;
  notes?: string;
  created_at: string;
}

export interface DonorValueStats {
  donor_name: string;
  total_food_rescued_meals: number;
  estimated_food_value_preserved_inr: number;
  waste_avoided_kg: number;
  rescue_missions_count: number;
  impact_credits: number;
  recurring_pattern_summary: string;
  ai_prevention_recommendation: string;
}

// API functions
export const api = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  getImpact: async () => {
    const res = await fetch(`${API_BASE}/dashboard/impact`);
    if (!res.ok) throw new Error('Failed to fetch impact');
    return res.json();
  },

  getFeedbacks: async (): Promise<PredictionFeedback[]> => {
    const res = await fetch(`${API_BASE}/dashboard/feedbacks`);
    if (!res.ok) throw new Error('Failed to fetch feedbacks');
    return res.json();
  },

  getDonorAnalytics: async (): Promise<DonorValueStats[]> => {
    const res = await fetch(`${API_BASE}/dashboard/donor-analytics`);
    if (!res.ok) throw new Error('Failed to fetch donor analytics');
    return res.json();
  },

  createPrediction: async (data: {
    event_type: string;
    expected_guests: number;
    planned_meals: number;
    historical_attendance_rate?: number;
    current_attendance?: number;
    food_category: string;
    weather: string;
    serving_window: string;
    dispatch_origin: string;
  }): Promise<Prediction> => {
    const res = await fetch(`${API_BASE}/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create prediction');
    return res.json();
  },

  getPrediction: async (id: number): Promise<Prediction> => {
    const res = await fetch(`${API_BASE}/predictions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch prediction');
    return res.json();
  },

  getPredictions: async (): Promise<Prediction[]> => {
    const res = await fetch(`${API_BASE}/predictions`);
    if (!res.ok) throw new Error('Failed to fetch predictions');
    return res.json();
  },

  getRecipients: async (verifiedOnly = false): Promise<Recipient[]> => {
    const res = await fetch(`${API_BASE}/recipients?verified_only=${verifiedOnly}`);
    if (!res.ok) throw new Error('Failed to fetch recipients');
    return res.json();
  },

  getMatches: async (predictionId: number, maxRadiusKm = 5.0): Promise<MatchResult[]> => {
    const res = await fetch(`${API_BASE}/recipients/matches/${predictionId}?max_radius_km=${maxRadiusKm}`);
    if (!res.ok) throw new Error('Failed to fetch matches');
    return res.json();
  },

  createMission: async (data: {
    prediction_id?: number;
    recipient_id: number;
    meals_quantity: number;
    food_category?: string;
    containment_type?: string;
    distance_km?: number;
  }): Promise<RescueMission> => {
    const res = await fetch(`${API_BASE}/rescue-missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create mission');
    return res.json();
  },

  getMissions: async (): Promise<RescueMission[]> => {
    const res = await fetch(`${API_BASE}/rescue-missions`);
    if (!res.ok) throw new Error('Failed to fetch missions');
    return res.json();
  },

  getMission: async (idOrCode: string | number): Promise<RescueMission> => {
    const res = await fetch(`${API_BASE}/rescue-missions/${idOrCode}`);
    if (!res.ok) throw new Error('Failed to fetch mission');
    return res.json();
  },

  verifyFood: async (id: number, data: { core_temp_celsius: number; notes?: string }): Promise<RescueMission> => {
    const res = await fetch(`${API_BASE}/rescue-missions/${id}/verify-food`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to verify food');
    return res.json();
  },

  confirmPickup: async (id: number, tokenOrOtp: string): Promise<RescueMission> => {
    const res = await fetch(`${API_BASE}/rescue-missions/${id}/pickup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token_or_otp: tokenOrOtp }),
    });
    if (!res.ok) throw new Error('Failed to confirm pickup');
    return res.json();
  },

  confirmDelivery: async (id: number, tokenOrOtp: string): Promise<RescueMission> => {
    const res = await fetch(`${API_BASE}/rescue-missions/${id}/deliver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token_or_otp: tokenOrOtp }),
    });
    if (!res.ok) throw new Error('Failed to confirm delivery');
    return res.json();
  },

  recordFeedback: async (missionId: number, data: { prediction_id: number; actual_surplus: number; notes?: string }): Promise<PredictionFeedback> => {
    const res = await fetch(`${API_BASE}/rescue-missions/${missionId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record feedback');
    return res.json();
  },

  runAutonomousDemo: async () => {
    const res = await fetch(`${API_BASE}/demo/run`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to run demo simulation');
    return res.json();
  },
};
