import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onRunDemo?: () => void;
  isDemoRunning?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onRunDemo,
  isDemoRunning = false,
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Overview', icon: 'dashboard' },
    { to: '/predict', label: 'Predict Surplus', icon: 'online_prediction' },
    { to: '/matches', label: 'Recipient Matching', icon: 'hub' },
    { to: '/missions', label: 'Rescue Missions', icon: 'local_shipping' },
    { to: '/recipients', label: 'Community Hubs', icon: 'storefront' },
    { to: '/impact', label: 'Impact & ESG', icon: 'eco' },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-surface-container-high shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Top Bar: Brand, Desktop Nav Links & Action Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo & Tag */}
          <div
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">diversity_1</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight">
                  FoodBridge
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-secondary-container/40 text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">
                  Rescue OS
                </span>
              </div>
              <span className="text-[11px] font-medium text-on-surface-variant tracking-tight">
                Predictive Redistribution Network
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold shadow-xs border border-primary/20'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right: Actions, Demo Trigger & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Live Telemetry Pill (Desktop) */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-surface-container-high text-[11px] text-on-surface-variant font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span>AI Core Live</span>
            </div>

            {/* 1-Click Demo Trigger */}
            {onRunDemo && (
              <button
                onClick={onRunDemo}
                disabled={isDemoRunning}
                className="h-9 px-3 sm:px-4 rounded-xl bg-secondary-container/40 text-on-secondary-container flex items-center gap-1.5 hover:bg-secondary-container active:scale-95 transition-all disabled:opacity-60 shadow-xs cursor-pointer border border-secondary/20"
                title="Simulate end-to-end banquet surplus rescue pipeline"
              >
                <span
                  className={`material-symbols-outlined text-[18px] text-secondary ${
                    isDemoRunning ? 'animate-spin' : ''
                  }`}
                >
                  {isDemoRunning ? 'sync' : 'smart_toy'}
                </span>
                <span className="font-label-sm text-label-sm font-bold whitespace-nowrap">
                  {isDemoRunning ? 'Simulating...' : '1-Click Demo'}
                </span>
              </button>
            )}

            {/* New Prediction Primary CTA */}
            <button
              onClick={() => navigate('/predict')}
              className="hidden sm:inline-flex h-9 px-3.5 rounded-xl bg-primary text-on-primary items-center gap-1.5 hover:bg-primary-container active:scale-95 transition-all shadow-sm font-semibold text-label-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">add_circle</span>
              <span className="whitespace-nowrap">+ New Prediction</span>
            </button>

            {/* User Profile Avatar */}
            <div
              className="w-9 h-9 rounded-xl bg-surface-container-high border border-surface-container flex items-center justify-center text-primary cursor-pointer hover:bg-surface-container transition-colors"
              title="Operations Command"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </div>

            {/* Mobile Menu Toggle Button (Phone/Tablet) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Header Operational Telemetry Banner */}
      <div className="bg-surface-container-low/60 border-t border-surface-container-high/60 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span>Scikit-Learn ML Model: Active</span>
            </span>
            <span className="text-surface-container-highest">•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-primary">cloud_done</span>
              <span>Weather Radar: Connected (Chennai Hub)</span>
            </span>
            <span className="text-surface-container-highest">•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-secondary">sensors</span>
              <span>Cold-Chain IoT: Monitored</span>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span>Latency: 38ms</span>
            <span>Uptime: 99.9%</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Visible only when mobileMenuOpen is true) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-surface-container-high bg-surface-container-lowest px-4 pt-2 pb-4 space-y-1 shadow-lg animate-fadeIn">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-md font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
          <div className="pt-2 border-t border-surface-container flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/predict');
              }}
              className="w-full h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center gap-2 font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ New Prediction</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
