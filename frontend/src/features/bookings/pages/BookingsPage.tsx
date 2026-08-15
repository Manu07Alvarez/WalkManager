import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Dog, Check, X, CheckCircle2, Clock3, XCircle, AlertCircle } from 'lucide-react';

// TODO: Connect to GET /bookings and PATCH /bookings/:id/accept|reject endpoints
// REVIEW: Add real-time status update via WebSocket subscription

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

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-001', walkerName: 'María González', customerName: 'Ana Pérez',
    date: '2026-08-14', time: '09:00 - 10:30', dogCount: 1, zone: 'Palermo',
    status: 'Pending', price: 2500,
  },
  {
    id: 'BK-002', walkerName: 'Carlos Ruiz', customerName: 'Luis Torres',
    date: '2026-08-13', time: '15:00 - 16:00', dogCount: 2, zone: 'Villa Crespo',
    status: 'Accepted', price: 4000,
  },
  {
    id: 'BK-003', walkerName: 'Sofía Martínez', customerName: 'Paula Gómez',
    date: '2026-08-10', time: '08:00 - 09:00', dogCount: 1, zone: 'Belgrano',
    status: 'Expired', price: 3000,
  },
  {
    id: 'BK-004', walkerName: 'Diego López', customerName: 'Marcos Silva',
    date: '2026-08-11', time: '17:00 - 18:30', dogCount: 1, zone: 'Recoleta',
    status: 'Cancelled', price: 2200,
  },
];

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
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const handleAccept = (id: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'Accepted' } : b));
  };
  const handleReject = (id: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'Rejected' } : b));
  };

  const filters: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'Pending', label: 'Pendientes' },
    { key: 'Accepted', label: 'Aceptadas' },
    { key: 'Expired', label: 'Expiradas / Canceladas' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in font-body">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#005da7] flex items-center gap-3">
          <Calendar className="w-8 h-8 text-[#005da7]" /> Mis Reservas
        </h1>
        <p className="text-sm text-[#414751] mt-1 font-body">
          Gestión transparente del ciclo de vida de reservas · {bookings.length} reservas registradas
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
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card-connection p-12 text-center bg-white border-[#dde4e6]">
            <Dog className="w-12 h-12 text-[#414751] mx-auto mb-3 opacity-40" />
            <p className="font-headline font-bold text-lg text-[#161d1f]">Ruh-roh! No hay reservas en esta categoría.</p>
          </div>
        ) : (
          filtered.map((booking) => {
            const StatusIcon = statusIcon[booking.status];
            return (
              <div key={booking.id} className="card-connection p-6 bg-white border-[#dde4e6] hover:shadow-level2 transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#414751]">{booking.id}</span>
                      <span className={`badge ${statusBadge[booking.status]}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusLabel[booking.status]}
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
                          onClick={() => handleAccept(booking.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#f9ffeb] border border-[#498300]/40 text-[#2a5000] text-xs font-bold font-headline hover:bg-[#498300]/20 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> ¡Aceptar!
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/40 text-[#93000a] text-xs font-bold font-headline hover:bg-[#ba1a1a]/20 transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
