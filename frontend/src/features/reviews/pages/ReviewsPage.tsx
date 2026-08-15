import React, { useState, useEffect } from 'react';
import { Star, Plus, Clock3, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { fetchReviews, submitReview } from '../api/reviewApi';
import { NotificationModal, NotificationType } from '../../../shared/components/NotificationModal';

interface Review {
  id: string;
  customerName: string;
  walkerName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  serviceResult: 'Successful' | 'Failed';
}

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchReviews()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          const mapped = data.map((r: any) => ({
            id: r.id || 'r-1',
            customerName: r.author_name || r.customerName || 'Carlos Pérez',
            walkerName: r.walker_name || r.walkerName || 'Santiago Martínez',
            rating: r.rating || 5,
            comment: r.comment || '',
            status: (r.status?.toLowerCase() as any) || 'approved',
            date: r.date || 'Hace 2 días',
            serviceResult: 'Successful',
          }));
          setReviews(mapped);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim() || newReview.comment.trim().length < 10) {
      showModal('Comentario muy corto', 'El comentario debe tener al menos 10 caracteres para enviar la reseña.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        bookingId: '11111111-1111-1111-1111-111111111111',
        rating: newReview.rating,
        comment: newReview.comment,
      });

      const added: Review = {
        id: `rev-${Date.now()}`,
        customerName: 'Tu Usuario',
        walkerName: 'Paseador Asignado',
        rating: newReview.rating,
        comment: newReview.comment,
        status: 'pending',
        date: 'Recién publicado',
        serviceResult: 'Successful',
      };

      setReviews((prev) => [added, ...prev]);
      setShowForm(false);
      setNewReview({ rating: 5, comment: '' });
      showModal('¡Reseña enviada!', 'Tu opinión fue registrada exitosamente y se encuentra visible.', 'success');
    } catch {
      showModal('No se pudo enviar', 'Ocurrió un problema al guardar la reseña. Por favor intentalo nuevamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = activeTab === 'all'
    ? reviews
    : reviews.filter((r) => r.status === activeTab);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in font-body">
      <NotificationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onClose={closeModal}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#005da7] flex items-center gap-3">
            <Star className="w-8 h-8 text-[#005da7] fill-current" /> Reseñas
          </h1>
          <p className="text-sm text-[#414751] mt-1 font-body">Calificaciones y experiencias de paseos completados</p>
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
        <form onSubmit={handleReviewSubmit} className="card-connection p-6 bg-white border-[#005da7]/30 animate-slide-up shadow-level2">
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
              <button disabled={isSubmitting} type="submit" className="btn-brand py-2.5 px-6 text-xs flex items-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '¡Enviar reseña!'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost py-2.5 px-5 text-xs">Cancelar</button>
            </div>
          </div>
        </form>
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
      {isLoading ? (
        <div className="card-connection p-12 text-center bg-white border-[#dde4e6]">
          <Loader2 className="w-8 h-8 text-[#005da7] animate-spin mx-auto mb-3" />
          <p className="font-headline font-bold text-base text-[#161d1f]">Cargando reseñas...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => {
            const StatusIcon = statusIcon[review.status] || CheckCircle2;
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
                    <span className={`badge ${statusBadge[review.status] || 'badge-accepted'}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusLabel[review.status] || review.status}
                    </span>
                    <span className={`badge ${review.serviceResult === 'Successful' ? 'badge-success' : 'badge-rejected'}`}>
                      {review.serviceResult === 'Successful' ? '✓ Exitoso' : '✗ Fallido'}
                    </span>
                  </div>
                </div>
                <PawRating value={review.rating} />
                <p className="text-sm text-[#414751] leading-relaxed italic font-body">"{review.comment}"</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
