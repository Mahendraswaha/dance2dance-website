import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  X, Star, CheckCircle2, AlertCircle, Clock, 
  Send, Sparkles, Calendar, MessageSquare, ShieldCheck
} from 'lucide-react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { getCategoryTheme, formatEventDate, getLocalizedEvent } from '../utils/eventHelpers';

export default function ReviewModal({ event, existingReview, user, onClose, onReviewSubmitted }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';

  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [useFirstNameOnly, setUseFirstNameOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fecha no ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event || !user) return null;

  const category = event.category || 'bethedance';
  const theme = getCategoryTheme(category);
  const { title: eventTitle } = getLocalizedEvent(event, currentLang);
  const dateRange = formatEventDate(event.startDate, event.endDate, currentLang);

  // Calcula nome público de exibição
  const rawName = user.profile?.fullName || user.profile?.nome || user.email?.split('@')[0] || 'Aluno';
  const nameParts = rawName.trim().split(' ').filter(Boolean);
  const displayName = useFirstNameOnly && nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
    : rawName;

  const ratingDescriptions = {
    1: t('reviews.rate1', 'Razoável'),
    2: t('reviews.rate2', 'Bom'),
    3: t('reviews.rate3', 'Muito Bom'),
    4: t('reviews.rate4', 'Excelente'),
    5: t('reviews.rate5', 'Transformador & Inesquecível')
  };

  const activeRating = hoverRating || rating;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) {
      setError(t('reviews.commentRequired', 'Por favor, escreva algumas palavras sobre sua experiência.'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        userId: user.uid,
        userEmail: user.email,
        userName: displayName,
        rawName: rawName,
        eventId: event.id,
        eventTitle: eventTitle,
        category: category,
        rating: Number(rating),
        comment: comment.trim(),
        status: existingReview?.status === 'approved' ? 'approved' : 'pending',
        updatedAt: new Date().toISOString()
      };

      if (existingReview?.id) {
        // Atualiza avaliação existente
        const reviewRef = doc(db, 'reviews', existingReview.id);
        await updateDoc(reviewRef, payload);
      } else {
        // Cria nova avaliação
        await addDoc(collection(db, 'reviews'), {
          ...payload,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }

      setSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted();
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
      setError(t('reviews.submitError', 'Ocorreu um erro ao salvar sua avaliação. Tente novamente.'));
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-lg bg-[#0E0E12] border border-[#1E1E28] rounded-[4px] shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col z-10 font-sans text-background"
      >
        {/* Header do Modal */}
        <div className="p-6 border-b border-[#1A1A24] bg-[#121218] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-heading uppercase tracking-[2px] text-accent font-semibold block">
                {t('reviews.modalTitle', 'Avaliar Workshop')}
              </span>
              <h3 className="font-drama text-xl text-[#FAF8F5] truncate max-w-xs sm:max-w-sm">
                {eventTitle}
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-[2px] bg-[#161620] hover:bg-[#20202A] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

          {/* Banner de status se já foi enviado */}
          {existingReview && (
            <div className={`p-3.5 rounded-[2px] border text-xs font-heading flex items-start gap-2.5 ${
              existingReview.status === 'approved'
                ? 'bg-green-950/30 border-green-800/40 text-green-300'
                : 'bg-amber-950/30 border-amber-800/40 text-amber-200'
            }`}>
              {existingReview.status === 'approved' ? (
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold block">
                  {existingReview.status === 'approved'
                    ? t('reviews.statusApproved', 'Avaliação Aprovada & Visível no Site')
                    : t('reviews.statusPending', 'Avaliação em Análise')}
                </span>
                <span className="text-[11px] opacity-90 leading-relaxed block mt-0.5">
                  {existingReview.status === 'approved'
                    ? t('reviews.statusApprovedDesc', 'Seu depoimento foi aprovado pela coordenação e pode ser exibido publicamente.')
                    : t('reviews.statusPendingDesc', 'Recebemos seu depoimento com carinho! Ele passará pela moderação da equipe antes de ser publicado.')}
                </span>
              </div>
            </div>
          )}

          {/* Seletor de Estrelas (1 a 5) */}
          <div className="space-y-2 text-center bg-[#14141A] border border-[#1E1E26] p-5 rounded-[2px]">
            <label className="block text-xs font-heading uppercase tracking-[2px] text-[#CFCFCF] mb-3">
              {t('reviews.ratingPrompt', 'Como você avalia este workshop?')}
            </label>

            <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = starVal <= activeRating;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer group"
                    title={`${starVal} estrelas`}
                  >
                    <Star 
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        isFilled 
                          ? 'fill-accent text-accent drop-shadow-[0_0_8px_rgba(201,168,76,0.6)]' 
                          : 'text-zinc-600 hover:text-accent/50'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>

            <div className="font-drama italic text-accent text-base min-h-[1.5rem] pt-1">
              {ratingDescriptions[activeRating] || ''}
            </div>
          </div>

          {/* Depoimento em Texto */}
          <div className="space-y-2">
            <label className="block text-xs font-heading uppercase tracking-[1.5px] text-[#CFCFCF]">
              {t('reviews.commentLabel', 'Seu Depoimento / Experiência')} *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('reviews.commentPlaceholder', 'Compartilhe o que você sentiu no corpo, o ritmo da aula, o acolhimento do grupo ou as transformações que notou...')}
              className="w-full bg-[#141418] border border-[#22222C] text-[#FAF8F5] p-3.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent/60 placeholder:text-zinc-600 resize-none transition-colors leading-relaxed"
            />
            <span className="text-[10px] text-zinc-500 font-heading block">
              {t('reviews.commentHint', 'Seu relato ajuda outros alunos a conhecerem o trabalho do Dance 2 Dance.')}
            </span>
          </div>

          {/* Opção de Nome Público */}
          <div className="p-3 bg-[#141418] border border-[#1E1E26] rounded-[2px] flex items-center justify-between text-xs font-heading">
            <div className="space-y-0.5">
              <span className="text-[#CFCFCF] block">
                {t('reviews.displayNameLabel', 'Assinatura do depoimento:')}
              </span>
              <span className="text-accent font-semibold font-mono">
                {displayName}
              </span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-white transition-colors">
              <input 
                type="checkbox" 
                checked={useFirstNameOnly}
                onChange={(e) => setUseFirstNameOnly(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-800 text-accent focus:ring-accent accent-accent cursor-pointer"
              />
              <span className="text-[11px]">{t('reviews.useFirstNameOnly', 'Apenas 1º nome + inicial')}</span>
            </label>
          </div>

          {/* Mensagens de Sucesso ou Erro */}
          {error && (
            <div className="p-3 rounded-[2px] bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-heading flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-[2px] bg-green-950/40 border border-green-800/40 text-green-300 text-xs font-heading flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-400" />
              <span>{t('reviews.successMessage', 'Muito obrigado! Avaliação enviada com sucesso.')}</span>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-[2px] bg-[#14141A] hover:bg-[#1E1E26] border border-zinc-800 text-zinc-400 hover:text-white font-heading text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {t('reviews.cancel', 'Cancelar')}
            </button>

            <button
              type="submit"
              disabled={loading || success}
              className="px-6 py-2.5 rounded-[2px] bg-accent text-primary hover:bg-[#FAF8F5] font-heading text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? t('reviews.submitting', 'Enviando...') : existingReview ? t('reviews.updateBtn', 'Atualizar Avaliação') : t('reviews.submitBtn', 'Enviar Avaliação')}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
