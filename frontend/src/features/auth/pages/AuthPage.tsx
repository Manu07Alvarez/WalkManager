import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Key, UserCheck, ShieldCheck, ArrowLeft } from 'lucide-react';
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

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'login',    label: 'Iniciar sesión', icon: Key },
    { key: 'register', label: 'Soy Cliente',    icon: UserCheck },
    { key: 'walker',   label: 'Soy Paseador',   icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#f4fafd] text-[#161d1f] flex items-center justify-center px-4 py-12 font-body">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#005da7]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 mb-6 text-[#414751] hover:text-[#005da7] transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </button>
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src="/icon.svg" alt="WalkManager Logo" className="w-14 h-14 object-contain drop-shadow-sm" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-[#005da7]">WalkManager</h1>
          <p className="text-sm text-[#414751] mt-1 font-body">Tu plataforma de paseos profesionales</p>
        </div>

        {/* Card */}
        <div className="card-connection p-8 bg-white shadow-level2 border-[#dde4e6]">
          {/* Tabs with layout morph pill */}
          <div className="relative flex gap-1.5 p-1.5 rounded-2xl bg-[#eef5f7] mb-8">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`relative flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold font-headline transition-colors duration-200 z-10 ${
                    isActive ? 'text-white' : 'text-[#414751] hover:text-[#005da7]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="auth-tab-pill"
                      className="absolute inset-0 bg-[#005da7] rounded-xl shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="hidden sm:inline relative z-10">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form with smooth animated transitions */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {(tab === 'register' || tab === 'walker') && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-[#161d1f] mb-1.5 font-headline">Nombre completo</label>
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
                      <label className="block text-xs font-bold text-[#161d1f] mb-1.5 font-headline">CUIL</label>
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
                      <label className="block text-xs font-bold text-[#161d1f] mb-1.5 font-headline">Teléfono</label>
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
                  <label className="block text-xs font-bold text-[#161d1f] mb-1.5 font-headline">Email</label>
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
                  <label className="block text-xs font-bold text-[#161d1f] mb-1.5 font-headline">Contraseña</label>
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
                    <label className="block text-xs font-bold text-[#161d1f] mb-1.5 font-headline">Confirmar contraseña</label>
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
                  <div className="rounded-xl border border-[#ba1a1a]/30 bg-[#ffdad6] p-4 space-y-1">
                    <p className="text-xs font-bold text-[#93000a] font-headline">Ruh-roh! Revisá estos campos:</p>
                    {errors.map((err, i) => (
                      <p key={i} className="text-xs text-[#93000a]">• {err}</p>
                    ))}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-brand w-full py-3.5 mt-2"
                >
                  {tab === 'login' ? '¡Ingresar a la plataforma!' : '¡Crear mi cuenta!'}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
};
