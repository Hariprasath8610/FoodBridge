import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type Recipient } from '../api';

export const RecipientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      const data = await api.getRecipients();
      setRecipients(data);
    } catch (err) {
      console.error('Error fetching recipients:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = recipients.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'verified') return r.verified;
    if (filter === 'veg') return r.dietary_preferences.toLowerCase().includes('veg');
    if (filter === 'pickup') return r.pickup_available;
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">storefront</span>
            <span className="text-[12px] font-bold text-secondary uppercase tracking-wider">
              Verified Partner Network
            </span>
            <span className="text-surface-container-highest">•</span>
            <span className="text-[12px] text-on-surface-variant font-mono">
              FSSAI Hygiene Inspected
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Community Food Recipients & Hubs
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Approved shelters, community kitchens, and welfare distribution centers ready for immediate dispatch and intake.
          </p>
        </div>

        <button
          onClick={() => navigate('/matches')}
          className="h-10 px-4 rounded-xl bg-primary text-on-primary font-semibold text-label-md flex items-center gap-2 hover:bg-primary-container transition-colors self-start lg:self-center cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">hub</span>
          <span>Match Active Surplus</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search recipient name, district, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest rounded-xl py-2.5 pl-10 pr-4 text-on-surface font-body-md border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: `All Hubs (${recipients.length})` },
            { id: 'verified', label: 'Verified NGO' },
            { id: 'veg', label: 'Vegetarian Only' },
            { id: 'pickup', label: 'Pickup Ready' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-2 rounded-xl text-label-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                filter === f.id
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border-surface-container-high'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Responsive Desktop Grid for Recipients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container-high flex flex-col justify-between space-y-4 transition-all hover:border-primary/40 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">
                    {r.recipient_type.includes('Shelter') ? 'night_shelter' : 'soup_kitchen'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
                      {r.name}
                    </h3>
                    {r.verified && (
                      <span className="material-symbols-outlined text-[18px] text-secondary" title="Verified NGO">
                        verified
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-on-surface-variant truncate mt-0.5">{r.address}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container text-[11px] font-bold uppercase tracking-wider flex-shrink-0">
                {r.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-container-low border border-surface-container text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Distance</span>
                <span className="text-[13px] font-bold text-primary">{r.distance_km} km</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Demand</span>
                <span className="text-[13px] font-bold text-on-surface">{r.current_demand_meals} meals</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Capacity</span>
                <span className="text-[13px] font-bold text-secondary">{r.capacity_people} pax</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-surface-container">
              <span className="text-[12px] text-on-surface-variant font-medium">
                Prefers: <strong>{r.dietary_preferences}</strong>
              </span>
              <button
                onClick={() => navigate('/matches')}
                className="h-9 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-bold text-label-sm flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Dispatch Batch</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
