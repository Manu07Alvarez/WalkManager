import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Search, Calendar, User, Star, Shield, Dog } from 'lucide-react';

// TODO: Add notification bell with unread badge count from notifications API
// TODO: Add user avatar dropdown with role switcher for demo mode
// REVIEW: Confirm responsive sidebar collapse at 768px breakpoint

const navItems = [
  { to: '/search',     icon: Search,   label: 'Buscar Paseadores' },
  { to: '/bookings',   icon: Calendar, label: 'Mis Reservas' },
  { to: '/profile',    icon: User,     label: 'Mi Perfil' },
  { to: '/reviews',    icon: Star,     label: 'Reseñas' },
  { to: '/moderation', icon: Shield,   label: 'Moderación' },
];

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-white/5 bg-[#0f0f12]">
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-6 py-5 border-b border-white/5 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white">
            <Dog className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-gradient">WalkManager</span>
            <p className="text-[10px] text-zinc-500 -mt-0.5">Dog Walking Platform</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="glass-card p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold text-white">
              U
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">Usuario Demo</p>
              <p className="text-[10px] text-zinc-500">DogWalker</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0f0f12]/95 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <Dog className="w-5 h-5 text-brand-500" />
          <span className="text-sm font-bold text-gradient">WalkManager</span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `p-2 rounded-lg text-base transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`
                }
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:overflow-y-auto">
        <div className="pt-14 md:pt-0 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
