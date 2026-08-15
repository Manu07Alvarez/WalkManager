import React, { useState } from 'react';
import { User, Edit3, Save, MapPin, Star, Clock, Calendar, CheckCircle2 } from 'lucide-react';

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
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in font-body">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#005da7] flex items-center gap-3">
            <User className="w-8 h-8 text-[#005da7]" /> Mi Perfil
          </h1>
          <p className="text-sm text-[#414751] mt-1 font-body">Información pública visible para los dueños de mascotas</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className={editing ? 'btn-brand py-2.5 px-5 text-xs flex items-center gap-2' : 'btn-ghost py-2.5 px-5 text-xs flex items-center gap-2'}
        >
          {editing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {editing ? 'Guardar cambios' : 'Editar perfil'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Avatar + stats */}
        <div className="space-y-5">
          <div className="card-connection p-6 flex flex-col items-center text-center bg-white border-[#dde4e6]">
            <div className="w-24 h-24 rounded-full bg-[#005da7] flex items-center justify-center text-3xl font-headline font-bold text-white shadow-md mb-4">
              {profile.name.charAt(0)}
            </div>
            <h2 className="font-headline font-bold text-[#161d1f] text-lg">{profile.name}</h2>
            <p className="text-xs text-[#414751] flex items-center gap-1 mt-1 font-body">
              <MapPin className="w-3.5 h-3.5 text-[#005da7]" /> {profile.zone}
            </p>
            <div className="mt-4 flex gap-1 justify-center text-[#feae2c]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs font-bold text-[#161d1f] mt-1 font-body">4.9 · 47 reseñas</p>
          </div>

          <div className="card-connection p-5 space-y-3 bg-white border-[#dde4e6]">
            <p className="text-xs font-headline font-bold text-[#005da7] uppercase tracking-wider">Estadísticas</p>
            {[
              { label: 'Paseos completados', value: '142' },
              { label: 'Max. perros simultáneos', value: `${profile.maxDogs} 🐕` },
              { label: 'Precio por servicio', value: `$${profile.pricePerService.toLocaleString()}` },
              { label: 'Tipos de perros', value: profile.dogTypes },
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between items-center text-xs">
                <span className="text-[#414751] font-body">{stat.label}</span>
                <span className="font-headline font-bold text-[#161d1f]">{stat.value}</span>
              </div>
            ))}
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
            <p className="text-xs font-headline font-bold text-[#005da7] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Horario disponible
            </p>
            <div className="grid grid-cols-7 gap-1.5 mb-5">
              {DAYS.map((day) => {
                const active = profile.availableDays.includes(day);
                return (
                  <div
                    key={day}
                    className={`rounded-xl p-2 text-center transition-all duration-200 ${
                      active
                        ? 'bg-[#005da7] text-white shadow-sm font-headline font-bold'
                        : 'bg-[#eef5f7] border border-[#dde4e6] text-[#414751]'
                    }`}
                  >
                    <span className="text-[10px] block">{day.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2.5">
              {schedules.map((s) => (
                <div key={s.day} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#eef5f7] border border-[#dde4e6]">
                  <span className="font-headline font-bold text-[#161d1f] w-24">{s.day}</span>
                  <span className="text-[#414751] flex items-center gap-1 font-body">
                    <Clock className="w-3 h-3 text-[#005da7]" /> {s.from} → {s.to}
                  </span>
                  <span className="badge badge-accepted">
                    <CheckCircle2 className="w-3 h-3" /> Disponible
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
