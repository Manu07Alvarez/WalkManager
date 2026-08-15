import React, { useState } from 'react';
import { Search, MapPin, Star, Dog, Filter, CheckCircle2, XCircle } from 'lucide-react';

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

  const filtered = MOCK_WALKERS
    .filter((w) => w.distanceKm <= radiusKm)
    .filter((w) => w.pricePerService <= maxPrice)
    .filter((w) => w.rating >= minRating)
    .sort((a, b) => a.distanceKm - b.distanceKm); // SC-003: nearest first

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in font-body">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#005da7] flex items-center gap-3">
          <Search className="w-8 h-8 text-[#005da7]" /> Buscar Paseadores
        </h1>
        <p className="text-sm text-[#414751] mt-1 font-body">
          Resultados ordenados por distancia · {filtered.length} paseadores disponibles en tu zona
        </p>
      </div>

      {/* Filters */}
      <div className="card-connection p-6 bg-white shadow-level1 border-[#dde4e6]">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#005da7]" />
          <p className="text-xs font-headline font-bold text-[#005da7] uppercase tracking-wider">Filtros de búsqueda</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-headline font-bold text-[#161d1f] mb-1.5">
              Radio: <span className="text-[#005da7] font-extrabold">{radiusKm} km</span>
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
              type="range" min={500} max={5000} step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#005da7]"
            />
          </div>
          <div>
            <label className="block text-xs font-headline font-bold text-[#161d1f] mb-1.5">
              Rating mínimo: <span className="text-[#005da7] font-extrabold">{minRating > 0 ? `${minRating}★` : 'Todos'}</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-2 card-connection p-12 text-center bg-white border-[#dde4e6]">
            <Dog className="w-12 h-12 text-[#414751] mx-auto mb-3 opacity-40" />
            <p className="font-headline font-bold text-lg text-[#161d1f]">Ruh-roh! No encontramos paseadores con esos filtros.</p>
            <p className="text-xs text-[#414751] mt-1">Probá ampliar el radio o ajustar el precio máximo.</p>
          </div>
        ) : (
          filtered.map((walker) => (
            <div key={walker.id} className="card-connection p-6 hover:shadow-level2 transition-all duration-200 group bg-white border-[#dde4e6]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#005da7] flex items-center justify-center font-headline font-bold text-white text-lg shrink-0 shadow-sm">
                    {walker.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-headline font-bold text-[#161d1f] text-base">{walker.name}</p>
                    <p className="text-xs text-[#414751] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#005da7]" /> {walker.zone} · {walker.distanceKm.toFixed(1)} km
                    </p>
                  </div>
                </div>
                <span className={`badge ${walker.available ? 'badge-accepted' : 'badge-expired'}`}>
                  {walker.available ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {walker.available ? 'Disponible' : 'Ocupado'}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <StarRating value={walker.rating} />
                <span className="text-xs font-bold text-[#161d1f]">{walker.rating} ({walker.reviewCount} reseñas)</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {walker.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-[#eef5f7] border border-[#dde4e6] text-[11px] font-bold text-[#005da7]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#dde4e6]">
                <div>
                  <span className="text-xl font-headline font-bold text-[#005da7]">${walker.pricePerService.toLocaleString()}</span>
                  <span className="text-xs text-[#414751] ml-1 font-body">/ servicio · max {walker.maxDogs} 🐕</span>
                </div>
                <button
                  disabled={!walker.available}
                  className="btn-brand py-2 px-5 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ¡Reservar!
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
