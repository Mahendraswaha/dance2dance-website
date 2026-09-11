import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, 
  Heart, 
  Users, 
  CheckCircle2, 
  Copy, 
  Check, 
  Share2
} from 'lucide-react';

const GOAL_COUNT = 10;

export default function WorkshopWishlist({ program, workshop }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const workshopKey = `${program?.id || 'program'}_${workshop?.slug || workshop?.id || 'workshop'}`;
  const workshopTitle = t(`programs.${program?.id}.workshops.${workshop?.id}.title`, workshop?.title || 'Workshop');

  // Real-time listener for wishlist interest for this specific workshop
  useEffect(() => {
    if (!workshopKey) return;
    setLoading(true);

    const q = query(collection(db, 'wishlists'), where('workshopKey', '==', workshopKey));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setWishes(docs);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao carregar wishlist:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workshopKey]);

  const isUserInterested = currentUser && wishes.some(w => w.userId === currentUser.uid);
  const count = wishes.length;
  const progressPercent = Math.min(100, Math.round((count / GOAL_COUNT) * 100));

  async function handleToggleInterest() {
    if (!currentUser) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setSubmitting(true);
    const wishDocId = `${workshopKey}_${currentUser.uid}`;
    const wishDocRef = doc(db, 'wishlists', wishDocId);

    try {
      if (isUserInterested) {
        await deleteDoc(wishDocRef);
      } else {
        await setDoc(wishDocRef, {
          workshopKey,
          programId: program?.id || '',
          workshopSlug: workshop?.slug || workshop?.id || '',
          workshopTitle,
          targetPath: `/${program?.id}/${workshop?.slug || workshop?.id}`,
          userId: currentUser.uid,
          userName: currentUser.profile?.fullName || currentUser.profile?.nome || currentUser.email || 'Aluno',
          userEmail: currentUser.email || '',
          userPhone: currentUser.profile?.phone || currentUser.profile?.telefone || '',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Erro ao atualizar interesse:", err);
      alert(t('common.error', 'Ocorreu um erro ao atualizar seu interesse. Tente novamente.'));
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopyLink() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error("Erro ao copiar link:", err);
    });
  }

  function handleShareWhatsApp() {
    const currentUrl = window.location.href;
    const rawMessage = t('workshopWishlist.whatsappMessage', {
      title: workshopTitle,
      url: currentUrl,
      defaultValue: `Oi! Quero participar do workshop "${workshopTitle}" na Dance2Dance em Oslo. Quando 10 pessoas demonstrarem interesse, eles abrem uma nova turma! Dá uma olhada e clica em 'Tenho Interesse' pra gente fazer juntos: ${currentUrl}`
    });

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(rawMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="w-full my-12 p-8 md:p-12 rounded-[3px] bg-[#101014] border border-[#22222C] shadow-2xl relative overflow-hidden"
    >
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-heading text-[10px] uppercase tracking-[2px] mb-5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>{t('workshopWishlist.badge', 'Lista de Interesse • Meta de 10 Pessoas')}</span>
        </div>

        {/* Title */}
        <h3 className="font-batang text-2xl md:text-3xl text-[#F0EDE8] mb-3">
          {t('workshopWishlist.title', 'Próxima Turma sob Demanda')}
        </h3>

        {/* Description */}
        <p className="font-heading font-light text-[#A0A0A0] text-sm md:text-base leading-relaxed mb-8">
          {t('workshopWishlist.description', 'No momento não há nenhuma data agendada para este workshop. Assim que 10 pessoas manifestarem interesse, uma nova turma será aberta com datas e horários prioritários para quem estiver na lista!')}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-[#181822] border border-[#262635] rounded-xl p-5 mb-8 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <span className="font-heading text-xs uppercase tracking-wider text-[#D0D0D8] font-semibold">
                {count >= GOAL_COUNT
                  ? t('workshopWishlist.goalReached', { count, defaultValue: `Meta atingida! (${count} interessados)` })
                  : t('workshopWishlist.progressLabel', { count, defaultValue: `${count} de 10 pessoas interessadas para abrir turma` })}
              </span>
            </div>
            <span className="font-mono text-xs text-accent font-bold">
              {progressPercent}%
            </span>
          </div>

          {/* Bar */}
          <div className="w-full h-3 bg-[#0C0C10] rounded-full overflow-hidden p-0.5 border border-[#1E1E28]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                count >= GOAL_COUNT 
                  ? 'bg-gradient-to-r from-emerald-500 to-accent shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
                  : 'bg-gradient-to-r from-amber-600 via-accent to-yellow-300 shadow-[0_0_10px_rgba(226,195,102,0.4)]'
              }`}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#7A7A88] mt-2">
            <span>0 {t('workshopWishlist.people', 'pessoas')}</span>
            <span>5</span>
            <span className="text-accent font-semibold">10 {t('workshopWishlist.openCohort', '(Abertura da Turma)')}</span>
          </div>
        </div>

        {/* Action Button: Toggle Wishlist */}
        <div className="w-full sm:w-auto flex flex-col items-center gap-3 mb-10">
          {isUserInterested ? (
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 font-heading text-xs font-semibold uppercase tracking-[1.5px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t('workshopWishlist.alreadyJoined', 'Você está na lista de interessados! Avisaremos você.')}</span>
              </div>
              <button
                type="button"
                onClick={handleToggleInterest}
                disabled={submitting}
                className="text-[11px] font-heading text-[#80808C] hover:text-red-400 transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer mt-1"
              >
                {submitting ? t('common.loading', 'Processando...') : t('workshopWishlist.btnLeave', 'Remover meu interesse')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleToggleInterest}
              disabled={submitting}
              className="group inline-flex items-center justify-center gap-3 font-heading text-xs tracking-[2px] uppercase bg-accent text-primary px-9 py-4 hover:bg-white transition-all duration-300 font-bold rounded-full shadow-lg hover:shadow-accent/20 cursor-pointer w-full sm:w-auto"
            >
              <Heart className="w-4 h-4 text-primary fill-primary group-hover:scale-110 transition-transform" />
              <span>
                {submitting 
                  ? t('common.loading', 'Processando...') 
                  : currentUser 
                    ? t('workshopWishlist.btnJoin', 'Tenho Interesse neste Workshop')
                    : t('workshopWishlist.btnJoinLogin', 'Entrar na Lista de Desejos')}
              </span>
            </button>
          )}

          {!currentUser && (
            <span className="text-[11px] font-heading text-[#7A7A88]">
              {t('workshopWishlist.loginPrompt', 'Faça login ou cadastre-se para registrar seu interesse.')}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#1E1E28] mb-8" />

        {/* Invite Friends Section */}
        <div className="w-full flex flex-col items-center">
          <span className="font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-4 flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5 text-accent" />
            {t('workshopWishlist.inviteTitle', 'Convide seus amigos para atingirmos a meta mais rápido!')}
          </span>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* WhatsApp Share */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-[#182820] hover:bg-[#1E3328] border border-[#254A36] text-[#4ADE80] font-heading text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer w-full sm:w-auto"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>{t('workshopWishlist.shareWhatsapp', 'Convidar via WhatsApp')}</span>
            </button>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1A1A24] hover:bg-[#242432] border border-[#2E2E3E] text-[#CFCFCF] hover:text-white font-heading text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer w-full sm:w-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">{t('workshopWishlist.linkCopied', 'Link copiado!')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-accent/80" />
                  <span>{t('workshopWishlist.copyLink', 'Copiar Link')}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
