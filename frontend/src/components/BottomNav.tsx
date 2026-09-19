import React from 'react';
import { NavLink } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Overview', icon: 'dashboard' },
    { to: '/predict', label: 'Predict', icon: 'online_prediction' },
    { to: '/matches', label: 'Matching', icon: 'hub' },
    { to: '/missions', label: 'Missions', icon: 'local_shipping' },
    { to: '/recipients', label: 'Hubs', icon: 'storefront' },
    { to: '/impact', label: 'Impact', icon: 'eco' },
  ];

  return (
    // Hidden on md screens and above - desktop users get the full desktop top navigation
    <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl border-t border-surface-container-high shadow-[0_-1px_12px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-lg mx-auto px-2 flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 h-12 transition-all rounded-lg ${
                isActive
                  ? 'text-primary font-bold scale-105'
                  : 'text-on-surface-variant hover:text-primary hover:scale-100'
              }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="font-label-sm text-[10px] sm:text-label-sm tracking-tight mt-0.5">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
