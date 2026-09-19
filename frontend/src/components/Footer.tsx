import React from 'react';
import { NavLink } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-surface-container-high mt-auto">
      {/* Upper Footer: Brand & Link Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Brand, Mission, & Live Telemetry */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">diversity_1</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                  FoodBridge
                </span>
                <span className="font-label-sm text-[11px] text-primary uppercase font-bold tracking-wider">
                  Surplus Rescue Platform
                </span>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed max-w-sm">
              Predicting surplus before it becomes waste. FoodBridge bridges the gap between commercial banquet
              surplus and verified community food programs via algorithmic matching and cold-chain transparency.
            </p>

            {/* Live System Health Badge */}
            <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high flex items-center justify-between max-w-sm">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                </span>
                <span className="font-label-sm text-[12px] font-semibold text-on-surface">
                  Core Network Online
                </span>
              </div>
              <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                ML v4.2 • 38ms
              </span>
            </div>
          </div>

          {/* Col 3: Platform Routing */}
          <div className="space-y-3">
            <h4 className="font-label-sm text-label-sm uppercase font-bold tracking-wider text-on-surface">
              Operations
            </h4>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              <li>
                <NavLink to="/" className="hover:text-primary transition-colors">
                  Operational Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/predict" className="hover:text-primary transition-colors">
                  Surplus Predictor (ML)
                </NavLink>
              </li>
              <li>
                <NavLink to="/matches" className="hover:text-primary transition-colors">
                  Recipient Matcher
                </NavLink>
              </li>
              <li>
                <NavLink to="/missions" className="hover:text-primary transition-colors">
                  Rescue Missions Log
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Ecosystem */}
          <div className="space-y-3">
            <h4 className="font-label-sm text-label-sm uppercase font-bold tracking-wider text-on-surface">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              <li>
                <NavLink to="/recipients" className="hover:text-primary transition-colors">
                  Verified Hubs Directory
                </NavLink>
              </li>
              <li>
                <NavLink to="/impact" className="hover:text-primary transition-colors">
                  Impact & ESG Ledger
                </NavLink>
              </li>
              <li>
                <span className="text-on-surface-variant/70 cursor-not-allowed">
                  Cold-Chain IoT Sensor API
                </span>
              </li>
              <li>
                <span className="text-on-surface-variant/70 cursor-not-allowed">
                  Air-Gapped Handshake
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Standards & Compliance */}
          <div className="space-y-3">
            <h4 className="font-label-sm text-label-sm uppercase font-bold tracking-wider text-on-surface">
              Standards & SDG
            </h4>
            <div className="space-y-2 text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                <span>FSSAI Hygiene Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">eco</span>
                <span>UN SDG 2: Zero Hunger</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">recycling</span>
                <span>UN SDG 12: Responsible Use</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">co2</span>
                <span>Scope 3 Emission Offsets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer: Copyright & Benchmarks */}
      <div className="border-t border-surface-container py-4 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-on-surface-variant">
          <p>© 2026 FoodBridge Intelligence Platform. Built for Hackathon Excellence.</p>
          <div className="flex items-center gap-4">
            <span>FAO Food Loss Framework</span>
            <span>•</span>
            <span>WRI GHG Protocol</span>
            <span>•</span>
            <span>ISO 22000 Food Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
