import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, getDocs, doc, runTransaction, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

export default function AgendaPage() {
  const [events, setEvents] = useState([]);
  const [userEnrollments, setUserEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Busca eventos
        const q = query(collection(db, 'events'), orderBy('startDate', 'asc'));
        const snap = await getDocs(q);
        const fetchedEvents = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(fetchedEvents);

        // Se logado, busca em quais eventos o aluno já está inscrito
        if (currentUser) {
          const enrollQ = query(collection(db, 'enrollments'), where('userId', '==', currentUser.uid));
          const enrollSnap = await getDocs(enrollQ);
          const enrollMap = {};
          enrollSnap.forEach(doc => {
            const data = doc.data();
            enrollMap[data.eventId] = data.status; // 'enrolled' ou 'waitlist'
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

  async function handleEnroll(eventId, isFull) {
    if (!currentUser) {
      // Manda pro login e idealmente volta pra cá depois
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

        // Atualiza contadores
        if (currentlyFull) {
          transaction.update(eventRef, { waitlistCount: eventData.waitlistCount + 1 });
        } else {
          transaction.update(eventRef, { enrolledCount: eventData.enrolledCount + 1 });
        }

        // Cria o registro da inscrição
        transaction.set(newEnrollmentRef, {
          eventId: eventId,
          userId: currentUser.uid,
          userName: currentUser.profile?.nome || currentUser.email,
          userEmail: currentUser.email,
          status: newStatus,
          createdAt: new Date().toISOString()
        });
      });

      // Atualiza o estado local para refletir a mudança sem precisar recarregar a página toda
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
      alert("Erro ao processar inscrição. Tente novamente.");
    }
    setActionLoading(null);
  }

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 max-w-5xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-drama italic text-5xl md:text-7xl text-accent mb-6">Agenda</h1>
          <p className="font-heading text-lg text-[#9A9A9A] max-w-2xl mx-auto">
            Reserve seu lugar nos próximos workshops e vivências. As vagas são limitadas para garantir a qualidade e a imersão de cada participante.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-accent font-heading tracking-widest animate-pulse">CARREGANDO AGENDA...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-[#222222] bg-[#0a0a0a] rounded-[2px]">
            <p className="text-[#9A9A9A] font-heading">Nenhum evento com inscrições abertas no momento.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event, index) => {
              const isFull = event.enrolledCount >= event.totalSpots;
              const spotsLeft = event.totalSpots - event.enrolledCount;
              const userStatus = userEnrollments[event.id]; // 'enrolled', 'waitlist', ou undefined

              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-6 md:p-8 bg-[#0a0a0a] border border-[#222222] hover:border-accent/50 rounded-[2px] transition-colors flex flex-col md:flex-row gap-8 justify-between items-start md:items-center overflow-hidden"
                >
                  {/* Informações do Evento */}
                  <div className="flex-1 space-y-4">
                    <h2 className="font-drama italic text-3xl md:text-4xl text-[#F0EDE8]">{event.title}</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#9A9A9A] font-heading text-sm">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <span className="whitespace-pre-wrap leading-relaxed">{event.scheduleDetails}</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-accent shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-accent shrink-0" />
                          <span>
                            {isFull ? (
                              <span className="text-red-400">Turma Cheia</span>
                            ) : (
                              <span>Restam <strong className="text-[#F0EDE8]">{spotsLeft}</strong> vagas</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ação (Inscrição) */}
                  <div className="w-full md:w-auto shrink-0 flex flex-col items-center">
                    {userStatus === 'enrolled' ? (
                      <div className="w-full text-center py-4 px-8 border border-green-500/30 bg-green-900/10 text-green-400 rounded-full font-heading text-xs font-bold uppercase tracking-[2px]">
                        Inscrição Confirmada
                      </div>
                    ) : userStatus === 'waitlist' ? (
                      <div className="w-full text-center py-4 px-8 border border-yellow-500/30 bg-yellow-900/10 text-yellow-400 rounded-full font-heading text-xs font-bold uppercase tracking-[2px]">
                        Na Lista de Espera
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEnroll(event.id, isFull)}
                        disabled={actionLoading === event.id}
                        className={`w-full btn-magnetic font-heading text-[11px] uppercase tracking-[3px] font-semibold py-4 px-8 transition-colors duration-300 rounded-full ${
                          isFull 
                            ? 'border border-[#333333] text-[#F0EDE8] hover:border-accent hover:text-accent' 
                            : 'bg-accent text-primary hover:bg-[#F0EDE8]'
                        }`}
                      >
                        <span className="relative z-10">
                          {actionLoading === event.id 
                            ? 'Processando...' 
                            : isFull 
                              ? 'Entrar na Lista de Espera' 
                              : 'Garantir Vaga'}
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
