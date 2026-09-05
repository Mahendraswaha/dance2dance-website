import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StudentsModal from '../components/StudentsModal';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, Users, Calendar, MapPin, Clock, UserCheck } from 'lucide-react';
import { getLocalizedEvent, getEventCategory } from '../utils/eventHelpers';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedEventForStudents, setSelectedEventForStudents] = useState(null);

  // Tab order: NO -> EN -> PT
  const currentInitialTab = i18n.language === 'pt' ? 'pt' : (i18n.language === 'en' ? 'en' : 'no');
  const [activeLangTab, setActiveLangTab] = useState(currentInitialTab);

  const initialFormState = {
    category: 'bethedance',
    instructor: 'Safia Valente',
    title_no: '',
    title_en: '',
    title_pt: '',
    startDate: '',
    startTime: '18:00',
    endTime: '20:00',
    totalHours: '',
    scheduleDetails_no: '',
    scheduleDetails_en: '',
    scheduleDetails_pt: '',
    location_no: '',
    location_en: '',
    location_pt: '',
    totalSpots: ''
  };

  const [formData, setFormData] = useState(initialFormState);

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

      // Se o modal estiver aberto, atualiza os dados do evento nele também
      if (selectedEventForStudents) {
        const updatedSelected = fetchedEvents.find(e => e.id === selectedEventForStudents.id);
        if (updatedSelected) setSelectedEventForStudents(updatedSelected);
      }
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
      const primaryTitle = (formData[`title_${activeLangTab}`] || formData.title_no || formData.title_en || formData.title_pt || '').trim();
      const primarySchedule = (formData[`scheduleDetails_${activeLangTab}`] || formData.scheduleDetails_no || formData.scheduleDetails_en || formData.scheduleDetails_pt || '').trim();
      const primaryLocation = (formData[`location_${activeLangTab}`] || formData.location_no || formData.location_en || formData.location_pt || '').trim();

      const payload = {
        category: formData.category || 'bethedance',
        instructor: (formData.instructor || 'Safia Valente').trim(),
        startDate: formData.startDate,
        startTime: formData.startTime || '',
        endTime: formData.endTime || '',
        totalHours: formData.totalHours ? Number(formData.totalHours) : null,
        totalSpots: Number(formData.totalSpots),

        title_no: (formData.title_no || primaryTitle).trim(),
        title_en: (formData.title_en || primaryTitle).trim(),
        title_pt: (formData.title_pt || primaryTitle).trim(),

        scheduleDetails_no: (formData.scheduleDetails_no || primarySchedule).trim(),
        scheduleDetails_en: (formData.scheduleDetails_en || primarySchedule).trim(),
        scheduleDetails_pt: (formData.scheduleDetails_pt || primarySchedule).trim(),

        location_no: (formData.location_no || primaryLocation).trim(),
        location_en: (formData.location_en || primaryLocation).trim(),
        location_pt: (formData.location_pt || primaryLocation).trim(),

        // Backward compatibility
        title: (formData.title_en || primaryTitle).trim(),
        scheduleDetails: (formData.scheduleDetails_en || primarySchedule).trim(),
        location: (formData.location_en || primaryLocation).trim()
      };

      if (editingId) {
        const eventRef = doc(db, 'events', editingId);
        await updateDoc(eventRef, payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'events'), {
          ...payload,
          enrolledCount: 0,
          waitlistCount: 0,
          status: 'active',
          createdAt: new Date().toISOString()
        });
      }
      setFormData(initialFormState);
      fetchEvents(); 
    } catch (err) {
      console.error("Erro ao salvar evento", err);
      alert(t('adminPage.saveError', 'Erro ao salvar evento.') + ' ' + (err.message || ''));
    }
  }

  function handleEditClick(event) {
    setFormData({
      category: event.category || getEventCategory(event),
      instructor: event.instructor || 'Safia Valente',
      title_no: event.title_no || event.title || '',
      title_en: event.title_en || event.title || '',
      title_pt: event.title_pt || event.title || '',
      startDate: event.startDate || '',
      startTime: event.startTime || '18:00',
      endTime: event.endTime || '20:00',
      totalHours: event.totalHours || '',
      scheduleDetails_no: event.scheduleDetails_no || event.scheduleDetails || '',
      scheduleDetails_en: event.scheduleDetails_en || event.scheduleDetails || '',
      scheduleDetails_pt: event.scheduleDetails_pt || event.scheduleDetails || '',
      location_no: event.location_no || event.location || '',
      location_en: event.location_en || event.location || '',
      location_pt: event.location_pt || event.location || '',
      totalSpots: event.totalSpots || ''
    });
    setEditingId(event.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData(initialFormState);
  }

  async function handleDelete(id) {
    if (window.confirm(t('adminPage.confirmDelete', 'Tem certeza que deseja apagar este evento permanentemente?'))) {
      try {
        await deleteDoc(doc(db, 'events', id));
        fetchEvents();
      } catch(err) {
        alert(t('adminPage.deleteError', 'Erro ao deletar.') + ' ' + (err.message || ''));
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
          {/* Coluna 1: Formulário de Criação / Edição */}
          <div className="lg:col-span-1 bg-[#0a0a0a] border border-[#222222] p-8 rounded-[2px] h-fit">
            <h2 className="font-heading text-xl text-[#F0EDE8] mb-6">
              {editingId ? t('adminPage.edit') : t('adminPage.createNew')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Seleção de Categoria */}
                <div>
                  <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                    {t("adminPage.category", "Categoria")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: 'bethedance' }))}
                      className={`py-2 text-center font-heading text-[10px] uppercase tracking-wider font-bold rounded-[2px] border transition-colors ${formData.category === 'bethedance' ? 'bg-accent text-primary border-accent' : 'border-[#333333] text-[#9A9A9A] hover:text-[#F0EDE8]'}`}
                    >
                      Be The Dance
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: 'biostretch' }))}
                      className={`py-2 text-center font-heading text-[10px] uppercase tracking-wider font-bold rounded-[2px] border transition-colors ${formData.category === 'biostretch' ? 'bg-accent text-primary border-accent' : 'border-[#333333] text-[#9A9A9A] hover:text-[#F0EDE8]'}`}
                    >
                      Biostretch
                    </button>
                  </div>
                </div>

                {/* Campo de Instrutor (Multi-instrutor) */}
                <div>
                  <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                    {t("adminPage.instructor", "Instrutor / Professor")}
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    list="instructors-list"
                    value={formData.instructor}
                    onChange={handleChange}
                    placeholder="Ex: Safia Valente"
                    required
                    className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm"
                  />
                  <datalist id="instructors-list">
                    <option value="Safia Valente" />
                  </datalist>
                </div>

                {/* Abas de Idioma na ordem: NO -> EN -> PT */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF]">
                      {t("adminPage.languageTab", "Idioma do Formulário")}
                    </label>
                    <span className="text-[10px] font-heading text-accent uppercase tracking-wider">
                      {activeLangTab.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-2 p-1 bg-[#141414] rounded-[2px] w-full border border-[#333333]">
                    <button 
                      type="button" 
                      onClick={() => setActiveLangTab('no')} 
                      className={`flex-1 py-1.5 font-heading text-[10px] uppercase tracking-wider font-bold rounded-[2px] transition-colors ${activeLangTab === 'no' ? 'bg-accent text-primary' : 'text-[#9A9A9A] hover:text-[#F0EDE8]'}`}
                    >
                      NO
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setActiveLangTab('en')} 
                      className={`flex-1 py-1.5 font-heading text-[10px] uppercase tracking-wider font-bold rounded-[2px] transition-colors ${activeLangTab === 'en' ? 'bg-accent text-primary' : 'text-[#9A9A9A] hover:text-[#F0EDE8]'}`}
                    >
                      EN
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setActiveLangTab('pt')} 
                      className={`flex-1 py-1.5 font-heading text-[10px] uppercase tracking-wider font-bold rounded-[2px] transition-colors ${activeLangTab === 'pt' ? 'bg-accent text-primary' : 'text-[#9A9A9A] hover:text-[#F0EDE8]'}`}
                    >
                      PT
                    </button>
                  </div>
                </div>

                {/* Título do Evento no Idioma Ativo */}
                <div>
                  <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                    {t("adminPage.eventTitle")} ({activeLangTab.toUpperCase()})
                  </label>
                  <input 
                    list="event-titles" 
                    required={activeLangTab === 'en' || activeLangTab === 'no'} 
                    type="text" 
                    name={`title_${activeLangTab}`} 
                    value={formData[`title_${activeLangTab}`] || ''} 
                    onChange={handleChange} 
                    placeholder={t("adminPage.selectOrType")} 
                    className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" 
                  />
                  
                  <datalist id="event-titles">
                    {activeLangTab === 'no' && (
                      <>
                        <option value="Be Water" />
                        <option value="Be Balance" />
                        <option value="Be Total" />
                        <option value="Be Stillness" />
                        <option value="Be The Dance PRO" />
                        <option value="Be The Dance DAY" />
                        <option value="En Bedre Holdning" />
                        <option value="Lære å Slappe Av" />
                        <option value="Strekk, Pust og Mediter" />
                        <option value="Transformere Vaner" />
                        <option value="Daglige Bevegelser for å Forhindre Stress" />
                        <option value="Gjenvinne Fokus" />
                        <option value="Biostretch: Individuell Økt" />
                        <option value="Biostretch: Faste Klasser" />
                        <option value="Biostretch: Bedrift" />
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
                        <option value="Transformando Hábitos" />
                        <option value="Movimentos Diários para Prevenir o Stress" />
                        <option value="Recuperando o Foco" />
                        <option value="Biostretch: Sessão Individual" />
                        <option value="Biostretch: Aulas Regulares" />
                        <option value="Biostretch: Corporate" />
                      </>
                    )}
                  </datalist>
                </div>
                
                {/* Data de Início e Total de Vagas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t("adminPage.startDate")}
                    </label>
                    <input 
                      required 
                      type="date" 
                      name="startDate" 
                      value={formData.startDate} 
                      onChange={handleChange} 
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-3 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                      {t("adminPage.totalSpots")}
                    </label>
                    <input 
                      required 
                      type="number" 
                      name="totalSpots" 
                      value={formData.totalSpots} 
                      onChange={handleChange} 
                      min="1" 
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-3 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm" 
                    />
                  </div>
                </div>

                {/* Horários Estruturados (Início / Término) e Carga Horária */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t("adminPage.startTime", "Início")}
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-2 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t("adminPage.endTime", "Término")}
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-2 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t("adminPage.totalHours", "Horas (h)")}
                    </label>
                    <input
                      type="number"
                      name="totalHours"
                      placeholder="Ex: 18"
                      value={formData.totalHours}
                      onChange={handleChange}
                      min="0"
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-2 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-xs text-center"
                    />
                  </div>
                </div>

                {/* Texto Visível de Datas / Horários no Idioma Ativo */}
                <div>
                  <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                    {t("adminPage.scheduleText")} ({activeLangTab.toUpperCase()})
                  </label>
                  <textarea 
                    name={`scheduleDetails_${activeLangTab}`} 
                    value={formData[`scheduleDetails_${activeLangTab}`] || ''} 
                    onChange={handleChange} 
                    placeholder={t("adminPage.exDates")} 
                    rows="3" 
                    className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none text-sm" 
                  />
                </div>

                {/* Local / Estúdio no Idioma Ativo */}
                <div>
                  <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                    {t("adminPage.location")} ({activeLangTab.toUpperCase()})
                  </label>
                  <input 
                    type="text" 
                    name={`location_${activeLangTab}`} 
                    value={formData[`location_${activeLangTab}`] || ''} 
                    onChange={handleChange} 
                    placeholder={t("adminPage.exLocation")} 
                    className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm" 
                  />
                </div>

                {/* Botões de Ação do Form */}
                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit" 
                    className="flex-1 bg-accent text-primary font-heading text-[11px] uppercase tracking-[3px] font-semibold py-4 hover:bg-[#F0EDE8] transition-colors duration-300 rounded-[2px]"
                  >
                    {editingId ? t("adminPage.save") : t("adminPage.publish")}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      onClick={handleCancelEdit} 
                      className="bg-transparent border border-[#333333] hover:border-accent text-[#F0EDE8] hover:text-accent font-heading text-[11px] uppercase tracking-[3px] font-semibold px-4 rounded-[2px] transition-colors"
                    >
                      {t("adminPage.cancel")}
                    </button>
                  )}
                </div>
            </form>
          </div>

          {/* Coluna 2: Lista de Eventos Ativos */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-xl text-[#F0EDE8] mb-6">{t("adminPage.activeAgenda")}</h2>
            {loading ? (
              <p className="text-[#9A9A9A] font-heading">{t("adminPage.loading", "Carregando...")}</p>
            ) : events.length === 0 ? (
              <div className="p-8 border border-[#222222] bg-[#0a0a0a] rounded-[2px] text-center text-[#9A9A9A] font-heading">
                {t("adminPage.empty", "Nenhum evento criado ainda.")}
              </div>
            ) : (
              <div className="space-y-4">
                {events.map(event => {
                  const { title: dispTitle, scheduleDetails: dispSchedule, location: dispLocation } = getLocalizedEvent(event, i18n.language);
                  const cat = getEventCategory(event);

                  let dateStr = '';
                  if (event.startDate) {
                    const [y, m, d] = event.startDate.split('-');
                    dateStr = `${d}/${m}/${y}`;
                  }

                  const spotsLeft = (event.totalSpots || 0) - (event.enrolledCount || 0);

                  return (
                    <div key={event.id} className="p-6 border border-[#222222] bg-[#0a0a0a] rounded-[2px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9px] uppercase tracking-[2px] font-bold px-2 py-0.5 rounded-[2px] bg-[#1a1a1a] text-accent">
                            {cat === 'bethedance' ? 'BE THE DANCE' : 'BIOSTRETCH'}
                          </span>
                          
                          {/* Badges de Idiomas */}
                          <div className="flex items-center gap-1">
                            {event.title_no && <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/5 text-[#9A9A9A]">NO</span>}
                            {event.title_en && <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/5 text-[#9A9A9A]">EN</span>}
                            {event.title_pt && <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/5 text-[#9A9A9A]">PT</span>}
                          </div>

                          {/* Instrutor */}
                          {event.instructor && (
                            <span className="text-[10px] font-heading text-[#9A9A9A] ml-2">
                              • <span className="text-[#CFCFCF] font-semibold">{event.instructor}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-drama text-2xl text-accent mb-2">{dispTitle}</h3>
                        
                        <div className="font-heading text-xs text-[#9A9A9A] space-y-1">
                          <div className="flex items-center gap-1.5">
                            <strong className="text-[#CFCFCF]">{t("adminPage.startDate")}:</strong> 
                            <span>{dateStr || '-'}</span>
                            {event.startTime && (
                              <span className="text-[#7A7A7A] ml-1">
                                ({event.startTime} - {event.endTime || ''})
                              </span>
                            )}
                            {event.totalHours && (
                              <span className="text-accent/80 font-mono text-[11px] ml-1">
                                [{event.totalHours}h]
                              </span>
                            )}
                          </div>
                          <div className="flex items-start gap-1.5">
                            <strong className="text-[#CFCFCF] shrink-0">{t("adminPage.scheduleText")}:</strong> 
                            <span className="whitespace-pre-wrap">{dispSchedule || '-'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-[#CFCFCF]">{t("adminPage.location")}:</strong> 
                            <span>{dispLocation || '-'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 shrink-0">
                        {/* Contador de Vagas exclusivo do Admin */}
                        <div className="text-center min-w-[50px]">
                          <span className="block font-heading text-[10px] uppercase tracking-widest text-[#CFCFCF]">
                            {t("adminPage.spots", "Vagas")}
                          </span>
                          <span className="font-sans text-lg text-[#F0EDE8] font-semibold">
                            {spotsLeft} <span className="text-[#9A9A9A] text-xs font-normal">/ {event.totalSpots}</span>
                          </span>
                        </div>

                        {/* Contador de Espera exclusivo do Admin */}
                        <div className="text-center min-w-[45px]">
                          <span className="block font-heading text-[10px] uppercase tracking-widest text-[#CFCFCF]">
                            {t("adminPage.waitlist", "Espera")}
                          </span>
                          <span className="font-sans text-lg text-[#F0EDE8] font-semibold">
                            {event.waitlistCount || 0}
                          </span>
                        </div>

                        {/* Ações por Ícones Elegantes com Tooltips */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedEventForStudents(event)}
                            title={t("adminPage.viewStudents")}
                            aria-label={t("adminPage.viewStudents")}
                            className="p-2.5 rounded-[2px] border border-[#333333] hover:border-accent text-[#F0EDE8] hover:text-accent transition-colors flex items-center justify-center relative group"
                          >
                            <Users className="w-4 h-4" />
                            {event.enrolledCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 bg-accent text-primary text-[9px] font-bold font-mono px-1 rounded-full">
                                {event.enrolledCount}
                              </span>
                            )}
                          </button>

                          <button 
                            onClick={() => handleEditClick(event)} 
                            title={t("adminPage.edit")}
                            aria-label={t("adminPage.edit")}
                            className="p-2.5 rounded-[2px] bg-[#1a1a1a] hover:bg-[#333333] text-[#9A9A9A] hover:text-[#F0EDE8] transition-colors flex items-center justify-center"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button 
                            onClick={() => handleDelete(event.id)} 
                            title={t("adminPage.delete")}
                            aria-label={t("adminPage.delete")}
                            className="p-2.5 rounded-[2px] bg-[#1a1a1a] hover:bg-red-900/40 text-[#9A9A9A] hover:text-red-400 transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Gestão de Alunos */}
      <AnimatePresence>
        {selectedEventForStudents && (
          <StudentsModal 
            event={selectedEventForStudents} 
            onClose={() => setSelectedEventForStudents(null)} 
            onEventUpdated={fetchEvents} 
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
