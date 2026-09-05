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
            enrollMap[data.eventId] = data.status;
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

  async function handleEnroll(eventId, isFull) {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setActionLoading(eventId);
    try {
      const eventRef = doc(db, 'events', eventId);
      const newEnrollmentRef = doc(collection(db, 'enrollments'));

      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) throw new Error("Evento não encontrado.");

        const eventData = eventDoc.data();
        const currentlyFull = eventData.enrolledCount >= eventData.totalSpots;
        const newStatus = currentlyFull ? 'waitlist' : 'enrolled';

        if (currentlyFull) {
          transaction.update(eventRef, { waitlistCount: eventData.waitlistCount + 1 });
        } else {
          transaction.update(eventRef, { enrolledCount: eventData.enrolledCount + 1 });
        }

        transaction.set(newEnrollmentRef, {
          eventId: eventId,
          userId: currentUser.uid,
          userName: currentUser.profile?.nome || currentUser.email,
          userEmail: currentUser.email,
          status: newStatus,
          createdAt: new Date().toISOString()
        });
      });

      setUserEnrollments(prev => ({ ...prev, [eventId]: isFull ? 'waitlist' : 'enrolled' }));
      setEvents(prev => prev.map(ev => {
        if (ev.id === eventId) {
          if (isFull) return { ...ev, waitlistCount: ev.waitlistCount + 1 };
          return { ...ev, enrolledCount: ev.enrolledCount + 1 };
        }
        return ev;
      }));

    } catch (err) {
      console.error(err);
      alert("Erro ao processar inscrição.");
    }
    setActionLoading(null);
  }

  const filteredEvents = events.filter(ev => {
    if (filter === 'all') return true;
    return getCategory(ev.title) === filter;
  });

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 max-w-5xl mx-auto w-full relative z-10">
        
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

                const isFull = event.enrolledCount >= event.totalSpots;
                const spotsLeft = event.totalSpots - event.enrolledCount;
                const userStatus = userEnrollments[event.id];

                return (
                  <motion.div 
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#0D0D12] border border-[#1A1A24] hover:border-[#2A2A35] transition-colors rounded-[2px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-8"
                  >
                    {/* Coluna Esquerda: Datas */}
                    <div className="w-full md:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-[#1A1A24] pb-6 md:pb-0 pr-6">
                      <div className="font-heading text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                        {dateStr}
                      </div>
                      <div className="flex items-start gap-2 text-[#9A9A9A] font-heading text-xs">
                        <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span className="whitespace-pre-wrap leading-relaxed">
                          {event.scheduleDetails || "A definir"}
                        </span>
                      </div>
                    </div>

                    {/* Coluna Central: Info */}
                    <div className="flex-1 space-y-3">
                      <div className="inline-block bg-[#16161D] px-2 py-1 rounded-[2px]">
                        <span className="font-heading text-[9px] uppercase tracking-[2px] text-[#CFCFCF] font-bold">
                          {badgeText}
                        </span>
                      </div>
                      <h2 className="font-drama text-3xl md:text-4xl text-[#F0EDE8]">
                        {event.title}
                      </h2>
                      <div className="flex items-center gap-2 text-[#9A9A9A] font-heading text-sm">
                        <MapPin className="w-4 h-4 text-accent shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* Coluna Direita: Vagas e Inscrição */}
                    <div className="w-full md:w-auto shrink-0 flex flex-col items-start md:items-end gap-4 border-t md:border-t-0 border-[#1A1A24] pt-6 md:pt-0 pl-0 md:pl-6">
                      <Link 
                        to={getDetailsLink(event.title)}
                        className="font-heading text-[10px] uppercase tracking-[2px] font-semibold text-accent hover:text-[#F0EDE8] transition-colors border-b border-accent/30 pb-0.5"
                      >
                        DETALHES
                      </Link>

                      {userStatus === 'enrolled' ? (
                        <div className="py-2.5 px-6 border border-green-500/30 bg-green-900/10 text-green-400 rounded-full font-heading text-xs font-bold uppercase tracking-[1px]">
                          Inscrito
                        </div>
                      ) : userStatus === 'waitlist' ? (
                        <div className="py-2.5 px-6 border border-yellow-500/30 bg-yellow-900/10 text-yellow-400 rounded-full font-heading text-xs font-bold uppercase tracking-[1px]">
                          Lista de Espera
                        </div>
                      ) : (
                        <div className="flex flex-col items-start md:items-end gap-2 w-full">
                          <button 
                            onClick={() => handleEnroll(event.id, isFull)}
                            disabled={actionLoading === event.id}
                            className={`w-full md:w-auto btn-magnetic font-heading text-[10px] uppercase tracking-[2px] font-semibold py-2.5 px-6 transition-colors duration-300 rounded-full ${
                              isFull 
                                ? 'border border-[#333333] text-[#F0EDE8] hover:border-accent hover:text-accent' 
                                : 'bg-accent text-primary hover:bg-[#F0EDE8]'
                            }`}
                          >
                            <span className="relative z-10">
                              {actionLoading === event.id 
                                ? 'Aguarde...' 
                                : isFull 
                                  ? 'Entrar na Espera' 
                                  : 'Inscreva-se'}
                            </span>
                          </button>
                          
                          {!isFull && (
                            <span className="text-[10px] font-heading text-[#9A9A9A] uppercase tracking-wider">
                              Restam {spotsLeft} {spotsLeft === 1 ? 'vaga' : 'vagas'}
                            </span>
                          )}
                        </div>
                      )}
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
