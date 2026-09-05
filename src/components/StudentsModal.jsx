import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, doc, runTransaction, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import { 
  X, Copy, Check, Download, UserCheck, Trash2, Phone, HeartPulse, 
  Mail, Calendar, CalendarPlus, MapPin, Sparkles, Cake, List, LayoutGrid 
} from 'lucide-react';
import { generateInstructorCalendarUrl } from '../utils/eventHelpers';

// Helper para formatar a data de nascimento e calcular a idade
function formatBirthDateAndAge(birthDateStr, yearsOldLabel = 'anos') {
  if (!birthDateStr) return null;

  let year, month, day;
  let formattedDate = birthDateStr;

  if (birthDateStr.includes('-')) {
    const parts = birthDateStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        [year, month, day] = parts.map(Number);
        formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
      } else {
        // DD-MM-YYYY
        [day, month, year] = parts.map(Number);
        formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
      }
    }
  } else if (birthDateStr.includes('/')) {
    const parts = birthDateStr.split('/');
    if (parts.length === 3) {
      [day, month, year] = parts.map(Number);
      formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }
  }

  if (!year || !month || !day) {
    const d = new Date(birthDateStr);
    if (!isNaN(d.getTime())) {
      year = d.getFullYear();
      month = d.getMonth() + 1;
      day = d.getDate();
      formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }
  }

  if (year && month && day) {
    const today = new Date();
    let age = today.getFullYear() - year;
    const m = (today.getMonth() + 1) - month;
    if (m < 0 || (m === 0 && today.getDate() < day)) {
      age--;
    }
    if (age >= 0 && age < 130) {
      return {
        formattedDate,
        age,
        display: `${formattedDate} (${age} ${yearsOldLabel})`
      };
    }
  }

  return {
    formattedDate,
    age: null,
    display: formattedDate
  };
}

export default function StudentsModal({ event, onClose, onEventUpdated }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('enrolled'); // 'enrolled' or 'waitlist'
  const [viewMode, setViewMode] = useState('simple'); // 'simple' or 'complete'
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    async function fetchEnrollments() {
      if (!event?.id) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'enrollments'),
          where('eventId', '==', event.id)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Busca perfis dos usuários na coleção 'users' para garantir que os dados estejam 100% completos e atualizados
        const uniqueUserIds = [...new Set(list.map(e => e.userId).filter(Boolean))];
        const userProfiles = {};
        await Promise.all(
          uniqueUserIds.map(async (uid) => {
            try {
              const uDoc = await getDoc(doc(db, 'users', uid));
              if (uDoc.exists()) {
                userProfiles[uid] = uDoc.data();
              }
            } catch (err) {
              console.error("Erro ao buscar perfil do aluno:", uid, err);
            }
          })
        );

        // Mescla dados cadastrais mais recentes
        const enrichedList = list.map(e => {
          const prof = userProfiles[e.userId] || {};
          return {
            ...e,
            userName: e.userName || prof.fullName || prof.nome || 'Aluno sem nome',
            userEmail: e.userEmail || prof.email || '',
            userPhone: e.userPhone || prof.phone || prof.telefone || '',
            userBirthDate: e.userBirthDate || prof.birthDate || '',
            userAddress: e.userAddress || prof.address || prof.endereco || '',
            userNeighborhood: e.userNeighborhood || prof.neighborhood || prof.bairro || '',
            userCity: e.userCity || prof.city || prof.cidade || '',
            userZip: e.userZip || prof.zip || prof.cep || '',
            userCountry: e.userCountry || prof.country || prof.pais || '',
            userExperience: e.userExperience || prof.experiencia || '',
            userRestrictions: e.userRestrictions || prof.restricoes || ''
          };
        });

        // Ordena por data de criação
        enrichedList.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        setEnrollments(enrichedList);
      } catch (err) {
        console.error("Erro ao carregar alunos:", err);
      }
      setLoading(false);
    }
    fetchEnrollments();
  }, [event]);

  const enrolledStudents = enrollments.filter(e => e.status === 'enrolled');
  const waitlistStudents = enrollments.filter(e => e.status === 'waitlist');
  const currentList = activeTab === 'enrolled' ? enrolledStudents : waitlistStudents;

  // 1. Copiar e-mails
  function handleCopyEmails() {
    const emails = currentList.map(e => e.userEmail).filter(Boolean).join(', ');
    if (!emails) return;
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  // 2. Exportar CSV
  function handleExportCsv() {
    if (currentList.length === 0) {
      alert(t("adminPage.studentsModal.noStudentsToExport", "Não há alunos na lista atual para exportar."));
      return;
    }

    const yearsLabel = t("adminPage.studentsModal.yearsOld", "anos");
    let headers = [];
    let rows = [];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const clean = String(val).replace(/"/g, '""');
      return `"${clean}"`;
    };

    if (viewMode === 'complete') {
      headers = [
        "#", 
        "Nome", 
        "Status", 
        "Data de Nascimento", 
        "Idade", 
        "Email", 
        "Telefone", 
        "Endereco", 
        "Bairro", 
        "Cidade", 
        "CEP", 
        "Pais", 
        "Experiencia Previa", 
        "Restricoes de Saude", 
        "Data de Inscricao"
      ];

      rows = currentList.map((e, idx) => {
        const birthInfo = formatBirthDateAndAge(e.userBirthDate, yearsLabel);
        return [
          idx + 1,
          escapeCsv(e.userName || ''),
          escapeCsv(e.status === 'enrolled' ? 'Inscrito' : 'Espera'),
          escapeCsv(birthInfo?.formattedDate || ''),
          birthInfo?.age !== null && birthInfo?.age !== undefined ? birthInfo.age : '',
          escapeCsv(e.userEmail || ''),
          escapeCsv(e.userPhone || ''),
          escapeCsv(e.userAddress || ''),
          escapeCsv(e.userNeighborhood || ''),
          escapeCsv(e.userCity || ''),
          escapeCsv(e.userZip || ''),
          escapeCsv(e.userCountry || ''),
          escapeCsv(e.userExperience || 'Nenhuma'),
          escapeCsv(e.userRestrictions || 'Nenhuma'),
          escapeCsv(e.createdAt ? new Date(e.createdAt).toLocaleString() : '')
        ];
      });
    } else {
      headers = ["#", "Nome", "Email", "Telefone", "Status", "Data de Inscricao", "Restricoes de Saude"];
      rows = currentList.map((e, idx) => [
        idx + 1,
        escapeCsv(e.userName || ''),
        escapeCsv(e.userEmail || ''),
        escapeCsv(e.userPhone || ''),
        escapeCsv(e.status === 'enrolled' ? 'Inscrito' : 'Espera'),
        escapeCsv(e.createdAt ? new Date(e.createdAt).toLocaleString() : ''),
        escapeCsv(e.userRestrictions || 'Nenhuma')
      ]);
    }

    // Configura o separador e o conteúdo com sep=, para compatibilidade universal
    const csvContent = "sep=,\r\n" + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

    // UTF-8 BOM (\uFEFF) para garantir suporte correto a acentos no Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const eventName = event.title_pt || event.title_en || event.title_no || event.title || 'workshop';
    const safeTitle = eventName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_');

    const filename = `alunos_${safeTitle}_${activeTab}_${viewMode}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  }

  // 3. Promover da espera para inscrito
  async function handlePromote(enrollmentId) {
    if (!window.confirm(t("adminPage.studentsModal.confirmPromote", "Mover este aluno da lista de espera para os inscritos?"))) return;

    setActionLoading(enrollmentId);
    try {
      const eventRef = doc(db, 'events', event.id);
      const enrollRef = doc(db, 'enrollments', enrollmentId);

      await runTransaction(db, async (transaction) => {
        const evDoc = await transaction.get(eventRef);
        if (!evDoc.exists()) throw new Error("Evento não encontrado");
        const evData = evDoc.data();

        transaction.update(enrollRef, { status: 'enrolled' });
        transaction.update(eventRef, {
          enrolledCount: (evData.enrolledCount || 0) + 1,
          waitlistCount: Math.max(0, (evData.waitlistCount || 0) - 1)
        });
      });

      setEnrollments(prev => prev.map(e => e.id === enrollmentId ? { ...e, status: 'enrolled' } : e));
      if (onEventUpdated) onEventUpdated();
    } catch (err) {
      alert("Erro ao promover aluno: " + err.message);
    }
    setActionLoading(null);
  }

  // 4. Remover inscrição
  async function handleRemove(enrollmentId, currentStatus) {
    if (!window.confirm(t("adminPage.studentsModal.confirmRemove", "Tem certeza que deseja remover este aluno?"))) return;

    setActionLoading(enrollmentId);
    try {
      const eventRef = doc(db, 'events', event.id);
      const enrollRef = doc(db, 'enrollments', enrollmentId);

      await runTransaction(db, async (transaction) => {
        const evDoc = await transaction.get(eventRef);
        if (!evDoc.exists()) throw new Error("Evento não encontrado");
        const evData = evDoc.data();

        transaction.delete(enrollRef);
        if (currentStatus === 'enrolled') {
          transaction.update(eventRef, { enrolledCount: Math.max(0, (evData.enrolledCount || 0) - 1) });
        } else {
          transaction.update(eventRef, { waitlistCount: Math.max(0, (evData.waitlistCount || 0) - 1) });
        }
      });

      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      if (onEventUpdated) onEventUpdated();
    } catch (err) {
      alert("Erro ao remover: " + err.message);
    }
    setActionLoading(null);
  }

  const occupancyPercent = Math.min(100, Math.round(((enrolledStudents.length) / (event.totalSpots || 1)) * 100));
  const yearsLabel = t("adminPage.studentsModal.yearsOld", "anos");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose} 
      />

      {/* Modal Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-[#0e0e11] border border-[#2A2A35] w-full max-w-5xl max-h-[92vh] rounded-[4px] shadow-2xl flex flex-col z-10 overflow-hidden relative"
      >
        {/* Header do Modal */}
        <div className="p-6 md:p-8 border-b border-[#1A1A24] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] uppercase tracking-[2px] font-bold px-2 py-0.5 rounded-[2px] bg-accent/10 text-accent border border-accent/20">
                {event.category === 'biostretch' ? 'BIOSTRETCH' : 'BE THE DANCE'}
              </span>
              {event.instructor && (
                <span className="text-xs font-heading text-[#9A9A9A]">
                  Instrutor: <strong className="text-[#F0EDE8]">{event.instructor}</strong>
                </span>
              )}
            </div>
            <h2 className="font-drama text-2xl md:text-3xl text-[#F0EDE8]">
              {event.title_no || event.title_en || event.title_pt || event.title}
            </h2>
            <p className="font-heading text-xs text-[#9A9A9A] mt-1">
              {event.startDate ? event.startDate.split('-').reverse().join('/') : ''} 
              {event.startTime && ` • ${event.startTime} - ${event.endTime || ''}`}
              {event.totalHours ? ` (${event.totalHours}h)` : ''}
              {event.location ? ` | ${event.location}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={generateInstructorCalendarUrl(event, 'en', event.instructorEmail)}
              target="_blank" 
              rel="noopener noreferrer"
              title={t("adminPage.addToInstructorCalendar", "Adicionar à Agenda do Instrutor (Google Calendar)")}
              className="px-3 py-1.5 border border-[#333333] hover:border-accent text-[#CFCFCF] hover:text-accent font-heading text-xs rounded-[2px] transition-colors flex items-center gap-1.5"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-accent" />
              <span className="hidden sm:inline">Google Calendar</span>
            </a>
            <button 
              onClick={onClose}
              className="p-2 text-[#9A9A9A] hover:text-[#F0EDE8] rounded-[2px] hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Ocupação */}
        <div className="px-6 md:px-8 py-3 bg-[#131317] border-b border-[#1A1A24] flex items-center justify-between text-xs font-heading">
          <div className="flex items-center gap-4">
            <span className="text-[#CFCFCF]">
              {t("adminPage.studentsModal.enrolledTab", "Inscritos")}: <strong className="text-accent">{enrolledStudents.length} / {event.totalSpots}</strong>
            </span>
            <span className="text-[#7A7A7A]">|</span>
            <span className="text-[#CFCFCF]">
              {t("adminPage.studentsModal.waitlistTab", "Espera")}: <strong className="text-yellow-400">{waitlistStudents.length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 w-48">
            <div className="w-full bg-[#22222a] h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${occupancyPercent >= 100 ? 'bg-yellow-500' : 'bg-accent'}`} 
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#9A9A9A] shrink-0 font-mono">{occupancyPercent}%</span>
          </div>
        </div>

        {/* Barra de Abas, Alternância de Visualização e Ferramentas */}
        <div className="px-6 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#1A1A24]">
          {/* Abas Inscritos / Espera */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`px-4 py-2 font-heading text-xs uppercase tracking-wider font-semibold rounded-[2px] transition-colors ${activeTab === 'enrolled' ? 'bg-accent text-primary' : 'bg-transparent text-[#9A9A9A] hover:text-[#F0EDE8]'}`}
            >
              {t("adminPage.studentsModal.enrolledTab", "Inscritos")} ({enrolledStudents.length})
            </button>
            <button
              onClick={() => setActiveTab('waitlist')}
              className={`px-4 py-2 font-heading text-xs uppercase tracking-wider font-semibold rounded-[2px] transition-colors ${activeTab === 'waitlist' ? 'bg-accent text-primary' : 'bg-transparent text-[#9A9A9A] hover:text-[#F0EDE8]'}`}
            >
              {t("adminPage.studentsModal.waitlistTab", "Lista de Espera")} ({waitlistStudents.length})
            </button>
          </div>

          {/* Seletor de Modo de Visualização: Simplificada vs Completa */}
          <div className="flex items-center bg-[#141418] p-1 border border-[#262633] rounded-[4px]">
            <button
              onClick={() => setViewMode('simple')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-medium rounded-[2px] transition-all ${
                viewMode === 'simple'
                  ? 'bg-accent text-primary font-semibold shadow-sm'
                  : 'text-[#9A9A9A] hover:text-[#F0EDE8]'
              }`}
              title={t("adminPage.studentsModal.simpleView", "Visualização Simplificada")}
            >
              <List className="w-3.5 h-3.5" />
              <span>{t("adminPage.studentsModal.simpleView", "Simplificada")}</span>
            </button>

            <button
              onClick={() => setViewMode('complete')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-medium rounded-[2px] transition-all ${
                viewMode === 'complete'
                  ? 'bg-accent text-primary font-semibold shadow-sm'
                  : 'text-[#9A9A9A] hover:text-[#F0EDE8]'
              }`}
              title={t("adminPage.studentsModal.completeView", "Visualização Completa (Todos os dados cadastrais)")}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t("adminPage.studentsModal.completeView", "Completa")}</span>
            </button>
          </div>

          {/* Botões Utilitários */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEmails}
              disabled={currentList.length === 0}
              className="px-3 py-1.5 border border-[#333333] hover:border-accent text-[#CFCFCF] hover:text-accent font-heading text-xs rounded-[2px] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              title="Copiar e-mails dos alunos listados"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t("adminPage.studentsModal.emailsCopied", "Copiados!") : t("adminPage.studentsModal.copyEmails", "Copiar E-mails")}</span>
            </button>

            <button
              onClick={handleExportCsv}
              disabled={currentList.length === 0}
              className="px-3 py-1.5 border border-[#333333] hover:border-accent text-[#CFCFCF] hover:text-accent font-heading text-xs rounded-[2px] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              title="Baixar lista em formato CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{viewMode === 'complete' ? t("adminPage.studentsModal.exportCompleteCsv", "Exportar Completo (CSV)") : t("adminPage.studentsModal.exportCsv", "Exportar CSV")}</span>
            </button>
          </div>
        </div>

        {/* Conteúdo da Lista de Alunos */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 divide-y divide-[#1A1A24]">
          {loading ? (
            <div className="py-12 text-center text-accent font-heading text-sm animate-pulse tracking-widest">
              Carregando lista de alunos...
            </div>
          ) : currentList.length === 0 ? (
            <div className="py-16 text-center text-[#7A7A7A] font-heading text-sm">
              {activeTab === 'enrolled' 
                ? t("adminPage.studentsModal.noEnrolled", "Nenhum aluno inscrito ainda neste workshop.")
                : t("adminPage.studentsModal.noWaitlist", "Ninguém na lista de espera no momento.")}
            </div>
          ) : viewMode === 'simple' ? (
            /* ================= VISUALIZAÇÃO SIMPLIFICADA ================= */
            currentList.map((student, idx) => {
              const enrolledDate = student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-';

              return (
                <div key={student.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-sm text-[#7A7A7A] w-6 shrink-0 mt-0.5">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-heading font-semibold text-[#F0EDE8] text-base">
                        {student.userName || 'Aluno sem nome'}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#9A9A9A] font-heading">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-accent/70" />
                          <a href={`mailto:${student.userEmail}`} className="hover:text-accent transition-colors">
                            {student.userEmail}
                          </a>
                        </span>
                        {student.userPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-accent/70" />
                            <a href={`tel:${student.userPhone}`} className="hover:text-accent transition-colors">
                              {student.userPhone}
                            </a>
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[#7A7A7A]">
                          <Calendar className="w-3 h-3" />
                          {enrolledDate}
                        </span>
                      </div>

                      {/* Restrições corporais / Observações de Saúde */}
                      {student.userRestrictions && (
                        <div className="mt-2 inline-flex items-start gap-1.5 px-2.5 py-1 rounded bg-red-950/30 border border-red-900/40 text-red-300 text-xs">
                          <HeartPulse className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-400" />
                          <span><strong>Atenção:</strong> {student.userRestrictions}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações por Aluno */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {student.status === 'waitlist' && (
                      <button
                        onClick={() => handlePromote(student.id)}
                        disabled={actionLoading === student.id}
                        className="px-3 py-1.5 bg-accent text-primary hover:bg-[#F0EDE8] font-heading text-[11px] uppercase tracking-wider font-bold rounded-[2px] transition-colors flex items-center gap-1"
                        title={t("adminPage.studentsModal.promote", "Promover para Inscrito")}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{t("adminPage.studentsModal.promote", "Promover")}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleRemove(student.id, student.status)}
                      disabled={actionLoading === student.id}
                      className="p-2 rounded-[2px] text-[#7A7A7A] hover:text-red-400 hover:bg-red-950/20 transition-colors"
                      title={t("adminPage.studentsModal.remove", "Remover do Evento")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            /* ================= VISUALIZAÇÃO COMPLETA (TODOS OS CAMPOS) ================= */
            currentList.map((student, idx) => {
              const enrolledDate = student.createdAt ? new Date(student.createdAt).toLocaleString() : '-';
              const birthInfo = formatBirthDateAndAge(student.userBirthDate, yearsLabel);

              const fullAddress = [
                student.userAddress,
                student.userNeighborhood,
                student.userCity,
                student.userZip,
                student.userCountry
              ].filter(Boolean).join(', ');

              return (
                <div key={student.id} className="py-6 first:pt-2">
                  <div className="bg-[#121217] border border-[#22222e] rounded-[4px] p-5 md:p-6 transition-all hover:border-accent/30 shadow-lg">
                    {/* Top Row: Nome, Status e Ações */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E1E28]">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs flex items-center justify-center font-bold">
                          #{idx + 1}
                        </span>
                        <div>
                          <h4 className="font-heading font-semibold text-[#F0EDE8] text-lg leading-tight">
                            {student.userName || 'Aluno sem nome'}
                          </h4>
                          <span className="text-[11px] font-heading text-[#7A7A7A]">
                            Inscrito em: {enrolledDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className={`text-[10px] font-heading uppercase tracking-wider font-bold px-2.5 py-1 rounded-[2px] border ${
                          student.status === 'enrolled'
                            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/30'
                            : 'bg-yellow-950/30 text-yellow-400 border-yellow-800/30'
                        }`}>
                          {student.status === 'enrolled' 
                            ? t("adminPage.studentsModal.enrolledTab", "Inscrito") 
                            : t("adminPage.studentsModal.waitlistTab", "Espera")}
                        </span>

                        {student.status === 'waitlist' && (
                          <button
                            onClick={() => handlePromote(student.id)}
                            disabled={actionLoading === student.id}
                            className="px-3 py-1 bg-accent text-primary hover:bg-[#F0EDE8] font-heading text-[11px] uppercase tracking-wider font-bold rounded-[2px] transition-colors flex items-center gap-1"
                            title={t("adminPage.studentsModal.promote", "Promover para Inscrito")}
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>{t("adminPage.studentsModal.promote", "Promover")}</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleRemove(student.id, student.status)}
                          disabled={actionLoading === student.id}
                          className="p-1.5 rounded-[2px] text-[#7A7A7A] hover:text-red-400 hover:bg-red-950/20 transition-colors"
                          title={t("adminPage.studentsModal.remove", "Remover do Evento")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Grid com Todos os Campos do Cadastro */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-xs font-heading">
                      {/* Data de Nascimento com Idade Calculada */}
                      <div className="p-3 bg-[#0d0d12] border border-[#1c1c24] rounded-[2px]">
                        <span className="text-[10px] uppercase tracking-[1.5px] text-[#7A7A7A] block mb-1 font-semibold flex items-center gap-1.5">
                          <Cake className="w-3.5 h-3.5 text-accent" />
                          {t("adminPage.studentsModal.birthDateAndAge", "Nascimento / Idade")}
                        </span>
                        <div className="text-[#F0EDE8] font-medium">
                          {birthInfo ? (
                            <span>
                              {birthInfo.display}
                            </span>
                          ) : (
                            <span className="text-[#555555] italic">
                              {t("adminPage.studentsModal.notInformed", "Não informado")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* E-mail */}
                      <div className="p-3 bg-[#0d0d12] border border-[#1c1c24] rounded-[2px]">
                        <span className="text-[10px] uppercase tracking-[1.5px] text-[#7A7A7A] block mb-1 font-semibold flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-accent" />
                          E-mail
                        </span>
                        <a href={`mailto:${student.userEmail}`} className="text-[#F0EDE8] hover:text-accent transition-colors truncate block">
                          {student.userEmail || '-'}
                        </a>
                      </div>

                      {/* Telefone / WhatsApp */}
                      <div className="p-3 bg-[#0d0d12] border border-[#1c1c24] rounded-[2px]">
                        <span className="text-[10px] uppercase tracking-[1.5px] text-[#7A7A7A] block mb-1 font-semibold flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-accent" />
                          Telefone / WhatsApp
                        </span>
                        {student.userPhone ? (
                          <a href={`tel:${student.userPhone}`} className="text-[#F0EDE8] hover:text-accent transition-colors">
                            {student.userPhone}
                          </a>
                        ) : (
                          <span className="text-[#555555] italic">{t("adminPage.studentsModal.notInformed", "Não informado")}</span>
                        )}
                      </div>

                      {/* Endereço Completo */}
                      <div className="p-3 bg-[#0d0d12] border border-[#1c1c24] rounded-[2px] md:col-span-2 lg:col-span-3">
                        <span className="text-[10px] uppercase tracking-[1.5px] text-[#7A7A7A] block mb-1 font-semibold flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-accent" />
                          {t("adminPage.studentsModal.address", "Endereço Completo")}
                        </span>
                        <p className="text-[#F0EDE8] leading-relaxed">
                          {fullAddress || <span className="text-[#555555] italic">{t("adminPage.studentsModal.notInformed", "Não informado")}</span>}
                        </p>
                      </div>

                      {/* Experiência Prévia */}
                      <div className="p-3 bg-[#0d0d12] border border-[#1c1c24] rounded-[2px] md:col-span-2 lg:col-span-3">
                        <span className="text-[10px] uppercase tracking-[1.5px] text-[#7A7A7A] block mb-1 font-semibold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-accent" />
                          {t("adminPage.studentsModal.experience", "Experiência prévia com dança ou trabalho corporal")}
                        </span>
                        <p className="text-[#CFCFCF] font-light leading-relaxed whitespace-pre-line">
                          {student.userExperience || <span className="text-[#555555] italic">{t("adminPage.studentsModal.none", "Nenhuma informada")}</span>}
                        </p>
                      </div>

                      {/* Restrições de Saúde / Físicas */}
                      <div className={`p-3 rounded-[2px] md:col-span-2 lg:col-span-3 border ${
                        student.userRestrictions 
                          ? 'bg-red-950/20 border-red-900/40 text-red-200' 
                          : 'bg-[#0d0d12] border-[#1c1c24] text-[#CFCFCF]'
                      }`}>
                        <span className="text-[10px] uppercase tracking-[1.5px] text-[#7A7A7A] block mb-1 font-semibold flex items-center gap-1.5">
                          <HeartPulse className={`w-3.5 h-3.5 ${student.userRestrictions ? 'text-red-400' : 'text-accent'}`} />
                          {t("adminPage.studentsModal.restrictions", "Restrições físicas ou de saúde")}
                        </span>
                        <p className="font-light leading-relaxed whitespace-pre-line">
                          {student.userRestrictions || <span className="text-[#555555] italic">{t("adminPage.studentsModal.none", "Nenhuma")}</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
