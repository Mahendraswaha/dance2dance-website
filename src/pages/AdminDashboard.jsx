import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [activeLangTab, setActiveLangTab] = useState('pt');
  const [formData, setFormData] = useState({
    title_pt: '',
    title_en: '',
    title_no: '',
    startDate: '',
    scheduleDetails_pt: '',
    scheduleDetails_en: '',
    scheduleDetails_no: '',
    location_pt: '',
    location_en: '',
    location_no: '',
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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        // Modo Edição
        const eventRef = doc(db, 'events', editingId);
        await updateDoc(eventRef, {
          title: formData.title,
          startDate: formData.startDate,
          scheduleDetails: formData.scheduleDetails,
          location: formData.location,
          totalSpots: Number(formData.totalSpots)
        });
        setEditingId(null);
      } else {
        // Modo Criação
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
      }
      setFormData({ title: '', startDate: '', scheduleDetails: '', location: '', totalSpots: '' });
      fetchEvents(); 
    } catch (err) {
      console.error("Erro ao salvar evento", err);
      alert("Erro ao salvar evento.");
    }
  }

  function handleEditClick(event) {
    setFormData({
      title: event.title,
      startDate: event.startDate,
      scheduleDetails: event.scheduleDetails,
      location: event.location,
      totalSpots: event.totalSpots
    });
    setEditingId(event.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({ title: '', startDate: '', scheduleDetails: '', location: '', totalSpots: '' });
  }

  async function handleDelete(id) {
    if(window.confirm('Tem certeza que deseja apagar este evento permanentemente?')) {
      try {
        await deleteDoc(doc(db, 'events', id));
        fetchEvents();
      } catch(err) {
        alert('Erro ao deletar.');
      }
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
        <h1 className="font-batang text-4xl text-[#F0EDE8] mb-12">{t("adminPage.adminTitle")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Coluna 1: Formulário de Criação */}
          <div className="lg:col-span-1 bg-[#0a0a0a] border border-[#222222] p-8 rounded-[2px]">
            <h2 className="font-heading text-xl text-[#F0EDE8] mb-6">{editingId ? t('adminPage.edit') : t('adminPage.createNew')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Abas de Idioma */}
                <div className="flex gap-2 p-1 bg-[#141414] rounded-[2px] w-fit border border-[#333333]">
                  <button type="button" onClick={() => setActiveLangTab('pt')} className={`px-4 py-1.5 font-heading text-[10px] uppercase tracking-wider font-bold rounded-[2px] transition-colors ${activeLangTab === 'pt' ? 'bg-accent text-primary' : 'text-[#9A9A9A] hover:text-[#F0EDE8]'}`}>
                    PT
                  </button>
                  <button type="button" onClick={() => setActiveLangTab('en')} className={`px-4 py-1.5 font-heading text-[10px] uppercase tracking-wider font-bold rounded-[2px] transition-colors ${activeLangTab === 'en' ? 'bg-accent text-primary' : 'text-[#9A9A9A] hover:text-[#F0EDE8]'}`}>
                    EN
                  </button>
                  <button type="button" onClick={() => setActiveLangTab('no')} className={`px-4 py-1.5 font-heading text-[10px] uppercase tracking-wider font-bold rounded-[2px] transition-colors ${activeLangTab === 'no' ? 'bg-accent text-primary' : 'text-[#9A9A9A] hover:text-[#F0EDE8]'}`}>
                    NO
                  </button>
                </div>

                <div>
                  <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">{t("adminPage.eventTitle")} ({activeLangTab.toUpperCase()})</label>
                  <input list="event-titles" required={activeLangTab === 'en'} type="text" name={`title_${activeLangTab}`} value={formData[`title_${activeLangTab}`]} onChange={handleChange} placeholder={t("adminPage.selectOrType")} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
                  
                  <datalist id="event-titles">
                    {activeLangTab === 'pt' && (
                      <>
                        <option value="Be Water" />
                        <option value="Be Balance" />
                        <option value="Be Total" />
                        <option value="Be Stillness" />
                        <option value="Be The Dance PRO" />
                        <option value="Be The Dance DAY" />
                        <option value="Uma Melhor Postura" />
                        <option value="Aprendendo a Relaxar" />
                        <option value="Alongar, Respirar e Meditar" />
                        <option value="Transformando H\u00E1bitos" />
                        <option value="Movimentos Di\u00E1rios para Prevenir o Stress" />
                        <option value="Recuperando o Foco" />
                        <option value="Biostretch: Sess\u00E3o Individual" />
                        <option value="Biostretch: Aulas Regulares" />
                        <option value="Biostretch: Corporate" />
                      </>
                    )}
                    {activeLangTab === 'en' && (
                      <>
                        <option value="Be Water" />
                        <option value="Be Balance" />
                        <option value="Be Total" />
                        <option value="Be Stillness" />
                        <option value="Be The Dance PRO" />
                        <option value="Be The Dance DAY" />
                        <option value="A Better Posture" />
                        <option value="Learning to Relax" />
                        <option value="Stretch, Breathe and Meditate" />
                        <option value="Transforming Habits" />
                        <option value="Daily Movements to Prevent Stress" />
                        <option value="Regaining Focus" />
                        <option value="Biostretch: Individual Session" />
                        <option value="Biostretch: Regular Classes" />
                        <option value="Biostretch: Corporate" />
                      </>
                    )}
                    {activeLangTab === 'no' && (
                      <>
                        <option value="Be Water" />
                        <option value="Be Balance" />
                        <option value="Be Total" />
                        <option value="Be Stillness" />
                        <option value="Be The Dance PRO" />
                        <option value="Be The Dance DAY" />
                        <option value="En Bedre Holdning" />
                        <option value="L\u00E6re \u00E5 Slappe Av" />
                        <option value="Strekk, Pust og Mediter" />
                        <option value="Transformere Vaner" />
                        <option value="Daglige Bevegelser for \u00E5 Forhindre Stress" />
                        <option value="Gjenvinne Fokus" />
                        <option value="Biostretch: Individuell \u00D8kt" />
                        <option value="Biostretch: Faste Klasser" />
                        <option value="Biostretch: Bedrift" />
                      </>
                    )}
                  </datalist>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">{t("adminPage.startDate")} {t("adminPage.global")}</label>
                    <input required type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
                  </div>
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">{t("adminPage.totalSpots")} {t("adminPage.global")}</label>
                    <input required type="number" name="totalSpots" value={formData.totalSpots} onChange={handleChange} min="1" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
                  </div>
                </div>

                <div>
                  <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">{t("adminPage.scheduleText")} ({activeLangTab.toUpperCase()})</label>
                  <textarea required={activeLangTab === 'en'} name={`scheduleDetails_${activeLangTab}`} value={formData[`scheduleDetails_${activeLangTab}`]} onChange={handleChange} placeholder={t("adminPage.exDates")} rows="3" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none" />
                </div>
                <div>
                  <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">{t("adminPage.location")} ({activeLangTab.toUpperCase()})</label>
                  <input required={activeLangTab === 'en'} type="text" name={`location_${activeLangTab}`} value={formData[`location_${activeLangTab}`]} onChange={handleChange} placeholder={t("adminPage.exLocation")} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
                </div>

                <div className="flex gap-2 mt-4">
                <button type="submit" className="flex-1 bg-accent text-primary font-heading text-[11px] uppercase tracking-[3px] font-semibold py-4 hover:bg-[#F0EDE8] transition-colors duration-300 rounded-[2px]">
                  {editingId ? t("adminPage.save") : t("adminPage.publish")}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="bg-transparent border border-[#333333] hover:border-accent text-[#F0EDE8] hover:text-accent font-heading text-[11px] uppercase tracking-[3px] font-semibold px-4 rounded-[2px] transition-colors">{t("adminPage.cancel")}</button>
                )}
              </div>
            </form>
          </div>

          {/* Coluna 2: Lista de Eventos */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-xl text-[#F0EDE8] mb-6">{t("adminPage.activeAgenda")}</h2>
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
                        <strong className="text-accent">Início:</strong> {event.startDate ? event.startDate.split('-').reverse().join('/') : ''} <br/>
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
                      <div className="flex flex-col gap-2">
                        <button className="bg-transparent border border-[#333333] hover:border-accent text-[#F0EDE8] hover:text-accent font-heading text-[10px] uppercase tracking-[2px] font-semibold px-4 py-2 rounded-[2px] transition-colors">{t("adminPage.viewStudents")}</button>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditClick(event)} className="flex-1 bg-[#1a1a1a] hover:bg-[#333333] text-[#9A9A9A] hover:text-[#F0EDE8] font-heading text-[10px] uppercase tracking-[1px] font-semibold px-2 py-2 rounded-[2px] transition-colors">
                            Editar
                          </button>
                          <button onClick={() => handleDelete(event.id)} className="flex-1 bg-[#1a1a1a] hover:bg-red-900/50 text-[#9A9A9A] hover:text-red-400 font-heading text-[10px] uppercase tracking-[1px] font-semibold px-2 py-2 rounded-[2px] transition-colors">
                            Excluir
                          </button>
                        </div>
                      </div>
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
