import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationModalProps {
  isOpen: boolean;
  type?: NotificationType;
  title: string;
  message: string;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  type = 'info',
  title,
  message,
  onClose,
}) => {
  const icons = {
    success: <CheckCircle2 className="w-8 h-8 text-[#498300]" />,
    error: <AlertCircle className="w-8 h-8 text-[#ba1a1a]" />,
    info: <Info className="w-8 h-8 text-[#005da7]" />,
  };

  const pretextBanners = {
    success: { bg: 'bg-[#f9ffeb]', border: 'border-[#498300]/30', text: 'text-[#2a5000]', label: '🐾 ¡Paseo Exitoso!' },
    error: { bg: 'bg-[#ffdad6]', border: 'border-[#ba1a1a]/30', text: 'text-[#93000a]', label: '⚠️ Atención' },
    info: { bg: 'bg-[#eef5f7]', border: 'border-[#005da7]/30', text: 'text-[#005da7]', label: 'ℹ️ Información de Cuenta' },
  };

  const banner = pretextBanners[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0d1417]/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-level2 border border-[#dde4e6] z-10 space-y-4 font-body"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#414751] hover:text-[#161d1f] p-1 rounded-full hover:bg-[#eef5f7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Pretext Banner */}
            <div className={`p-3 rounded-2xl ${banner.bg} border ${banner.border} flex items-center gap-2.5`}>
              {icons[type]}
              <div>
                <p className={`text-xs font-bold font-headline ${banner.text}`}>{banner.label}</p>
                <p className="text-xs text-[#414751] font-body leading-tight">WalkManager</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-lg font-headline font-bold text-[#161d1f]">{title}</h3>
              <p className="text-sm text-[#414751] leading-relaxed font-body">{message}</p>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="btn-brand w-full py-3 text-xs font-headline font-bold"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
