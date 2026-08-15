import React, { useState, useEffect } from 'react';
import { Shield, FolderOpen, Lock, CheckCircle2, User, FileText, Check, ArrowUpFromLine, Loader2 } from 'lucide-react';
import { fetchIncidents, applyRestriction } from '../api/moderationApi';

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

const typeLabel: Record<WorkItem['type'], string> = {
  Report: 'Reporte',
  DisputedService: 'Servicio Disputado',
  RestrictionReview: 'Revisión Restricción',
  SuspensionReview: 'Revisión Suspensión',
  ReviewModeration: 'Moderación Reseña',
};

const restrictionTypeLabel: Record<Restriction['type'], string> = {
  BookingLimited: 'Reservas Limitadas',
  MessagingLimited: 'Mensajería Limitada',
  VisibilityReduced: 'Visibilidad Reducida',
  Suspended: 'Suspendido',
};

export const ModerationPage: React.FC = () => {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'workitems' | 'restrictions'>('workitems');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchIncidents()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          const mapped: WorkItem[] = data.map((inc: any) => ({
            id: inc.id || 'INC-1',
            type: 'Report',
            status: (inc.status as any) || 'Open',
            subject: inc.user_name || 'Usuario Reportado',
            summary: inc.description || 'Reporte registrado en la plataforma.',
            createdAt: inc.created_at || '15 de Agosto, 2026',
          }));
          setItems(mapped);
          setRestrictions([
            {
              id: 'REST-001',
              account: 'Paseador con Cancelaciones',
              type: 'VisibilityReduced',
              reason: 'Reiteradas cancelaciones de servicio.',
              appliedAt: '15 de Agosto, 2026',
              active: true,
            },
          ]);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResolve = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'Resolved' } : i)));
  };

  const handleLiftRestriction = (id: string) => {
    setRestrictions((prev) => prev.map((r) => (r.id === id ? { ...r, active: false } : r)));
  };

  const statusBadge: Record<WorkItem['status'], string> = {
    Open: 'badge-pending',
    Assigned: 'badge badge-disputed',
    Resolved: 'badge-accepted',
  };

  const openCount = items.filter((i) => i.status === 'Open').length;
  const activeRestCount = restrictions.filter((r) => r.active).length;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in font-body">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#005da7] flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#005da7]" /> Panel de Moderación
        </h1>
        <p className="text-sm text-[#414751] mt-1 font-body">
          Gestión de reportes, disputas y restricciones de cuentas
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Items abiertos', value: openCount, icon: FolderOpen, color: 'text-[#835500]', bg: 'bg-[#ffddb4]' },
          { label: 'Restricciones activas', value: activeRestCount, icon: Lock, color: 'text-[#93000a]', bg: 'bg-[#ffdad6]' },
          { label: 'Total resueltos', value: items.filter((i) => i.status === 'Resolved').length, icon: CheckCircle2, color: 'text-[#2a5000]', bg: 'bg-[#f9ffeb]' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card-connection p-5 flex items-center gap-4 bg-white border-[#dde4e6]">
              <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-2xl font-headline font-bold ${card.color}`}>{card.value}</p>
                <p className="text-xs font-semibold text-[#414751]">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSection('workitems')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold font-headline border transition-all duration-200 flex items-center gap-2 ${
            activeSection === 'workitems'
              ? 'bg-[#005da7] border-[#005da7] text-white shadow-sm'
              : 'border-[#dde4e6] bg-white text-[#414751] hover:text-[#005da7]'
          }`}
        >
          <FileText className="w-4 h-4" /> Work Items ({items.length})
        </button>
        <button
          onClick={() => setActiveSection('restrictions')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold font-headline border transition-all duration-200 flex items-center gap-2 ${
            activeSection === 'restrictions'
              ? 'bg-[#005da7] border-[#005da7] text-white shadow-sm'
              : 'border-[#dde4e6] bg-white text-[#414751] hover:text-[#005da7]'
          }`}
        >
          <Lock className="w-4 h-4" /> Restricciones ({restrictions.length})
        </button>
      </div>

      {/* Work Items */}
      {isLoading ? (
        <div className="card-connection p-12 text-center bg-white border-[#dde4e6]">
          <Loader2 className="w-8 h-8 text-[#005da7] animate-spin mx-auto mb-3" />
          <p className="font-headline font-bold text-base text-[#161d1f]">Cargando incidencias...</p>
        </div>
      ) : (
        <>
          {activeSection === 'workitems' && (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card-connection p-6 bg-white border-[#dde4e6] space-y-3 hover:shadow-level2 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-[#414751] truncate max-w-[120px]">{item.id}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef5f7] border border-[#dde4e6] font-bold text-[#005da7]">
                          {typeLabel[item.type]}
                        </span>
                        <span className={`badge ${statusBadge[item.status]}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="font-headline font-bold text-[#161d1f] text-base flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#005da7]" /> {item.subject}
                      </p>
                      <p className="text-xs text-[#414751] font-body">{item.summary}</p>
                      <p className="text-[10px] text-[#414751] font-body">Creado: {item.createdAt}</p>
                    </div>
                    {item.status !== 'Resolved' && (
                      <button
                        onClick={() => handleResolve(item.id)}
                        className="shrink-0 px-4 py-2 rounded-xl bg-[#f9ffeb] border border-[#498300]/40 text-[#2a5000] text-xs font-bold font-headline hover:bg-[#498300]/20 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> ¡Resolver!
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Restrictions */}
          {activeSection === 'restrictions' && (
            <div className="space-y-4">
              {restrictions.map((rest) => (
                <div key={rest.id} className={`card-connection p-6 bg-white border-[#dde4e6] transition-all duration-200 ${!rest.active ? 'opacity-60' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-[#414751]">{rest.id}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef5f7] border border-[#dde4e6] font-bold text-[#005da7]">
                          {restrictionTypeLabel[rest.type]}
                        </span>
                        <span className={`badge ${rest.active ? 'badge-rejected' : 'badge-accepted'}`}>
                          {rest.active ? '● Activa' : '○ Levantada'}
                        </span>
                      </div>
                      <p className="font-headline font-bold text-[#161d1f] text-base flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#005da7]" /> {rest.account}
                      </p>
                      <p className="text-xs text-[#414751] font-body">{rest.reason}</p>
                      <p className="text-[10px] text-[#414751] font-body">Aplicada: {rest.appliedAt}</p>
                    </div>
                    {rest.active && (
                      <button
                        onClick={() => handleLiftRestriction(rest.id)}
                        className="shrink-0 px-4 py-2 rounded-xl bg-[#eef5f7] border border-[#dde4e6] text-[#005da7] text-xs font-bold font-headline hover:bg-[#005da7]/10 transition-colors flex items-center gap-1"
                      >
                        <ArrowUpFromLine className="w-4 h-4" /> ¡Levantar restricción!
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
