import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StudentsModal from '../components/StudentsModal';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, Users, Calendar, MapPin, Clock, UserCheck, CalendarPlus, ChevronDown, Check, Sparkles, Download } from 'lucide-react';
import { getLocalizedEvent, getEventCategory, getEventRoute, generateInstructorCalendarUrl, downloadEventIcs, isEventPast, isEventOngoing, formatEventDate, getCategoryTheme, generateScheduleSummary } from '../utils/eventHelpers';
import ScheduleCalendarPicker from '../components/ScheduleCalendarPicker';

// Presets estruturados por categoria e idioma com suas respectivas rotas
const EVENT_PRESETS = {
  bethedance: {
    no: [
      "Be Water",
      "Be Balance",
      "Be Total",
      "Be Stillness",
      "Be The Dance PRO",
      "Be The Dance DAY",
      "Be the Dance: Bedrift"
    ],
    en: [
      "Be Water",
      "Be Balance",
      "Be Total",
      "Be Stillness",
      "Be The Dance PRO",
      "Be The Dance DAY",
      "Be the Dance: Corporate"
    ],
    pt: [
      "Be Water",
      "Be Balance",
      "Be Total",
      "Be Stillness",
      "Be The Dance PRO",
      "Be The Dance DAY",
      "Be the Dance: Corporate"
    ],
    routes: [
      "/be-the-dance/be-water",
      "/be-the-dance/be-balance",
      "/be-the-dance/be-total",
      "/be-the-dance/be-stillness",
      "/be-the-dance/be-the-dance-pro",
      "/be-the-dance/be-the-dance-day",
      "/be-the-dance/empresas"
    ]
  },
  biostretch: {
    no: [
      "En Bedre Holdning",
      "Lære å Slappe Av",
      "Strekk, Pust og Mediter",
      "Transformere Vaner",
      "Daglige Bevegelser for å Forhindre Stress",
      "Gjenvinne Fokus",
      "Biostretch: Individuell Økt",
      "Biostretch: Faste Klasser",
      "Biostretch: Bedrift"
    ],
    en: [
      "A Better Posture",
      "Learning to Relax",
      "Stretch, Breathe and Meditate",
      "Transforming Habits",
      "Daily Movements to Prevent Stress",
      "Regaining Focus",
      "Biostretch: Individual Session",
      "Biostretch: Regular Classes",
      "Biostretch: Corporate"
    ],
    pt: [
      "Uma Melhor Postura",
      "Aprendendo a Relaxar",
      "Alongar, Respirar e Meditar",
      "Transformando Hábitos",
      "Movimentos Diários para Prevenir o Stress",
      "Recuperando o Foco",
      "Biostretch: Sessão Individual",
      "Biostretch: Aulas Regulares",
      "Biostretch: Corporate"
    ],
    routes: [
      "/biostretch/uma-melhor-postura",
      "/biostretch/aprendendo-a-relaxar",
      "/biostretch/alongar-respirar-e-meditar",
      "/biostretch/transformando-habitos",
      "/biostretch/movimentos-diarios-para-prevenir-o-stress",
      "/biostretch/recuperando-o-foco",
      "/biostretch/individual",
      "/biostretch/aulas-regulares",
      "/biostretch/empresas"
    ]
  },
  kroppsskole: {
    no: [
      "Kroppsskole: Grunnkurs",
      "Kroppens Intelligens",
      "Pust og Nærvær",
      "Holdning og Bevegelse",
      "Kroppsskole: Fordypning"
    ],
    en: [
      "Kroppsskole: Foundation",
      "Body Intelligence",
      "Breath and Presence",
      "Posture and Movement",
      "Kroppsskole: Immersion"
    ],
    pt: [
      "Kroppsskole: Fundamentos",
      "A Inteligência do Corpo",
      "Respiração e Presença",
      "Postura e Movimento",
      "Kroppsskole: Imersão"
    ],
    routes: [
      "/kroppsskole",
      "/kroppsskole",
      "/kroppsskole",
      "/kroppsskole",
      "/kroppsskole"
    ]
  }
};

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedEventForStudents, setSelectedEventForStudents] = useState(null);
  const [adminTab, setAdminTab] = useState('upcoming'); // 'upcoming' | 'past'

  // Tab order: NO -> EN -> PT
  const currentInitialTab = i18n.language === 'pt' ? 'pt' : (i18n.language === 'en' ? 'en' : 'no');
  const [activeLangTab, setActiveLangTab] = useState(currentInitialTab);

  const initialFormState = {
    category: 'bethedance',
    instructor: 'Safia',
    instructorEmail: '',
    targetPath: '',
    title_no: '',
    title_en: '',
    title_pt: '',
    startDate: '',
    endDate: '',
    startTime: '18:00',
    endTime: '20:00',
    totalHours: '',
    sessions: [],
    scheduleDetails_no: '',
    scheduleDetails_en: '',
    scheduleDetails_pt: '',
    location_no: '',
    location_en: '',
    location_pt: '',
    address: '',
    totalSpots: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const titleDropdownRef = useRef(null);

  // Fecha o dropdown de títulos ao clicar fora do componente
  useEffect(() => {
    function handleClickOutside(e) {
      if (titleDropdownRef.current && !titleDropdownRef.current.contains(e.target)) {
        setIsTitleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      const title_no = (formData.title_no || primaryTitle).trim();
      const title_en = (formData.title_en || primaryTitle).trim();
      const title_pt = (formData.title_pt || primaryTitle).trim();

      const calculatedTargetPath = formData.targetPath || getEventRoute({
        category: formData.category,
        title_no,
        title_en,
        title_pt,
        title: primaryTitle
      });

      if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
        alert(t('adminPage.invalidEndDate', 'A data de término não pode ser anterior à data de início.'));
        return;
      }

      const payload = {
        category: formData.category || 'bethedance',
        instructor: (formData.instructor || 'Safia').trim(),
        instructorEmail: (formData.instructorEmail || '').trim(),
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        startTime: formData.startTime || '',
        endTime: formData.endTime || '',
        totalHours: formData.totalHours ? Number(formData.totalHours) : null,
        totalSpots: Number(formData.totalSpots),
        sessions: formData.sessions || [],

        title_no,
        title_en,
        title_pt,

        scheduleDetails_no: (formData.scheduleDetails_no || primarySchedule).trim(),
        scheduleDetails_en: (formData.scheduleDetails_en || primarySchedule).trim(),
        scheduleDetails_pt: (formData.scheduleDetails_pt || primarySchedule).trim(),

        location_no: (formData.location_no || primaryLocation).trim(),
        location_en: (formData.location_en || primaryLocation).trim(),
        location_pt: (formData.location_pt || primaryLocation).trim(),
        address: (formData.address || '').trim(),

        targetPath: calculatedTargetPath,

        // Backward compatibility
        title: primaryTitle,
        scheduleDetails: primarySchedule,
        location: primaryLocation
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
    const existingSessions = Array.isArray(event.sessions) && event.sessions.length > 0 
      ? event.sessions 
      : (event.startDate ? [{ date: event.startDate, startTime: event.startTime || '18:00', endTime: event.endTime || '20:00' }] : []);

    setFormData({
      category: event.category || getEventCategory(event),
      instructor: event.instructor || 'Safia',
      instructorEmail: event.instructorEmail || '',
      targetPath: event.targetPath || getEventRoute(event),
      title_no: event.title_no || event.title || '',
      title_en: event.title_en || event.title || '',
      title_pt: event.title_pt || event.title || '',
      startDate: event.startDate || '',
      endDate: event.endDate || '',
      startTime: event.startTime || '18:00',
      endTime: event.endTime || '20:00',
      totalHours: event.totalHours || '',
      sessions: existingSessions,
      scheduleDetails_no: event.scheduleDetails_no || event.scheduleDetails || '',
      scheduleDetails_en: event.scheduleDetails_en || event.scheduleDetails || '',
      scheduleDetails_pt: event.scheduleDetails_pt || event.scheduleDetails || '',
      location_no: event.location_no || event.location || '',
      location_en: event.location_en || event.location || '',
      location_pt: event.location_pt || event.location || '',
      address: event.address || '',
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

  function handleCategoryChange(newCategory) {
    setIsTitleDropdownOpen(false);
    setFormData(prev => {
      if (prev.category === newCategory) return prev;
      const oldPresets = EVENT_PRESETS[prev.category] || {};
      const allOldTitles = Object.values(oldPresets).flatMap(arr => Array.isArray(arr) ? arr : []);
      const currentTitle = prev[`title_${activeLangTab}`];
      const shouldReset = allOldTitles.includes(currentTitle);

      return {
        ...prev,
        category: newCategory,
        ...(shouldReset ? {
          title_no: '',
          title_en: '',
          title_pt: '',
          targetPath: ''
        } : {})
      };
    });
  }

  function handleSelectPreset(idx) {
    const cat = formData.category || 'bethedance';
    const presets = EVENT_PRESETS[cat] || EVENT_PRESETS.bethedance;

    setFormData(prev => ({
      ...prev,
      title_no: presets.no[idx] || '',
      title_en: presets.en[idx] || '',
      title_pt: presets.pt[idx] || '',
      targetPath: presets.routes[idx] || ''
    }));
    setIsTitleDropdownOpen(false);
  }

  function handleTitleChange(e) {
    const val = e.target.value;
    const cat = formData.category || 'bethedance';
    const presets = EVENT_PRESETS[cat] || EVENT_PRESETS.bethedance;

    // Procura se o valor digitado/selecionado corresponde a um dos presets no idioma ativo
    const listForLang = presets[activeLangTab] || [];
    const matchIdx = listForLang.findIndex(t => t.toLowerCase() === val.trim().toLowerCase());

    if (matchIdx !== -1) {
      // Auto-preenche as traduções dos 3 idiomas e a rota específica
      setFormData(prev => ({
        ...prev,
        title_no: presets.no[matchIdx],
        title_en: presets.en[matchIdx],
        title_pt: presets.pt[matchIdx],
        targetPath: presets.routes[matchIdx]
      }));
    } else {
      // Digitação livre
      setFormData(prev => ({
        ...prev,
        [`title_${activeLangTab}`]: val,
        targetPath: ''
      }));
    }
  }

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <Navbar />
      
      <main className="flex-grow pt-44 md:pt-48 pb-24 px-4 sm:px-8 max-w-[1680px] mx-auto w-full relative z-10">
        <h1 className="font-batang text-4xl text-[#F0EDE8] mb-8">{t("adminPage.adminTitle")}</h1>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
          {/* Coluna 1: Formulário de Criação / Edição */}
          <div className="xl:col-span-5 2xl:col-span-5 bg-[#0a0a0a] border border-[#222222] p-6 sm:p-8 rounded-[4px] h-fit">
            <h2 className="font-heading text-xl text-[#F0EDE8] mb-6">
              {editingId ? t('adminPage.edit') : t('adminPage.createNew')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Seleção de Categoria */}
                <div>
                  <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                    {t("adminPage.category", "Categoria")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCategoryChange('bethedance')}
                      className={`py-2 text-center font-heading text-[10px] uppercase tracking-wider font-bold rounded-[2px] border transition-colors ${formData.category === 'bethedance' ? 'bg-accent text-primary border-accent' : 'border-[#333333] text-[#9A9A9A] hover:text-[#F0EDE8]'}`}
                    >
                      Be The Dance
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange('biostretch')}
                      className={`py-2 text-center font-heading text-[10px] uppercase tracking-wider font-bold rounded-[2px] border transition-colors ${formData.category === 'biostretch' ? 'bg-[#FAF8F5] text-primary border-[#FAF8F5]' : 'border-[#333333] text-[#9A9A9A] hover:text-[#F0EDE8]'}`}
                    >
                      Biostretch
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange('kroppsskole')}
                      className={`py-2 text-center font-heading text-[10px] uppercase tracking-wider font-bold rounded-[2px] border transition-colors ${formData.category === 'kroppsskole' ? 'bg-[#4A9B8E] text-primary border-[#4A9B8E]' : 'border-[#333333] text-[#9A9A9A] hover:text-[#F0EDE8]'}`}
                    >
                      Kroppsskole
                    </button>
                  </div>
                </div>

                {/* Campos de Instrutor e E-mail com alinhamento perfeito */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2 truncate">
                      {t("adminPage.instructor", "Instrutor")}
                    </label>
                    <input
                      type="text"
                      name="instructor"
                      list="instructors-list"
                      value={formData.instructor}
                      onChange={handleChange}
                      placeholder="Ex: Safia"
                      required
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-3 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm"
                    />
                    <datalist id="instructors-list">
                      <option value="Safia" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2 truncate">
                      {t("adminPage.instructorEmail", "E-mail do Instrutor")}
                    </label>
                    <input
                      type="email"
                      name="instructorEmail"
                      value={formData.instructorEmail || ''}
                      onChange={handleChange}
                      placeholder="safia@dance2dance.no"
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-3 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm"
                    />
                  </div>
                </div>

                {/* Abas de Idioma na ordem: NO -> EN -> PT */}
                <div>
                  <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                    {t("adminPage.languageTab", "Idioma do Formulário")}
                  </label>
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

                {/* Título do Evento no Idioma Ativo (Combobox estrito por Categoria) */}
                <div ref={titleDropdownRef} className="relative">
                  <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                    {t("adminPage.eventTitle")} ({activeLangTab.toUpperCase()})
                  </label>
                  <div className="relative">
                    <input 
                      autoComplete="off"
                      spellCheck="false"
                      required={activeLangTab === 'en' || activeLangTab === 'no'} 
                      type="text" 
                      name={`title_${activeLangTab}`} 
                      value={formData[`title_${activeLangTab}`] || ''} 
                      onChange={handleTitleChange} 
                      onFocus={() => setIsTitleDropdownOpen(true)}
                      placeholder={t("adminPage.selectOrType")} 
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 pr-10 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm" 
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setIsTitleDropdownOpen(prev => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7A7A7A] hover:text-accent p-1.5 transition-colors"
                      title="Alternar lista de workshops"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isTitleDropdownOpen ? 'rotate-180 text-accent' : ''}`} />
                    </button>
                  </div>

                  {/* Dropdown customizado contendo EXCLUSIVAMENTE os workshops da categoria selecionada */}
                  <AnimatePresence>
                    {isTitleDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 mt-1 bg-[#121214] border border-[#2A2A30] shadow-2xl rounded-[2px] z-50 max-h-64 overflow-y-auto py-1 divide-y divide-[#1E1E24]"
                      >
                        <div className="px-3 py-1.5 text-[9px] font-heading uppercase tracking-wider text-accent/80 font-bold bg-[#0A0A0C]">
                          {formData.category === 'kroppsskole' ? 'Cursos Kroppsskole' : formData.category === 'biostretch' ? 'Workshops Biostretch' : 'Workshops Be The Dance'}
                        </div>
                        {(EVENT_PRESETS[formData.category]?.[activeLangTab] || []).map((titleOption, idx) => {
                          const isSelected = formData[`title_${activeLangTab}`] === titleOption;
                          return (
                            <button
                              key={titleOption}
                              type="button"
                              onClick={() => handleSelectPreset(idx)}
                              className={`w-full text-left px-4 py-2.5 text-xs font-heading transition-colors flex items-center justify-between group ${
                                isSelected ? 'bg-accent/15 text-accent font-semibold' : 'text-[#D4D4D8] hover:text-accent hover:bg-[#1A1A20]'
                              }`}
                            >
                              <span className="group-hover:translate-x-1 transition-transform">
                                {titleOption}
                              </span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-accent shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Seletor Visual de Calendário Multi-Sessões */}
                <div>
                  <ScheduleCalendarPicker
                    sessions={formData.sessions || []}
                    onChange={(newSessions, summary) => {
                      setFormData(prev => ({
                        ...prev,
                        sessions: newSessions,
                        startDate: summary.startDate || prev.startDate,
                        endDate: summary.endDate || prev.endDate,
                        startTime: summary.startTime || prev.startTime,
                        endTime: summary.endTime || prev.endTime,
                        totalHours: summary.totalHours || prev.totalHours
                      }));
                    }}
                    defaultStartTime={formData.startTime || '18:00'}
                    defaultEndTime={formData.endTime || '20:00'}
                    category={formData.category}
                  />
                </div>

                {/* Carga Horária e Total de Vagas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t("adminPage.totalHours", "Carga Horária (h)")}
                    </label>
                    <input
                      type="number"
                      name="totalHours"
                      placeholder="Calculado automaticamente"
                      value={formData.totalHours}
                      onChange={handleChange}
                      min="0"
                      className="w-full bg-[#141414] border border-[#333333] text-accent font-mono font-bold px-3 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t("adminPage.totalSpots", "Total de Vagas")}
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

                {/* Texto Visível de Datas / Horários no Idioma Ativo */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF]">
                      {t("adminPage.scheduleText")} ({activeLangTab.toUpperCase()})
                    </label>
                    {formData.sessions && formData.sessions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const ptText = generateScheduleSummary(formData.sessions, 'pt');
                          const enText = generateScheduleSummary(formData.sessions, 'en');
                          const noText = generateScheduleSummary(formData.sessions, 'no');
                          setFormData(prev => ({
                            ...prev,
                            scheduleDetails_pt: ptText,
                            scheduleDetails_en: enText,
                            scheduleDetails_no: noText
                          }));
                        }}
                        className="text-[10px] font-heading uppercase tracking-wider text-accent hover:text-white transition-colors flex items-center gap-1 bg-accent/10 px-2 py-0.5 rounded border border-accent/30"
                        title={t("adminPage.autoGenerateSchedule", "Gerar Resumo da Programação")}
                      >
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span>{t("adminPage.autoGenerateSchedule", "Gerar Resumo da Programação")}</span>
                      </button>
                    )}
                  </div>
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
                  <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
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

                {/* Endereço Completo (Usado para o Google Maps) */}
                <div>
                  <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                    {t("adminPage.address", "Endereço Completo (Para Google Maps)")}
                  </label>
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address || ''} 
                    onChange={handleChange} 
                    placeholder="Ex: Storgata 12, 0155 Oslo, Norway" 
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

          {/* Coluna 2: Lista de Eventos */}
          <div className="xl:col-span-7 2xl:col-span-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="font-heading text-xl text-[#F0EDE8]">{t("adminPage.activeAgenda")}</h2>

              {/* Abas: Próximos & Ativos vs Encerrados / Histórico */}
              <div className="flex items-center gap-1.5 p-1 bg-[#121214] border border-[#222222] rounded-[2px] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setAdminTab('upcoming')}
                  className={`px-3 py-1.5 rounded-[2px] font-heading text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
                    adminTab === 'upcoming' 
                      ? 'bg-accent text-primary font-semibold shadow' 
                      : 'text-[#9A9A9A] hover:text-[#F0EDE8]'
                  }`}
                >
                  <span>{t("adminPage.tabUpcoming", "Próximos & Ativos")}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    adminTab === 'upcoming' ? 'bg-primary/20 text-primary font-bold' : 'bg-[#222222] text-[#CFCFCF]'
                  }`}>
                    {events.filter(e => !isEventPast(e)).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab('past')}
                  className={`px-3 py-1.5 rounded-[2px] font-heading text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
                    adminTab === 'past' 
                      ? 'bg-accent text-primary font-semibold shadow' 
                      : 'text-[#9A9A9A] hover:text-[#F0EDE8]'
                  }`}
                >
                  <span>{t("adminPage.tabPast", "Passados / Histórico")}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    adminTab === 'past' ? 'bg-primary/20 text-primary font-bold' : 'bg-[#222222] text-[#CFCFCF]'
                  }`}>
                    {events.filter(e => isEventPast(e)).length}
                  </span>
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-[#9A9A9A] font-heading">{t("adminPage.loading", "Carregando...")}</p>
            ) : (() => {
              const upcomingEvents = events.filter(e => !isEventPast(e));
              const pastEvents = events.filter(e => isEventPast(e));
              const displayedEvents = adminTab === 'past' ? pastEvents : upcomingEvents;

              if (displayedEvents.length === 0) {
                return (
                  <div className="p-8 border border-[#222222] bg-[#0a0a0a] rounded-[2px] text-center text-[#9A9A9A] font-heading">
                    {adminTab === 'past' 
                      ? t("adminPage.emptyPast", "Nenhum evento encerrado no histórico.") 
                      : t("adminPage.emptyUpcoming", "Nenhum evento ativo ou futuro no momento.")}
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {displayedEvents.map(event => {
                    const { title: dispTitle, scheduleDetails: dispSchedule, location: dispLocation } = getLocalizedEvent(event, i18n.language);
                    const cat = getEventCategory(event);
                    const dateStr = formatEventDate(event.startDate, event.endDate);
                    const isPast = isEventPast(event);
                    const isOngoing = isEventOngoing(event);
                    const spotsLeft = (event.totalSpots || 0) - (event.enrolledCount || 0);

                    return (
                      <div 
                        key={event.id} 
                        className={`p-6 border rounded-[2px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors ${
                          isPast 
                            ? 'border-[#222222] bg-[#08080a] opacity-85 hover:opacity-100' 
                            : 'border-[#222222] bg-[#0a0a0a]'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className={`text-[9px] uppercase tracking-[2px] font-bold px-2 py-0.5 rounded-[2px] ${getCategoryTheme(cat).badgeBg}`}>
                              {getCategoryTheme(cat).label}
                            </span>

                            {Array.isArray(event.sessions) && event.sessions.length > 1 && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#9A9A9A] border border-white/5">
                                {event.sessions.length} {t("adminPage.sessionsCount", "encontros")}
                              </span>
                            )}

                            {/* Status Badge */}
                            {isPast && (
                              <span className="text-[9px] uppercase tracking-[1px] font-mono px-2 py-0.5 rounded-[2px] bg-red-950/40 text-red-400 border border-red-800/30">
                                {t("adminPage.statusPast", "Encerrado")}
                              </span>
                            )}
                            {isOngoing && !isPast && (
                              <span className="text-[9px] uppercase tracking-[1px] font-mono px-2 py-0.5 rounded-[2px] bg-amber-950/40 text-amber-400 border border-amber-800/30">
                                {t("adminPage.statusOngoing", "Em Andamento")}
                              </span>
                            )}
                            
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

                          <h3 className={`font-drama text-2xl mb-2 ${isPast ? 'text-[#D0D0D4]' : 'text-accent'}`}>{dispTitle}</h3>
                          
                          <div className="font-heading text-xs text-[#9A9A9A] space-y-1">
                            <div className="flex items-center gap-1.5">
                              <strong className="text-[#CFCFCF]">{t("adminPage.eventDates", "Período")}:</strong> 
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
                            <a 
                              href={generateInstructorCalendarUrl(event, i18n.language, event.instructorEmail)}
                              target="_blank" 
                              rel="noopener noreferrer"
                              title={t("adminPage.addToInstructorCalendar", "Adicionar à Agenda do Instrutor (Google Calendar)")}
                              aria-label={t("adminPage.addToInstructorCalendar", "Adicionar à Agenda do Instrutor")}
                              className="p-2.5 rounded-[2px] bg-[#1a1a1a] hover:bg-accent hover:text-primary text-[#9A9A9A] transition-colors flex items-center justify-center"
                            >
                              <CalendarPlus className="w-4 h-4" />
                            </a>

                            <button 
                              type="button"
                              onClick={() => downloadEventIcs(event, i18n.language)}
                              title={t("agendaPage.downloadIcs", "Baixar arquivo (.ics) de todos os encontros")}
                              aria-label="Download .ics"
                              className="p-2.5 rounded-[2px] bg-[#1a1a1a] hover:bg-accent hover:text-primary text-[#9A9A9A] transition-colors flex items-center justify-center cursor-pointer"
                            >
                              <Download className="w-4 h-4" />
                            </button>

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
              );
            })()}
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
