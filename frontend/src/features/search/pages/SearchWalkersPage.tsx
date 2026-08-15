import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Star, Dog, Filter, CheckCircle2, Loader2, Calendar, Clock } from 'lucide-react';
import { searchWalkers, createBookingRequest, WalkerSearchResult } from '../api/searchApi';
import { NotificationModal, NotificationType } from '../../../shared/components/NotificationModal';

const StarRating: React.FC<{ value: number }> = ({ value }) => (
  <span className="flex items-center gap-0.5 text-[#feae2c]">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`w-4 h-4 ${s <= Math.round(value) ? 'fill-current' : 'opacity-30'}`} />
    ))}
  </span>
);

export const SearchWalkersPage: React.FC = () => {
  const [radiusKm, setRadiusKm] = useState(5);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [walkers, setWalkers] = useState<WalkerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWalker, setSelectedWalker] = useState<WalkerSearchResult | null>(null);
  const [dogCount, setDogCount] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

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

  // Buenos Aires default coordinates (Palermo/Belgrano area)
  const defaultLat = -34.5889;
  const defaultLng = -58.4306;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    searchWalkers({
      latitude: defaultLat,
      longitude: defaultLng,
      radiusKm,
    })
      .then((data) => {
        if (isMounted) {
          setWalkers(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [radiusKm]);

  const filtered = walkers
    .filter((w) => w.distance_km <= radiusKm)
    .filter((w) => w.service_price <= maxPrice)
    .filter((w) => w.rating >= minRating)
    .sort((a, b) => a.distance_km - b.distance_km);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWalker) return;

    setIsBooking(true);
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() + 3600000).toISOString();
      const endTime = new Date(now.getTime() + 7200000).toISOString();

      await createBookingRequest({
        walkerId: selectedWalker.id,
        startTime,
        endTime,
        dogCount,
      });

      setBookingSuccess(`¡Solicitud enviada con éxito a ${selectedWalker.full_name}!`);
      setTimeout(() => {
        setSelectedWalker(null);
        setBookingSuccess(null);
      }, 2000);
    } catch {
      showModal('No se pudo procesar la reserva', 'Ocurrió un problema al enviar la solicitud. Por favor intentalo de nuevo.', 'error');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in font-body">
      <NotificationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onClose={closeModal}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#005da7] flex items-center gap-3">
          <Search className="w-8 h-8 text-[#005da7]" /> Buscar Paseadores Cercanos
        </h1>
        <p className="text-sm text-[#414751] mt-1 font-body">
          Paseadores disponibles en tu zona · {filtered.length} paseadores encontrados
        </p>
      </div>

      {/* Filters */}
      <div className="card-connection p-6 bg-white shadow-level1 border-[#dde4e6]">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#005da7]" />
          <p className="text-xs font-headline font-bold text-[#005da7] uppercase tracking-wider">Filtros de Búsqueda</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-headline font-bold text-[#161d1f] mb-1.5">
              Radio de búsqueda: <span className="text-[#005da7] font-extrabold">{radiusKm} km</span>
            </label>
            <input
              type="range" min={1} max={20} step={1}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-[#005da7]"
            />
          </div>
          <div>
            <label className="block text-xs font-headline font-bold text-[#161d1f] mb-1.5">
              Precio máx: <span className="text-[#005da7] font-extrabold">${maxPrice.toLocaleString()}</span>
            </label>
            <input
              type="range" min={1000} max={6000} step={200}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#005da7]"
            />
          </div>
          <div>
            <label className="block text-xs font-headline font-bold text-[#161d1f] mb-1.5">
              Calificación mínima: <span className="text-[#005da7] font-extrabold">{minRating > 0 ? `${minRating}★` : 'Todas'}</span>
            </label>
            <input
              type="range" min={0} max={5} step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-[#005da7]"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="card-connection p-12 text-center bg-white border-[#dde4e6]">
          <Loader2 className="w-8 h-8 text-[#005da7] animate-spin mx-auto mb-3" />
          <p className="font-headline font-bold text-base text-[#161d1f]">Buscando paseadores en tu zona...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.length === 0 ? (
            <div className="col-span-2 card-connection p-12 text-center bg-white border-[#dde4e6]">
              <Dog className="w-12 h-12 text-[#414751] mx-auto mb-3 opacity-40" />
              <p className="font-headline font-bold text-lg text-[#161d1f]">No encontramos paseadores con esos filtros.</p>
              <p className="text-xs text-[#414751] mt-1">Probá ampliar el radio de búsqueda o el precio máximo.</p>
            </div>
          ) : (
            filtered.map((walker) => (
              <motion.div
                key={walker.id}
                whileHover={{ scale: 1.01 }}
                className="card-connection p-6 hover:shadow-level2 transition-all duration-200 group bg-white border-[#dde4e6]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#005da7] flex items-center justify-center font-headline font-bold text-white text-lg shrink-0 shadow-sm">
                      {walker.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-headline font-bold text-[#161d1f] text-base">{walker.full_name}</p>
                      <p className="text-xs text-[#414751] flex items-center gap-1 mt-0.5 font-body">
                        <MapPin className="w-3.5 h-3.5 text-[#005da7]" /> {walker.distance_km.toFixed(1)} km de distancia
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-accepted">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Disponible
                  </span>
                </div>

                <p className="text-xs text-[#414751] mb-4 leading-relaxed line-clamp-2">
                  {walker.public_description}
                </p>

                <div className="flex items-center gap-3 mb-3">
                  <StarRating value={walker.rating} />
                  <span className="text-xs font-bold text-[#161d1f]">{walker.rating} ({walker.completed_walks} paseos)</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {walker.usual_dog_types.map((type) => (
                    <span key={type} className="px-2.5 py-1 rounded-full bg-[#eef5f7] border border-[#dde4e6] text-[11px] font-bold text-[#005da7]">
                      {type}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#dde4e6]">
                  <div>
                    <span className="text-xl font-headline font-bold text-[#005da7]">${walker.service_price.toLocaleString()}</span>
                    <span className="text-xs text-[#414751] ml-1 font-body">/ paseo (máx {walker.max_simultaneous_dogs} 🐕)</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedWalker(walker)}
                    className="btn-brand py-2 px-5 text-xs font-headline"
                  >
                    ¡Reservar Paseo!
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Interactive Booking Modal */}
      <AnimatePresence>
        {selectedWalker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="card-connection w-full max-w-md bg-white p-6 shadow-level3 border-[#dde4e6]"
            >
              <div className="flex items-center justify-between border-b border-[#dde4e6] pb-4 mb-4">
                <h2 className="text-lg font-headline font-bold text-[#005da7] flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Reservar con {selectedWalker.full_name}
                </h2>
                <button
                  onClick={() => setSelectedWalker(null)}
                  className="text-[#414751] hover:text-[#161d1f] text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {bookingSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#498300] mx-auto animate-bounce" />
                  <p className="font-headline font-bold text-base text-[#161d1f]">{bookingSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#161d1f] mb-1.5 font-headline">Cantidad de Perros</label>
                    <select
                      value={dogCount}
                      onChange={(e) => setDogCount(Number(e.target.value))}
                      className="input-field"
                    >
                      {Array.from({ length: selectedWalker.max_simultaneous_dogs }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'perro' : 'perros'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-[#eef5f7] border border-[#dde4e6] text-xs space-y-1">
                    <p className="font-bold text-[#005da7] font-headline flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Duración estimada: 1 hora
                    </p>
                    <p className="text-[#414751]">Total a abonar: <strong>${(selectedWalker.service_price * dogCount).toLocaleString()} ARS</strong></p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedWalker(null)}
                      className="btn-ghost flex-1 py-3 text-xs"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isBooking}
                      type="submit"
                      className="btn-brand flex-1 py-3 text-xs flex items-center justify-center gap-2"
                    >
                      {isBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Reserva'}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
