import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Dog, Shield, Star, Calendar, MessageSquare, Bell } from 'lucide-react';

// REVIEW: Add animated hero background with PostGIS map integration when available

const features = [
  {
    icon: Search,
    title: 'Búsqueda por Proximidad',
    desc: 'Encuentra paseadores cercanos con filtros de distancia, precio y disponibilidad.',
  },
  {
    icon: Calendar,
    title: 'Reservas en Tiempo Real',
    desc: 'Gestión de reservas concurrente y segura. Notificaciones instantáneas.',
  },
  {
    icon: Star,
    title: 'Reseñas Verificadas',
    desc: 'Solo reseñas de paseos completados, moderadas antes de publicarse.',
  },
  {
    icon: Shield,
    title: 'Moderación Interna',
    desc: 'Sistema de incidentes y restricciones transparente para ambos roles.',
  },
  {
    icon: MessageSquare,
    title: 'Chat en Tiempo Real',
    desc: 'Conversaciones pre-reserva y chat específico por reserva con WebSockets.',
  },
  {
    icon: Bell,
    title: 'Notificaciones Multi-canal',
    desc: 'Email o mensajería según tu preferencia. Actualizaciones de estado.',
  },
];

const stats = [
  { value: '< 2s', label: 'Tiempo de búsqueda' },
  { value: '95%', label: 'Chat en 5 segundos' },
  { value: '100%', label: 'Sin overbooking' },
  { value: '3 roles', label: 'Walker · Cliente · Moderador' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-brand-700/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white">
            <Dog className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-gradient">WalkManager</span>
            <p className="text-[10px] text-zinc-600 -mt-0.5 hidden md:block">Dog Walking Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/auth')}
            className="btn-ghost text-sm"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/auth?tab=register')}
            className="btn-brand text-sm"
          >
            Registrarse
          </button>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-24 md:pt-32 md:pb-40"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-400 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
          Plataforma de paseadores verificados
        </motion.div>

        <h1 className="max-w-3xl text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
          Tu perro merece el
          <span className="text-gradient"> mejor paseo</span>
        </h1>

        <p className="mt-6 max-w-xl text-base md:text-lg text-zinc-400 leading-relaxed">
          Conectamos dueños de mascotas con paseadores profesionales verificados.
          Búsqueda por proximidad, reservas seguras y chat en tiempo real.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/search')}
            className="btn-brand px-8 py-4 text-base flex items-center gap-2"
          >
            <Search className="w-5 h-5" /> Buscar Paseadores
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/auth?tab=walker')}
            className="btn-ghost px-8 py-4 text-base flex items-center gap-2"
          >
            <Dog className="w-5 h-5" /> Soy Paseador
          </motion.button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card p-4 text-center"
            >
              <div className="text-2xl font-extrabold text-gradient">{stat.value}</div>
              <div className="mt-1 text-xs text-zinc-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Todo lo que necesitás en una plataforma
            </h2>
            <p className="mt-3 text-zinc-500 text-sm md:text-base">
              Diseñado para ser confiable, transparente y seguro desde el día uno.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-6 group hover:border-brand-500/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2">{f.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto glass-card p-10 text-center glow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white mx-auto mb-4">
            <Dog className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            ¿Listo para empezar?
          </h2>
          <p className="text-zinc-400 text-sm mb-8">
            Registrate gratis y encontrá el paseador ideal para tu mascota hoy mismo.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/auth?tab=register')}
            className="btn-brand px-10 py-4 text-base"
          >
            Crear cuenta gratis →
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-6 text-center">
        <p className="text-xs text-zinc-600">
          © 2026 WalkManager · Dog Walking Platform · Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
};
