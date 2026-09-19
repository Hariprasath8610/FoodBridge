import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type RescueMission } from '../api';

export const MissionsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [missions, setMissions] = useState<RescueMission[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const data = await api.getMissions();
      setMissions(data);
    } catch (err) {
      console.error('Error fetching missions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMissions = missions.filter((m) => {
    const matchesSearch =
      m.mission_code.toLowerCase().includes(search.toLowerCase()) ||
      (m.donor_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.recipient_name || '').toLowerCase().includes(search.toLowerCase()) ||
      m.assigned_driver.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'active') return m.status !== 'DELIVERED';
    if (filter === 'delivered') return m.status === 'DELIVERED';
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">local_shipping</span>
            <span className="text-[12px] font-bold text-secondary uppercase tracking-wider">
              Fleet & Dispatch Ledger
            </span>
            <span className="text-surface-container-highest">•</span>
            <span className="text-[12px] text-on-surface-variant font-mono">
              Immutable Custody Audit
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Rescue Missions Dispatch Log
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Auditable custody logs for all past and currently active food redistribution missions.
          </p>
        </div>

        <button
          onClick={() => navigate('/predict')}
          className="h-10 px-4 rounded-xl bg-primary text-on-primary font-semibold text-label-md flex items-center gap-2 hover:bg-primary-container transition-colors self-start lg:self-center cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>New Surplus Mission</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search mission code, donor, recipient, or driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest rounded-xl py-2.5 pl-10 pr-4 text-on-surface font-body-md border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-label-sm font-semibold transition-all cursor-pointer border ${
              filter === 'all'
                ? 'bg-primary text-on-primary border-primary shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border-surface-container-high'
            }`}
          >
            All ({missions.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl text-label-sm font-semibold transition-all cursor-pointer border ${
              filter === 'active'
                ? 'bg-primary text-on-primary border-primary shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border-surface-container-high'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-xl text-label-sm font-semibold transition-all cursor-pointer border ${
              filter === 'delivered'
                ? 'bg-primary text-on-primary border-primary shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border-surface-container-high'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Desktop Missions List */}
      <div className="space-y-3">
        {filteredMissions.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/rescue/${m.id}`)}
            className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container-high flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-primary/40 transition-all group"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[24px]">local_shipping</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
                    Mission #{m.mission_code}
                  </h3>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      m.status === 'DELIVERED'
                        ? 'bg-secondary/15 text-secondary border-secondary/30'
                        : 'bg-primary/15 text-primary border-primary/30'
                    }`}
                  >
                    {m.status === 'DELIVERED' ? 'DELIVERED ✓' : m.status}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface font-semibold mt-1">
                  {m.meals_quantity} Meals ({m.food_category}) • <strong>{m.donor_name || 'Grand Palace Pavilion'}</strong> → <strong>{m.recipient_name}</strong>
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-on-surface-variant text-[12px] mt-1.5">
                  <span>Driver: <strong>{m.assigned_driver}</strong></span>
                  <span>•</span>
                  <span>Core Temp: <strong>{m.core_temp_celsius}°C</strong></span>
                  <span>•</span>
                  <span className="font-mono">Security Token: {m.pickup_token}</span>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-surface-container">
              <span className="text-primary font-bold text-label-md flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Open Tracking & QR</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </span>
            </div>
          </div>
        ))}

        {filteredMissions.length === 0 && (
          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-surface-container-high text-on-surface-variant">
            No rescue missions matched the current criteria.
          </div>
        )}
      </div>
    </div>
  );
};
