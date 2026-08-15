import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Dog, Check, X, CheckCircle2, Clock3, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { fetchUserBookings, acceptBooking, rejectBooking, cancelBooking } from '../api/bookingApi';
import { NotificationModal, NotificationType } from '../../../shared/components/NotificationModal';

type BookingStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Expired' | 'Cancelled';

interface Booking {
  id: string;
  walkerName: string;
  customerName: string;
  date: string;
  time: string;
  dogCount: number;
  zone: string;
  status: BookingStatus;
  price: number;
}

const statusBadge: Record<BookingStatus, string> = {
  Pending:   'badge-pending',
  Accepted:  'badge-accepted',
  Rejected:  'badge-rejected',
  Expired:   'badge-expired',
  Cancelled: 'badge-expired',
};

const statusIcon: Record<BookingStatus, React.ElementType> = {
  Pending:   Clock3,
  Accepted:  CheckCircle2,
  Rejected:  XCircle,
  Expired:   AlertCircle,
  Cancelled: XCircle,
};

const statusLabel: Record<BookingStatus, string> = {
  Pending:   'Pendiente',
  Accepted:  'Aceptada',
  Rejected:  'Rechazada',
  Expired:   'Expirada',
  Cancelled: 'Cancelada',
};

type FilterTab = 'all' | BookingStatus;

export const BookingsPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Modal State
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

    fetchUserBookings()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          const mapped = data.map((b: any) => ({
            id: b.id || 'BK-00',
            walkerName: b.walker_name || b.walkerName || 'Santiago Martínez',
            customerName: b.customer_name || b.customerName || 'Carlos Pérez',
            date: b.date || '16 de Agosto, 2026',
            time: b.time_slot || b.time || '10:00 - 11:00 hs',
            dogCount: b.dog_count || b.dogCount || 1,
            zone: b.zone || 'Palermo',
            status: (b.status as BookingStatus) || 'Pending',
            price: b.total_price || b.price || 2500,
          }));
          setBookings(mapped);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const handleAccept = async (id: string) => {
    setActionInProgress(id);
    try {
      await acceptBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'Accepted' } : b)));
      showModal('Reserva aceptada', 'Has aceptado la solicitud de paseo correctamente.', 'success');
    } catch {
      showModal('No se pudo aceptar', 'Ocurrió un problema al procesar la solicitud. Intentalo de nuevo.', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionInProgress(id);
    try {
      await rejectBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'Rejected' } : b)));
      showModal('Reserva rechazada', 'Has rechazado la solicitud de paseo.', 'info');
    } catch {
      showModal('No se pudo rechazar', 'Ocurrió un problema al rechazar la solicitud. Intentalo de nuevo.', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleCancel = async (id: string) => {
    setActionInProgress(id);
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b)));
      showModal('Reserva cancelada', 'La reserva ha sido cancelada exitosamente.', 'info');
    } catch {
      showModal('No se pudo cancelar', 'Ocurrió un problema al cancelar la reserva.', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const filters: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'Pending', label: 'Pendientes' },
    { key: 'Accepted', label: 'Aceptadas' },
    { key: 'Expired', label: 'Expiradas / Canceladas' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in font-body">
      <NotificationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onClose={closeModal}
      />

      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#005da7] flex items-center gap-3">
          <Calendar className="w-8 h-8 text-[#005da7]" /> Mis Reservas
        </h1>
        <p className="text-sm text-[#414751] mt-1 font-body">
          Gestión de tus solicitudes de paseo · {bookings.length} reservas registradas
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold font-headline border transition-all duration-200 ${
              filter === f.key
                ? 'bg-[#005da7] border-[#005da7] text-white shadow-sm'
                : 'border-[#dde4e6] bg-white text-[#414751] hover:text-[#005da7] hover:border-[#005da7]/30'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Booking list */}
      {isLoading ? (
        <div className="card-connection p-12 text-center bg-white border-[#dde4e6]">
          <Loader2 className="w-8 h-8 text-[#005da7] animate-spin mx-auto mb-3" />
          <p className="font-headline font-bold text-base text-[#161d1f]">Cargando tus reservas...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="card-connection p-12 text-center bg-white border-[#dde4e6]">
              <Dog className="w-12 h-12 text-[#414751] mx-auto mb-3 opacity-40" />
              <p className="font-headline font-bold text-lg text-[#161d1f]">No tenés reservas en esta categoría.</p>
            </div>
          ) : (
            filtered.map((booking) => {
              const StatusIcon = statusIcon[booking.status] || Clock3;
              const isWorking = actionInProgress === booking.id;

              return (
                <div key={booking.id} className="card-connection p-6 bg-white border-[#dde4e6] hover:shadow-level2 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-[#414751] truncate max-w-[120px]">{booking.id}</span>
                        <span className={`badge ${statusBadge[booking.status] || 'badge-pending'}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusLabel[booking.status] || booking.status}
                        </span>
                      </div>
                      <p className="font-headline font-bold text-[#161d1f] text-base flex items-center gap-2">
                        <span>Paseador: {booking.walkerName}</span>
                        <span className="text-[#414751] font-normal">→</span>
                        <span>Cliente: {booking.customerName}</span>
                      </p>
                      <p className="text-xs text-[#414751] flex flex-wrap items-center gap-3 font-body">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#005da7]" /> {booking.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#005da7]" /> {booking.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#005da7]" /> {booking.zone}</span>
                        <span className="flex items-center gap-1"><Dog className="w-3.5 h-3.5 text-[#005da7]" /> {booking.dogCount} perro{booking.dogCount !== 1 ? 's' : ''}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xl font-headline font-bold text-[#005da7]">
                        ${booking.price.toLocaleString()}
                      </span>
                      {booking.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            disabled={isWorking}
                            onClick={() => handleAccept(booking.id)}
                            className="px-3.5 py-2 rounded-xl bg-[#f9ffeb] border border-[#498300]/40 text-[#2a5000] text-xs font-bold font-headline hover:bg-[#498300]/20 transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            {isWorking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} ¡Aceptar!
                          </button>
                          <button
                            disabled={isWorking}
                            onClick={() => handleReject(booking.id)}
                            className="px-3.5 py-2 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/40 text-[#93000a] text-xs font-bold font-headline hover:bg-[#ba1a1a]/20 transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            {isWorking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />} Rechazar
                          </button>
                        </div>
                      )}
                      {booking.status === 'Accepted' && (
                        <button
                          disabled={isWorking}
                          onClick={() => handleCancel(booking.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#ffdad6]/60 border border-[#ba1a1a]/30 text-[#93000a] text-xs font-bold font-headline hover:bg-[#ffdad6] transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          {isWorking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />} Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
