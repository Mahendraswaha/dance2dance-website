import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    scheduleDetails: '',
    location: '',
    totalSpots: ''
  });

  async function fetchEvents() {
    setLoading(true);
    try {
      const q = query(collection(db, 'events'), orderBy('startDate', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Erro ao buscar eventos", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  async function handleCreateEvent(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'events'), {
        title: formData.title,
        startDate: formData.startDate,
        scheduleDetails: formData.scheduleDetails,
        location: formData.location,
        totalSpots: Number(formData.totalSpots),
        enrolledCount: 0,
        waitlistCount: 0,
        status: 'active',
        createdAt: new Date().toISOString()
      });
      setFormData({ title: '', startDate: '', scheduleDetails: '', location: '', totalSpots: '' });
      fetchEvents(); // recarrega a lista
    } catch (err) {
      console.error("Erro ao criar evento", err);
      alert("Erro ao criar evento.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 max-w-6xl mx-auto w-full relative z-10">
        <h1 className="font-batang text-4xl text-[#F0EDE8] mb-12">Painel Administrativo</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Coluna 1: Formulário de Criação */}
          <div className="lg:col-span-1 bg-[#0a0a0a] border border-[#222222] p-8 rounded-[2px]">
            <h2 className="font-heading text-xl text-[#F0EDE8] mb-6">Criar Novo Evento</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Título do Evento</label>
                <input list="event-titles" required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Selecione ou digite..." className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
                <datalist id="event-titles">
                  {/* Be the Dance */}
                  <option value="Be Water" />
                  <option value="Be Earth" />
                  <option value="Be Fire" />
                  <option value="Be Air" />
                  <option value="Be The Dance - Imersão Completa" />
                  {/* Biostretch */}
                  <option value="Biostretch - Sessão Individual" />
                  <option value="Biostretch - Aulas Regulares" />
                  <option value="Biostretch - Workshop" />
                </datalist>
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Data de Início (Para ordenação do sistema)</label>
                <input required type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Texto Visível: Datas e Horários</label>
                <textarea required name="scheduleDetails" value={formData.scheduleDetails} onChange={handleChange} placeholder="Ex: 9 sextas-feiras: 04, 11, 18... das 10h às 12h" rows="3" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Local / Estúdio</label>
                <input required type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ex: Rommen Skole" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Total de Vagas</label>
                <input required type="number" name="totalSpots" value={formData.totalSpots} onChange={handleChange} min="1" placeholder="Ex: 20" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <button type="submit" className="w-full bg-accent text-primary font-heading text-[11px] uppercase tracking-[3px] font-semibold py-4 hover:bg-[#F0EDE8] transition-colors duration-300 rounded-[2px] mt-4">
                Publicar Evento
              </button>
            </form>
          </div>

          {/* Coluna 2: Lista de Eventos */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-xl text-[#F0EDE8] mb-6">Agenda Ativa</h2>
            {loading ? (
              <p className="text-[#9A9A9A]">Carregando...</p>
            ) : events.length === 0 ? (
              <div className="p-8 border border-[#222222] bg-[#0a0a0a] rounded-[2px] text-center text-[#9A9A9A]">
                Nenhum evento criado ainda.
              </div>
            ) : (
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="p-6 border border-[#222222] bg-[#0a0a0a] rounded-[2px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-drama text-2xl text-accent mb-1">{event.title}</h3>
                      <p className="font-heading text-sm text-[#9A9A9A] whitespace-pre-wrap mt-1">
                        <strong className="text-accent">Início:</strong> {event.startDate} <br/>
                        <strong className="text-accent">Agenda:</strong> {event.scheduleDetails} <br/>
                        <strong className="text-accent">Local:</strong> {event.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="block font-heading text-xs uppercase tracking-widest text-[#CFCFCF]">Vagas</span>
                        <span className="font-sans text-xl text-[#F0EDE8]">{event.totalSpots - event.enrolledCount} <span className="text-[#9A9A9A] text-sm">/ {event.totalSpots}</span></span>
                      </div>
                      <div className="text-center">
                        <span className="block font-heading text-xs uppercase tracking-widest text-[#CFCFCF]">Espera</span>
                        <span className="font-sans text-xl text-[#F0EDE8]">{event.waitlistCount}</span>
                      </div>
                      <button className="bg-transparent border border-[#333333] hover:border-accent text-[#F0EDE8] hover:text-accent font-heading text-[10px] uppercase tracking-[2px] font-semibold px-4 py-2 rounded-[2px] transition-colors">
                        Ver Alunos
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
