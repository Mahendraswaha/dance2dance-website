import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, X, HeartHandshake } from 'lucide-react';

export default function ScholarshipModal({
  isOpen,
  onClose,
  onConfirmScholarship,
  onDeclineScholarship,
  workshopTitle = '',
  neighborhood = '',
  loading = false
}) {
  const { t } = useTranslation();

  // Previne rolagem de fundo enquanto o modal esta aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-[#121218] border border-[#2B2B38] rounded-[4px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 text-left overflow-hidden my-auto"
          >
            {/* Subtle top gold line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-4 right-4 text-zinc-400 hover:text-[#FAF8F5] p-1.5 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-accent/15 border border-accent/30 text-accent font-heading text-[10px] font-semibold uppercase tracking-[1.5px] mb-4">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>{t('scholarshipModal.badge', 'Tøyen & Grønland • Acesso Comunitário')}</span>
            </div>

            {/* Title / Question */}
            <h2 className="font-drama text-2xl sm:text-3xl text-[#FAF8F5] leading-snug mb-3">
              {t('scholarshipModal.question', 'Você deseja solicitar bolsa integral para esse workshop?')}
            </h2>

            {/* Workshop highlight if available */}
            {workshopTitle && (
              <div className="mb-3 text-xs font-heading text-accent/90 uppercase tracking-wider font-semibold">
                {workshopTitle}
              </div>
            )}

            {/* Explanatory context */}
            <p className="text-xs sm:text-sm font-heading text-zinc-300 leading-relaxed mb-6">
              {t(
                'scholarshipModal.description',
                'Identificamos que seu endereço registrado é em {{neighborhood}}. Moradores de Tøyen e Grønland têm direito a bolsas de 100% financiadas pelo nosso ecossistema social de sustentabilidade.',
                { neighborhood: neighborhood || 'Tøyen / Grønland' }
              )}
            </p>

            <div className="p-3.5 rounded-[3px] bg-[#171720] border border-[#232330] text-[11px] font-heading text-zinc-400 leading-relaxed mb-6">
              <div className="flex items-start gap-2">
                <HeartHandshake className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>
                  {t(
                    'scholarshipModal.solidarityNote',
                    'Se você tem condições financeiras de investir no valor da vaga, sua taxa ajuda a manter essa oportunidade aberta para quem mais precisa.'
                  )}
                </span>
              </div>
            </div>

            {/* Decision Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {/* Button 1: Decline scholarship / Pay */}
              <button
                type="button"
                onClick={onDeclineScholarship}
                disabled={loading}
                className="flex-1 order-2 sm:order-1 px-4 py-3 rounded-[3px] border border-[#3A3A4C] hover:border-zinc-300 text-zinc-300 hover:text-white font-heading text-xs uppercase tracking-wider font-semibold transition-all text-center cursor-pointer disabled:opacity-50"
              >
                {loading ? t('common.loading', 'Processando...') : t('scholarshipModal.declineBtn', 'Não, tenho condições de pagar')}
              </button>

              {/* Button 2: Confirm scholarship */}
              <button
                type="button"
                onClick={onConfirmScholarship}
                disabled={loading}
                className="flex-1 order-1 sm:order-2 px-4 py-3 rounded-[3px] bg-accent hover:bg-[#F0EDE8] text-primary font-heading text-xs uppercase tracking-wider font-bold transition-all text-center shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? t('common.loading', 'Processando...') : t('scholarshipModal.confirmBtn', 'Sim, solicito bolsa integral')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
