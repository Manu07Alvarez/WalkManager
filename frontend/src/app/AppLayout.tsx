import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Search, Calendar, User, Star, Shield, LogOut } from 'lucide-react';
import { AnimatedPage } from './AnimatedPage';
import { AuthUser } from '../features/auth/api/authApi';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  roles?: Array<'Customer' | 'DogWalker' | 'Moderator'>;
}

const allNavItems: NavItem[] = [
  { to: '/search',     icon: Search,   label: 'Buscar Paseadores', roles: ['Customer'] },
  { to: '/bookings',   icon: Calendar, label: 'Mis Reservas',       roles: ['Customer', 'DogWalker'] },
  { to: '/profile',    icon: User,     label: 'Mi Perfil',          roles: ['Customer', 'DogWalker', 'Moderator'] },
  { to: '/reviews',    icon: Star,     label: 'Reseñas',            roles: ['Customer', 'DogWalker', 'Moderator'] },
  { to: '/moderation', icon: Shield,   label: 'Moderación',        roles: ['Moderator'] },
];

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('user_info');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const stored = localStorage.getItem('user_info');
        setCurrentUser(stored ? JSON.parse(stored) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setCurrentUser(null);
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/auth?tab=login');
  };

  const userRole = currentUser?.role || 'Customer';

  const visibleNavItems = allNavItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'DogWalker':
        return 'Paseador Verificado';
      case 'Moderator':
        return 'Moderador de Plataforma';
      case 'Customer':
      default:
        return 'Cliente / Dueño';
    }
  };

  const avatarInitial = currentUser?.full_name
    ? currentUser.full_name.charAt(0).toUpperCase()
    : 'U';

  return (
    <div className="flex min-h-screen bg-[#f4fafd] text-[#161d1f]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-[#dde4e6] bg-white shadow-level1">
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-6 py-5 border-b border-[#dde4e6] cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img src="/icon.svg" alt="WalkManager Logo" className="w-11 h-11 scale-110 object-contain drop-shadow-sm transition-transform hover:scale-125" />
          <div>
            <span className="text-base font-headline font-bold text-[#005da7]">WalkManager</span>
            <p className="text-[10px] text-[#414751] font-body -mt-0.5">Plataforma de Paseadores</p>
          </div>
        </div>

        {/* Nav links filtered by role */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {visibleNavItems.map((item) => {
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

        {/* Footer profile card with active session & logout */}
        <div className="px-4 py-4 border-t border-[#dde4e6] bg-[#f4fafd] space-y-2">
          {currentUser ? (
            <div className="card-connection p-3 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#005da7] flex items-center justify-center text-xs font-bold text-white shadow-sm font-headline">
                  {avatarInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#161d1f] truncate font-headline">
                    {currentUser.full_name}
                  </p>
                  <p className="text-[10px] text-[#414751] font-body">
                    {getRoleBadge(currentUser.role)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => navigate('/auth?tab=login')}
              className="card-connection p-3 flex items-center gap-3 bg-white cursor-pointer hover:bg-[#eef5f7] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#005da7]/10 text-[#005da7] flex items-center justify-center text-xs font-bold font-headline">
                ?
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#005da7] truncate font-headline">Ingresar / Registrarse</p>
                <p className="text-[10px] text-[#414751] font-body">Iniciar sesión con tu cuenta</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur border-b border-[#dde4e6] shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/icon.svg" alt="WalkManager Logo" className="w-9 h-9 scale-110 object-contain" />
          <span className="text-sm font-bold font-headline text-[#005da7]">WalkManager</span>
        </div>
        <div className="flex items-center gap-1">
          {visibleNavItems.slice(0, 4).map((item) => {
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
          {currentUser && (
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-2 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
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
