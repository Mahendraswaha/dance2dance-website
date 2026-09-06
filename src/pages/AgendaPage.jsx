import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, getDocs, doc, runTransaction, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  MapPin, 
  Clock, 
  CalendarPlus, 
  Calendar, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ArrowUpRight, 
  History,
  Sparkles
} from 'lucide-react';
import { 
  getLocalizedEvent, 
  getEventCategory, 
  getEventRoute, 
  generateGoogleCalendarUrl, 
  isEventPast, 
  isEventOngoing, 
  formatEventDate, 
  getEventAllDates, 
  getCategoryTheme 
} from '../utils/eventHelpers';
import { useTranslation } from 'react-i18next';

function getIsoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function AgendaPage() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [userEnrollments, setUserEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  // Filtros de Categoria e Modo de Exibição
  const [filter, setFilter] = useState('all'); // 'all', 'bethedance', 'biostretch', 'kroppsskole'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [showPastList, setShowPastList] = useState(false);

  // Estado do Calendário Mensal
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(() => getIsoDate(today.getFullYear(), today.getMonth(), today.getDate()));
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const q = query(collection(db, 'events'), orderBy('startDate', 'asc'));
        const snap = await getDocs(q);
        const fetchedEvents = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(fetchedEvents);

        if (currentUser) {
          const enrollQ = query(collection(db, 'enrollments'), where('userId', '==', currentUser.uid));
          const enrollSnap = await getDocs(enrollQ);
          const enrollMap = {};
          enrollSnap.forEach(doc => {
            const data = doc.data();
            enrollMap[data.eventId] = { status: data.status, id: doc.id };
          });
          setUserEnrollments(enrollMap);
        }
      } catch (err) {
        console.error("Erro ao buscar agenda:", err);
      }
      setLoading(false);
    }
    fetchData();
  }, [currentUser]);

  function getCategory(event) {
    return getEventCategory(event);
  }
  
  function getDetailsLink(event) {
    return getEventRoute(event);
  }

  async function handleCancelEnrollment(eventId) {
    if (!window.confirm(t("agendaPage.confirmCancel", "Tem certeza que deseja cancelar sua inscrição/espera para este evento?"))) return;
    
    setActionLoading(eventId);
    try {
      const enrollmentData = userEnrollments[eventId];
      if (!enrollmentData) return;

      const eventRef = doc(db, 'events', eventId);
      const enrollmentRef = doc(db, 'enrollments', enrollmentData.id);

      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) throw new Error("Evento não encontrado.");
        
        const eventData = eventDoc.data();
        
        if (enrollmentData.status === 'waitlist') {
          transaction.update(eventRef, { waitlistCount: Math.max(0, eventData.waitlistCount - 1) });
        } else {
          transaction.update(eventRef, { enrolledCount: Math.max(0, eventData.enrolledCount - 1) });
        }

        transaction.delete(enrollmentRef);
      });

      const newUserEnrollments = { ...userEnrollments };
      delete newUserEnrollments[eventId];
      setUserEnrollments(newUserEnrollments);
      
      setEvents(prev => prev.map(ev => {
        if (ev.id === eventId) {
          if (enrollmentData.status === 'waitlist') return { ...ev, waitlistCount: Math.max(0, ev.waitlistCount - 1) };
          return { ...ev, enrolledCount: Math.max(0, ev.enrolledCount - 1) };
        }
        return ev;
      }));

    } catch(err) {
      console.error(err);
      alert(t("agendaPage.cancelError", "Erro ao cancelar: ") + err.message);
    }
    setActionLoading(null);
  }

  async function handleEnroll(eventId, isFull) {
    try {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setActionLoading(eventId);
      
      const eventRef = doc(db, 'events', eventId);
      const newEnrollmentRef = doc(collection(db, 'enrollments'));

      let finalStatus = '';
      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) throw new Error("Evento não encontrado.");

        const eventData = eventDoc.data();
        const currentlyFull = (eventData.enrolledCount || 0) >= (eventData.totalSpots || 0);
        finalStatus = currentlyFull ? 'waitlist' : 'enrolled';

        if (currentlyFull) {
          transaction.update(eventRef, { waitlistCount: (eventData.waitlistCount || 0) + 1 });
        } else {
          transaction.update(eventRef, { enrolledCount: (eventData.enrolledCount || 0) + 1 });
        }

        transaction.set(newEnrollmentRef, {
          eventId: eventId,
          userId: currentUser.uid || 'unknown',
          userName: currentUser.profile?.fullName || currentUser.profile?.nome || currentUser.email || 'unknown',
          userEmail: currentUser.email || 'unknown',
          userPhone: currentUser.profile?.phone || currentUser.profile?.telefone || '',
          userBirthDate: currentUser.profile?.birthDate || '',
          userAddress: currentUser.profile?.address || currentUser.profile?.endereco || '',
          userNeighborhood: currentUser.profile?.neighborhood || '',
          userCity: currentUser.profile?.city || '',
          userZip: currentUser.profile?.zip || currentUser.profile?.cep || '',
          userCountry: currentUser.profile?.country || '',
          userExperience: currentUser.profile?.experiencia || '',
          userRestrictions: currentUser.profile?.restricoes || '',
          status: finalStatus,
          createdAt: new Date().toISOString()
        });
      });

      setUserEnrollments(prev => ({ ...prev, [eventId]: { status: finalStatus, id: newEnrollmentRef.id } }));
      setEvents(prev => prev.map(ev => {
        if (ev.id === eventId) {
          if (isFull) return { ...ev, waitlistCount: (ev.waitlistCount || 0) + 1 };
          return { ...ev, enrolledCount: (ev.enrolledCount || 0) + 1 };
        }
        return ev;
      }));

    } catch (err) {
      console.error(err);
      alert("ERRO: " + err.message);
    } finally {
      setActionLoading(null);
    }
  }

  // Eventos filtrados por categoria
  const categoryFilteredEvents = useMemo(() => {
    return events.filter(ev => {
      if (filter === 'all') return true;
      return getCategory(ev) === filter;
    });
  }, [events, filter]);

  // Lista: separa próximos e passados
  const upcomingEvents = useMemo(() => {
    return categoryFilteredEvents.filter(ev => !isEventPast(ev));
  }, [categoryFilteredEvents]);

  const pastEvents = useMemo(() => {
    return categoryFilteredEvents.filter(ev => isEventPast(ev));
  }, [categoryFilteredEvents]);

  // Mapa de datas para o Calendário: dateStr ('YYYY-MM-DD') -> Array de sessões
  const eventsByDate = useMemo(() => {
    const map = {};
    categoryFilteredEvents.forEach(ev => {
      const allDates = getEventAllDates(ev);
      allDates.forEach(d => {
        if (!d.date) return;
        if (!map[d.date]) map[d.date] = [];
        map[d.date].push(d);
      });
    });
    return map;
  }, [categoryFilteredEvents]);

  // Navegação do calendário
  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentYear(prev => prev - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentYear(prev => prev + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  }

  function handleToday() {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(getIsoDate(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  // Gera dias do mês em grid de 7 colunas (Segunda a Domingo)
  const calendarCells = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Seg = 0 ... Dom = 6
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];

    // Dias do mês anterior
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      cells.push({
        dateStr: getIsoDate(prevYear, prevMonth, day),
        dayNumber: day,
        isCurrentMonth: false
      });
    }

    // Dias do mês corrente
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({
        dateStr: getIsoDate(currentYear, currentMonth, day),
        dayNumber: day,
        isCurrentMonth: true
      });
    }

    // Dias do mês seguinte para completar o grid (múltiplo de 7)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      cells.push({
        dateStr: getIsoDate(nextYear, nextMonth, day),
        dayNumber: day,
        isCurrentMonth: false
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Nomes dos dias da semana internacionalizados
  const currentLang = i18n.language || 'en';
  const weekdayNames = useMemo(() => {
    const baseDate = new Date(2026, 0, 5); // 05/01/2026 é Segunda-feira
    const names = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      names.push(d.toLocaleDateString(currentLang, { weekday: 'short' }));
    }
    return names;
  }, [currentLang]);

  // Título do mês internacionalizado
  const monthTitle = useMemo(() => {
    const d = new Date(currentYear, currentMonth, 1);
    const mStr = d.toLocaleDateString(currentLang, { month: 'long', year: 'numeric' });
    return mStr.charAt(0).toUpperCase() + mStr.slice(1);
  }, [currentYear, currentMonth, currentLang]);

  // Eventos do dia selecionado
  const selectedDaySessions = useMemo(() => {
    if (!selectedDate) return [];
    return eventsByDate[selectedDate] || [];
  }, [selectedDate, eventsByDate]);

  // Data formatada para o cabeçalho de inspeção do dia
  const selectedDayFormatted = useMemo(() => {
    if (!selectedDate) return '';
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString(currentLang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return selectedDate;
    }
  }, [selectedDate, currentLang]);

  const todayStr = getIsoDate(today.getFullYear(), today.getMonth(), today.getDate());

  // Renderizador de Card de Evento (compartilhado na lista e no painel do dia)
  function renderEventCard(event, isPast = false, sessionInfo = null) {
    const category = getEventCategory(event);
    const theme = getCategoryTheme(category);
    
    const { title: dispTitle, scheduleDetails: dispSchedule, location: dispLocation } = getLocalizedEvent(event, currentLang);
    
    // Período ou horário específico da sessão
    const dateStr = sessionInfo 
      ? formatEventDate(sessionInfo.date)
      : formatEventDate(event.startDate, event.endDate) || t("agendaPage.comingSoon");
      
    const sessionTime = sessionInfo && sessionInfo.startTime && sessionInfo.endTime
      ? `${sessionInfo.startTime} - ${sessionInfo.endTime}`
      : (event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : null);

    const isOngoing = isEventOngoing(event);
    const currentEnrolled = event.enrolledCount || 0;
    const isFull = currentEnrolled >= event.totalSpots;
    const userEnrollmentData = userEnrollments[event.id];
    const userStatus = userEnrollmentData ? userEnrollmentData.status : null;
    const sessionCount = Array.isArray(event.sessions) ? event.sessions.length : 0;

    return (
      <motion.div 
        key={`${event.id}-${sessionInfo ? sessionInfo.date : 'card'}`}
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`border transition-all duration-300 rounded-[2px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 ${
          isPast 
            ? 'bg-[#0E0E10] border-[#1C1C22] opacity-75 hover:opacity-100' 
            : 'bg-[#121214] border-[#1E1E24] hover:border-[#2A2A35] hover:bg-[#161619]'
        }`}
      >
        {/* Coluna Esquerda: Datas e Horários */}
        <div className="w-full md:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-[#1A1A24] pb-6 md:pb-0 pr-6">
          <div className="font-heading text-sm font-semibold uppercase tracking-wider mb-2 mt-1 flex flex-wrap items-center gap-2">
            <span className={theme.textColor}>{dateStr}</span>
            {isOngoing && (
              <span className="text-[9px] uppercase tracking-[1px] font-mono px-2 py-0.5 rounded-[2px] bg-amber-950/40 text-amber-400 border border-amber-800/30 font-normal">
                {t("agendaPage.ongoing", "Em Andamento")}
              </span>
            )}
            {isPast && (
              <span className="text-[9px] uppercase tracking-[1px] font-mono px-2 py-0.5 rounded-[2px] bg-zinc-800/60 text-zinc-400 border border-zinc-700/50 font-normal">
                {t("agendaPage.pastBadge", "Realizado")}
              </span>
            )}
          </div>
          
          <div className="flex items-start gap-2 text-[#9A9A9A] font-heading text-xs">
            <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent/70" />
            <span className="whitespace-pre-wrap leading-relaxed">
              {sessionTime ? `${sessionTime} ${dispSchedule ? `• ${dispSchedule}` : ''}` : (dispSchedule || t("agendaPage.tbd"))}
            </span>
          </div>

          {/* Badges de Carga Horária e Encontros */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {sessionCount > 1 && (
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#181820] text-zinc-300 border border-zinc-800 rounded-[2px]">
                {t("agendaPage.sessionsCount", { count: sessionCount, defaultValue: `${sessionCount} encontros` })}
              </span>
            )}
            {event.totalHours && (
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#181820] text-zinc-300 border border-zinc-800 rounded-[2px]">
                {t("agendaPage.totalWorkload", { hours: event.totalHours, defaultValue: `${event.totalHours}h` })}
              </span>
            )}
          </div>
          
          {!isPast && (
            <a 
              href={generateGoogleCalendarUrl(event, currentLang)}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] text-[#7A7A7A] hover:text-accent font-heading transition-colors mt-3"
              title={t("agendaPage.addToCalendar", "Adicionar ao Google Calendar")}
            >
              <CalendarPlus className="w-3 h-3 text-accent/70" />
              <span>{t("agendaPage.addToCalendar", "Adicionar ao Calendário")}</span>
            </a>
          )}
        </div>

        {/* Coluna Central: Informações do Evento */}
        <div className="flex-1 flex flex-col justify-center min-w-0 w-full space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link 
              to={getDetailsLink(event)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] w-fit transition-all duration-200 cursor-pointer ${theme.badgeBg}`}
              title={theme.label}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
              <span className="font-heading text-[9px] uppercase tracking-[2px] font-bold">
                {theme.label}
              </span>
            </Link>
          </div>

          <Link to={getDetailsLink(event)} className="block group/title">
            <h2 className="font-drama text-2xl md:text-3xl text-[#F0EDE8] group-hover/title:text-accent transition-colors">
              {dispTitle}
            </h2>
          </Link>

          <div className="flex items-center gap-2 text-[#9A9A9A] font-heading text-sm pt-1">
            <MapPin className="w-4 h-4 text-accent shrink-0" />
            <span>{dispLocation}</span>
          </div>
        </div>

        {/* Coluna Direita: Instrutor + Ações */}
        <div className="shrink-0 w-full md:w-auto md:min-w-[180px] flex flex-col items-center justify-center">
          {event.instructor && (
            <Link 
              to="/safia"
              className="font-heading text-[9px] text-[#7A7A7A] hover:text-accent uppercase tracking-wider mb-2 text-center w-full block transition-colors group/inst"
              title={t("agendaPage.viewInstructorProfile", "Ver perfil de Safia")}
            >
              {t("agendaPage.instructor", "Instrutor")}: <span className="text-[#CFCFCF] group-hover/inst:text-accent font-semibold transition-colors underline decoration-dotted underline-offset-2">{event.instructor}</span>
            </Link>
          )}

          {isPast ? (
            <div className="py-2 px-5 border border-zinc-800 bg-zinc-900/40 text-zinc-500 rounded-full font-heading text-xs font-semibold uppercase tracking-[1px] text-center w-full">
              {t("agendaPage.pastBadge", "Realizado")}
            </div>
          ) : userStatus === 'enrolled' ? (
            <div className="py-2.5 px-6 border border-green-500/30 bg-green-900/10 text-green-400 rounded-full font-heading text-xs font-bold uppercase tracking-[1px] text-center w-full">
              {t("agendaPage.enrolled")}
            </div>
          ) : userStatus === 'waitlist' ? (
            <div className="py-2.5 px-6 border border-yellow-500/30 bg-yellow-900/10 text-yellow-400 rounded-full font-heading text-xs font-bold uppercase tracking-[1px] text-center w-full">
              {t("agendaPage.waitlist")}
            </div>
          ) : (
            <button 
              onClick={() => handleEnroll(event.id, isFull)}
              disabled={actionLoading === event.id}
              className={`w-full btn-magnetic font-heading text-[10px] uppercase tracking-[2px] font-semibold py-3 px-8 transition-colors duration-300 rounded-full ${
                isFull 
                  ? 'border border-[#333333] text-[#F0EDE8] hover:border-accent hover:text-accent' 
                  : 'bg-accent text-primary hover:bg-[#F0EDE8]'
              }`}
            >
              <span className="relative z-10 block text-center ml-[2px]">
                {actionLoading === event.id 
                  ? t('agendaPage.loading') 
                  : isFull ? t('agendaPage.joinWaitlist') : t('agendaPage.subscribe')}
              </span>
            </button>
          )}

          {!isPast && (userStatus === 'enrolled' || userStatus === 'waitlist') && (
            <button 
              onClick={() => handleCancelEnrollment(event.id)} 
              disabled={actionLoading === event.id} 
              className="text-[#9A9A9A] hover:text-red-400 text-[9px] uppercase tracking-wider font-heading transition-colors mt-2 text-center block"
            >
              {actionLoading === event.id ? t('agendaPage.loading') : t('agendaPage.cancel')}
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <Navbar />
      
      <main className="flex-grow pt-44 md:pt-52 pb-28 px-4 sm:px-6 max-w-6xl mx-auto w-full relative z-10">
        
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="font-heading text-xs uppercase tracking-[4px] text-accent font-semibold block mb-4">
            {t("nav.agenda").toUpperCase()}
          </span>
          <h1 className="font-drama text-5xl md:text-7xl text-[#F0EDE8] mb-6">
            {t("agendaPage.title")}
          </h1>
          <p className="font-heading text-[#9A9A9A] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {t("agendaPage.subtitle")}
          </p>
        </motion.div>

        {/* Barra de Controles: Alternador de Visualização (Lista vs Calendário) e Filtros de Categoria */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-[#101014] border border-[#1E1E26] p-3 md:p-4 rounded-[2rem]"
        >
          {/* Alternador de Modo */}
          <div className="flex items-center p-1 bg-[#0A0A0D] border border-[#22222B] rounded-full">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-heading text-xs uppercase tracking-[1.5px] font-semibold transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-accent text-primary shadow-sm'
                  : 'text-[#8A8A96] hover:text-[#F0EDE8]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{t("agendaPage.viewList", "Modo Lista")}</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-heading text-xs uppercase tracking-[1.5px] font-semibold transition-all duration-300 ${
                viewMode === 'calendar'
                  ? 'bg-accent text-primary shadow-sm'
                  : 'text-[#8A8A96] hover:text-[#F0EDE8]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t("agendaPage.viewCalendar", "Modo Calendário")}</span>
            </button>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full font-heading text-xs uppercase tracking-[1.5px] font-semibold transition-colors duration-200 ${
                filter === 'all' 
                  ? 'bg-[#2A2A36] text-[#F0EDE8] border border-accent/40' 
                  : 'bg-transparent text-[#8A8A96] hover:text-[#F0EDE8]'
              }`}
            >
              {t("agendaPage.filterAll")}
            </button>
            <button 
              onClick={() => setFilter('bethedance')}
              className={`px-4 py-1.5 rounded-full font-heading text-xs uppercase tracking-[1.5px] font-semibold transition-colors duration-200 ${
                filter === 'bethedance' 
                  ? 'bg-accent/20 text-accent border border-accent/50' 
                  : 'bg-transparent text-[#8A8A96] hover:text-accent'
              }`}
            >
              Be The Dance
            </button>
            <button 
              onClick={() => setFilter('biostretch')}
              className={`px-4 py-1.5 rounded-full font-heading text-xs uppercase tracking-[1.5px] font-semibold transition-colors duration-200 ${
                filter === 'biostretch' 
                  ? 'bg-white/15 text-[#FAF8F5] border border-white/40' 
                  : 'bg-transparent text-[#8A8A96] hover:text-[#FAF8F5]'
              }`}
            >
              Biostretch
            </button>
            <button 
              onClick={() => setFilter('kroppsskole')}
              className={`px-4 py-1.5 rounded-full font-heading text-xs uppercase tracking-[1.5px] font-semibold transition-colors duration-200 ${
                filter === 'kroppsskole' 
                  ? 'bg-[#4A9B8E]/20 text-[#4A9B8E] border border-[#4A9B8E]/50' 
                  : 'bg-transparent text-[#8A8A96] hover:text-[#4A9B8E]'
              }`}
            >
              Kroppsskole
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-accent font-heading tracking-widest animate-pulse my-24">
            {t("agendaPage.loading")}
          </div>
        ) : viewMode === 'list' ? (
          /* ============================================================
             1. MODO LISTA (List View)
             Separa eventos ativos/próximos e histórico de passados
             ============================================================ */
          <div className="space-y-12">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-20 bg-[#0E0E10] border border-[#1E1E24] rounded-[2px]">
                <p className="text-[#9A9A9A] font-heading">{t("agendaPage.empty")}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {upcomingEvents.map(event => renderEventCard(event, false))}
                </AnimatePresence>
              </div>
            )}

            {/* Seção de Eventos Anteriores / Histórico (Atende o requisito de separação) */}
            {pastEvents.length > 0 && (
              <div className="pt-8 border-t border-[#1C1C24]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <History className="w-4 h-4 text-zinc-500" />
                    <span className="font-heading text-xs uppercase tracking-[2px] font-semibold text-zinc-400">
                      {t("agendaPage.pastEventsTitle", "Eventos Realizados (Histórico)")}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">
                      {pastEvents.length}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowPastList(prev => !prev)}
                    className="text-xs font-heading uppercase tracking-[1.5px] text-accent/80 hover:text-accent transition-colors underline decoration-dotted underline-offset-4"
                  >
                    {showPastList 
                      ? t("agendaPage.hidePastEvents", "Ocultar eventos anteriores")
                      : t("agendaPage.showPastEvents", { count: pastEvents.length, defaultValue: `Exibir eventos anteriores (${pastEvents.length})` })}
                  </button>
                </div>

                <AnimatePresence>
                  {showPastList && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      {pastEvents.map(event => renderEventCard(event, true))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          /* ============================================================
             2. MODO CALENDÁRIO (Monthly Interactive Calendar)
             Passado, presente e futuro navegáveis com visual luxuoso
             ============================================================ */
          <div className="space-y-10">
            <div className="bg-[#101014] border border-[#1E1E26] rounded-[2rem] p-6 md:p-8 shadow-2xl">
              
              {/* Barra de Navegação do Calendário */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#1C1C24] mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="font-drama text-2xl md:text-4xl text-[#F0EDE8]">
                    {monthTitle}
                  </h2>
                  <button
                    onClick={handleToday}
                    className="px-3 py-1 rounded-full bg-[#181820] hover:bg-[#22222E] border border-zinc-800 text-[10px] font-heading uppercase tracking-wider text-zinc-300 transition-colors"
                  >
                    {t("agendaPage.today", "Hoje")}
                  </button>
                </div>

                {/* Legenda de Categorias */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-heading">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-zinc-400">Be The Dance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FAF8F5]" />
                    <span className="text-zinc-400">Biostretch</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#4A9B8E]" />
                    <span className="text-zinc-400">Kroppsskole</span>
                  </div>
                </div>

                {/* Botões Mês Anterior / Próximo */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full bg-[#16161C] hover:bg-[#202028] border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
                    aria-label="Mês Anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full bg-[#16161C] hover:bg-[#202028] border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
                    aria-label="Próximo Mês"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Grid dos Dias da Semana */}
              <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center">
                {weekdayNames.map((name, idx) => (
                  <div key={idx} className="font-heading text-[11px] md:text-xs uppercase tracking-[2px] font-semibold text-zinc-500 py-2">
                    {name}
                  </div>
                ))}
              </div>

              {/* Grid dos Dias do Mês */}
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {calendarCells.map((cell, idx) => {
                  const dayEvents = eventsByDate[cell.dateStr] || [];
                  const hasEvents = dayEvents.length > 0;
                  const isToday = cell.dateStr === todayStr;
                  const isSelected = cell.dateStr === selectedDate;
                  const isPast = cell.dateStr < todayStr;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(cell.dateStr)}
                      className={`min-h-[70px] md:min-h-[105px] p-1.5 md:p-2.5 rounded-[1rem] flex flex-col justify-between text-left transition-all duration-200 relative group ${
                        !cell.isCurrentMonth 
                          ? 'bg-[#0A0A0C]/50 text-zinc-600 border border-transparent' 
                          : isSelected 
                            ? 'bg-[#181822] border-accent shadow-[0_0_15px_rgba(201,168,76,0.15)] ring-1 ring-accent' 
                            : hasEvents
                              ? 'bg-[#14141A] border-zinc-800/80 hover:border-zinc-700 hover:bg-[#181820]'
                              : 'bg-[#0E0E12] border-transparent hover:bg-[#141418]'
                      } ${isPast && cell.isCurrentMonth && !isSelected ? 'opacity-70' : ''}`}
                    >
                      {/* Topo da Célula: Número do Dia */}
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs md:text-sm font-heading font-semibold ${
                          isToday 
                            ? 'w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center font-bold' 
                            : isSelected 
                              ? 'text-accent' 
                              : cell.isCurrentMonth 
                                ? 'text-zinc-300' 
                                : 'text-zinc-600'
                        }`}>
                          {cell.dayNumber}
                        </span>

                        {/* Indicador de Quantidade em Telas Maiores */}
                        {hasEvents && (
                          <span className="hidden md:inline-block text-[9px] font-mono px-1.5 py-0.2 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* Eventos dentro do dia */}
                      <div className="w-full space-y-1 mt-1">
                        {/* Mobile: Dots coloridos */}
                        <div className="flex md:hidden items-center gap-1 justify-center flex-wrap pt-1">
                          {dayEvents.slice(0, 3).map((item, i) => {
                            const cat = getEventCategory(item.event);
                            const t = getCategoryTheme(cat);
                            return (
                              <span 
                                key={i} 
                                className={`w-1.5 h-1.5 rounded-full ${t.dotColor}`} 
                              />
                            );
                          })}
                          {dayEvents.length > 3 && (
                            <span className="text-[8px] font-mono text-zinc-500">+</span>
                          )}
                        </div>

                        {/* Desktop: Mini cartões de evento */}
                        <div className="hidden md:flex flex-col gap-1">
                          {dayEvents.slice(0, 2).map((item, i) => {
                            const cat = getEventCategory(item.event);
                            const t = getCategoryTheme(cat);
                            const { title } = getLocalizedEvent(item.event, currentLang);

                            return (
                              <div 
                                key={i} 
                                className={`px-1.5 py-0.5 rounded-[4px] text-[10px] truncate flex items-center gap-1 border ${t.badgeBg}`}
                                title={`${title} (${item.startTime || ''})`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.dotColor}`} />
                                <span className="truncate font-heading">{title}</span>
                              </div>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <span className="text-[9px] font-mono text-zinc-500 pl-1">
                              +{dayEvents.length - 2} mais
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ============================================================
               Painel de Inspeção do Dia Selecionado
               Mostra os detalhes de todas as atividades naquele dia
               ============================================================ */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#1E1E26]">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                  <h3 className="font-drama text-2xl md:text-3xl text-[#F0EDE8]">
                    {t("agendaPage.selectedDay", { date: selectedDayFormatted, defaultValue: `Atividades em ${selectedDayFormatted}` })}
                  </h3>
                </div>

                <span className="font-mono text-xs text-zinc-400">
                  {selectedDaySessions.length} {selectedDaySessions.length === 1 ? 'atividade' : 'atividades'}
                </span>
              </div>

              {selectedDaySessions.length === 0 ? (
                <div className="p-8 md:p-12 text-center bg-[#0E0E12] border border-[#1E1E24] rounded-[2rem]">
                  <p className="text-zinc-400 font-heading text-sm mb-2">
                    {t("agendaPage.noEventsOnDay", "Nenhuma atividade programada para este dia.")}
                  </p>
                  <p className="text-zinc-600 font-heading text-xs">
                    {t("agendaPage.exploreDayHint", "Selecione uma data marcada no calendário para ver os detalhes da sessão.")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDaySessions.map((sessionItem, idx) => {
                    const isPast = sessionItem.date < todayStr;
                    return renderEventCard(sessionItem.event, isPast, sessionItem);
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
