import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReviewModal from '../components/ReviewModal';
import { 
  CheckCircle2, User, Save, ArrowLeft, Calendar, Clock, 
  MapPin, Sparkles, ExternalLink, CalendarPlus, ShieldCheck, 
  Star, MessageSquare, AlertCircle, Loader2, Award, ChevronRight,
  GraduationCap, Download, Trash2
} from 'lucide-react';
import { collection, getDocs, query, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  getCategoryTheme, 
  formatEventDate, 
  getLocalizedEvent, 
  isEventPast, 
  generateGoogleCalendarUrl, 
  downloadEventIcs 
} from '../utils/eventHelpers';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';
  const { currentUser, updateProfileData } = useAuth();
  const navigate = useNavigate();

  // Tab: 'courses' | 'personal_data'
  const [activeTab, setActiveTab] = useState('courses');

  // Form State para Dados Cadastrais
  const [formData, setFormData] = useState({
    nome: '',
    birthDate: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: '',
    zip: '',
    country: '',
    experiencia: '',
    restricoes: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Estados de Cursos & Avaliações
  const [enrollments, setEnrollments] = useState([]);
  const [eventsMap, setEventsMap] = useState({});
  const [reviewsMap, setReviewsMap] = useState({});
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Estado do Modal de Avaliação
  const [selectedEventForReview, setSelectedEventForReview] = useState(null);
  const [selectedReviewForModal, setSelectedReviewForModal] = useState(null);

  // Redireciona se não autenticado
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Carrega dados do perfil atual
  useEffect(() => {
    if (currentUser?.profile) {
      const p = currentUser.profile;
      setFormData({
        nome: p.fullName || p.nome || '',
        birthDate: p.birthDate || '',
        phone: p.phone || p.telefone || '',
        address: p.address || p.endereco || '',
        neighborhood: p.neighborhood || p.bairro || '',
        city: p.city || p.cidade || '',
        zip: p.zip || p.cep || '',
        country: p.country || p.pais || '',
        experiencia: p.experiencia || '',
        restricoes: p.restricoes || ''
      });
    }
  }, [currentUser]);

  // Busca inscrições, eventos e avaliações do aluno
  const fetchUserCoursesAndReviews = useCallback(async () => {
    if (!currentUser?.uid) return;
    setLoadingCourses(true);

    try {
      // 1. Busca eventos para compor o mapa
      const eventsSnap = await getDocs(collection(db, 'events'));
      const evMap = {};
      eventsSnap.forEach(doc => {
        evMap[doc.id] = { id: doc.id, ...doc.data() };
      });
      setEventsMap(evMap);

      // 2. Busca inscrições do usuário por UID
      const enrollQ = query(
        collection(db, 'enrollments'), 
        where('userId', '==', currentUser.uid)
      );
      const enrollSnap = await getDocs(enrollQ);
      let userEnrolls = enrollSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fallback para e-mail caso haja inscrições antigas sem userId
      if (currentUser.email) {
        const enrollEmailQ = query(
          collection(db, 'enrollments'),
          where('userEmail', '==', currentUser.email.toLowerCase())
        );
        const enrollEmailSnap = await getDocs(enrollEmailQ);
        const emailEnrolls = enrollEmailSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Unifica sem duplicados
        const ids = new Set(userEnrolls.map(e => e.id));
        emailEnrolls.forEach(e => {
          if (!ids.has(e.id)) {
            userEnrolls.push(e);
            ids.add(e.id);
          }
        });
      }

      setEnrollments(userEnrolls);

      // 3. Busca avaliações já feitas pelo usuário
      const reviewQ = query(
        collection(db, 'reviews'),
        where('userId', '==', currentUser.uid)
      );
      const reviewSnap = await getDocs(reviewQ);
      const revMap = {};
      reviewSnap.forEach(doc => {
        const data = doc.data();
        revMap[data.eventId] = { id: doc.id, ...data };
      });
      setReviewsMap(revMap);

    } catch (err) {
      console.error("Erro ao carregar cursos do aluno:", err);
    } finally {
      setLoadingCourses(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserCoursesAndReviews();
  }, [fetchUserCoursesAndReviews]);

  // Separa cursos em Próximos e Realizados
  const { upcomingList, pastList } = useMemo(() => {
    const list = enrollments
      .map(enr => {
        const ev = eventsMap[enr.eventId];
        return {
          ...enr,
          event: ev || null
        };
      })
      .filter(item => item.event !== null);

    const upcoming = [];
    const past = [];

    list.forEach(item => {
      if (isEventPast(item.event)) {
        past.push(item);
      } else {
        upcoming.push(item);
      }
    });

    // Próximos: ordem cronológica ascendente (mais perto primeiro)
    upcoming.sort((a, b) => {
      const dateA = a.event?.startDate || '';
      const dateB = b.event?.startDate || '';
      return dateA.localeCompare(dateB);
    });

    // Realizados: ordem cronológica descendente (mais recentes primeiro)
    past.sort((a, b) => {
      const dateA = a.event?.startDate || '';
      const dateB = b.event?.startDate || '';
      return dateB.localeCompare(dateA);
    });

    return { upcomingList: upcoming, pastList: past };
  }, [enrollments, eventsMap]);

  // Cursos passados disponíveis no sistema em que este usuário ainda não está inscrito
  const unEnrolledPastEvents = useMemo(() => {
    const enrolledIds = new Set(enrollments.map(e => e.eventId));
    return Object.values(eventsMap)
      .filter(ev => isEventPast(ev) && !enrolledIds.has(ev.id));
  }, [eventsMap, enrollments]);

  const [enrollingPastId, setEnrollingPastId] = useState(null);

  async function handleAdminSelfEnroll(eventId) {
    if (!currentUser) return;
    setEnrollingPastId(eventId);
    try {
      const newEnrollmentRef = doc(collection(db, 'enrollments'));
      await setDoc(newEnrollmentRef, {
        eventId: eventId,
        userId: currentUser.uid || 'admin',
        userName: currentUser.profile?.fullName || currentUser.profile?.nome || currentUser.email || 'Admin',
        userEmail: currentUser.email || '',
        userPhone: currentUser.profile?.phone || currentUser.profile?.telefone || '',
        status: 'enrolled',
        createdAt: new Date().toISOString()
      });
      await fetchUserCoursesAndReviews();
    } catch (err) {
      console.error("Erro ao vincular inscrição de teste:", err);
    } finally {
      setEnrollingPastId(null);
    }
  }

  async function handleRemoveTestEnrollment(enrollmentId) {
    if (!window.confirm("Deseja remover esta inscrição de teste?")) return;
    try {
      await deleteDoc(doc(db, 'enrollments', enrollmentId));
      await fetchUserCoursesAndReviews();
    } catch (err) {
      console.error("Erro ao remover inscrição de teste:", err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const updatedData = {
        fullName: formData.nome,
        nome: formData.nome,
        birthDate: formData.birthDate,
        phone: formData.phone,
        telefone: formData.phone,
        address: formData.address,
        endereco: formData.address,
        neighborhood: formData.neighborhood,
        bairro: formData.neighborhood,
        city: formData.city,
        cidade: formData.city,
        zip: formData.zip,
        cep: formData.zip,
        country: formData.country,
        pais: formData.country,
        experiencia: formData.experiencia,
        restricoes: formData.restricoes,
        updatedAt: new Date().toISOString()
      };

      await updateProfileData(updatedData);
      setSuccessMsg(t('auth.profileSuccess', 'Cadastro atualizado com sucesso!'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMsg(t('auth.profileError', 'Erro ao atualizar cadastro. Tente novamente.'));
    }
    setLoading(false);
  }

  function handleOpenReviewModal(event, existingReview = null) {
    setSelectedEventForReview(event);
    setSelectedReviewForModal(existingReview);
  }

  const isAdmin = currentUser && (
    currentUser.email === 'mahendra.swaha@gmail.com' ||
    currentUser.email === 'contato@dance2dance.no' ||
    currentUser.profile?.role === 'admin'
  );

  const studentName = currentUser?.profile?.fullName || currentUser?.profile?.nome || currentUser?.email?.split('@')[0] || 'Aluno';

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <Navbar />

      <main className="flex-grow pt-40 md:pt-48 pb-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #222 0%, transparent 60%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-4xl mx-auto relative z-10"
        >
          {/* Header Superior / Voltar + Badges */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1A1A24]">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-[#9A9A9A] hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('actions.back', 'Voltar')}</span>
            </button>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-[10px] uppercase font-heading tracking-[2px] text-accent font-bold px-2.5 py-1 bg-accent/10 border border-accent/30 rounded-[2px] hover:bg-accent/20 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Painel Admin</span>
                </Link>
              )}

              <span className="text-[10px] uppercase font-heading tracking-[2px] text-zinc-300 font-bold px-2.5 py-1 bg-[#14141C] border border-[#22222E] rounded-[2px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-accent" />
                <span>{t('studentPortal.portalBadge', 'Área do Aluno')}</span>
              </span>
            </div>
          </div>

          {/* Título Principal */}
          <div className="text-center sm:text-left mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 justify-center sm:justify-start mb-1.5">
                <GraduationCap className="w-6 h-6 text-accent" />
                <h1 className="font-batang text-2xl sm:text-3xl text-[#FAF8F5]">
                  {t('studentPortal.portalTitle', 'Meu Painel & Perfil')}
                </h1>
              </div>
              <p className="font-heading text-xs sm:text-sm text-[#9A9A9A] max-w-xl">
                {t('studentPortal.portalSubtitle', 'Acompanhe seus workshops inscritos, histórico de cursos e atualize seus dados cadastrais.')}
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <span className="text-[11px] font-heading text-zinc-400 block">Olá,</span>
              <span className="font-drama text-lg text-accent block leading-tight">{studentName}</span>
            </div>
          </div>

          {/* Master Tabs Switcher */}
          <div className="flex border-b border-[#1E1E28] mb-8 bg-[#0D0D12] p-1.5 rounded-[2px] gap-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 py-3 px-4 rounded-[2px] text-xs font-heading font-semibold uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-2.5 ${
                activeTab === 'courses'
                  ? 'bg-accent text-primary shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{t('studentPortal.tabCourses', 'Meus Cursos & Workshops')}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'courses' ? 'bg-primary/20 text-primary' : 'bg-[#181822] text-zinc-300'
              }`}>
                {enrollments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('personal_data')}
              className={`flex-1 py-3 px-4 rounded-[2px] text-xs font-heading font-semibold uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-2.5 ${
                activeTab === 'personal_data'
                  ? 'bg-accent text-primary shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>{t('studentPortal.tabProfile', 'Meus Dados Cadastrais')}</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* ABA 1: MEUS CURSOS & WORKSHOPS */}
          {/* ========================================================================= */}
          {activeTab === 'courses' && (
            <div className="space-y-10">
              {loadingCourses ? (
                <div className="p-16 text-center bg-[#0C0C10] border border-[#1E1E28] rounded-[2px]">
                  <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
                  <p className="font-heading text-xs text-zinc-400 tracking-wider uppercase">
                    {t('studentPortal.loading', 'Carregando seus cursos...')}
                  </p>
                </div>
              ) : enrollments.length === 0 ? (
                /* Estado Vazio Geral */
                <div className="p-12 sm:p-16 text-center bg-[#0C0C10] border border-[#1E1E28] rounded-[2px] space-y-5">
                  <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="font-batang text-xl text-[#FAF8F5]">
                      {t('studentPortal.noEnrollments', 'Você ainda não se inscreveu em nenhum workshop ou curso.')}
                    </h3>
                    <p className="font-heading text-xs text-[#8A8A96] leading-relaxed">
                      Conheça os próximos encontros de Be the Dance e Biostretch na nossa agenda e reserve seu lugar.
                    </p>
                  </div>
                  <div>
                    <Link
                      to="/agenda"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary font-heading text-xs uppercase tracking-[2px] font-bold rounded-[2px] hover:bg-[#FAF8F5] transition-colors"
                    >
                      <span>{t('studentPortal.exploreAgenda', 'Explorar Agenda de Workshops')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* SEÇÃO A: PRÓXIMOS WORKSHOPS */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#1A1A24]">
                      <div>
                        <h2 className="font-heading text-sm uppercase tracking-[2px] text-accent font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-accent" />
                          {t('studentPortal.upcomingTitle', 'Próximos Cursos & Workshops')}
                        </h2>
                        <p className="text-[11px] font-heading text-[#888894] mt-0.5">
                          {t('studentPortal.upcomingSubtitle', 'Workshops confirmados e encontros futuros na sua jornada.')}
                        </p>
                      </div>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-[2px] bg-[#14141C] border border-[#1E1E28] text-zinc-300">
                        {upcomingList.length}
                      </span>
                    </div>

                    {upcomingList.length === 0 ? (
                      <div className="p-6 bg-[#0E0E14] border border-[#1A1A22] rounded-[2px] text-center space-y-3">
                        <p className="text-xs text-zinc-400 font-heading">
                          {t('studentPortal.noUpcoming', 'Você não possui workshops futuros agendados.')}
                        </p>
                        <Link
                          to="/agenda"
                          className="inline-flex items-center gap-1.5 text-xs font-heading uppercase tracking-wider text-accent hover:underline font-medium"
                        >
                          <span>{t('studentPortal.exploreAgenda', 'Explorar Agenda de Workshops')}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingList.map((item) => {
                          const ev = item.event;
                          const category = ev.category || 'bethedance';
                          const theme = getCategoryTheme(category);
                          const { title: eventTitle, location: eventLocation, scheduleDetails: dispSchedule } = getLocalizedEvent(ev, currentLang);
                          const dateRange = formatEventDate(ev.startDate, ev.endDate, currentLang);
                          const timeRange = ev.startTime && ev.endTime ? `${ev.startTime} – ${ev.endTime}` : '';
                          const isWaitlist = item.status === 'waitlist';
                          const gcalUrl = generateGoogleCalendarUrl(ev, currentLang);

                          return (
                            <div 
                              key={item.id}
                              className="p-5 sm:p-6 bg-[#0E0E14] border border-[#1E1E28] hover:border-accent/40 rounded-[2px] transition-all space-y-4 relative group"
                            >
                              {/* Top row: Badges */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-heading font-bold uppercase tracking-wider ${theme.badgeBg}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
                                    {theme.label}
                                  </span>

                                  {isWaitlist ? (
                                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-[2px] bg-yellow-950/40 text-yellow-400 border border-yellow-800/40 font-semibold">
                                      {t('studentPortal.waitlistBadge', 'Lista de Espera')}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-[2px] bg-green-950/40 text-green-400 border border-green-800/40 font-semibold flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                                      {t('studentPortal.confirmedBadge', 'Inscrição Confirmada')}
                                    </span>
                                  )}
                                </div>

                                <span className="text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-[2px]">
                                  {t('adminPage.usersManager.upcomingBadge', 'Próximo')}
                                </span>
                              </div>

                              {/* Título & Detalhes */}
                              <div>
                                <h3 className="font-heading font-semibold text-lg sm:text-xl text-[#FAF8F5] mb-2">
                                  {eventTitle}
                                </h3>

                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-heading text-[#A0A0A0]">
                                  <span className="flex items-center gap-1.5 text-[#E0DDD5]">
                                    <Calendar className="w-4 h-4 text-accent" />
                                    {dateRange}
                                  </span>

                                  {timeRange && (
                                    <span className="flex items-center gap-1.5 text-zinc-300 font-mono">
                                      <Clock className="w-4 h-4 text-accent" />
                                      {timeRange}
                                    </span>
                                  )}

                                  {dispSchedule && (
                                    <span className="text-[11px] font-heading font-semibold px-2 py-0.5 rounded-[2px] bg-accent/15 text-accent border border-accent/30 tracking-wide">
                                      {dispSchedule}
                                    </span>
                                  )}

                                  {eventLocation && (
                                    <span className="flex items-center gap-1.5 text-zinc-400">
                                      <MapPin className="w-4 h-4 text-accent/70 shrink-0" />
                                      {ev.address ? (
                                        <a
                                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.address)}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="hover:text-accent underline underline-offset-2 transition-colors"
                                          title={ev.address}
                                        >
                                          {eventLocation}
                                        </a>
                                      ) : (
                                        eventLocation
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Ações de Calendário & Agenda */}
                              <div className="pt-3 border-t border-[#181822] flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  {gcalUrl && (
                                    <a
                                      href={gcalUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 rounded-[2px] bg-[#14141C] hover:bg-[#1E1E2A] border border-[#22222E] hover:border-accent/40 text-[11px] font-heading text-zinc-300 hover:text-accent transition-all flex items-center gap-1.5"
                                      title={t('studentPortal.addToGoogleCalendar', 'Google Calendar')}
                                    >
                                      <CalendarPlus className="w-3.5 h-3.5 text-accent" />
                                      <span>Google Calendar</span>
                                    </a>
                                  )}

                                  <button
                                    onClick={() => downloadEventIcs(ev, currentLang)}
                                    type="button"
                                    className="px-3 py-1.5 rounded-[2px] bg-[#14141C] hover:bg-[#1E1E2A] border border-[#22222E] hover:border-accent/40 text-[11px] font-heading text-zinc-300 hover:text-accent transition-all flex items-center gap-1.5 cursor-pointer"
                                    title={t('studentPortal.downloadIcs', 'Baixar .ICS')}
                                  >
                                    <Download className="w-3.5 h-3.5 text-accent" />
                                    <span>Baixar .ICS (iCal)</span>
                                  </button>
                                </div>

                                <Link
                                  to="/agenda"
                                  className="text-xs font-heading text-zinc-400 hover:text-accent flex items-center gap-1 transition-colors ml-auto"
                                >
                                  <span>Ver na Agenda</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* SEÇÃO B: CURSOS REALIZADOS & AVALIAÇÕES */}
                  <div className="space-y-4 pt-6">
                    <div className="flex items-center justify-between pb-2 border-b border-[#1A1A24]">
                      <div>
                        <h2 className="font-heading text-sm uppercase tracking-[2px] text-accent font-semibold flex items-center gap-2">
                          <Award className="w-4 h-4 text-accent" />
                          {t('studentPortal.completedTitle', 'Cursos Realizados')}
                        </h2>
                        <p className="text-[11px] font-heading text-[#888894] mt-0.5">
                          {t('studentPortal.completedSubtitle', 'Histórico de workshops concluídos e suas avaliações.')}
                        </p>
                      </div>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-[2px] bg-[#14141C] border border-[#1E1E28] text-zinc-300">
                        {pastList.length}
                      </span>
                    </div>

                    {/* Banner de Teste para Administrador */}
                    {isAdmin && unEnrolledPastEvents.length > 0 && (
                      <div className="p-4 sm:p-5 bg-[#14141E] border border-accent/30 rounded-[2px] space-y-3">
                        <div className="flex items-center gap-2 text-accent text-xs font-heading font-semibold uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-accent" />
                          <span>Modo de Teste (Admin): Cursos Realizados Disponíveis</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-heading leading-relaxed">
                          Para que um curso apareça em <em>Cursos Realizados</em> para avaliação, o aluno precisa ter a inscrição registrada.
                          Como Administrador, você pode se vincular a qualquer um dos cursos passados abaixo com 1 clique para testar a experiência de avaliação:
                        </p>
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {unEnrolledPastEvents.map(ev => {
                            const { title } = getLocalizedEvent(ev, currentLang);
                            return (
                              <button
                                key={ev.id}
                                type="button"
                                onClick={() => handleAdminSelfEnroll(ev.id)}
                                disabled={enrollingPastId === ev.id}
                                className="px-3.5 py-2 bg-accent/15 hover:bg-accent hover:text-primary text-accent border border-accent/40 rounded-[2px] text-xs font-heading font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                              >
                                <CalendarPlus className="w-3.5 h-3.5" />
                                <span>{enrollingPastId === ev.id ? 'Vinculando...' : `Testar Avaliação em: ${title}`}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {pastList.length === 0 ? (
                      <div className="p-6 bg-[#0E0E14] border border-[#1A1A22] rounded-[2px] text-center">
                        <p className="text-xs text-zinc-400 font-heading">
                          {t('studentPortal.noCompleted', 'Você ainda não possui histórico de cursos concluídos.')}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pastList.map((item) => {
                          const ev = item.event;
                          const category = ev.category || 'bethedance';
                          const theme = getCategoryTheme(category);
                          const { title: eventTitle, location: eventLocation, scheduleDetails: dispSchedule } = getLocalizedEvent(ev, currentLang);
                          const dateRange = formatEventDate(ev.startDate, ev.endDate, currentLang);
                          const existingReview = reviewsMap[ev.id] || null;

                          return (
                            <div 
                              key={item.id}
                              className="p-5 sm:p-6 bg-[#0E0E14] border border-[#1C1C24] rounded-[2px] space-y-4"
                            >
                              {/* Top row */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[9px] font-heading font-bold uppercase tracking-wider ${theme.badgeBg}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
                                    {theme.label}
                                  </span>

                                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-zinc-900 text-zinc-400 border border-zinc-800">
                                    {t('studentPortal.completedBadge', 'Realizado')}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-zinc-400 font-heading flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-accent/70" />
                                    {dateRange}
                                  </span>

                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTestEnrollment(item.id)}
                                      className="text-[10px] text-zinc-500 hover:text-red-400 font-heading flex items-center gap-1 transition-colors ml-1 cursor-pointer"
                                      title="Remover esta inscrição de teste"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span className="hidden sm:inline">Desvincular</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Título */}
                              <div>
                                <h3 className="font-heading font-semibold text-base sm:text-lg text-[#FAF8F5]">
                                  {eventTitle}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                  {eventLocation && (
                                    <span className="text-xs text-zinc-500 font-heading flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-accent/60" />
                                      {eventLocation}
                                    </span>
                                  )}
                                  {dispSchedule && (
                                    <span className="text-[11px] font-heading font-semibold px-2 py-0.5 rounded-[2px] bg-accent/15 text-accent border border-accent/30 tracking-wide">
                                      {dispSchedule}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* ÁREA DE AVALIAÇÃO / DEPOIMENTO */}
                              <div className="mt-4 p-4 rounded-[2px] bg-[#121218] border border-[#1E1E28]">
                                {existingReview ? (
                                  <div className="space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        {/* Estrelas */}
                                        <div className="flex items-center gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                              key={star}
                                              className={`w-4 h-4 ${
                                                star <= (existingReview.rating || 5)
                                                  ? 'fill-accent text-accent'
                                                  : 'text-zinc-700'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-xs font-mono font-bold text-accent">
                                          {existingReview.rating} / 5
                                        </span>
                                      </div>

                                      {/* Status da Avaliação */}
                                      {existingReview.status === 'approved' ? (
                                        <span className="text-[10px] font-heading font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-green-950/40 text-green-400 border border-green-800/40 flex items-center gap-1">
                                          <ShieldCheck className="w-3 h-3 text-green-400" />
                                          {t('studentPortal.reviewApprovedBadge', 'Depoimento Publicado')}
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-heading font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-amber-950/40 text-amber-400 border border-amber-800/40 flex items-center gap-1">
                                          <Clock className="w-3 h-3 text-amber-400" />
                                          {t('studentPortal.reviewPendingBadge', 'Em Moderação')}
                                        </span>
                                      )}
                                    </div>

                                    {/* Comentário do Aluno */}
                                    <blockquote className="font-heading text-xs italic text-[#D8D5CD] bg-[#0E0E14] border-l-2 border-accent/60 pl-3 py-2 pr-2 leading-relaxed">
                                      "{existingReview.comment}"
                                    </blockquote>

                                    {existingReview.status !== 'approved' && (
                                      <p className="text-[10px] text-zinc-500 font-heading">
                                        {t('reviews.statusPendingDesc', 'Recebemos seu depoimento com carinho! Ele passará pela moderação da equipe antes de ser publicado.')}
                                      </p>
                                    )}

                                    {/* Botão de Editar */}
                                    <div className="pt-1 flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenReviewModal(ev, existingReview)}
                                        className="px-3 py-1.5 rounded-[2px] bg-[#161622] hover:bg-[#20202E] border border-zinc-700 hover:border-accent/40 text-[11px] font-heading text-[#CFCFCF] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <Star className="w-3.5 h-3.5 text-accent" />
                                        <span>{t('studentPortal.editReviewBtn', 'Ver / Editar Minha Avaliação')}</span>
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  /* Aluno ainda não avaliou */
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1 max-w-lg">
                                      <span className="text-xs font-heading font-semibold text-[#FAF8F5] flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                                        {t('studentPortal.reviewPrompt', 'Compartilhe como foi sua experiência! Seu depoimento é muito valioso para nós e outros alunos.')}
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenReviewModal(ev, null)}
                                      className="px-4 py-2.5 rounded-[2px] bg-accent text-primary hover:bg-[#FAF8F5] text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
                                    >
                                      <Star className="w-4 h-4 fill-primary" />
                                      <span>{t('studentPortal.reviewBtn', 'Avaliar Workshop')}</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 2: MEUS DADOS CADASTRAIS (FORMULÁRIO EXISTENTE) */}
          {/* ========================================================================= */}
          {activeTab === 'personal_data' && (
            <div className="bg-[#0a0a0a] border border-[#222222] p-6 sm:p-10 rounded-[2px] shadow-2xl">
              <div className="text-center sm:text-left mb-8 pb-4 border-b border-[#1A1A24]">
                <h2 className="font-batang text-2xl text-[#F0EDE8] mb-1">
                  {t('auth.profileTitle', 'Meu Perfil')}
                </h2>
                <p className="font-heading text-xs sm:text-sm font-light text-[#9A9A9A]">
                  {t('auth.profileSubtitle', 'Mantenha seus dados cadastrais atualizados.')}
                </p>
              </div>

              {successMsg && (
                <div className="mb-6 p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-sm font-heading rounded-[2px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 text-red-400 text-sm font-heading rounded-[2px]">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome Completo */}
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t('auth.fullNameLabel', 'Nome Completo *')}
                    </label>
                    <input
                      required
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder={t('auth.fullNamePlaceholder', 'Seu nome completo')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                    />
                  </div>

                  {/* Data de Nascimento */}
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t('auth.birthDateLabel', 'Data de Nascimento *')}
                    </label>
                    <input
                      required
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light [color-scheme:dark]"
                    />
                  </div>

                  {/* E-mail (Apenas Leitura) */}
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t('auth.emailLabel', 'E-mail')}
                    </label>
                    <input
                      disabled
                      type="email"
                      value={currentUser?.email || ''}
                      className="w-full bg-[#1A1A1E] border border-[#2A2A35] text-[#888888] px-4 py-3 rounded-[2px] font-heading font-light cursor-not-allowed select-none"
                    />
                    <p className="text-[10px] text-[#666666] font-heading mt-1">
                      {t('auth.readOnlyEmail', 'O e-mail não pode ser alterado diretamente.')}
                    </p>
                  </div>

                  {/* Telefone / WhatsApp */}
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t('auth.phoneLabel', 'Telefone / WhatsApp *')}
                    </label>
                    <input
                      required
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('auth.phonePlaceholder', '+55 ... / +47 ...')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                    />
                  </div>

                  {/* Endereço */}
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t('auth.addressLabel', 'Endereço *')}
                    </label>
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={t('auth.addressPlaceholder', 'Nome da rua, número')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                    />
                  </div>

                  {/* Bairro */}
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t('auth.neighborhoodLabel', 'Bairro *')}
                    </label>
                    <input
                      required
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      placeholder={t('auth.neighborhoodPlaceholder', 'Seu bairro')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                    />
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t('auth.cityLabel', 'Cidade *')}
                    </label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={t('auth.cityPlaceholder', 'Sua cidade')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                    />
                  </div>

                  {/* CEP / Código Postal */}
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t('auth.zipLabel', 'CEP / Código Postal *')}
                    </label>
                    <input
                      required
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder={t('auth.zipPlaceholder', '00000-000')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                    />
                  </div>

                  {/* País */}
                  <div className="md:col-span-2">
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t('auth.countryLabel', 'País *')}
                    </label>
                    <input
                      required
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder={t('auth.countryPlaceholder', 'Brasil, Noruega...')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                    />
                  </div>

                  {/* Experiência Prévia */}
                  <div className="md:col-span-2">
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t('auth.experienceLabel', 'Experiência prévia com dança ou trabalho corporal?')}
                    </label>
                    <textarea
                      name="experiencia"
                      value={formData.experiencia}
                      onChange={handleChange}
                      rows="2"
                      placeholder={t('auth.experiencePlaceholder', 'Conte-nos brevemente sobre sua experiência...')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none placeholder:text-[#555555]"
                    />
                  </div>

                  {/* Restrições */}
                  <div className="md:col-span-2">
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t('auth.restrictionsLabel', 'Restrições físicas ou de saúde?')}
                    </label>
                    <textarea
                      name="restricoes"
                      value={formData.restricoes}
                      onChange={handleChange}
                      rows="2"
                      placeholder={t('auth.restrictionsPlaceholder', 'Alguma lesão ou condição que o professor deva saber?')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none placeholder:text-[#555555]"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-accent text-primary font-heading text-[11px] uppercase tracking-[3px] font-semibold py-4 hover:bg-[#F0EDE8] transition-colors duration-300 rounded-[2px] mt-8 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? t('auth.savingProfile', 'Salvando...') : t('auth.saveProfile', 'Salvar Alterações')}</span>
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </main>

      {/* Modal de Avaliação do Workshop */}
      <AnimatePresence>
        {selectedEventForReview && (
          <ReviewModal
            event={selectedEventForReview}
            existingReview={selectedReviewForModal}
            user={currentUser}
            onClose={() => {
              setSelectedEventForReview(null);
              setSelectedReviewForModal(null);
            }}
            onReviewSubmitted={() => {
              fetchUserCoursesAndReviews();
            }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
