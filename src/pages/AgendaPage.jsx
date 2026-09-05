import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, getDocs, doc, runTransaction, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AgendaPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [userEnrollments, setUserEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'bethedance', 'biostretch'
  
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

  // Função para inferir a categoria com base no título
  function getCategory(title) {
    const t = title.toLowerCase();
    if (t.includes('biostretch') || t.includes('postura') || t.includes('relaxar') || t.includes('alongar') || t.includes('hábitos') || t.includes('stress') || t.includes('foco')) {
      return 'biostretch';
    }
    return 'bethedance';
  }

  // Gera o link de detalhes baseado no título
  function getDetailsLink(title) {
    const category = getCategory(title);
    if (category === 'biostretch') return '/biostretch'; // Rota base do biostretch
    
    // Tenta achar qual workshop específico do Be The Dance
    const t = title.toLowerCase();
    if (t.includes('water')) return '/be-the-dance/be-water';
    if (t.includes('balance')) return '/be-the-dance/be-balance';
    if (t.includes('total')) return '/be-the-dance/be-total';
    if (t.includes('stillness')) return '/be-the-dance/be-stillness';
    if (t.includes('pro')) return '/be-the-dance/be-the-dance-pro';
    if (t.includes('day')) return '/be-the-dance/be-the-dance-day';
    
    return '/be-the-dance';
  }

  async function handleCancelEnrollment(eventId) {
    if (!window.confirm("Tem certeza que deseja cancelar sua inscrição/espera para este evento?")) return;
    
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
      alert("Erro ao cancelar: " + err.message);
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
          userName: currentUser.profile?.nome || currentUser.email || 'unknown',
          userEmail: currentUser.email || 'unknown',
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
      alert("ERRO DETALHADO: " + err.message + "\n" + err.stack);
    } finally {
      setActionLoading(null);
    }
  }

  const filteredEvents = events.filter(ev => {
    if (filter === 'all') return true;
    return getCategory(ev.title) === filter;
  });

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <Navbar />
      
      <main className="flex-grow pt-48 md:pt-56 pb-24 px-6 max-w-5xl mx-auto w-full relative z-10">
        
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="font-heading text-xs uppercase tracking-[4px] text-accent font-semibold block mb-4">
            CALENDÁRIO
          </span>
          <h1 className="font-drama text-5xl md:text-7xl text-[#F0EDE8] mb-6">Agenda Completa</h1>
          <p className="font-heading text-[#9A9A9A] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Acompanhe nossas próximas datas para os workshops, sessões regulares e vivências do Be The Dance e Biostretch.
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-heading text-xs uppercase tracking-[2px] font-semibold transition-colors duration-300 ${filter === 'all' ? 'bg-accent text-primary' : 'bg-transparent border border-[#333333] text-[#9A9A9A] hover:border-accent hover:text-accent'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('bethedance')}
            className={`px-6 py-2 rounded-full font-heading text-xs uppercase tracking-[2px] font-semibold transition-colors duration-300 ${filter === 'bethedance' ? 'bg-accent text-primary' : 'bg-transparent border border-[#333333] text-[#9A9A9A] hover:border-accent hover:text-accent'}`}
          >
            Be The Dance
          </button>
          <button 
            onClick={() => setFilter('biostretch')}
            className={`px-6 py-2 rounded-full font-heading text-xs uppercase tracking-[2px] font-semibold transition-colors duration-300 ${filter === 'biostretch' ? 'bg-accent text-primary' : 'bg-transparent border border-[#333333] text-[#9A9A9A] hover:border-accent hover:text-accent'}`}
          >
            Biostretch
          </button>
        </motion.div>

        {/* Lista de Eventos */}
        {loading ? (
          <div className="text-center text-accent font-heading tracking-widest animate-pulse mt-20">CARREGANDO AGENDA...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-[#0a0a0a] border border-[#222222] rounded-[2px]">
            <p className="text-[#9A9A9A] font-heading">Nenhuma data cadastrada nesta categoria no momento.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredEvents.map((event, index) => {
                const category = getCategory(event.title);
                const badgeText = category === 'bethedance' ? 'BE THE DANCE' : 'BIOSTRETCH';
                
                // Formata data do evento (se existir)
                let dateStr = "EM BREVE";
                if (event.startDate) {
                   const [y, m, d] = event.startDate.split('-');
                   dateStr = `${d}/${m}/${y}`;
                }

                const currentEnrolled = event.enrolledCount || 0;
                const isFull = currentEnrolled >= event.totalSpots;
                const spotsLeft = event.totalSpots - currentEnrolled;
                const userEnrollmentData = userEnrollments[event.id];
                const userStatus = userEnrollmentData ? userEnrollmentData.status : null;

                return (
                  <motion.div 
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#121214] border border-transparent hover:bg-[#161618] transition-colors rounded-[2px] p-6 md:p-8 flex flex-col md:flex-row items-start gap-8"
                  >
                    {/* Coluna Esquerda: Datas (com padding top para alinhar com o Titulo) */}
                    <div className="w-full md:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-[#1A1A24] pb-6 md:pb-0 pr-6 md:pt-[32px]">
                      <div className="font-heading text-sm font-semibold text-accent uppercase tracking-wider mb-2 mt-1">
                        {dateStr}
                      </div>
                      <div className="flex items-start gap-2 text-[#9A9A9A] font-heading text-xs">
                        <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span className="whitespace-pre-wrap leading-relaxed">
                          {event.scheduleDetails || "A definir"}
                        </span>
                      </div>
                    </div>

                    {/* Bloco Central e Direito */}
                    <div className="flex-1 flex flex-col w-full">
                      
                      {/* Topo: Badge (ocupa exatos 32px de altura para empurrar o Titulo) */}
                      <div className="h-[32px] flex items-start">
                        <div className="inline-flex items-center justify-center bg-[#1E1E24] px-2 py-1 rounded-[2px] pr-[calc(0.5rem-2px)]">
                          <span className="font-heading text-[9px] uppercase tracking-[2px] text-[#9A9A9A] font-bold ml-[2px]">
                            {badgeText}
                          </span>
                        </div>
                      </div>

                      {/* Linha do Meio: Titulo (Esq) + Botao (Dir) */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full">
                        <Link to={getDetailsLink(event.title)} className="block group-hover:text-accent transition-colors">
                          <h2 className="font-drama text-2xl md:text-3xl text-[#F0EDE8] group-hover:text-accent transition-colors">
                            {event.title}
                          </h2>
                        </Link>
                        
                        <div className="shrink-0 w-full md:w-auto md:min-w-[180px]">
                          {userStatus === 'enrolled' ? (
                            <div className="py-2.5 px-6 border border-green-500/30 bg-green-900/10 text-green-400 rounded-full font-heading text-xs font-bold uppercase tracking-[1px] text-center w-full">
                              Inscrito
                            </div>
                          ) : userStatus === 'waitlist' ? (
                            <div className="py-2.5 px-6 border border-yellow-500/30 bg-yellow-900/10 text-yellow-400 rounded-full font-heading text-xs font-bold uppercase tracking-[1px] text-center w-full">
                              Lista de Espera
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
                                  ? 'Aguarde...' 
                                  : isFull 
                                    ? 'Entrar na Espera' 
                                    : 'Inscreva-se'}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Linha Inferior: Local (Esq) + Infos extras (Dir) */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full mt-2">
                        <div className="flex items-center gap-2 text-[#9A9A9A] font-heading text-sm">
                          <MapPin className="w-4 h-4 text-accent shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        
                        <div className="shrink-0 w-full md:w-auto md:min-w-[180px] flex flex-col items-center">
                          {(userStatus === 'enrolled' || userStatus === 'waitlist') ? (
                            <button onClick={() => handleCancelEnrollment(event.id)} disabled={actionLoading === event.id} className="text-[#9A9A9A] hover:text-red-400 text-[9px] uppercase tracking-wider font-heading transition-colors mt-1">
                              {actionLoading === event.id ? 'Aguarde...' : 'Cancelar Inscrição'}
                            </button>
                          ) : (
                            !isFull && (
                              <span className="text-[10px] font-heading text-[#9A9A9A] uppercase tracking-wider text-center w-full inline-block">
                                Restam {spotsLeft} {spotsLeft === 1 ? 'vaga' : 'vagas'}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
