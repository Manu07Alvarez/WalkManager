import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Search, Calendar, User, Star, Shield, Dog } from 'lucide-react';
import { AnimatedPage } from './AnimatedPage';

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
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#f4fafd] text-[#161d1f]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-[#dde4e6] bg-white shadow-level1">
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-6 py-5 border-b border-[#dde4e6] cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 rounded-2xl bg-[#005da7] flex items-center justify-center text-white shadow-sm">
            <Dog className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-headline font-bold text-[#005da7]">WalkManager</span>
            <p className="text-[10px] text-[#414751] font-body -mt-0.5">Plataforma de Paseadores</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-5 space-y-1">
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

        {/* Footer profile card */}
        <div className="px-4 py-4 border-t border-[#dde4e6] bg-[#f4fafd]">
          <div className="card-connection p-3 flex items-center gap-3 bg-white">
            <div className="w-8 h-8 rounded-full bg-[#005da7] flex items-center justify-center text-xs font-bold text-white shadow-sm font-headline">
              U
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#161d1f] truncate font-headline">Usuario Demo</p>
              <p className="text-[10px] text-[#414751] font-body">Paseador Verificado</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur border-b border-[#dde4e6] shadow-sm">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <Dog className="w-5 h-5 text-[#005da7]" />
          <span className="text-sm font-bold font-headline text-[#005da7]">WalkManager</span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `p-2 rounded-xl text-base transition-colors ${isActive ? 'bg-[#005da7]/10 text-[#005da7]' : 'text-[#414751] hover:text-[#005da7]'}`
                }
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Main content with smooth view transitions */}
      <main className="flex-1 md:overflow-y-auto">
        <div className="pt-14 md:pt-0 min-h-screen">
          <AnimatePresence mode="wait">
            <AnimatedPage key={location.pathname}>
              <Outlet />
            </AnimatedPage>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
