import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Dog, Shield, Star, Calendar, MessageSquare, Bell, Heart, ArrowRight } from 'lucide-react';

// REVIEW: Add animated hero background with PostGIS map integration when available

const features = [
  {
    icon: Search,
    title: 'Búsqueda por Proximidad',
    desc: 'Encontrá paseadores cercanos con filtros de distancia, precio y disponibilidad.',
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
    title: 'Moderación Transparente',
    desc: 'Sistema de incidentes y restricciones claro y seguro para todos.',
  },
  {
    icon: MessageSquare,
    title: 'Chat en Tiempo Real',
    desc: 'Conversaciones pre-reserva y chat de seguimiento por paseo.',
  },
  {
    icon: Bell,
    title: 'Notificaciones Claras',
    desc: 'Alertas por email o celular según tu preferencia en cada estado.',
  },
];

const stats = [
  { value: '< 2s', label: 'Búsqueda veloz' },
  { value: '95%', label: 'Respuestas en < 5s' },
  { value: '100%', label: 'Capacidad garantizada' },
  { value: '3 roles', label: 'Walker · Cliente · Moderador' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4fafd] text-[#161d1f] overflow-hidden font-body">
      {/* Background decorations */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#005da7]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-[#feae2c]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#dde4e6] bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/icon.svg" alt="WalkManager Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
          <div>
            <span className="text-xl font-headline font-bold text-[#005da7]">WalkManager</span>
            <p className="text-[11px] text-[#414751] font-body -mt-0.5 hidden md:block">The Reliable Best Friend</p>
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
            ¡Registrate gratis!
          </button>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-20 md:pt-28 md:pb-32"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#feae2c]/50 bg-[#ffddb4] px-4 py-1.5 text-xs font-bold text-[#633f00] mb-6 shadow-sm font-headline"
        >
          <Heart className="w-4 h-4 text-[#835500] fill-current" />
          Paseadores locales verificados y de confianza
        </motion.div>

        <h1 className="max-w-3xl text-4xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight leading-[1.15] text-[#161d1f]">
          Tu mejor amigo merece el
          <span className="text-gradient"> paseo ideal</span>
        </h1>

        <p className="mt-6 max-w-xl text-base md:text-lg text-[#414751] leading-relaxed">
          Conectamos dueños apasionados con paseadores profesionales verificados.
          Búsqueda por proximidad, capacidad garantizada y reservas instantáneas.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/search')}
            className="btn-brand px-8 py-4 text-base flex items-center gap-2"
          >
            <Search className="w-5 h-5" /> ¡Buscar Paseadores!
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/auth?tab=walker')}
            className="btn-secondary px-8 py-4 text-base flex items-center gap-2"
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
              className="card-connection p-5 text-center"
            >
              <div className="text-2xl font-headline font-bold text-[#005da7]">{stat.value}</div>
              <div className="mt-1 text-xs font-semibold text-[#414751]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-headline font-bold text-[#161d1f]">
              Todo pensado para la seguridad de tu mascota
            </h2>
            <p className="mt-3 text-[#414751] text-sm md:text-base">
              Una experiencia clara, alegre y sin sorpresas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card-connection p-6 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#005da7]/10 border border-[#005da7]/20 flex items-center justify-center text-[#005da7] mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline font-bold text-[#161d1f] text-base mb-2">{f.title}</h3>
                  <p className="text-xs text-[#414751] leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto card-connection p-10 text-center bg-gradient-to-b from-white to-[#eef5f7] border-[#005da7]/20"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#005da7]/10 border border-[#005da7]/20 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <img src="/icon.svg" alt="WalkManager Logo" className="w-10 h-10 object-contain" />
          </div>
          <h2 className="text-3xl font-headline font-bold text-[#161d1f] mb-3">
            ¡En marcha!
          </h2>
          <p className="text-[#414751] text-sm mb-8 max-w-md mx-auto">
            Sumate hoy a WalkManager y regalale a tu perro paseos felices y seguros.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/auth?tab=register')}
            className="btn-brand px-10 py-4 text-base flex items-center justify-center gap-2 mx-auto"
          >
            ¡Empezar ahora! <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#dde4e6] bg-white px-6 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/icon.svg" alt="WalkManager Logo" className="w-5 h-5 object-contain" />
          <span className="text-xs font-bold font-headline text-[#005da7]">WalkManager</span>
        </div>
        <p className="text-xs text-[#414751]">
          © 2026 WalkManager · Canine Connection Design · Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
};
