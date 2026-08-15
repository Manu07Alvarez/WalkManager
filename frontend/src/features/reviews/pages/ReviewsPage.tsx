import React, { useState } from 'react';
import { Star, Plus, Clock3, CheckCircle2, XCircle } from 'lucide-react';

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
    comment: '¡Excelente servicio! María es muy profesional y mi perro la adora. Mandó fotos durante todo el paseo.',
    status: 'approved', date: '2026-08-10', serviceResult: 'Successful',
  },
  {
    id: 'R-002', customerName: 'Luis Torres', walkerName: 'Carlos Ruiz',
    bookingId: 'BK-002', rating: 4,
    comment: 'Muy buena atención. Llegó puntual y el perro volvió super contento. ¡Recomendable!',
    status: 'approved', date: '2026-08-09', serviceResult: 'Successful',
  },
  {
    id: 'R-003', customerName: 'Paula Gómez', walkerName: 'Sofía Martínez',
    bookingId: 'BK-003', rating: 2,
    comment: 'El servicio no fue como esperaba, el perro llegó sin agua y con demora.',
    status: 'pending', date: '2026-08-11', serviceResult: 'Failed',
  },
];

// FR-055: Dog paw treat visual scoring
const PawRating: React.FC<{ value: number; max?: number }> = ({ value, max = 5 }) => (
  <div className="flex gap-1 text-[#feae2c]">
    {Array.from({ length: max }).map((_, i) => (
      <span
        key={i}
        className={`text-lg transition-transform ${i < value ? 'opacity-100 scale-105' : 'opacity-25'}`}
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

const statusIcon = {
  pending:  Clock3,
  approved: CheckCircle2,
  rejected: XCircle,
};

const statusLabel = {
  pending:  'En moderación',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};

export const ReviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const filtered = activeTab === 'all'
    ? MOCK_REVIEWS
    : MOCK_REVIEWS.filter((r) => r.status === activeTab);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in font-body">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#005da7] flex items-center gap-3">
            <Star className="w-8 h-8 text-[#005da7] fill-current" /> Reseñas
          </h1>
          <p className="text-sm text-[#414751] mt-1 font-body">Exclusivas de paseos completados con resultado Exitoso o Fallido (FR-049)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-brand py-2.5 px-5 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ¡Escribir reseña!
        </button>
      </div>

      {/* Review form */}
      {showForm && (
        <div className="card-connection p-6 bg-white border-[#005da7]/30 animate-slide-up shadow-level2">
          <h3 className="font-headline font-bold text-[#005da7] text-base mb-4">Nueva reseña</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-headline font-bold text-[#161d1f] mb-2">Calificación (🐾 premios de perro)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: s })}
                    className={`text-2xl transition-transform hover:scale-125 ${s <= newReview.rating ? 'opacity-100' : 'opacity-25'}`}
                  >
                    🐾
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-headline font-bold text-[#161d1f] mb-1.5">Comentario (mínimo 10 caracteres)</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="input-field min-h-[100px] resize-none"
                placeholder="Describí tu experiencia con el paseo..."
              />
            </div>
            <div className="flex gap-3">
              <button className="btn-brand py-2.5 px-6 text-xs">¡Enviar reseña!</button>
              <button onClick={() => setShowForm(false)} className="btn-ghost py-2.5 px-5 text-xs">Cancelar</button>
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
            className={`px-4 py-2 rounded-full text-xs font-bold font-headline border transition-all duration-200 ${
              activeTab === t
                ? 'bg-[#005da7] border-[#005da7] text-white shadow-sm'
                : 'border-[#dde4e6] bg-white text-[#414751] hover:text-[#005da7] hover:border-[#005da7]/30'
            }`}
          >
            {t === 'all' ? 'Todas' : t === 'pending' ? 'En moderación' : 'Aprobadas'}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filtered.map((review) => {
          const StatusIcon = statusIcon[review.status];
          return (
            <div key={review.id} className="card-connection p-6 bg-white border-[#dde4e6] space-y-3 hover:shadow-level2 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#005da7] flex items-center justify-center text-sm font-headline font-bold text-white shadow-sm">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-headline font-bold text-[#161d1f]">{review.customerName}</p>
                    <p className="text-xs text-[#414751] font-body">→ Paseador: {review.walkerName} · {review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`badge ${statusBadge[review.status]}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusLabel[review.status]}
                  </span>
                  <span className={`badge ${review.serviceResult === 'Successful' ? 'badge-success' : 'badge-rejected'}`}>
                    {review.serviceResult === 'Successful' ? '✓ Exitoso' : '✗ Fallido'}
                  </span>
                </div>
              </div>
              <PawRating value={review.rating} />
              <p className="text-sm text-[#414751] leading-relaxed italic font-body">"{review.comment}"</p>
              {/* FR-056: No walker reply option */}
            </div>
          );
        })}
      </div>
    </div>
  );
};
