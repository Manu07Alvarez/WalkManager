import React, { useState } from 'react';

// TODO: Connect to GET /reviews and POST /reviews endpoints (FR-049, FR-053)
// REVIEW: FR-055 - rating system uses 🐾 dog paw treats as visual scoring indicator

interface Review {
  id: string;
  customerName: string;
  walkerName: string;
  bookingId: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  serviceResult: 'Successful' | 'Failed';
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 'R-001', customerName: 'Ana Pérez', walkerName: 'María González',
    bookingId: 'BK-001', rating: 5,
    comment: 'Excelente servicio! María es muy profesional y mi perro la adora. Mandó fotos durante todo el paseo.',
    status: 'approved', date: '2026-08-10', serviceResult: 'Successful',
  },
  {
    id: 'R-002', customerName: 'Luis Torres', walkerName: 'Carlos Ruiz',
    bookingId: 'BK-002', rating: 4,
    comment: 'Muy buena atención. Llegó puntual y el perro volvió contento. Recomendable.',
    status: 'approved', date: '2026-08-09', serviceResult: 'Successful',
  },
  {
    id: 'R-003', customerName: 'Paula Gómez', walkerName: 'Sofía Martínez',
    bookingId: 'BK-003', rating: 2,
    comment: 'El servicio no fue como esperaba, el perro llegó sin agua y tarde.',
    status: 'pending', date: '2026-08-11', serviceResult: 'Failed',
  },
];

// FR-055: Dog paw treat visual scoring
const PawRating: React.FC<{ value: number; max?: number }> = ({ value, max = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <span
        key={i}
        className={`text-base transition-colors ${i < value ? 'text-amber-400' : 'text-zinc-700'}`}
      >
        🐾
      </span>
    ))}
  </div>
);

const statusBadge = {
  pending:  'badge-pending',
  approved: 'badge-accepted',
  rejected: 'badge-rejected',
};
const statusLabel = {
  pending:  '⏳ En moderación',
  approved: '✅ Aprobada',
  rejected: '❌ Rechazada',
};

export const ReviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const filtered = activeTab === 'all'
    ? MOCK_REVIEWS
    : MOCK_REVIEWS.filter((r) => r.status === activeTab);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">⭐ Reseñas</h1>
          <p className="text-sm text-zinc-500 mt-1">Solo de paseos con resultado Exitoso o Fallido (FR-049)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-brand py-2 px-5 text-sm"
        >
          + Escribir reseña
        </button>
      </div>

      {/* Review form */}
      {showForm && (
        <div className="glass-card p-6 border-brand-500/20 animate-slide-up">
          <h3 className="font-semibold text-white mb-4">Nueva reseña</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-2">Calificación (🐾 dog treats)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setNewReview({ ...newReview, rating: s })}
                    className={`text-2xl transition-transform hover:scale-110 ${s <= newReview.rating ? 'opacity-100' : 'opacity-30'}`}
                  >
                    🐾
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Comentario (mínimo 10 caracteres)</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="input-field min-h-[100px] resize-none"
                placeholder="Describí tu experiencia con el paseo..."
              />
            </div>
            <div className="flex gap-3">
              <button className="btn-brand py-2 px-6 text-sm">Enviar reseña</button>
              <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-5 text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              activeTab === t
                ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                : 'border-white/10 text-zinc-500 hover:text-zinc-300 hover:border-white/20'
            }`}
          >
            {t === 'all' ? 'Todas' : t === 'pending' ? 'En moderación' : 'Aprobadas'}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <div key={review.id} className="glass-card p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center text-sm font-bold text-white">
                  {review.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{review.customerName}</p>
                  <p className="text-xs text-zinc-500">→ {review.walkerName} · {review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${statusBadge[review.status]}`}>
                  {statusLabel[review.status]}
                </span>
                <span className={`badge ${review.serviceResult === 'Successful' ? 'badge-success' : 'badge-rejected'}`}>
                  {review.serviceResult === 'Successful' ? '✓ Exitoso' : '✗ Fallido'}
                </span>
              </div>
            </div>
            <PawRating value={review.rating} />
            <p className="text-sm text-zinc-300 leading-relaxed">"{review.comment}"</p>
            {/* FR-056: No walker reply option */}
          </div>
        ))}
      </div>
    </div>
  );
};
