import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type DashboardStats, type RescueMission } from '../api';

interface OverviewPageProps {
  onRunDemo: () => void;
  isDemoRunning: boolean;
  demoLogs: { step: string; text: string }[];
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onRunDemo,
  isDemoRunning,
  demoLogs,
}) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [urgentMission, setUrgentMission] = useState<RescueMission | null>(null);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 10000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const [statsData, missionsData] = await Promise.all([
        api.getStats(),
        api.getMissions(),
      ]);
      setStats(statsData);

      // Find active or top urgent mission
      const active = missionsData.find((m) => m.status !== 'DELIVERED') || missionsData[0];
      if (active) setUrgentMission(active);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner: Greeting, Operational Mode & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-[12px] font-bold text-secondary uppercase tracking-wider">
              Live Operations Command
            </span>
            <span className="text-surface-container-highest">•</span>
            <span className="text-[12px] text-on-surface-variant font-mono">
              Sector: South Chennai Metro
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
            Surplus Rescue Operations
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Automated intelligence predicting banquet overproduction and routing fresh food to certified community kitchens.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRunDemo}
            disabled={isDemoRunning}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary-container/40 text-on-secondary-container rounded-xl shadow-xs border border-secondary/30 font-semibold text-label-md hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[19px] text-secondary ${isDemoRunning ? 'animate-spin' : ''}`}>
              {isDemoRunning ? 'sync' : 'smart_toy'}
            </span>
            <span>{isDemoRunning ? 'Simulating Pipeline...' : '1-Click Autonomous Demo'}</span>
          </button>

          <button
            onClick={() => navigate('/predict')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl shadow-md active:scale-95 transition-transform hover:bg-primary-container font-semibold text-label-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">add_circle</span>
            <span>+ Predict New Surplus</span>
          </button>
        </div>
      </div>

      {/* 4 Key KPI Metrics Cards (4-Columns on Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Predicted Surplus */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              Today's Predicted Surplus
            </span>
            <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-data-display text-data-display text-on-surface leading-tight font-extrabold tabular-nums">
              {stats ? stats.predicted_surplus_today.toLocaleString() : '1,240'}
              <span className="text-body-md text-on-surface-variant font-normal ml-1">meals</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-secondary font-semibold text-label-sm">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>+14% anticipated (Heavy Rain alert)</span>
            </div>
          </div>
        </div>

        {/* 2. Food Rescued */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high flex flex-col justify-between relative overflow-hidden group hover:border-secondary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              Certified Rescued
            </span>
            <div className="w-9 h-9 rounded-xl bg-secondary-container/30 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">task_alt</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-data-display text-data-display text-on-surface leading-tight font-extrabold tabular-nums">
              {stats ? stats.food_rescued.toLocaleString() : '876'}
              <span className="text-body-md text-on-surface-variant font-normal ml-1">meals</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-secondary font-semibold text-label-sm">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>{stats ? `${stats.rescue_success_rate}% success rate` : '94% success rate'}</span>
            </div>
          </div>
        </div>

        {/* 3. People Served */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              Beneficiaries Served
            </span>
            <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-data-display text-data-display text-on-surface leading-tight font-extrabold tabular-nums">
              {stats ? stats.people_served.toLocaleString() : '812'}
              <span className="text-body-md text-on-surface-variant font-normal ml-1">individuals</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-on-surface-variant text-label-sm font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
              <span>{stats ? `${stats.verified_recipients_count} verified hubs` : '5 active recipient hubs'}</span>
            </div>
          </div>
        </div>

        {/* 4. Waste Avoided */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high flex flex-col justify-between relative overflow-hidden group hover:border-tertiary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              Avoided Landfill Waste
            </span>
            <div className="w-9 h-9 rounded-xl bg-tertiary-fixed/40 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">eco</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-data-display text-data-display text-on-surface leading-tight font-extrabold tabular-nums">
              {stats ? `${stats.waste_avoided_kg} kg` : '428 kg'}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-tertiary font-semibold text-label-sm">
              <span className="material-symbols-outlined text-[16px]">co2</span>
              <span>~{stats ? stats.co2e_saved_tonnes : '1.1'} tonnes CO2e avoided</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 12-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Main Command Column (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Autonomous Simulation Console (Dark Obsidian Theme) */}
          <div className="relative overflow-hidden rounded-2xl bg-inverse-surface text-inverse-on-surface p-6 shadow-xl border border-white/10">
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/25 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary flex-shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[28px]">terminal</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed font-extrabold">
                    Interactive Hackathon Simulation
                  </span>
                  <span className="px-2 py-0.5 bg-white/15 text-white rounded font-mono text-[11px]">
                    FastAPI + Scikit-Learn Model
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-inverse-on-surface font-bold mt-1">
                  Automated Banquet Surplus Rescue Pipeline
                </h3>
                <p className="font-body-sm text-body-sm text-inverse-on-surface/80 mt-1 leading-relaxed">
                  Triggers realistic wedding scenario: 500 Guests @ Grand Palace Pavilion → Heavy Rain Alert (+14% surplus factor) → Random Forest AI predicts 60–75 Meals → Proximity engine matches Hope Community Kitchen (94% fit) → Dispatches driver with thermal Cambros.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={onRunDemo}
                    disabled={isDemoRunning}
                    className="py-2.5 px-5 bg-secondary-fixed text-on-secondary-fixed rounded-xl font-headline-sm text-[15px] font-bold flex items-center justify-center gap-2 hover:bg-secondary-container active:scale-[0.98] transition-all shadow-md cursor-pointer disabled:opacity-60"
                  >
                    <span className={`material-symbols-outlined text-[19px] ${isDemoRunning ? 'animate-spin' : ''}`}>
                      {isDemoRunning ? 'sync' : 'play_arrow'}
                    </span>
                    <span>{isDemoRunning ? 'Executing Simulation Steps...' : 'Run Automated Pipeline'}</span>
                  </button>

                  <button
                    onClick={() => navigate('/predict')}
                    className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>Custom Prediction Parameters</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Real-Time Live Logs Terminal */}
            {(isDemoRunning || demoLogs.length > 0) && (
              <div className="mt-5 p-4 bg-black/70 rounded-xl text-secondary-fixed font-mono text-body-sm space-y-2 border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-white/70 border-b border-white/10 pb-2 mb-2">
                  <span className="flex items-center gap-2 font-semibold text-[12px]">
                    <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></span>
                    <span>AI AUTONOMOUS LOG STREAM</span>
                  </span>
                  <span className="text-[11px] text-secondary-fixed font-mono bg-white/10 px-2 py-0.5 rounded">
                    {demoLogs.length > 0 ? demoLogs[demoLogs.length - 1].step : 'Standing By'}
                  </span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {demoLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 text-[12px] leading-relaxed">
                      <span className="text-secondary-fixed font-bold flex-shrink-0">[{log.step}]</span>
                      <span className="text-white/90">{log.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rescue Pipeline Dynamic Flow Widget */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container-high">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">conversion_path</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Rescue Pipeline Architecture
                  </h2>
                  <p className="text-[12px] text-on-surface-variant">
                    Continuous feedback architecture from prediction to biological decomposition avoidance.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-bold border border-secondary/20">
                {stats ? `${stats.pipeline_capacity_percent}% Fleet Utilization` : '72% Fleet Utilization'}
              </span>
            </div>

            {/* Stepper Graphic */}
            <div className="grid grid-cols-4 gap-3 text-center py-3">
              <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-[13px] font-bold shadow-xs">
                  1
                </div>
                <span className="font-label-sm text-label-sm text-on-surface font-bold mt-2">
                  Surplus AI
                </span>
                <span className="text-[11px] text-on-surface-variant mt-0.5">Scikit-Learn Regression</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-[13px] font-bold shadow-xs">
                  2
                </div>
                <span className="font-label-sm text-label-sm text-on-surface font-bold mt-2">
                  Matching
                </span>
                <span className="text-[11px] text-on-surface-variant mt-0.5">5-Factor Weight Matrix</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
                <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[13px] font-bold shadow-xs">
                  3
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-bold mt-2">
                  Dispatch & QR
                </span>
                <span className="text-[11px] text-secondary mt-0.5">Air-Gapped Handshake</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
                <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[13px] font-bold">
                  4
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold mt-2">
                  Closed-Loop
                </span>
                <span className="text-[11px] text-on-surface-variant mt-0.5">Variance ML Tuning</span>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden mt-3 relative">
              <div
                className="bg-gradient-to-r from-primary via-secondary to-secondary-container h-full rounded-full transition-all duration-1000"
                style={{ width: `${stats ? stats.pipeline_capacity_percent : 72}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant text-[12px] mt-2 font-medium">
              <span>{stats ? stats.active_rescue_missions : 2} Operations Dispatched Today</span>
              <span className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                <span>ISO 22000 & HACCP Compliant Cold-Chain</span>
              </span>
            </div>
          </div>

          {/* Real-time Autonomous Stream */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container-high">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">satellite_alt</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Live Dispatch Feed & Telemetry Events
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1 px-2.5 py-1 bg-secondary/10 rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span> Streaming
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-surface-container-low rounded-xl flex items-start gap-3 border border-surface-container-high">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">hub</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm font-bold text-secondary px-2 py-0.5 rounded bg-secondary/10">
                      94% Match Compatibility
                    </span>
                    <span className="text-[12px] text-on-surface-variant font-mono">2m ago</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface mt-1 font-medium">
                    Wedding banquet surplus (72 meals) matched with <strong>Hope Community Kitchen</strong> (1.8 km).
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-xl flex items-start gap-3 border border-surface-container-high">
                <div className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">rainy</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm font-bold text-tertiary px-2 py-0.5 rounded bg-tertiary/10">
                      Weather Factor Active
                    </span>
                    <span className="text-[12px] text-on-surface-variant font-mono">7m ago</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface mt-1 font-medium">
                    Precipitation sensor logged 18mm rainfall. ML surplus estimate adjusted upward by +14% to account for drop in late attendance.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-xl flex items-start gap-3 border border-surface-container-high">
                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                      Delivery Verified
                    </span>
                    <span className="text-[12px] text-on-surface-variant font-mono">14m ago</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface mt-1 font-medium">
                    <strong>St. Jude Care Center</strong> verified pickup of 45 vegetarian meal packs via air-gapped cryptographic QR.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Sidebar Column (4 Columns on Desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Urgent Rescue Mission Priority Card */}
          {urgentMission ? (
            <div className="relative overflow-hidden bg-error-container text-on-error-container rounded-2xl p-5 shadow-sm border border-error/20">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-error text-on-error flex items-center justify-center flex-shrink-0 animate-bounce shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">notification_important</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm uppercase font-extrabold tracking-wider text-error">
                      Urgent Rescue Priority
                    </span>
                    <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-on-error-container font-extrabold truncate mt-1">
                    Mission #{urgentMission.mission_code}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-error-container/90 mt-1">
                    {urgentMission.meals_quantity} Meals ({urgentMission.food_category}) ready at <strong>{urgentMission.donor_name || 'Grand Palace Pavilion'}</strong>.
                  </p>
                  <div className="mt-2 text-[12px] text-on-error-container/80 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">location_on</span>
                    <span>To: {urgentMission.recipient_name}</span>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/rescue/${urgentMission.id}`)}
                      className="w-full py-2.5 px-4 bg-error text-on-error rounded-xl font-label-md text-label-md font-bold active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:bg-error/90"
                    >
                      <span>Open Live Rescue Mission</span>
                      <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                    </button>
                    <button
                      onClick={() => setIsMissionModalOpen(true)}
                      className="w-full py-2 px-3 bg-white/70 text-on-error-container hover:bg-white rounded-xl font-label-md text-label-md font-semibold transition-all text-center"
                    >
                      Quick Telemetry Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Verified Community Hubs Card */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Nearby Verified Hubs
              </h3>
              <button
                onClick={() => navigate('/recipients')}
                className="font-label-md text-label-md text-primary font-bold flex items-center gap-0.5 hover:underline"
              >
                <span>All Hubs</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            <div className="space-y-3">
              <div
                onClick={() => navigate('/matches')}
                className="bg-surface-container-low rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:bg-surface-container transition-colors border border-surface-container-high"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">soup_kitchen</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      Hope Community Kitchen
                    </p>
                    <span className="font-label-sm text-label-sm text-secondary font-bold">1.8 km</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-0.5">
                    <span>Cap: 120 pax • Veg only</span>
                    <span className="text-secondary font-semibold">Active Dispatch</span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigate('/matches')}
                className="bg-surface-container-low rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:bg-surface-container transition-colors border border-surface-container-high"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">night_shelter</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      St. Jude Care Center
                    </p>
                    <span className="font-label-sm text-label-sm text-secondary font-bold">2.4 km</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-0.5">
                    <span>Cap: 80 pax • Any diet</span>
                    <span className="text-secondary font-semibold">Ready (45 needed)</span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigate('/matches')}
                className="bg-surface-container-low rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:bg-surface-container transition-colors border border-surface-container-high"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                      CareBridge Shelter
                    </p>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">3.1 km</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-0.5">
                    <span>Cap: 150 pax • High Demand</span>
                    <span className="text-primary font-semibold">Verified NGO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cold-Chain IoT Telemetry Box */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[19px] text-secondary">thermostat</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Cold-Chain IoT Telemetry
                </span>
              </div>
              <span className="text-[11px] font-mono text-secondary font-semibold bg-secondary/10 px-2 py-0.5 rounded">
                HACCP OK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high">
                <span className="text-[11px] text-on-surface-variant font-medium">Core Temp</span>
                <p className="text-[20px] font-extrabold text-on-surface font-mono mt-0.5">4.2°C</p>
                <span className="text-[10px] text-secondary font-bold">Safe (&lt; 5°C)</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high">
                <span className="text-[11px] text-on-surface-variant font-medium">Cambro Boxes</span>
                <p className="text-[20px] font-extrabold text-on-surface font-mono mt-0.5">3 Units</p>
                <span className="text-[10px] text-primary font-bold">Insulated</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 bg-surface-container-low rounded-xl text-[11px] text-on-surface-variant flex items-center justify-between">
              <span>Sensor ID: #IOT-TH-994</span>
              <span className="text-secondary font-bold">Battery 98%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Quick Preview Modal */}
      {isMissionModalOpen && urgentMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-surface-container-high">
            <button
              onClick={() => setIsMissionModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex items-center gap-2 text-error mb-2">
              <span className="material-symbols-outlined">fmd_bad</span>
              <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">
                Mission Telemetry
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md font-bold">
              {urgentMission.donor_name || 'Grand Palace Pavilion'}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              {urgentMission.meals_quantity} Prepared Warm Meals ({urgentMission.food_category}). Cold-chain hold verified at {urgentMission.core_temp_celsius}°C.
            </p>
            <div className="my-4 p-3 bg-surface-container-low rounded-xl space-y-2 font-body-sm text-body-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Recommended Hub:</span>
                <span className="font-semibold text-primary">{urgentMission.recipient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Estimated Transit:</span>
                <span className="font-semibold text-error">
                  {urgentMission.estimated_transit_minutes} minutes max
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Driver Assigned:</span>
                <span className="font-semibold text-secondary">{urgentMission.assigned_driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Security Token:</span>
                <span className="font-mono text-[11px] font-semibold text-on-surface">{urgentMission.pickup_token}</span>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setIsMissionModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setIsMissionModalOpen(false);
                  navigate(`/rescue/${urgentMission.id}`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
              >
                Open Full Mission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
