import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  HeartHandshake,
  Lock,
  User,
  Mail,
  Home
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, collection, runTransaction, updateDoc } from 'firebase/firestore';
import { 
  getCategoryTheme, 
  getLocalizedEvent, 
  formatEventDate,
  isEventScholarshipAllowed
} from '../utils/eventHelpers';
import { toast } from 'sonner';

export default function EnrollmentModal({
  isOpen,
  onClose,
  event,
  onSuccess
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';
  const { currentUser, signup, login } = useAuth();

  // Estado do formulário
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isExistingUserLogin, setIsExistingUserLogin] = useState(false);
  const [restrictions, setRestrictions] = useState('');
  const [scholarshipChoice, setScholarshipChoice] = useState('paying'); // 'paying' | 'scholarship'
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Preenche dados caso o usuário já esteja logado
  useEffect(() => {
    if (currentUser) {
      const profile = currentUser.profile || {};
      setFullName(profile.fullName || profile.nome || currentUser.displayName || '');
      setEmail(currentUser.email || '');
      setRestrictions(profile.restricoes || profile.restrictions || '');
      setAddress(profile.address || profile.endereco || '');
      setZip(profile.zip || profile.cep || '');
      setCity(profile.city || profile.cidade || profile.neighborhood || profile.bairro || 'Oslo');
    } else {
      setFullName('');
      setEmail('');
      setPassword('');
      setRestrictions('');
      setAddress('');
      setZip('');
      setCity('Oslo');
      setIsExistingUserLogin(false);
    }
    setScholarshipChoice('paying');
    setErrorMessage('');
  }, [currentUser, isOpen, event]);

  // Previne rolagem de fundo enquanto o modal está aberto
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

  if (!isOpen || !event) return null;

  const category = event.category || 'bethedance';
  const theme = getCategoryTheme(category);
  const { title: eventTitle, location: eventLocation } = getLocalizedEvent(event, currentLang);
  const dateRange = formatEventDate(event.startDate, event.endDate, currentLang);
  const timeRange = event.startTime && event.endTime ? `${event.startTime} – ${event.endTime}` : '';
  const isFull = (event.enrolledCount || 0) >= (event.totalSpots || 0);

  // O evento permite bolsas comunitárias? Usa a flag ou fallback inteligente por polo comunitário
  const allowsScholarships = isEventScholarshipAllowed(event);
  const isRequestingScholarship = allowsScholarships && scholarshipChoice === 'scholarship';

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    // Validações básicas
    if (!fullName.trim()) {
      setErrorMessage(t('enrollmentModal.errors.nameRequired', 'Por favor, informe seu nome completo.'));
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(t('enrollmentModal.errors.emailInvalid', 'Por favor, informe um e-mail válido.'));
      return;
    }
    if (!address.trim()) {
      setErrorMessage(t('enrollmentModal.errors.addressRequired', 'Por favor, informe a rua e número do seu endereço.'));
      return;
    }
    if (!zip.trim()) {
      setErrorMessage(t('enrollmentModal.errors.zipRequired', 'Por favor, informe o código postal (Postnummer).'));
      return;
    }
    if (!city.trim()) {
      setErrorMessage(t('enrollmentModal.errors.cityRequired', 'Por favor, informe o bairro ou cidade.'));
      return;
    }

    if (!currentUser && !isExistingUserLogin && (!password || password.length < 6)) {
      setErrorMessage(t('enrollmentModal.errors.passwordShort', 'A senha de acesso deve ter pelo menos 6 caracteres.'));
      return;
    }

    setLoading(true);

    try {
      let activeUid = currentUser?.uid;

      // 1. Se o usuário não está autenticado, cadastra ou autentica
      if (!activeUid) {
        if (isExistingUserLogin) {
          // Tenta login com a conta existente
          try {
            const userCred = await login(email.trim(), password);
            activeUid = userCred.user.uid;
          } catch (loginErr) {
            console.error(loginErr);
            setErrorMessage(t('enrollmentModal.errors.loginFailed', 'Senha incorreta ou usuário não encontrado. Verifique seus dados.'));
            setLoading(false);
            return;
          }
        } else {
          // Cria nova conta com o perfil
          try {
            const userData = {
              fullName: fullName.trim(),
              nome: fullName.trim(),
              email: email.trim(),
              address: address.trim(),
              endereco: address.trim(),
              zip: zip.trim(),
              cep: zip.trim(),
              city: city.trim(),
              cidade: city.trim(),
              neighborhood: city.trim(),
              restricoes: restrictions.trim(),
              role: 'student',
              emailVerified: false,
              createdAt: new Date().toISOString()
            };
            const userCred = await signup(email.trim(), password, userData);
            activeUid = userCred.user.uid;
          } catch (signupErr) {
            console.error(signupErr);
            if (signupErr.code === 'auth/email-already-in-use') {
              setIsExistingUserLogin(true);
              setErrorMessage(t('enrollmentModal.errors.emailInUse', 'Este e-mail já está cadastrado. Digite sua senha existente para confirmar a inscrição.'));
              setLoading(false);
              return;
            } else {
              setErrorMessage(signupErr.message || t('enrollmentModal.errors.genericAuth', 'Falha ao registrar conta de aluno.'));
              setLoading(false);
              return;
            }
          }
        }
      } else {
        // Se já está logado, atualiza o endereço e restrições no perfil se mudaram
        try {
          await updateDoc(doc(db, 'users', activeUid), {
            fullName: fullName.trim(),
            address: address.trim(),
            zip: zip.trim(),
            city: city.trim(),
            restricoes: restrictions.trim()
          });
        } catch (err) {
          console.warn('Não foi possível sincronizar perfil do usuário:', err);
        }
      }

      // 2. Transação atômica no Firestore para registrar a vaga
      const eventRef = doc(db, 'events', event.id);
      const newEnrollmentRef = doc(collection(db, 'enrollments'));
      let finalStatus = '';

      await runTransaction(db, async (transaction) => {
        const evDoc = await transaction.get(eventRef);
        if (!evDoc.exists()) {
          throw new Error(t('agendaPage.eventNotFound', 'Evento não encontrado.'));
        }

        const evData = evDoc.data();
        const currentlyFull = (evData.enrolledCount || 0) >= (evData.totalSpots || 0);
        finalStatus = currentlyFull ? 'waitlist' : 'enrolled';

        if (currentlyFull) {
          transaction.update(eventRef, { waitlistCount: (evData.waitlistCount || 0) + 1 });
        } else {
          transaction.update(eventRef, { enrolledCount: (evData.enrolledCount || 0) + 1 });
        }

        transaction.set(newEnrollmentRef, {
          eventId: event.id,
          userLang: currentLang,
          userId: activeUid,
          userName: fullName.trim(),
          userEmail: email.trim(),
          userAddress: address.trim(),
          userZip: zip.trim(),
          userCity: city.trim(),
          userNeighborhood: isRequestingScholarship ? city.trim() : '',
          userRestrictions: restrictions.trim(),
          status: finalStatus,
          scholarshipRequested: isRequestingScholarship,
          scholarshipStatus: isRequestingScholarship ? 'requested' : 'none',
          scholarshipNeighborhood: isRequestingScholarship ? city.trim() : '',
          createdAt: new Date().toISOString(),
          emailSent: false
        });
      });

      // 3. Notificação de Sucesso contextualizada
      if (isRequestingScholarship) {
        toast.success(
          t('enrollmentModal.successScholarship', 'Solicitação de bolsa recebida com sucesso! Analisaremos seu endereço em Tøyen/Grønland e retornaremos por e-mail.')
        );
      } else if (finalStatus === 'waitlist') {
        toast.success(
          t('enrollmentModal.successWaitlist', 'Você entrou na lista de espera! Avisaremos por e-mail assim que surgir uma vaga.')
        );
      } else {
        toast.success(
          t('enrollmentModal.successEnrolled', 'Inscrição confirmada com sucesso! Enviamos a confirmação para o seu e-mail.')
        );
      }

      if (onSuccess) {
        onSuccess({
          id: newEnrollmentRef.id,
          eventId: event.id,
          status: finalStatus,
          scholarshipRequested: isRequestingScholarship
        });
      }

      onClose();
    } catch (err) {
      console.error('Erro ao processar inscrição:', err);
      setErrorMessage(err.message || t('enrollmentModal.errors.genericEnroll', 'Erro ao registrar sua inscrição. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop escuro com blur suave */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={loading ? undefined : onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        />

        {/* Janela do Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-[#0D0D11] border border-[#262632] rounded-[4px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10 text-left my-auto overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Linha dourada superior sutil */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

          {/* Botão de Fechar */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 text-zinc-400 hover:text-[#FAF8F5] p-1.5 rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header com Resumo do Workshop */}
          <div className="mb-5 pb-5 border-b border-[#1E1E26] shrink-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[9px] font-heading font-bold uppercase tracking-wider ${theme.badgeBg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
                {theme.label}
              </span>

              {isFull ? (
                <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-yellow-950/40 text-yellow-400 border border-yellow-800/40 font-semibold">
                  {t('agendaPage.waitlist', 'Lista de Espera')}
                </span>
              ) : (
                <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-green-950/40 text-green-400 border border-green-800/40 font-semibold">
                  {t('agendaPage.enrolled', 'Vagas Abertas')}
                </span>
              )}
            </div>

            <h2 className="font-batang text-2xl sm:text-3xl text-[#FAF8F5] leading-tight mb-2">
              {eventTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 font-heading">
              {dateRange && (
                <span className="flex items-center gap-1.5 text-[#CFCFCF]">
                  <Calendar className="w-3.5 h-3.5 text-accent/80 shrink-0" />
                  <span>{dateRange}</span>
                </span>
              )}
              {timeRange && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{timeRange}</span>
                </span>
              )}
              {eventLocation && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate max-w-[220px]">{eventLocation}</span>
                </span>
              )}
            </div>
          </div>

          {/* Mensagem de Erro Inline */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-heading rounded-[2px] flex items-start gap-2 shrink-0">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulário com Scroll interno */}
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Bloco 1: Identificação */}
            <div className="space-y-3">
              <div>
                <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-1.5">
                  {t('enrollmentModal.fullName', 'Nome Completo')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-[#141418] border border-[#2A2A34] text-[#FAF8F5] pl-9 pr-4 py-2.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent/60 placeholder:text-zinc-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-1.5">
                  {t('enrollmentModal.email', 'E-mail')} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    disabled={!!currentUser}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-[#141418] border border-[#2A2A34] text-[#FAF8F5] pl-9 pr-4 py-2.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent/60 placeholder:text-zinc-600 transition-colors disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 2: Restrições Físicas ou de Saúde (Opcional) */}
            <div>
              <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-1.5">
                {t('enrollmentModal.restrictionsLabel', 'Restrições Físicas ou de Saúde')}
                <span className="text-zinc-500 font-normal lowercase ml-1">({t('common.optional', 'opcional')})</span>
              </label>
              <textarea
                rows="2"
                value={restrictions}
                onChange={(e) => setRestrictions(e.target.value)}
                placeholder={t(
                  'enrollmentModal.restrictionsPlaceholder',
                  'Dores na coluna, lesões, cirurgias recentes, gravidez... Se não tiver nenhuma, deixe em branco.'
                )}
                className="w-full bg-[#141418] border border-[#2A2A34] text-[#FAF8F5] px-3.5 py-2.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent/60 placeholder:text-zinc-600 transition-colors resize-none"
              />
            </div>

            {/* Bloco 3: Modalidade de Vaga (Apenas se o workshop permitir bolsas) */}
            {allowsScholarships && (
              <div className="p-3.5 rounded-[3px] bg-[#14141A] border border-[#22222E] space-y-2.5">
                <div className="font-heading text-[10px] uppercase tracking-[1.5px] text-accent font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span>{t('enrollmentModal.scholarshipSectionTitle', 'Modalidade da Inscrição')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Opção Pagante */}
                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-[2px] border cursor-pointer transition-all ${
                      scholarshipChoice === 'paying'
                        ? 'bg-accent/10 border-accent/60 text-[#FAF8F5]'
                        : 'bg-[#101014] border-[#22222C] text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="scholarshipChoice"
                      value="paying"
                      checked={scholarshipChoice === 'paying'}
                      onChange={() => setScholarshipChoice('paying')}
                      className="mt-0.5 accent-accent"
                    />
                    <div className="text-[11px] font-heading leading-tight">
                      <span className="font-semibold block text-white mb-0.5">
                        {t('enrollmentModal.payingOption', 'Vaga Regular (Pagante)')}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {t('enrollmentModal.payingDesc', 'Sua taxa financia as bolsas sociais para a comunidade.')}
                      </span>
                    </div>
                  </label>

                  {/* Opção Bolsa Comunitária */}
                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-[2px] border cursor-pointer transition-all ${
                      scholarshipChoice === 'scholarship'
                        ? 'bg-accent/15 border-accent text-[#FAF8F5] shadow-sm'
                        : 'bg-[#101014] border-[#22222C] text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="scholarshipChoice"
                      value="scholarship"
                      checked={scholarshipChoice === 'scholarship'}
                      onChange={() => setScholarshipChoice('scholarship')}
                      className="mt-0.5 accent-accent"
                    />
                    <div className="text-[11px] font-heading leading-tight">
                      <span className="font-semibold block text-accent mb-0.5">
                        {t('enrollmentModal.scholarshipOption', 'Bolsa Integral (100%)')}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {t('enrollmentModal.scholarshipDesc', 'Exclusivo para moradores de Tøyen e Grønland.')}
                      </span>
                    </div>
                  </label>
                </div>

                {isRequestingScholarship && (
                  <div className="p-2.5 bg-[#171722] border border-[#2C2C3C] rounded-[2px] text-[10px] font-heading text-zinc-300 leading-relaxed flex items-start gap-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span>
                      {t(
                        'scholarshipModal.solidarityNote',
                        'Se você tem condições financeiras de investir no valor da vaga, sua taxa ajuda a manter essa oportunidade aberta para quem mais precisa.'
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Bloco 4: Endereço (Rótulo Dinâmico: Faktura vs Comprovação de Bairro) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF]">
                  {isRequestingScholarship ? (
                    <span className="text-accent font-semibold flex items-center gap-1.5">
                      <Home className="w-3 h-3" />
                      {t('enrollmentModal.addressTitleScholarship', 'Endereço em Oslo (Validação Tøyen / Grønland)')} *
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-zinc-400" />
                      {t('enrollmentModal.addressTitleInvoice', 'Endereço para emissão da Fatura (Faktura)')} *
                    </span>
                  )}
                </label>
              </div>

              {/* Linha da Rua */}
              <div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('enrollmentModal.addressPlaceholder', 'Rua e número (ex: Kolstadgata 1)')}
                  className="w-full bg-[#141418] border border-[#2A2A34] text-[#FAF8F5] px-3.5 py-2.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent/60 placeholder:text-zinc-600 transition-colors"
                />
              </div>

              {/* Linha de CEP e Cidade/Bairro */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder={t('enrollmentModal.zipPlaceholder', 'Código Postal / Postnummer')}
                    className="w-full bg-[#141418] border border-[#2A2A34] text-[#FAF8F5] px-3.5 py-2.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent/60 placeholder:text-zinc-600 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={t('enrollmentModal.cityPlaceholder', 'Bairro / Bydel (ex: Tøyen, Oslo)')}
                    className="w-full bg-[#141418] border border-[#2A2A34] text-[#FAF8F5] px-3.5 py-2.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent/60 placeholder:text-zinc-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 5: Senha de Acesso (Apenas se o aluno não estiver autenticado) */}
            {!currentUser && (
              <div className="p-3.5 rounded-[3px] bg-[#141418] border border-[#22222C] space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF]">
                    {isExistingUserLogin 
                      ? t('auth.passwordLabel', 'Digite sua senha cadastrada') 
                      : t('enrollmentModal.passwordLabel', 'Crie uma senha de acesso')} *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsExistingUserLogin(!isExistingUserLogin);
                      setErrorMessage('');
                    }}
                    className="text-[10px] font-heading text-accent hover:underline cursor-pointer"
                  >
                    {isExistingUserLogin 
                      ? t('enrollmentModal.newAccountLink', 'Sou novo aluno') 
                      : t('enrollmentModal.existingAccountLink', 'Já tenho conta')}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    className="w-full bg-[#101014] border border-[#2A2A34] text-[#FAF8F5] pl-9 pr-4 py-2.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent/60 placeholder:text-zinc-600 transition-colors"
                  />
                </div>
                {!isExistingUserLogin && (
                  <p className="text-[10px] font-heading text-zinc-500">
                    {t('enrollmentModal.passwordHint', 'Sua senha permite acessar sua área de aluno, histórico e certificados.')}
                  </p>
                )}
              </div>
            )}

            {/* Botões de Ação */}
            <div className="pt-3 border-t border-[#1E1E26] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-[2px] border border-[#33333F] hover:border-zinc-400 text-zinc-300 hover:text-white font-heading text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {t('common.cancel', 'Cancelar')}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-[2px] bg-accent hover:bg-[#F0EDE8] text-primary font-heading text-[10px] uppercase tracking-[2px] font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <span>{t('common.loading', 'Processando...')}</span>
                ) : isRequestingScholarship ? (
                  <span>{t('enrollmentModal.submitScholarshipBtn', 'Solicitar Bolsa Integral')}</span>
                ) : isFull ? (
                  <span>{t('agendaPage.joinWaitlist', 'Entrar na Lista de Espera')}</span>
                ) : (
                  <span>{t('enrollmentModal.submitEnrollBtn', 'Confirmar Inscrição')}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
