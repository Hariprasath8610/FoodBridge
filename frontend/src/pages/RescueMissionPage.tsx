import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, type RescueMission } from '../api';

export const RescueMissionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mission, setMission] = useState<RescueMission | null>(null);
  const [safetyChecked, setSafetyChecked] = useState(true);
  const [actualMealsInput, setActualMealsInput] = useState<number>(72);
  const [feedbackRecorded, setFeedbackRecorded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMission();
  }, [id]);

  const loadMission = async () => {
    try {
      const missionId = id || '1';
      const m = await api.getMission(missionId);
      setMission(m);
      setActualMealsInput(m.meals_quantity + 2);
    } catch (err) {
      console.error('Error loading mission:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickupSimulation = async () => {
    if (!mission) return;
    try {
      const updated = await api.confirmPickup(mission.id, mission.pickup_token);
      setMission(updated);
    } catch (err) {
      console.error('Error during pickup simulation:', err);
    }
  };

  const handleDeliverySimulation = async () => {
    if (!mission) return;
    try {
      const updated = await api.confirmDelivery(mission.id, mission.delivery_token);
      setMission(updated);
    } catch (err) {
      console.error('Error during delivery simulation:', err);
    }
  };

  const handleSaveFeedback = async () => {
    if (!mission || !mission.prediction_id) return;
    try {
      await api.recordFeedback(mission.id, {
        prediction_id: mission.prediction_id,
        actual_surplus: Number(actualMealsInput),
        notes: `Operational verification: ${actualMealsInput} meals rescued and distributed.`,
      });
      setFeedbackRecorded(true);
      setTimeout(() => navigate('/impact'), 1500);
    } catch (err) {
      console.error('Error recording feedback:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-[36px] text-primary animate-spin">sync</span>
        <p className="mt-3 font-body-md text-body-md text-on-surface-variant font-medium">
          Loading Rescue Mission Telemetry...
        </p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="font-headline-md font-bold text-on-surface">Mission Not Found</h2>
        <p className="mt-2 text-on-surface-variant">The requested rescue dispatch could not be found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  const isPickupDone = mission.current_step >= 5 || mission.status === 'PICKED_UP' || mission.status === 'DELIVERED';
  const isDeliveryDone = mission.current_step >= 6 || mission.status === 'DELIVERED';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Card: Mission ID, Status Pill & Certification */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
              Live Dispatch Command
            </span>
            <span className="text-surface-container-highest">•</span>
            <span className="text-[12px] text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
              Cold-Chain Tier 1 Certified
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight">
            Rescue Mission #{mission.mission_code}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Encrypted custody handshake with IoT temperature monitoring and physical recipient validation.
          </p>
        </div>

        {/* Status Indicator */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-label-md font-extrabold tracking-wide self-start lg:self-center border shadow-xs ${
            isDeliveryDone
              ? 'bg-secondary/15 text-secondary border-secondary/30'
              : isPickupDone
              ? 'bg-primary/15 text-primary border-primary/30'
              : 'bg-secondary-container text-on-secondary-container border-secondary/30'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isDeliveryDone ? 'bg-secondary' : 'bg-secondary animate-ping'
            }`}
          ></span>
          <span>
            {isDeliveryDone
              ? 'MISSION DELIVERED & VERIFIED ✓'
              : isPickupDone
              ? 'IN TRANSIT • DELIVERY STAGE'
              : 'ACTIVE • PICKUP STAGE'}
          </span>
        </div>
      </div>

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 6-Step Timeline & Route Manifest (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mission Timeline (6 Steps) */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">timeline</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Lifecycle Timeline
                  </h2>
                  <p className="text-[12px] text-on-surface-variant">End-to-end custody verification audit.</p>
                </div>
              </div>
              <span className="text-[12px] font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                Step {mission.current_step} of 6 {isDeliveryDone ? 'Completed' : 'Active'}
              </span>
            </div>

            {/* Stepped Timeline */}
            <div className="relative pl-6 space-y-5 pt-2">
              <div className="absolute left-2.5 top-3 bottom-4 w-0.5 bg-surface-container-highest"></div>

              {/* Step 1 */}
              <div className="relative flex items-start gap-3.5">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">1. Surplus Prediction</span>
                    <span className="text-[11px] text-secondary font-semibold">✓ 7:15 PM</span>
                  </div>
                  <span className="text-[12px] text-on-surface-variant">
                    Anticipated 60–75 meal surplus via kitchen POS telemetry & storm factor.
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-3.5">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">2. Recipient Matched</span>
                    <span className="text-[11px] text-secondary font-semibold">✓ 7:22 PM</span>
                  </div>
                  <span className="text-[12px] text-on-surface-variant">
                    {mission.recipient_name || 'Hope Community Kitchen'} matched (94% fit, 1.8km distance).
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-3.5">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">3. Physical Food Inspection</span>
                    <span className="text-[11px] text-secondary font-semibold">✓ 7:35 PM</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-[11px] font-semibold">
                      Core Temp: {mission.core_temp_celsius}°C Verified
                    </span>
                    <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-3.5">
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${
                    isPickupDone
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary text-on-primary animate-pulse'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] font-bold">
                    {isPickupDone ? 'check' : 'local_shipping'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-label-md text-label-md font-bold ${isPickupDone ? 'text-on-surface' : 'text-primary'}`}>
                      4. Pickup Assigned & Dispatched
                    </span>
                    <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                      {isPickupDone ? '✓ 7:52 PM' : 'Driver En Route'}
                    </span>
                  </div>
                  <span className="text-[12px] text-on-surface font-medium">
                    {mission.assigned_driver} (Vehicle: Van #DL-04-A-4481)
                  </span>
                </div>
              </div>

              {/* Step 5 */}
              <div className={`relative flex items-start gap-3.5 ${!isPickupDone ? 'opacity-60' : ''}`}>
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${
                    isPickupDone
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container text-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] font-bold">
                    {isPickupDone ? 'check' : 'qr_code_scanner'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-label-md text-label-md font-bold ${isPickupDone ? 'text-secondary' : 'text-on-surface'}`}>
                      5. Food Picked Up (QR Handshake)
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isPickupDone
                          ? 'bg-secondary/15 text-secondary'
                          : 'bg-surface-container text-outline'
                      }`}
                    >
                      {isPickupDone ? 'PICKUP VERIFIED ✓' : 'Pending QR Handshake'}
                    </span>
                  </div>
                  <span className="text-[12px] text-on-surface-variant">
                    {mission.meals_quantity} hot meal portions loaded into insulated Cambro containers.
                  </span>
                </div>
              </div>

              {/* Step 6 */}
              <div className={`relative flex items-start gap-3.5 ${!isDeliveryDone ? 'opacity-60' : ''}`}>
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${
                    isDeliveryDone
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container text-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] font-bold">
                    {isDeliveryDone ? 'check' : 'handshake'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-label-md text-label-md font-bold ${isDeliveryDone ? 'text-secondary' : 'text-on-surface'}`}>
                      6. Recipient Delivery & Audit
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isDeliveryDone
                          ? 'bg-secondary/15 text-secondary'
                          : 'bg-surface-container text-outline'
                      }`}
                    >
                      {isDeliveryDone ? 'DELIVERY COMPLETE ✓' : 'Pending Handoff'}
                    </span>
                  </div>
                  <span className="text-[12px] text-on-surface-variant">
                    Physical receipt acknowledged by intake staff. Variance logged to retraining engine.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Route & Cargo Manifest Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Route & Cargo Manifest
              </h2>
              <span className="text-[12px] font-bold text-tertiary bg-tertiary-container/30 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">timer</span>
                <span>{isDeliveryDone ? 'Delivered safely' : `${mission.estimated_transit_minutes}m target window`}</span>
              </span>
            </div>

            {/* Route Summary */}
            <div className="bg-surface-container-low rounded-xl p-4 space-y-3 border border-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">restaurant</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">Donor Origin</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                    {mission.donor_name || 'Grand Palace Pavilion'}
                  </span>
                  <span className="text-[12px] text-on-surface-variant">Loading Bay 2 • Chef Marcus</span>
                </div>
              </div>

              <div className="flex items-center pl-5 py-0.5">
                <div className="h-6 w-0.5 bg-outline-variant"></div>
                <span className="text-[12px] text-on-surface-variant pl-4">
                  {mission.distance_km} km transit via Metro Downtown Expressway
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">soup_kitchen</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">Destination Hub</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                    {mission.recipient_name || 'Hope Community Kitchen'}
                  </span>
                  <span className="text-[12px] text-on-surface-variant">East Receiving Ramp • Intake Officer</span>
                </div>
              </div>
            </div>

            {/* Cargo Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase">Cargo Volume</span>
                <p className="text-[20px] font-extrabold text-primary mt-0.5 tabular-nums">{mission.meals_quantity} Meals</p>
                <span className="text-[12px] text-on-surface-variant">{mission.food_category} Prepared Portions</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase">Containment</span>
                <p className="text-[20px] font-extrabold text-secondary mt-0.5">3 Cambro Units</p>
                <span className="text-[12px] text-on-surface-variant">Thermal Insulated Hold</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Air-Gapped Handshake, QR Verification & Feedback (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* QR Handshake Station */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {isPickupDone ? 'Delivery Handover Token' : 'Pickup Verification QR'}
                </h2>
                <p className="text-[12px] text-on-surface-variant">
                  {isPickupDone
                    ? 'Recipient scans to confirm receipt.'
                    : 'Driver scans QR to verify physical pickup.'}
                </p>
              </div>
              <span className="text-[11px] font-bold bg-surface-container-high text-on-surface px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">encrypted</span>
                Air-Gapped
              </span>
            </div>

            {/* SVG QR Code */}
            <div className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-2xl border border-surface-container relative">
              <div className="relative p-4 rounded-2xl bg-white shadow-md flex items-center justify-center">
                {!isDeliveryDone && (
                  <div className="absolute left-3 right-3 h-0.5 bg-secondary-fixed shadow-[0_0_8px_#4fdbc8] top-4 animate-bounce z-10 opacity-80 pointer-events-none"></div>
                )}

                <svg className="w-48 h-48 text-on-surface" fill="currentColor" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                  <rect fill="#005c55" height="40" rx="6" width="40" x="10" y="10"></rect>
                  <rect fill="#ffffff" height="24" rx="3" width="24" x="18" y="18"></rect>
                  <rect fill="#005c55" height="12" rx="2" width="12" x="24" y="24"></rect>
                  <rect fill="#005c55" height="40" rx="6" width="40" x="110" y="10"></rect>
                  <rect fill="#ffffff" height="24" rx="3" width="24" x="118" y="18"></rect>
                  <rect fill="#005c55" height="12" rx="2" width="12" x="124" y="24"></rect>
                  <rect fill="#005c55" height="40" rx="6" width="40" x="10" y="110"></rect>
                  <rect fill="#ffffff" height="24" rx="3" width="24" x="18" y="118"></rect>
                  <rect fill="#005c55" height="12" rx="2" width="12" x="24" y="124"></rect>
                  <rect height="8" rx="1.5" width="8" x="58" y="14"></rect>
                  <rect height="8" rx="1.5" width="8" x="70" y="14"></rect>
                  <rect height="8" rx="1.5" width="8" x="82" y="14"></rect>
                  <rect height="8" rx="1.5" width="8" x="94" y="14"></rect>
                  <rect height="8" rx="1.5" width="8" x="58" y="26"></rect>
                  <rect height="8" rx="1.5" width="14" x="74" y="26"></rect>
                  <rect height="8" rx="1.5" width="8" x="94" y="26"></rect>
                  <rect height="8" rx="1.5" width="8" x="58" y="38"></rect>
                  <rect height="8" rx="1.5" width="8" x="82" y="38"></rect>
                  <circle cx="80" cy="80" fill="#005c55" r="14"></circle>
                  <circle cx="80" cy="80" fill="#ffffff" r="10"></circle>
                  <path d="M76 80 L79 83 L85 76" fill="none" stroke="#005c55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <rect height="8" rx="1.5" width="8" x="14" y="74"></rect>
                  <rect height="8" rx="1.5" width="12" x="34" y="74"></rect>
                  <rect height="8" rx="1.5" width="14" x="102" y="74"></rect>
                  <rect height="8" rx="1.5" width="8" x="138" y="74"></rect>
                  <rect height="8" rx="1.5" width="8" x="58" y="90"></rect>
                  <rect height="8" rx="1.5" width="16" x="94" y="90"></rect>
                  <rect height="8" rx="1.5" width="8" x="126" y="90"></rect>
                  <rect height="8" rx="1.5" width="8" x="58" y="106"></rect>
                  <rect height="8" rx="1.5" width="14" x="90" y="106"></rect>
                  <rect height="8" rx="1.5" width="8" x="110" y="106"></rect>
                  <rect height="8" rx="1.5" width="8" x="82" y="122"></rect>
                  <rect height="8" rx="1.5" width="8" x="102" y="122"></rect>
                </svg>
              </div>

              <div className="mt-4 text-center space-y-1">
                <span className="text-[12px] text-on-surface-variant font-mono block tracking-wider">
                  Token: {isPickupDone ? mission.delivery_token : mission.pickup_token}
                </span>
                <span className="text-[15px] font-bold text-primary block">
                  Fallback OTP: {isPickupDone ? mission.delivery_otp : mission.pickup_otp}
                </span>
              </div>
            </div>

            {/* Safety Confirmation Checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low cursor-pointer select-none border border-surface-container">
              <input
                type="checkbox"
                checked={safetyChecked}
                onChange={(e) => setSafetyChecked(e.target.checked)}
                className="mt-1 h-4 w-4 rounded accent-primary cursor-pointer"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Thermal containment verified ({mission.core_temp_celsius}°C)
                </span>
                <span className="text-[12px] text-on-surface-variant">
                  Safe hold threshold (&lt;5°C chill or &gt;60°C hot) verified.
                </span>
              </div>
            </label>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {!isPickupDone ? (
                <button
                  onClick={handlePickupSimulation}
                  className="w-full h-12 bg-primary text-on-primary rounded-xl font-headline-sm text-[15px] font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all hover:bg-primary-container cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <span>Simulate Pickup Verification (Scan QR)</span>
                </button>
              ) : !isDeliveryDone ? (
                <button
                  onClick={handleDeliverySimulation}
                  className="w-full h-12 bg-primary text-on-primary rounded-xl font-headline-sm text-[15px] font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all hover:bg-primary-container cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                  <span>Complete Delivery Handoff (Verify Receipt)</span>
                </button>
              ) : (
                <div className="p-4 bg-secondary-container/40 rounded-xl text-on-secondary-container flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                    <span className="font-headline-sm text-[14px] font-bold">
                      Mission Completed & Delivered!
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/impact')}
                    className="px-3.5 py-1.5 bg-secondary text-on-secondary rounded-lg font-bold text-[12px] hover:bg-secondary/90 transition-colors cursor-pointer"
                  >
                    View Impact
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Closed-Loop Learning Card */}
          {isDeliveryDone && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-secondary/40 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">model_training</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Closed-Loop Model Feedback
                </h3>
              </div>
              <p className="text-[12px] text-on-surface-variant">
                Record the ground-truth surplus quantity delivered. FoodBridge stores the residual variance to continuously retrain and calibrate future banquet models.
              </p>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 bg-surface-container-low rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Predicted</span>
                  <p className="font-bold text-on-surface text-[16px] mt-0.5">{mission.meals_quantity}</p>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Actual</span>
                  <input
                    type="number"
                    value={actualMealsInput}
                    onChange={(e) => setActualMealsInput(Number(e.target.value))}
                    className="w-16 mx-auto bg-white rounded p-1 font-bold text-primary text-center text-[15px] border border-surface-container-highest mt-0.5"
                  />
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Variance</span>
                  <p className="font-bold text-secondary text-[16px] mt-0.5">
                    {Math.abs(actualMealsInput - mission.meals_quantity)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSaveFeedback}
                disabled={feedbackRecorded}
                className="w-full h-11 bg-secondary text-on-secondary rounded-xl font-headline-sm text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all cursor-pointer disabled:opacity-75"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {feedbackRecorded ? 'check_circle' : 'save'}
                </span>
                <span>{feedbackRecorded ? 'Feedback Stored ✓' : 'Submit Ground-Truth Feedback & View Impact'}</span>
              </button>
            </div>
          )}

          {/* Dispatcher Field Photos */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-on-surface-variant">
                Dispatcher Verified Photos
              </span>
              <span className="text-[11px] font-semibold text-secondary">
                2 Field Photos
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative rounded-xl overflow-hidden h-28 bg-surface-container border border-surface-container">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0k9-iU5yzItWcd-Rw7dczxObOaTVRJKvXfKFWK0ESFEsu0vMhwa_xAyBeRcIDvrQE9iZZaHl2Eyr7GQ0ky_hxr8DCvi_645E0-P9q8lccdKFH68qJzuHj5PxFlqrZk7S8UT8ciZGigsZHVjFBZDdPwl1WzaPj9RkF55XUJNOjYCnuwed5f6g1r8Xee1iO2F6ElQ0zY4nt8lKtO-MIC5mDioySt_46APX-DxNJnoGXd4-701LtC9pG"
                  alt="Insulated food rescue cambro containers"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-black/75 px-2 py-0.5 rounded text-white text-[10px] font-bold">
                  Cambro Seal OK
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden h-28 bg-surface-container border border-surface-container">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxauKCMUgI7ocHKaqtPSRJ5ApVelgjBnP2ONYuitmwV5fazJNwlhSyPZxAxplhMLEuI7FniyCHTcsJiol-8sIklVCG4xWPyvT10e0rgvmOs_HhDk9BeeQsp7lg_9m4DYYjRKA2gwxoevDy90tmelwEnauBP6bQWSj52vDTRi0Ltqy4wjPX9rW4UqD4MZ8g0_ZwDHIDLHxi3IrTCD3ug66we2BbjS8UTPBZlvHMudVsIglThkl2Jm_z"
                  alt="Volunteer delivery driver scanning manifest"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-black/75 px-2 py-0.5 rounded text-white text-[10px] font-bold">
                  Receiving Ramp
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
