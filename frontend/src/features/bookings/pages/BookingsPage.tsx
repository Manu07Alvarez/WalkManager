import React, { useState } from 'react';

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

const statusLabel: Record<BookingStatus, string> = {
  Pending:   '⏳ Pendiente',
  Accepted:  '✅ Aceptada',
  Rejected:  '❌ Rechazada',
  Expired:   '⏱ Expirada',
  Cancelled: '🚫 Cancelada',
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
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">📅 Mis Reservas</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Gestión del ciclo de vida de reservas · {bookings.length} total
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              filter === f.key
                ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                : 'border-white/10 text-zinc-500 hover:text-zinc-300 hover:border-white/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Booking list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-zinc-400 text-sm">No hay reservas en esta categoría.</p>
          </div>
        ) : (
          filtered.map((booking) => (
            <div key={booking.id} className="glass-card p-5 hover:border-white/10 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-600">{booking.id}</span>
                    <span className={`badge ${statusBadge[booking.status]}`}>
                      {statusLabel[booking.status]}
                    </span>
                  </div>
                  <p className="font-semibold text-white text-sm">
                    🦮 {booking.walkerName} → 🐶 {booking.customerName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    📅 {booking.date} · 🕐 {booking.time} · 📍 {booking.zone} · {booking.dogCount} perro{booking.dogCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-lg font-bold text-gradient">
                    ${booking.price.toLocaleString()}
                  </span>
                  {booking.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(booking.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
                      >
                        ✓ Aceptar
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/25 text-rose-400 text-xs font-semibold hover:bg-rose-500/25 transition-colors"
                      >
                        ✗ Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
