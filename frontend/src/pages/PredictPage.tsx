import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type Prediction } from '../api';

export const PredictPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State initialized with the Wedding Banquet Scenario
  const [eventType, setEventType] = useState('Wedding Banquet');
  const [expectedGuests, setExpectedGuests] = useState(500);
  const [plannedMeals, setPlannedMeals] = useState(500);
  const [currentAttendance, setCurrentAttendance] = useState(430);
  const [foodCategory, setFoodCategory] = useState('Vegetarian');
  const [weather, setWeather] = useState('Heavy Rain');
  const [servingWindow, setServingWindow] = useState('7:30 PM (Dinner Shift)');
  const [dispatchOrigin, setDispatchOrigin] = useState('Grand Palace Pavilion');

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    // Initial prediction on load
    handleCalculatePrediction();
  }, []);

  const handleCalculatePrediction = async () => {
    setLoading(true);
    try {
      const pred = await api.createPrediction({
        event_type: eventType,
        expected_guests: Number(expectedGuests),
        planned_meals: Number(plannedMeals),
        current_attendance: Number(currentAttendance),
        food_category: foodCategory,
        weather: weather,
        serving_window: servingWindow,
        dispatch_origin: dispatchOrigin,
      });
      setPrediction(pred);
    } catch (err) {
      console.error('Prediction calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type: string) => {
    if (type === 'wedding') {
      setEventType('Wedding Banquet');
      setExpectedGuests(500);
      setPlannedMeals(500);
      setCurrentAttendance(430);
      setFoodCategory('Vegetarian');
      setWeather('Heavy Rain');
      setServingWindow('7:30 PM (Dinner Shift)');
      setDispatchOrigin('Grand Palace Pavilion');
    } else if (type === 'corporate') {
      setEventType('Corporate Gala');
      setExpectedGuests(250);
      setPlannedMeals(260);
      setCurrentAttendance(220);
      setFoodCategory('Mixed');
      setWeather('Clear');
      setServingWindow('1:00 PM (Lunch Shift)');
      setDispatchOrigin('ITC Grand Chola Convention Center');
    } else if (type === 'college') {
      setEventType('College Hostel');
      setExpectedGuests(600);
      setPlannedMeals(600);
      setCurrentAttendance(510);
      setFoodCategory('Vegetarian');
      setWeather('Rain');
      setServingWindow('8:00 PM (Hostel Mess)');
      setDispatchOrigin('IIT Madras Mega Dining Hall');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Intro Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">psychology</span>
            <span className="text-[12px] font-bold text-secondary uppercase tracking-wider">
              RandomForest AI Surplus Intelligence
            </span>
            <span className="text-surface-container-highest">•</span>
            <span className="text-[12px] text-on-surface-variant font-mono">
              Confidence Calibrated v4.2
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Predict Surplus Before It Becomes Waste
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Simulate kitchen and banquet scenarios. Machine learning calculates attendance attrition, weather elasticity, and safe rescue time horizons.
          </p>
        </div>

        {/* Preset Selector Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mr-1">
            Quick Presets:
          </span>
          <button
            onClick={() => loadPreset('wedding')}
            className={`px-3 py-1.5 rounded-xl text-label-sm font-semibold transition-all cursor-pointer border ${
              eventType === 'Wedding Banquet'
                ? 'bg-primary text-on-primary border-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-surface-container-high'
            }`}
          >
            Wedding Banquet
          </button>
          <button
            onClick={() => loadPreset('corporate')}
            className={`px-3 py-1.5 rounded-xl text-label-sm font-semibold transition-all cursor-pointer border ${
              eventType === 'Corporate Gala'
                ? 'bg-primary text-on-primary border-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-surface-container-high'
            }`}
          >
            Corporate Gala
          </button>
          <button
            onClick={() => loadPreset('college')}
            className={`px-3 py-1.5 rounded-xl text-label-sm font-semibold transition-all cursor-pointer border ${
              eventType === 'College Hostel'
                ? 'bg-primary text-on-primary border-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-surface-container-high'
            }`}
          >
            College Hostel
          </button>
        </div>
      </div>

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form & Context Signals (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Input Form Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container-high space-y-5">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Event & Kitchen Parameters
                  </h2>
                  <p className="text-[12px] text-on-surface-variant">Live inputs sent to FastAPI surplus prediction model.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-surface-container-low font-label-sm text-label-sm text-primary font-bold border border-primary/20">
                Auto-Calibrate
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Event Type */}
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl p-2.5 text-on-surface font-body-md border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                >
                  <option value="Wedding Banquet">Wedding Banquet</option>
                  <option value="Corporate Gala">Corporate Gala</option>
                  <option value="Hotel Buffet">Hotel Buffet</option>
                  <option value="College Hostel">College Hostel</option>
                  <option value="Restaurant Dinner">Restaurant Dinner</option>
                  <option value="Catered Festival">Catered Festival</option>
                </select>
              </div>

              {/* Weather Condition */}
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Weather Condition</label>
                <select
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl p-2.5 text-on-surface font-body-md border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                >
                  <option value="Heavy Rain">Heavy Rain (Severe Precip)</option>
                  <option value="Rain">Rain Expected</option>
                  <option value="Cloudy">Cloudy / Overcast</option>
                  <option value="Clear">Clear Skies</option>
                </select>
              </div>

              {/* Expected Guests */}
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Expected Guests</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[18px]">group</span>
                  <input
                    type="number"
                    value={expectedGuests}
                    onChange={(e) => setExpectedGuests(Number(e.target.value))}
                    className="w-full bg-surface-container-low rounded-xl py-2.5 pl-10 pr-3 text-on-surface font-body-md border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                  />
                </div>
              </div>

              {/* Planned Meals */}
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Planned Meals Prepared</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[18px]">skillet</span>
                  <input
                    type="number"
                    value={plannedMeals}
                    onChange={(e) => setPlannedMeals(Number(e.target.value))}
                    className="w-full bg-surface-container-low rounded-xl py-2.5 pl-10 pr-3 text-on-surface font-body-md border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                  />
                </div>
              </div>

              {/* Current Attendance */}
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Live Attendance Check-Ins
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-secondary text-[18px]">how_to_reg</span>
                  <input
                    type="number"
                    value={currentAttendance}
                    onChange={(e) => setCurrentAttendance(Number(e.target.value))}
                    className="w-full bg-surface-container-low rounded-xl py-2.5 pl-10 pr-16 text-on-surface font-body-md border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                  />
                  <span className="absolute right-3 top-3 text-[12px] font-bold text-secondary">
                    {expectedGuests > 0 ? `${Math.round((currentAttendance / expectedGuests) * 100)}% checkin` : '0%'}
                  </span>
                </div>
              </div>

              {/* Food Category */}
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Food Category</label>
                <select
                  value={foodCategory}
                  onChange={(e) => setFoodCategory(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl p-2.5 text-on-surface font-body-md border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                >
                  <option value="Vegetarian">Vegetarian Banquet</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                  <option value="Mixed">Mixed Cuisine</option>
                  <option value="Vegan">100% Plant-Based / Vegan</option>
                </select>
              </div>

              {/* Serving Window */}
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Serving Window</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-primary text-[18px]">schedule</span>
                  <input
                    type="text"
                    value={servingWindow}
                    onChange={(e) => setServingWindow(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl py-2.5 pl-10 pr-3 text-on-surface font-body-md border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  />
                </div>
              </div>

              {/* Dispatch Origin */}
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Origin Facility</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-primary text-[18px]">pin_drop</span>
                  <input
                    type="text"
                    value={dispatchOrigin}
                    onChange={(e) => setDispatchOrigin(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl py-2.5 pl-10 pr-3 text-on-surface font-body-md border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Recalculate CTA */}
            <button
              onClick={handleCalculatePrediction}
              disabled={loading}
              className="w-full h-12 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all hover:bg-primary-container cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                  <span>Executing Scikit-Learn Model Pipeline...</span>
                </>
              ) : (
                <>
                  <span>Recalculate AI Surplus Prediction</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>

          {/* Context Sensors Strip */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                Environmental & Operational Telemetry
              </span>
              <span className="text-[11px] font-mono text-on-surface-variant">Chennai Station #4</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-container-low rounded-xl p-3.5 border border-surface-container-high">
                <div className="flex items-center justify-between text-tertiary">
                  <span className="material-symbols-outlined text-[22px]">thunderstorm</span>
                  <span className="font-label-sm text-label-sm font-bold">
                    {weather === 'Heavy Rain' ? '75% precip' : '20% precip'}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-[11px] text-on-surface-variant block font-medium">Weather Condition</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-bold truncate">{weather}</span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-3.5 border border-surface-container-high">
                <div className="flex items-center justify-between text-primary">
                  <span className="material-symbols-outlined text-[22px]">analytics</span>
                  <span className="font-label-sm text-label-sm font-bold">92%</span>
                </div>
                <div className="mt-2">
                  <span className="text-[11px] text-on-surface-variant block font-medium">Historical Baseline</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-bold truncate">30+ Banquets</span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-3.5 border border-surface-container-high">
                <div className="flex items-center justify-between text-secondary">
                  <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
                  <span className="font-label-sm text-label-sm font-bold">{currentAttendance}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[11px] text-on-surface-variant block font-medium">Check-In Velocity</span>
                  <span className="font-body-sm text-body-sm text-secondary font-bold truncate">
                    {expectedGuests > 0 ? `${Math.round((currentAttendance / expectedGuests) * 100)}% In-Hall` : '86%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Obsidian Dark AI Result Card & Explanations (5 Columns) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {prediction && (
            <>
              {/* Obsidian Dark Result Card */}
              <div className="bg-inverse-surface rounded-2xl p-6 text-inverse-on-surface shadow-xl space-y-5 relative overflow-hidden border border-white/10">
                {/* Ambient Radial Highlight */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/30 blur-3xl pointer-events-none"></div>

                {/* Card Header */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary-fixed text-[24px]">smart_toy</span>
                    <span className="font-label-sm text-[12px] font-bold tracking-widest text-surface-dim uppercase">
                      AI Surplus Intelligence
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-secondary-fixed">
                    <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></span>
                    <span className="font-mono text-[11px] font-bold uppercase">
                      {Math.round(prediction.confidence_score * 100)}% Confidence
                    </span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <span className="text-[11px] font-bold text-surface-dim uppercase tracking-wider block">
                      Expected Intake
                    </span>
                    <div className="my-1.5">
                      <span className="text-[28px] font-extrabold tracking-tight text-white tabular-nums">
                        {prediction.expected_intake_min}–{prediction.expected_intake_max}
                      </span>
                    </div>
                    <span className="text-[12px] text-surface-dim">Meals consumed by guests</span>
                  </div>

                  <div className="bg-primary/20 rounded-xl p-4 border border-primary/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-secondary-container uppercase tracking-wider">
                        Predicted Surplus
                      </span>
                      <span className="material-symbols-outlined text-secondary-fixed text-[18px]">verified</span>
                    </div>
                    <div className="my-1.5">
                      <span className="text-[28px] font-extrabold tracking-tight text-secondary-container tabular-nums">
                        {prediction.predicted_surplus_min}–{prediction.predicted_surplus_max}
                      </span>
                    </div>
                    <span className="text-[12px] text-white/90 font-medium">
                      Rescueable hot portions (~{prediction.surplus_quantity} meals)
                    </span>
                  </div>
                </div>

                {/* Risk Gauge */}
                <div className="bg-white/5 rounded-xl p-4 space-y-2 relative z-10 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error/20 text-error-container font-label-sm text-[11px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      {prediction.risk_level} SURPLUS RISK
                    </span>
                    <span className="text-[12px] text-surface-dim">
                      Surplus Probability: <strong className="text-secondary-fixed">{Math.round(prediction.confidence_score * 100)}%</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 h-2 w-full pt-1">
                    <div className="rounded-full bg-white/20"></div>
                    <div className="rounded-full bg-white/30"></div>
                    <div className="rounded-full bg-secondary-fixed"></div>
                  </div>
                </div>

                {/* Primary Proceed CTA */}
                <button
                  onClick={() => navigate(`/matches?prediction_id=${prediction.id}`)}
                  className="w-full h-12 bg-primary text-on-primary rounded-xl font-headline-sm text-[15px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-all hover:bg-primary-container cursor-pointer relative z-10"
                >
                  <span className="material-symbols-outlined text-[20px]">hub</span>
                  <span>Match Recipients ({prediction.surplus_quantity} Meals)</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>

              {/* Explainable AI Factor Breakdown */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container-high space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">explore</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Explainable AI Attribution
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Feature Weights
                  </span>
                </div>

                <div className="space-y-2.5">
                  {prediction.explainability && prediction.explainability.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container-low rounded-xl p-3 flex items-start gap-3 border border-surface-container-high"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          item.color === 'tertiary'
                            ? 'bg-tertiary-container/20 text-tertiary'
                            : item.color === 'secondary'
                            ? 'bg-secondary-container/40 text-secondary'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-label-md text-label-md text-on-surface font-bold">
                            {item.title}
                          </span>
                          <span
                            className={`font-label-sm text-label-sm font-bold ${
                              item.color === 'tertiary'
                                ? 'text-tertiary'
                                : item.color === 'secondary'
                                ? 'text-secondary'
                                : 'text-primary'
                            }`}
                          >
                            {item.impact}
                          </span>
                        </div>
                        <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Safe Window Timeline */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container-high space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">timelapse</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Safe Rescue Window
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-[11px] font-bold">
                    90m Maximum Freshness
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[12px] font-medium text-on-surface-variant">
                    <span>Buffet Concludes: <strong>{prediction.rescue_window_start}</strong></span>
                    <span className="text-secondary font-bold">Optimal: 8:30 PM</span>
                    <span>Cutoff: <strong>{prediction.rescue_window_cutoff}</strong></span>
                  </div>

                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-primary via-secondary to-tertiary h-full rounded-full w-3/4"></div>
                  </div>

                  <p className="text-[11px] text-on-surface-variant pt-1 leading-relaxed">
                    Cold-chain requirement: Thermal Cambros maintained &lt; 5°C or hot hold &gt; 60°C. Verified at pickup and dropoff.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
