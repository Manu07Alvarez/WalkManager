import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { registerWalkerSchema, RegisterWalkerInput } from '../api/authApi';

// TODO: Connect to real auth API - currently uses mock validation only
// REVIEW: Add CUIL format mask input (XX-XXXXXXXX-X)

type Tab = 'login' | 'register' | 'walker';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'login';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [formData, setFormData] = useState<RegisterWalkerInput & { password_confirm?: string }>({
    full_name: '',
    email: '',
    phone_number: '',
    cuil: '',
    password: '',
    password_confirm: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (tab === 'login') {
      // HACK: Mock login bypass for demo — replace with real JWT call
      navigate('/search');
      return;
    }

    const result = registerWalkerSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.errors.map((e) => e.message));
      return;
    }

    // TODO: Call POST /auth/register endpoint
    navigate('/search');
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'login',    label: 'Iniciar sesión',    icon: '🔑' },
    { key: 'register', label: 'Soy Cliente',       icon: '🐶' },
    { key: 'walker',   label: 'Soy Paseador',      icon: '🦮' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 mb-6 text-zinc-500 hover:text-white transition-colors text-sm"
          >
            ← Volver al inicio
          </button>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl">🐾</span>
          </div>
          <h1 className="text-2xl font-bold text-white">WalkManager</h1>
          <p className="text-sm text-zinc-500 mt-1">Tu plataforma de paseos profesionales</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/5 mb-8">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                  tab === t.key
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {(tab === 'register' || tab === 'walker') && (
              <>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Nombre completo</label>
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Juan García"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">CUIL</label>
                  <input
                    name="cuil"
                    value={formData.cuil}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="20-12345678-9"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Teléfono</label>
                  <input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+54 11 1234-5678"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Contraseña</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {(tab === 'register' || tab === 'walker') && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirmar contraseña</label>
                <input
                  name="password_confirm"
                  type="password"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 space-y-1">
                {errors.map((err, i) => (
                  <p key={i} className="text-xs text-rose-400">• {err}</p>
                ))}
              </div>
            )}

            <button type="submit" className="btn-brand w-full py-3.5 mt-2">
              {tab === 'login' ? '→ Ingresar a la plataforma' : '→ Crear mi cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
