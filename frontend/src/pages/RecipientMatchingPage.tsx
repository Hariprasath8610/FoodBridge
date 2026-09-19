import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, type MatchResult, type Prediction } from '../api';

export const RecipientMatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const predictionIdParam = searchParams.get('prediction_id');

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(3.0);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null);
  const [creatingMission, setCreatingMission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, [predictionIdParam, radiusKm]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      let predId = predictionIdParam ? Number(predictionIdParam) : null;
      if (!predId) {
        const list = await api.getPredictions();
        if (list.length > 0) {
          predId = list[0].id;
          setPrediction(list[0]);
        }
      } else {
        const pred = await api.getPrediction(predId);
        setPrediction(pred);
      }

      if (predId) {
        const matchData = await api.getMatches(predId, radiusKm);
        setMatches(matchData);
        if (matchData.length > 0) {
          setSelectedRecipientId(matchData[0].recipient.id);
        }
      }
    } catch (err) {
      console.error('Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMission = async (recipientId: number, meals: number) => {
    setCreatingMission(true);
    try {
      const newMission = await api.createMission({
        prediction_id: prediction?.id,
        recipient_id: recipientId,
        meals_quantity: meals || 70,
        food_category: prediction?.food_category || 'Vegetarian',
        containment_type: '3 Cambro Units (Thermal Insulated)',
        distance_km: matches.find(m => m.recipient.id === recipientId)?.distance_km || 1.8,
      });
      navigate(`/rescue/${newMission.id}`);
    } catch (err) {
      console.error('Error creating rescue mission:', err);
      alert('Failed to initialize rescue mission. Please try again.');
    } finally {
      setCreatingMission(false);
    }
  };

  const filteredMatches = matches.filter((m) => {
    if (filterType === 'score') return m.match_score >= 80;
    if (filterType === 'distance') return m.distance_km <= 2.0;
    if (filterType === 'veg') return m.recipient.dietary_preferences.toLowerCase().includes('veg');
    return true;
  });

  const recommendedMatch = matches.find((m) => m.is_recommended) || matches[0];
  const alternativeMatches = filteredMatches.filter((m) => m.recipient.id !== recommendedMatch?.recipient.id);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header: Context & Active Surplus Batch Indicator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">hub</span>
            <span className="text-[12px] font-bold text-primary uppercase tracking-wider">
              Algorithmic Allocation Engine
            </span>
            <span className="text-surface-container-highest">•</span>
            <span className="text-[12px] text-on-surface-variant font-mono">
              5-Factor Multi-Objective Match
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Find & Match the Right Recipient
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            FoodBridge balances capacity, distance, urgency, and dietary compatibility to avoid secondary spoilage.
          </p>
        </div>

        {/* Active Surplus Batch Pill */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high flex items-center gap-3.5 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center flex-shrink-0 text-on-tertiary-container shadow-xs">
            <span className="material-symbols-outlined text-[20px]">restaurant</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary">
                Surplus Batch
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            </div>
            <p className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
              {prediction ? `${prediction.predicted_surplus_min}–${prediction.predicted_surplus_max} ${prediction.food_category} Meals` : '60–75 Vegetarian Meals'}
            </p>
            <span className="text-[12px] text-on-surface-variant">
              Origin: <strong>{prediction?.dispatch_origin || 'Grand Palace Pavilion'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Proximity Radar Map & Filter Controls (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Schematic Spatial Map Card */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">radar</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Proximity & Route Radar
                </h2>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-secondary-container/40 text-on-secondary-container rounded-full border border-secondary/20">
                Geofence Active
              </span>
            </div>

            {/* Stylized Visual Map */}
            <div className="relative w-full h-80 rounded-xl bg-surface-container-low overflow-hidden flex items-center justify-center select-none shadow-inner border border-surface-container">
              {/* Map grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-30" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern height="32" id="grid-lines-desktop" patternUnits="userSpaceOnUse" width="32">
                    <path className="text-outline-variant" d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.75"></path>
                  </pattern>
                </defs>
                <rect fill="url(#grid-lines-desktop)" height="100%" width="100%"></rect>
                <path className="text-surface-container-highest" d="M-20 80 Q 90 90, 160 115 T 480 130" fill="none" stroke="currentColor" strokeWidth="6"></path>
                <path className="text-surface-container-highest" d="M80 -20 Q 110 90, 155 120 T 260 280" fill="none" stroke="currentColor" strokeWidth="4"></path>
                <path className="text-surface-container-highest" d="M220 -20 C 220 80, 160 110, 140 280" fill="none" stroke="currentColor" strokeWidth="5"></path>
              </svg>

              {/* Dynamic radius circle */}
              <div
                className="absolute rounded-full border-2 border-dashed border-secondary/60 bg-secondary/10 flex items-center justify-center pointer-events-none transition-all duration-500"
                style={{
                  width: `${radiusKm * 70}px`,
                  height: `${radiusKm * 70}px`,
                }}
              >
                <div className="w-full h-full rounded-full animate-ping opacity-20 bg-secondary-fixed"></div>
              </div>

              {/* Concentric rings */}
              <div className="absolute w-32 h-32 rounded-full border border-secondary/25 pointer-events-none"></div>

              {/* Source Pin (Grand Palace Pavilion) */}
              <div className="absolute top-[50%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                <div className="px-2.5 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-[10px] font-bold shadow-md whitespace-nowrap mb-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed animate-pulse"></span>
                  Grand Palace
                </div>
                <div className="w-9 h-9 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-lg ring-4 ring-white">
                  <span className="material-symbols-outlined text-[19px]">dinner_dining</span>
                </div>
              </div>

              {/* Recipient 1: Hope Community Kitchen (Top Match) */}
              <div
                className="absolute top-[26%] left-[68%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 cursor-pointer group"
                onClick={() => setSelectedRecipientId(1)}
              >
                <div className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[11px] font-bold shadow-md whitespace-nowrap mb-1 flex items-center gap-1 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  Hope Kitchen (1.8km • 94%)
                </div>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md ring-4 ring-white">
                    <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                  </span>
                </div>
              </div>

              {/* Recipient 2: St. Jude Care Center */}
              <div
                className="absolute top-[72%] left-[28%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 cursor-pointer group"
                onClick={() => setSelectedRecipientId(2)}
              >
                <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md ring-2 ring-white">
                  <span className="material-symbols-outlined text-[16px]">night_shelter</span>
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-[11px] font-semibold shadow-xs whitespace-nowrap">
                  St. Jude (2.4km • 81%)
                </div>
              </div>

              {/* Recipient 3: CareBridge Shelter */}
              <div
                className="absolute top-[68%] left-[82%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 cursor-pointer opacity-85"
                onClick={() => setSelectedRecipientId(3)}
              >
                <div className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-[14px]">local_hospital</span>
                </div>
                <div className="mt-1 px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] whitespace-nowrap">
                  CareBridge (3.1km)
                </div>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-2 left-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm text-on-surface flex items-center gap-3 text-[11px] font-semibold border border-surface-container-high">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>Origin</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span>Top Fit</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>Active Recipient</span>
              </div>
            </div>

            {/* Radius Controller */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[13px] font-semibold text-on-surface">
                Search Radius: <strong>{radiusKm.toFixed(1)} km</strong>
              </span>
              <div className="flex items-center gap-1.5">
                {[2.0, 3.0, 5.0, 8.0].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadiusKm(r)}
                    className={`px-3 py-1 rounded-xl text-label-sm font-semibold transition-all cursor-pointer border ${
                      radiusKm === r
                        ? 'bg-primary text-on-primary border-primary shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-surface-container-high'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-surface-container">
              {[
                { id: 'all', label: `All Candidates (${matches.length})` },
                { id: 'score', label: 'Score >80%' },
                { id: 'distance', label: '< 2.0 km' },
                { id: 'veg', label: 'Vegetarian Only' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-1 rounded-full text-label-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    filterType === f.id
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-surface-container-high'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: AI Recommended Match & Candidate Feed (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Recommended Recipient Card */}
          {recommendedMatch && (
            <article className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border-2 border-primary/40 space-y-5 relative overflow-hidden">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-surface-container pb-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container">
                  <span className="material-symbols-outlined text-[18px] text-secondary">auto_awesome</span>
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">
                    Optimal AI Recommendation
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Rank #1 by Proximity & Demand Fit
                </span>
              </div>

              {/* Entity Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[30px]">volunteer_activism</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold truncate">
                      {recommendedMatch.recipient.name}
                    </h2>
                    <div className="flex items-center gap-2 text-on-surface-variant text-[13px] font-medium">
                      <span className="material-symbols-outlined text-[16px] text-primary">near_me</span>
                      <span className="font-semibold text-on-surface">{recommendedMatch.distance_km} km away</span>
                      <span>(~{recommendedMatch.transit_mins} mins transit)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <div className="px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-headline-sm text-headline-sm font-extrabold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[19px] text-secondary">eco</span>
                    <span>{recommendedMatch.match_score}%</span>
                  </div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">
                    Match Score
                  </span>
                </div>
              </div>

              {/* Demand Metrics Row */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-bold text-on-surface-variant">
                    Current Demand
                  </span>
                  <span className="text-[18px] font-extrabold text-on-surface mt-0.5">
                    {recommendedMatch.recipient.current_demand_meals} Meals Needed
                  </span>
                  <span className="text-[12px] text-secondary font-bold">
                    Covers {recommendedMatch.coverage_percentage}% of batch
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-bold text-on-surface-variant">
                    Dock Readiness
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="text-[16px] font-bold text-on-surface">
                      Active Dispatch Team
                    </span>
                  </div>
                  <span className="text-[12px] text-on-surface-variant">
                    Intake Ramp Open till 10 PM
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2">
                {recommendedMatch.badges.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-[12px] font-semibold border border-surface-container-highest"
                  >
                    <span className="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
                    {badge}
                  </span>
                ))}
              </div>

              {/* 5-Factor Explainable Breakdown */}
              <div className="bg-surface-container-low rounded-xl p-4 space-y-2.5 border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] uppercase tracking-wider font-bold text-on-surface-variant">
                    Algorithmic Compatibility Breakdown
                  </span>
                  <span className="text-[12px] font-bold text-primary">
                    High Confidence
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  <div>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-on-surface-variant font-medium">Quantity compatibility</span>
                      <span className="font-bold text-on-surface">{recommendedMatch.compatibility.quantity_score}%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${recommendedMatch.compatibility.quantity_score}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-on-surface-variant font-medium">Distance efficiency</span>
                      <span className="font-bold text-on-surface">{recommendedMatch.compatibility.distance_score}%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${recommendedMatch.compatibility.distance_score}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-on-surface-variant font-medium">Dietary safety compliance</span>
                      <span className="font-bold text-secondary">{recommendedMatch.compatibility.dietary_safety_score}%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: `${recommendedMatch.compatibility.dietary_safety_score}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Mission Action Button */}
              <button
                onClick={() => handleCreateMission(recommendedMatch.recipient.id, prediction?.surplus_quantity || 70)}
                disabled={creatingMission}
                className="w-full h-12 rounded-xl bg-primary text-on-primary font-headline-sm text-[15px] font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-60"
              >
                {creatingMission ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                    <span>Initializing Rescue Mission #FB-2026...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Rescue Mission with {recommendedMatch.recipient.name}</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </article>
          )}

          {/* Alternative Candidates */}
          {alternativeMatches.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Alternative Recipient Hubs
                </h3>
                <span className="text-[12px] text-on-surface-variant">
                  Within {radiusKm} km radius
                </span>
              </div>

              <div className="space-y-3">
                {alternativeMatches.map((item) => (
                  <article
                    key={item.recipient.id}
                    className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container-high flex flex-col space-y-3 transition-all hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-[22px] text-secondary">
                            {item.recipient.recipient_type.includes('Shelter') ? 'night_shelter' : 'local_hospital'}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                              {item.recipient.name}
                            </h4>
                            {item.recipient.verified && (
                              <span className="material-symbols-outlined text-[16px] text-secondary" title="Verified NGO">
                                verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-on-surface-variant text-[12px] font-medium">
                            <span className="font-semibold text-on-surface">{item.distance_km} km away</span>
                            <span>•</span>
                            <span>{item.recipient.current_demand_meals} meals needed</span>
                          </div>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container text-label-md font-bold">
                        {item.match_score}% Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                      <div className="flex items-center gap-2 text-[12px] text-on-surface-variant">
                        <span className="flex items-center gap-1 text-secondary font-semibold">
                          <span className="material-symbols-outlined text-[14px]">check</span> Verified Hub
                        </span>
                        <span>•</span>
                        <span>{item.recipient.dietary_preferences}</span>
                      </div>
                      <button
                        onClick={() => handleCreateMission(item.recipient.id, prediction?.surplus_quantity || 70)}
                        className="h-9 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary text-label-md font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Assign Portion</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
