import React, { useState } from 'react';

// TODO: Connect to GET /walker-profile/:id and PATCH /walker-profile endpoints
// REVIEW: Add availability schedule calendar component (weekly grid)

interface Schedule {
  day: string;
  from: string;
  to: string;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ProfilePage: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'María González',
    zone: 'Palermo, CABA',
    description: 'Paseadora certificada con 5 años de experiencia. Especializada en razas grandes. Envío fotos y actualizaciones durante cada paseo.',
    maxDogs: 3,
    pricePerService: 2500,
    dogTypes: 'Grandes, medianos',
    availableDays: ['Lunes', 'Miércoles', 'Viernes', 'Sábado'],
  });

  const schedules: Schedule[] = [
    { day: 'Lunes', from: '08:00', to: '12:00' },
    { day: 'Miércoles', from: '08:00', to: '12:00' },
    { day: 'Viernes', from: '14:00', to: '18:00' },
    { day: 'Sábado', from: '09:00', to: '14:00' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">👤 Mi Perfil</h1>
          <p className="text-sm text-zinc-500 mt-1">Información pública como paseador</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className={editing ? 'btn-brand py-2 px-5 text-sm' : 'btn-ghost py-2 px-5 text-sm'}
        >
          {editing ? '💾 Guardar cambios' : '✏️ Editar perfil'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Avatar + stats */}
        <div className="space-y-4">
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-3xl font-bold text-white mb-4">
              {profile.name.charAt(0)}
            </div>
            <h2 className="font-bold text-white">{profile.name}</h2>
            <p className="text-xs text-zinc-500 mt-1">📍 {profile.zone}</p>
            <div className="mt-4 flex gap-1 justify-center">
              {[1,2,3,4,5].map((s) => (
                <span key={s} className="text-amber-400 text-lg">★</span>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-1">4.9 · 47 reseñas</p>
          </div>

          <div className="glass-card p-4 space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Estadísticas</p>
            {[
              { label: 'Paseos completados', value: '142' },
              { label: 'Max. perros simultáneos', value: `${profile.maxDogs} 🐕` },
              { label: 'Precio por servicio', value: `$${profile.pricePerService.toLocaleString()}` },
              { label: 'Tipos de perros', value: profile.dogTypes },
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">{stat.label}</span>
                <span className="text-xs font-semibold text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Descripción</p>
            {editing ? (
              <textarea
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="input-field min-h-[100px] resize-none"
              />
            ) : (
              <p className="text-sm text-zinc-300 leading-relaxed">{profile.description}</p>
            )}
          </div>

          <div className="glass-card p-5">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Horario disponible</p>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {DAYS.map((day) => {
                const active = profile.availableDays.includes(day);
                return (
                  <div
                    key={day}
                    className={`rounded-lg p-2 text-center cursor-pointer transition-all duration-200 ${
                      active
                        ? 'bg-brand-500/20 border border-brand-500/30 text-brand-400'
                        : 'bg-white/3 border border-white/5 text-zinc-600'
                    }`}
                  >
                    <span className="text-[10px] font-semibold">{day.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              {schedules.map((s) => (
                <div key={s.day} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium w-24">{s.day}</span>
                  <span className="text-zinc-500">{s.from} → {s.to}</span>
                  <span className="badge badge-accepted">Disponible</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
