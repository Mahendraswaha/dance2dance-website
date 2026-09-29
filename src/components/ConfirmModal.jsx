import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[#0D0D12] border border-[#22222A] rounded-[4px] shadow-2xl p-6"
          >
            <button 
              onClick={onCancel}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-950/30 text-red-500 rounded-full shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[#F0EDE8] font-drama text-xl mb-2">{title}</h3>
                <p className="text-[#9A9A9A] font-heading font-light text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 font-heading text-xs font-semibold tracking-wider text-[#9A9A9A] hover:text-white transition-colors uppercase"
              >
                {t('common.cancel', 'Cancelar')}
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 hover:border-red-600/50 rounded-[2px] font-heading text-xs font-semibold tracking-wider uppercase transition-all"
              >
                {t('common.confirm', 'Confirmar')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
