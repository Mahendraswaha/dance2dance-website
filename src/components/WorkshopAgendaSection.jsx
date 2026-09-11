import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, getDocs, doc, runTransaction, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Clock, 
  CalendarPlus, 
  CalendarDays, 
  ChevronDown, 
  Download, 
  Sparkles 
} from 'lucide-react';
import { 
  getLocalizedEvent, 
  getEventCategory, 
  getEventRoute, 
  generateGoogleCalendarUrl, 
  downloadEventIcs, 
  isEventPast, 
  isEventOngoing, 
  formatEventDate, 
  getCategoryTheme,
  getWeekdayAbbrev 
} from '../utils/eventHelpers';
import WorkshopWishlist from './WorkshopWishlist';

export default function WorkshopAgendaSection({ program, workshop }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [userEnrollments, setUserEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedSchedules, setExpandedSchedules] = useState({});
  const scheduleRefs = useRef({});

  const workshopSlug = workshop?.slug || workshop?.id;
  const workshopRoute = `/${program?.id}/${workshopSlug}`;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const q = query(collection(db, 'events'), orderBy('startDate', 'asc'));
        const snap = await getDocs(q);
        const fetchedEvents = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEvents(fetchedEvents);

        if (currentUser) {
          const enrollQ = query(collection(db, 'enrollments'), where('userId', '==', currentUser.uid));
          const enrollSnap = await getDocs(enrollQ);
          const enrollMap = {};
          enrollSnap.forEach(d => {
            const data = d.data();
            enrollMap[data.eventId] = { status: data.status, id: d.id };
          });
          setUserEnrollments(enrollMap);
        }
      } catch (err) {
        console.error("Erro ao carregar eventos do workshop:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentUser]);

  // Filter events matching this workshop that have not expired
  const matchingUpcomingEvents = useMemo(() => {
    return events.filter(ev => {
      if (isEventPast(ev)) return false;
      const evRoute = ev.targetPath || getEventRoute(ev);
      if (evRoute === workshopRoute) return true;
      if (ev.workshopSlug && ev.workshopSlug === workshopSlug) return true;
      if (ev.workshopId && ev.workshopId === workshopSlug) return true;
      return false;
    });
  }, [events, workshopRoute, workshopSlug]);

  const toggleSchedule = (eventId) => {
    setExpandedSchedules(prev => {
      const willExpand = !prev[eventId];
      if (willExpand) {
        setTimeout(() => {
          const el = scheduleRefs.current[eventId];
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 150);
      }
      return {
        ...prev,
        [eventId]: willExpand
      };
    });
  };

  async function handleEnroll(eventId, isFull) {
    try {
      if (!currentUser) {
        navigate('/login', { state: { from: window.location.pathname } });
        return;
      }

      setActionLoading(eventId);
      
      const eventRef = doc(db, 'events', eventId);
      const newEnrollmentRef = doc(collection(db, 'enrollments'));

      let finalStatus = '';
      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) throw new Error(t('agendaPage.eventNotFound', "Evento não encontrado."));

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
        if (!eventDoc.exists()) throw new Error(t('agendaPage.eventNotFound', "Evento não encontrado."));
        
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
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="w-full my-12 p-8 text-center border border-[#1C1C24] bg-[#121214] rounded-[2px]">
        <div className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-heading text-xs uppercase tracking-widest text-[#8A8A9A]">
          {t('workshopAgenda.loading', 'Carregando agenda do workshop...')}
        </p>
      </div>
    );
  }

  // If NO upcoming dates are scheduled for this workshop, display the interactive Wishlist
  if (matchingUpcomingEvents.length === 0) {
    return <WorkshopWishlist program={program} workshop={workshop} />;
  }

  // If there ARE scheduled events, render the agenda cards
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full my-16 pt-12 border-t border-[#22222A]"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent font-heading text-[10px] uppercase tracking-[2px] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>{t('workshopAgenda.badge', 'Datas Confirmadas')}</span>
        </div>
        <h3 className="font-batang text-2xl md:text-3xl text-[#F0EDE8] mb-2">
          {t('workshopAgenda.title', 'Próximas Turmas & Inscrições')}
        </h3>
        <p className="font-heading font-light text-[#A0A0A0] text-sm md:text-base max-w-xl mx-auto">
          {t('workshopAgenda.subtitle', 'Confira as datas programadas para este workshop e garanta sua vaga diretamente abaixo.')}
        </p>
      </div>

      <div className="space-y-6">
        {matchingUpcomingEvents.map(event => {
          const category = getEventCategory(event);
          const theme = getCategoryTheme(category);
          const { title: dispTitle, scheduleDetails: dispSchedule, location: dispLocation } = getLocalizedEvent(event, currentLang);
          
          const dateStr = formatEventDate(event.startDate, event.endDate, currentLang) || t("agendaPage.comingSoon");
          const sessionTime = event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : null;
          const isOngoing = isEventOngoing(event);
          const currentEnrolled = event.enrolledCount || 0;
          const isFull = currentEnrolled >= event.totalSpots;
          const userEnrollmentData = userEnrollments[event.id];
          const userStatus = userEnrollmentData ? userEnrollmentData.status : null;
          const sessionCount = Array.isArray(event.sessions) ? event.sessions.length : 0;
          const hasMultiSessions = sessionCount > 1 || (!sessionCount && dispSchedule && dispSchedule.length > 30);
          const isExpanded = !!expandedSchedules[event.id];

          return (
            <motion.div 
              key={event.id}
              layout
              className="border rounded-[2px] p-6 md:p-8 flex flex-col items-stretch gap-6 bg-[#121214] border-[#1E1E24] hover:border-[#2A2A35] hover:bg-[#161619] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                {/* Left Column: Dates & Schedule */}
                <div className="w-full md:w-1/3 shrink-0 border-b md:border-b-0 md:border-r border-[#1A1A24] pb-6 md:pb-0 pr-6">
                  <div className="font-heading text-sm font-semibold uppercase tracking-wider mb-2 mt-1 flex flex-wrap items-center gap-2">
                    <span className={theme.textColor}>{dateStr}</span>
                    {isOngoing && (
                      <span className="text-[9px] uppercase tracking-[1px] font-mono px-2 py-0.5 rounded-[2px] bg-amber-950/40 text-amber-400 border border-amber-800/30 font-normal">
                        {t("agendaPage.ongoing", "Em Andamento")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-2 text-[#9A9A9A] font-heading text-xs">
                    <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent/70" />
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {sessionTime && (
                          <span className="font-mono text-zinc-300 font-medium">
                            {sessionTime}
                          </span>
                        )}
                        {!sessionTime && !dispSchedule && (
                          <span>{t("agendaPage.tbd")}</span>
                        )}
                        {dispSchedule && !dispSchedule.includes('\n') && (
                          <span className="text-[11px] font-heading font-semibold px-2 py-0.5 rounded-[2px] bg-accent/15 text-accent border border-accent/30 tracking-wide">
                            {dispSchedule}
                          </span>
                        )}
                      </div>

                      {dispSchedule && dispSchedule.includes('\n') && (
                        <div className="text-xs text-zinc-300 font-heading whitespace-pre-wrap leading-relaxed pt-0.5">
                          {dispSchedule}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badges for workload and sessions */}
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

                  {/* Expand Schedule Button */}
                  {hasMultiSessions && (
                    <button
                      type="button"
                      onClick={() => toggleSchedule(event.id)}
                      className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-[2px] bg-[#181822] hover:bg-[#22222E] border border-[#2A2A38] text-[10px] font-heading uppercase tracking-wider text-accent transition-all duration-200 cursor-pointer"
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-accent" />
                      <span>
                        {isExpanded 
                          ? t("agendaPage.hideFullSchedule", "Ocultar Cronograma") 
                          : (sessionCount > 0 
                              ? t("agendaPage.viewFullSchedule", { count: sessionCount, defaultValue: `Ver ${sessionCount} Encontros` }) 
                              : t("agendaPage.viewFullSchedule", { count: '', defaultValue: "Ver Cronograma Completo" }))}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-accent transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}

                  {/* Calendar integrations */}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <a 
                      href={generateGoogleCalendarUrl(event, currentLang)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] text-[#7A7A7A] hover:text-accent font-heading transition-colors"
                      title={t("agendaPage.addToCalendar", "Adicionar ao Google Calendar")}
                    >
                      <CalendarPlus className="w-3 h-3 text-accent/70" />
                      <span>{t("agendaPage.addToCalendar", "Adicionar ao Calendário")}</span>
                    </a>

                    {hasMultiSessions && (
                      <button
                        type="button"
                        onClick={() => downloadEventIcs(event, currentLang)}
                        className="inline-flex items-center gap-1.5 text-[10px] text-[#7A7A7A] hover:text-accent font-heading transition-colors cursor-pointer"
                        title={t("agendaPage.downloadIcs", "Baixar arquivo (.ics)")}
                      >
                        <Download className="w-3 h-3 text-accent/70" />
                        <span>{t("agendaPage.downloadIcsShort", "Exportar (.ics)")}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Center Column: Event Title & Location */}
                <div className="flex-1 flex flex-col justify-center min-w-0 w-full space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] w-fit ${theme.badgeBg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
                      <span className="font-heading text-[9px] uppercase tracking-[2px] font-bold">
                        {theme.label}
                      </span>
                    </span>
                  </div>

                  <h4 className="font-drama text-2xl md:text-3xl text-[#F0EDE8]">
                    {dispTitle}
                  </h4>

                  <div className="flex items-center gap-2 text-[#9A9A9A] font-heading text-sm pt-1">
                    <MapPin className="w-4 h-4 text-accent shrink-0" />
                    {event.address ? (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-accent hover:underline decoration-dotted underline-offset-4 transition-colors cursor-pointer"
                      >
                        {dispLocation}
                      </a>
                    ) : (
                      <span>{dispLocation}</span>
                    )}
                  </div>
                </div>

                {/* Right Column: Instructor & Action Button */}
                <div className="shrink-0 w-full md:w-auto md:min-w-[180px] flex flex-col items-center justify-center">
                  {event.instructor && (
                    <Link 
                      to="/safia"
                      className="font-heading text-[9px] text-[#7A7A7A] hover:text-accent uppercase tracking-wider mb-2 text-center w-full block transition-colors group/inst"
                    >
                      {t("agendaPage.instructor", "Instrutor")}: <span className="text-[#CFCFCF] group-hover/inst:text-accent font-semibold transition-colors underline decoration-dotted underline-offset-2">{event.instructor}</span>
                    </Link>
                  )}

                  {userStatus === 'enrolled' ? (
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
                      className={`w-full font-heading text-[10px] uppercase tracking-[2px] font-semibold py-3 px-8 transition-colors duration-300 rounded-full cursor-pointer ${
                        isFull 
                          ? 'border border-[#333333] text-[#F0EDE8] hover:border-accent hover:text-accent' 
                          : 'bg-accent text-primary hover:bg-[#F0EDE8]'
                      }`}
                    >
                      <span>
                        {actionLoading === event.id 
                          ? t('agendaPage.loading') 
                          : isFull ? t('agendaPage.joinWaitlist') : t('agendaPage.subscribe')}
                      </span>
                    </button>
                  )}

                  {(userStatus === 'enrolled' || userStatus === 'waitlist') && (
                    <button 
                      onClick={() => handleCancelEnrollment(event.id)} 
                      disabled={actionLoading === event.id} 
                      className="text-[#9A9A9A] hover:text-red-400 text-[9px] uppercase tracking-wider font-heading transition-colors mt-2 text-center block cursor-pointer"
                    >
                      {actionLoading === event.id ? t('agendaPage.loading') : t('agendaPage.cancel')}
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Schedule Row */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    ref={el => { if (el) scheduleRefs.current[event.id] = el; }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full pt-4 border-t border-[#1C1C24] overflow-hidden"
                  >
                    <div className="bg-[#0A0A0E] border border-[#20202A] rounded-[4px] p-4">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1A1A22]">
                        <span className="font-heading text-[11px] uppercase tracking-[1.5px] text-accent font-semibold flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5 text-accent" />
                          {t("agendaPage.scheduleBreakdown", "Cronograma Completo das Sessões")}
                        </span>
                        <div className="flex items-center gap-2.5">
                          {sessionCount > 0 && (
                            <span className="text-[10px] font-mono text-zinc-400">
                              {sessionCount} {t("agendaPage.sessionsCount", { count: sessionCount, defaultValue: `${sessionCount} encontros` })}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => downloadEventIcs(event, currentLang)}
                            className="inline-flex items-center gap-1 text-[10px] font-heading uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#161622] hover:bg-[#202030] text-accent border border-accent/30 transition-colors cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>.ICS</span>
                          </button>
                        </div>
                      </div>

                      {dispSchedule && dispSchedule.includes('\n') && (
                        <div className="mb-3.5 p-3 rounded-[2px] bg-[#14141B] border border-[#22222E] text-xs text-zinc-300 font-heading whitespace-pre-wrap leading-relaxed">
                          {dispSchedule}
                        </div>
                      )}

                      {Array.isArray(event.sessions) && event.sessions.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {event.sessions.map((sess, sIdx) => {
                            const wd = getWeekdayAbbrev(sess.date, currentLang);
                            const [sy, sm, sd] = sess.date.split('-');
                            const sessIsPast = sess.date < todayStr;
                            return (
                              <div 
                                key={sIdx}
                                className={`p-3 rounded-[3px] border flex items-center justify-between gap-2.5 transition-colors ${
                                  sessIsPast 
                                    ? 'bg-[#0D0D11] border-[#181820] opacity-60' 
                                    : 'bg-[#14141B] border-[#22222E] hover:border-accent/40'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="w-5 h-5 rounded-full bg-accent/15 text-accent font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                                    #{sIdx + 1}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-xs font-heading font-semibold text-[#F0EDE8] truncate">
                                      {wd}, {sd}/{sm}/{sy}
                                    </div>
                                    <div className="text-[11px] font-mono text-[#9A9A9A] flex items-center gap-1.5 mt-0.5">
                                      <Clock className="w-3 h-3 text-accent/70 shrink-0" />
                                      <span>{sess.startTime} – {sess.endTime}</span>
                                    </div>
                                  </div>
                                </div>
                                {!sessIsPast && (
                                  <a
                                    href={generateGoogleCalendarUrl(event, currentLang, sess)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-[2px] bg-[#1A1A24] hover:bg-accent hover:text-primary text-zinc-400 transition-colors"
                                    title={t("agendaPage.addSessionToCalendar", "Adicionar Encontro ao Calendário")}
                                  >
                                    <CalendarPlus className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
