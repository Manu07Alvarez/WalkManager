import React, { useState } from 'react';

// TODO: Connect to GET /search/walkers?lat=...&lng=...&radiusKm=... endpoint
// REVIEW: Optimize 375px mobile viewport layout for filter pills (FR-010)

interface WalkerCard {
  id: string;
  name: string;
  zone: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  pricePerService: number;
  maxDogs: number;
  tags: string[];
  available: boolean;
}

const MOCK_WALKERS: WalkerCard[] = [
  {
    id: '1', name: 'María González', zone: 'Palermo', distanceKm: 0.8,
    rating: 4.9, reviewCount: 47, pricePerService: 2500, maxDogs: 3,
    tags: ['Perros grandes', 'GPS', 'Fotos'], available: true,
  },
  {
    id: '2', name: 'Carlos Ruiz', zone: 'Villa Crespo', distanceKm: 1.4,
    rating: 4.7, reviewCount: 23, pricePerService: 2000, maxDogs: 4,
    tags: ['Cachorros', 'Seguro', 'Flexible'], available: true,
  },
  {
    id: '3', name: 'Sofía Martínez', zone: 'Belgrano', distanceKm: 2.1,
    rating: 4.8, reviewCount: 61, pricePerService: 3000, maxDogs: 2,
    tags: ['Entrenada', 'Nocturno', 'GPS'], available: false,
  },
  {
    id: '4', name: 'Diego López', zone: 'Recoleta', distanceKm: 2.8,
    rating: 4.5, reviewCount: 18, pricePerService: 2200, maxDogs: 3,
    tags: ['Perros pequeños', 'Seguro'], available: true,
  },
];

const StarRating: React.FC<{ value: number }> = ({ value }) => (
  <span className="star-rating flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= Math.round(value) ? 'filled' : ''}>★</span>
    ))}
  </span>
);

export const SearchWalkersPage: React.FC = () => {
  const [radiusKm, setRadiusKm] = useState(5);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);

  const filtered = MOCK_WALKERS
    .filter((w) => w.distanceKm <= radiusKm)
    .filter((w) => w.pricePerService <= maxPrice)
    .filter((w) => w.rating >= minRating)
    .sort((a, b) => a.distanceKm - b.distanceKm); // SC-003: nearest first

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          🔍 Buscar Paseadores
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Resultados ordenados por distancia · {filtered.length} paseadores disponibles
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-5">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Filtros</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">
              Radio: <span className="text-white font-semibold">{radiusKm} km</span>
            </label>
            <input
              type="range" min={1} max={20} step={1}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">
              Precio máx: <span className="text-white font-semibold">${maxPrice.toLocaleString()}</span>
            </label>
            <input
              type="range" min={500} max={5000} step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">
              Rating mínimo: <span className="text-white font-semibold">{minRating > 0 ? `${minRating}★` : 'Todos'}</span>
            </label>
            <input
              type="range" min={0} max={5} step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 glass-card p-10 text-center">
            <p className="text-4xl mb-3">🔭</p>
            <p className="text-zinc-400">No se encontraron paseadores con esos filtros.</p>
          </div>
        ) : (
          filtered.map((walker) => (
            <div key={walker.id} className="glass-card p-5 hover:border-brand-500/20 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center font-bold text-white text-lg shrink-0">
                    {walker.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{walker.name}</p>
                    <p className="text-xs text-zinc-500">📍 {walker.zone} · {walker.distanceKm.toFixed(1)} km</p>
                  </div>
                </div>
                <span className={`badge ${walker.available ? 'badge-accepted' : 'badge-expired'}`}>
                  {walker.available ? '● Disponible' : '○ Ocupado'}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <StarRating value={walker.rating} />
                <span className="text-xs text-zinc-400">{walker.rating} ({walker.reviewCount} reseñas)</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {walker.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gradient">${walker.pricePerService.toLocaleString()}</span>
                  <span className="text-xs text-zinc-600 ml-1">/ servicio · max {walker.maxDogs} 🐕</span>
                </div>
                <button
                  disabled={!walker.available}
                  className="btn-brand py-2 px-4 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Reservar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
