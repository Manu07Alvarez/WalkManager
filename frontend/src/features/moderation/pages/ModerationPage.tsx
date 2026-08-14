import React, { useState } from 'react';

// TODO: Connect to GET /moderation/reports and POST /moderation/reports/:id/resolve (FR-063)
// TODO: Connect to POST /moderation/restrictions/:id/lift (FR-063)
// REVIEW: Add dispute resolution modal for Moderators

interface WorkItem {
  id: string;
  type: 'Report' | 'DisputedService' | 'RestrictionReview' | 'SuspensionReview' | 'ReviewModeration';
  status: 'Open' | 'Assigned' | 'Resolved';
  subject: string;
  summary: string;
  createdAt: string;
  assignedModerator?: string;
}

interface Restriction {
  id: string;
  account: string;
  type: 'BookingLimited' | 'MessagingLimited' | 'VisibilityReduced' | 'Suspended';
  reason: string;
  appliedAt: string;
  active: boolean;
}

const MOCK_WORK_ITEMS: WorkItem[] = [
  {
    id: 'WI-001', type: 'DisputedService', status: 'Open',
    subject: 'Carlos Ruiz (Walker)', summary: 'Cliente reporta que el paseador no se presentó al servicio.',
    createdAt: '2026-08-11',
  },
  {
    id: 'WI-002', type: 'ReviewModeration', status: 'Assigned',
    subject: 'Reseña R-003', summary: 'Reseña pendiente de moderación antes de publicación pública.',
    createdAt: '2026-08-10', assignedModerator: 'Admin Mod',
  },
  {
    id: 'WI-003', type: 'Report', status: 'Open',
    subject: 'Ana Pérez (Customer)', summary: 'Múltiples cancelaciones tardías en los últimos 30 días.',
    createdAt: '2026-08-09',
  },
  {
    id: 'WI-004', type: 'SuspensionReview', status: 'Resolved',
    subject: 'Diego López (Walker)', summary: 'Revisión de suspensión temporal. Levantada tras rectificación.',
    createdAt: '2026-08-07',
  },
];

const MOCK_RESTRICTIONS: Restriction[] = [
  {
    id: 'REST-001', account: 'Diego López', type: 'VisibilityReduced',
    reason: 'Tres no-shows consecutivos en 30 días.',
    appliedAt: '2026-08-08', active: true,
  },
  {
    id: 'REST-002', account: 'Ana Pérez', type: 'BookingLimited',
    reason: 'Exceso de cancelaciones tardías.',
    appliedAt: '2026-08-05', active: false,
  },
];

const typeLabel: Record<WorkItem['type'], string> = {
  Report: '📋 Reporte',
  DisputedService: '⚖️ Servicio Disputado',
  RestrictionReview: '🔒 Revisión Restricción',
  SuspensionReview: '🚫 Revisión Suspensión',
  ReviewModeration: '⭐ Moderación Reseña',
};

const restrictionTypeLabel: Record<Restriction['type'], string> = {
  BookingLimited: '📅 Reservas Limitadas',
  MessagingLimited: '💬 Mensajería Limitada',
  VisibilityReduced: '👁 Visibilidad Reducida',
  Suspended: '🚫 Suspendido',
};

export const ModerationPage: React.FC = () => {
  const [items, setItems] = useState<WorkItem[]>(MOCK_WORK_ITEMS);
  const [restrictions, setRestrictions] = useState<Restriction[]>(MOCK_RESTRICTIONS);
  const [activeSection, setActiveSection] = useState<'workitems' | 'restrictions'>('workitems');

  const handleResolve = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: 'Resolved' } : i));
  };

  const handleLiftRestriction = (id: string) => {
    setRestrictions((prev) => prev.map((r) => r.id === id ? { ...r, active: false } : r));
  };

  const statusBadge: Record<WorkItem['status'], string> = {
    Open: 'badge-pending',
    Assigned: 'badge badge-disputed',
    Resolved: 'badge-accepted',
  };

  const openCount = items.filter((i) => i.status === 'Open').length;
  const activeRestCount = restrictions.filter((r) => r.active).length;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">🛡️ Panel de Moderación</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Gestión de reportes, disputas y restricciones de cuentas (FR-063)
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Items abiertos', value: openCount, icon: '📂', color: 'text-amber-400' },
          { label: 'Restricciones activas', value: activeRestCount, icon: '🔒', color: 'text-rose-400' },
          { label: 'Total resueltos', value: items.filter((i) => i.status === 'Resolved').length, icon: '✅', color: 'text-emerald-400' },
        ].map((card) => (
          <div key={card.label} className="glass-card p-5 flex items-center gap-4">
            <span className="text-3xl">{card.icon}</span>
            <div>
              <p className={`text-2xl font-extrabold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-zinc-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Section toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSection('workitems')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
            activeSection === 'workitems'
              ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
              : 'border-white/10 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          📋 Work Items
        </button>
        <button
          onClick={() => setActiveSection('restrictions')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
            activeSection === 'restrictions'
              ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
              : 'border-white/10 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🔒 Restricciones
        </button>
      </div>

      {/* Work Items */}
      {activeSection === 'workitems' && (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="glass-card p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-zinc-600">{item.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                      {typeLabel[item.type]}
                    </span>
                    <span className={`badge ${statusBadge[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="font-semibold text-white text-sm">👤 {item.subject}</p>
                  <p className="text-xs text-zinc-500">{item.summary}</p>
                  <p className="text-[10px] text-zinc-600">Creado: {item.createdAt}{item.assignedModerator ? ` · Asignado a: ${item.assignedModerator}` : ''}</p>
                </div>
                {item.status !== 'Resolved' && (
                  <button
                    onClick={() => handleResolve(item.id)}
                    className="shrink-0 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
                  >
                    ✓ Resolver
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restrictions */}
      {activeSection === 'restrictions' && (
        <div className="space-y-3">
          {restrictions.map((rest) => (
            <div key={rest.id} className={`glass-card p-5 ${!rest.active ? 'opacity-60' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-600">{rest.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                      {restrictionTypeLabel[rest.type]}
                    </span>
                    <span className={`badge ${rest.active ? 'badge-rejected' : 'badge-accepted'}`}>
                      {rest.active ? '● Activa' : '○ Levantada'}
                    </span>
                  </div>
                  <p className="font-semibold text-white text-sm">👤 {rest.account}</p>
                  <p className="text-xs text-zinc-500">{rest.reason}</p>
                  <p className="text-[10px] text-zinc-600">Aplicada: {rest.appliedAt}</p>
                </div>
                {rest.active && (
                  <button
                    onClick={() => handleLiftRestriction(rest.id)}
                    className="shrink-0 px-4 py-2 rounded-lg bg-zinc-500/15 border border-zinc-500/25 text-zinc-400 text-xs font-semibold hover:bg-zinc-500/25 transition-colors"
                  >
                    ↑ Levantar restricción
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
