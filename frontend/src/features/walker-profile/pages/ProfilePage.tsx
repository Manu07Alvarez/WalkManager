import React, { useState, useEffect } from 'react';
import { User, Edit3, Save, MapPin, Star, Clock, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { AuthUser } from '../../auth/api/authApi';
import { updateMyWalkerProfile } from '../api/walkerProfileApi';
import { NotificationModal, NotificationType } from '../../../shared/components/NotificationModal';

interface Schedule {
  day: string;
  from: string;
  to: string;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ProfilePage: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('user_info');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showModal = (title: string, message: string, type: NotificationType = 'info') => {
    setModalState({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const [profile, setProfile] = useState({
    name: user?.full_name || 'Usuario WalkManager',
    email: user?.email || 'usuario@walkmanager.dev',
    role: user?.role || 'Customer',
    zone: 'Palermo, CABA',
    description:
      user?.role === 'DogWalker'
        ? 'Paseador profesional verificado en WalkManager. Amante de las mascotas con años de experiencia.'
        : 'Usuario cliente en WalkManager. Amante de los perros y paseo responsable.',
    maxDogs: 3,
    pricePerService: 2500,
    dogTypes: 'Grandes, medianos, pequeños',
    availableDays: ['Lunes', 'Miércoles', 'Viernes', 'Sábado'],
  });

  useEffect(() => {
    const stored = localStorage.getItem('user_info');
    if (stored) {
      try {
        const u: AuthUser = JSON.parse(stored);
        setUser(u);
        setProfile((prev) => ({
          ...prev,
          name: u.full_name,
          email: u.email,
          role: u.role,
        }));
      } catch {}
    }
  }, []);

  const toggleDay = (day: string) => {
    if (!editing) return;
    setProfile((prev) => {
      const exists = prev.availableDays.includes(day);
      const nextDays = exists
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: nextDays };
    });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updated = await updateMyWalkerProfile({
        name: profile.name,
        zone: profile.zone,
        description: profile.description,
        maxDogs: profile.maxDogs,
        pricePerService: profile.pricePerService,
        dogTypes: profile.dogTypes,
        availableDays: profile.availableDays,
      });

      if (user) {
        const updatedUser: AuthUser = {
          ...user,
          full_name: updated.name || profile.name,
        };
        setUser(updatedUser);
        localStorage.setItem('user_info', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('auth-changed'));
      }

      setEditing(false);
      showModal('¡Perfil actualizado!', 'Tus cambios han sido guardados exitosamente.', 'success');
    } catch {
      showModal('Error al guardar', 'No se pudieron guardar los cambios en tu perfil. Intentalo de nuevo.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const schedules: Schedule[] = profile.availableDays.map((day) => ({
    day,
    from: '08:00',
    to: '14:00',
  }));

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'DogWalker':
        return 'Paseador de Perros Verificado';
      case 'Moderator':
        return 'Moderador de Plataforma';
      case 'Customer':
      default:
        return 'Cliente / Dueño de Mascota';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in font-body">
      <NotificationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onClose={closeModal}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#005da7] flex items-center gap-3">
            <User className="w-8 h-8 text-[#005da7]" /> Mi Perfil
          </h1>
          <p className="text-sm text-[#414751] mt-1 font-body">
            Información de la cuenta de {profile.name} ({getRoleLabel(profile.role)})
          </p>
        </div>
        {editing ? (
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="btn-brand py-2.5 px-5 text-xs flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar cambios
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="btn-ghost py-2.5 px-5 text-xs flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" /> Editar perfil
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Avatar + stats */}
        <div className="space-y-5">
          <div className="card-connection p-6 flex flex-col items-center text-center bg-white border-[#dde4e6]">
            <div className="w-24 h-24 rounded-full bg-[#005da7] flex items-center justify-center text-3xl font-headline font-bold text-white shadow-md mb-4">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            {editing ? (
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="input-field text-center font-bold font-headline text-base mb-2"
              />
            ) : (
              <h2 className="font-headline font-bold text-[#161d1f] text-lg">{profile.name}</h2>
            )}
            <p className="text-xs text-[#005da7] font-bold mt-0.5">{getRoleLabel(profile.role)}</p>
            {editing ? (
              <input
                value={profile.zone}
                onChange={(e) => setProfile({ ...profile, zone: e.target.value })}
                className="input-field text-center text-xs mt-2"
                placeholder="Zona / Barrio"
              />
            ) : (
              <p className="text-xs text-[#414751] flex items-center gap-1 mt-1 font-body">
                <MapPin className="w-3.5 h-3.5 text-[#005da7]" /> {profile.zone}
              </p>
            )}
            <div className="mt-4 flex gap-1 justify-center text-[#feae2c]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs font-bold text-[#161d1f] mt-1 font-body">4.9 · Perfil Activo</p>
          </div>

          <div className="card-connection p-5 space-y-3 bg-white border-[#dde4e6]">
            <p className="text-xs font-headline font-bold text-[#005da7] uppercase tracking-wider">Detalles de Cuenta</p>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#414751] font-body">Email</span>
                <span className="font-headline font-bold text-[#161d1f] truncate max-w-[150px]">{profile.email}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#414751] font-body">Max. perros simultáneos</span>
                {editing ? (
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={profile.maxDogs}
                    onChange={(e) => setProfile({ ...profile, maxDogs: Number(e.target.value) })}
                    className="input-field w-20 text-center py-1 text-xs"
                  />
                ) : (
                  <span className="font-headline font-bold text-[#161d1f]">{profile.maxDogs} 🐕</span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#414751] font-body">Precio por servicio ($ ARS)</span>
                {editing ? (
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={profile.pricePerService}
                    onChange={(e) => setProfile({ ...profile, pricePerService: Number(e.target.value) })}
                    className="input-field w-24 text-center py-1 text-xs"
                  />
                ) : (
                  <span className="font-headline font-bold text-[#161d1f]">${profile.pricePerService.toLocaleString()}</span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#414751] font-body">Tipos de perros</span>
                {editing ? (
                  <input
                    value={profile.dogTypes}
                    onChange={(e) => setProfile({ ...profile, dogTypes: e.target.value })}
                    className="input-field w-32 py-1 text-xs"
                  />
                ) : (
                  <span className="font-headline font-bold text-[#161d1f] truncate max-w-[140px]">{profile.dogTypes}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card-connection p-6 bg-white border-[#dde4e6]">
            <p className="text-xs font-headline font-bold text-[#005da7] uppercase tracking-wider mb-3">Descripción</p>
            {editing ? (
              <textarea
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="input-field min-h-[100px] resize-none"
              />
            ) : (
              <p className="text-sm text-[#414751] leading-relaxed font-body">{profile.description}</p>
            )}
          </div>

          <div className="card-connection p-6 bg-white border-[#dde4e6]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-headline font-bold text-[#005da7] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Días de disponibilidad
              </p>
              {editing && (
                <span className="text-[11px] text-[#005da7] font-semibold">¡Hacé clic en un día para activar/desactivar!</span>
              )}
            </div>

            {/* Interactive Day Selection Grid */}
            <div className="grid grid-cols-7 gap-1.5 mb-5">
              {DAYS.map((day) => {
                const active = profile.availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-xl p-2.5 text-center transition-all duration-200 ${
                      active
                        ? 'bg-[#005da7] text-white shadow-sm font-headline font-bold scale-105'
                        : 'bg-[#eef5f7] border border-[#dde4e6] text-[#414751] hover:border-[#005da7]/50'
                    } ${editing ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                  >
                    <span className="text-xs block font-bold">{day.slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2.5">
              {schedules.length === 0 ? (
                <p className="text-xs text-[#414751] italic text-center py-4">No hay días seleccionados como disponibles.</p>
              ) : (
                schedules.map((s) => (
                  <div key={s.day} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#eef5f7] border border-[#dde4e6]">
                    <span className="font-headline font-bold text-[#161d1f] w-24">{s.day}</span>
                    <span className="text-[#414751] flex items-center gap-1 font-body">
                      <Clock className="w-3 h-3 text-[#005da7]" /> {s.from} → {s.to}
                    </span>
                    <span className="badge badge-accepted">
                      <CheckCircle2 className="w-3 h-3" /> Disponible
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
