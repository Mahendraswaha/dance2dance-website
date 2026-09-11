import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, doc, runTransaction, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  X, Copy, Check, Download, UserCheck, Trash2, Phone, HeartPulse, 
  Mail, Calendar, CalendarPlus, MapPin, Sparkles, Cake, List, LayoutGrid,
  Star, Save, CheckCircle2, ChevronDown, ChevronUp, Lock
} from 'lucide-react';
import { generateInstructorCalendarUrl, formatEventDate, getLocalizedEvent } from '../utils/eventHelpers';

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

// Subcomponente elegante para Avaliação e Anotações Internas de CRM por Aluno
function StudentCrmCard({ student, currentUser, onSave, isSaving, isSavedSuccess }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(student.evaluation?.rating || 0);
  const [notes, setNotes] = useState(student.evaluation?.notes || '');
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setRating(student.evaluation?.rating || 0);
    setNotes(student.evaluation?.notes || '');
  }, [student.evaluation]);

  const hasChanges = 
    (student.evaluation?.rating || 0) !== rating || 
    (student.evaluation?.notes || '') !== notes;

  const ratingDescriptions = {
    1: t("adminPage.studentsModal.rating1", "1★ Iniciante / Básico"),
    2: t("adminPage.studentsModal.rating2", "2★ Em Desenvolvimento"),
    3: t("adminPage.studentsModal.rating3", "3★ Bom Desempenho"),
    4: t("adminPage.studentsModal.rating4", "4★ Excelente Evolução"),
    5: t("adminPage.studentsModal.rating5", "5★ Excepcional / Destaque"),
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="bg-[#0B0B0F] border border-[#232330] rounded-[3px] p-4 text-xs font-heading">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#1A1A24]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center">
            <Star className="w-3 h-3 fill-accent text-accent" />
          </div>
          <span className="font-semibold text-[#F0EDE8] uppercase tracking-wider text-[11px]">
            {t("adminPage.studentsModal.crmTitle", "CRM • Avaliação e Acompanhamento")}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
            <Lock className="w-2.5 h-2.5 text-zinc-400" />
            {t("adminPage.studentsModal.internalOnly", "Interno • O aluno não vê")}
          </span>
        </div>

        {student.evaluation?.updatedAt && (
          <span className="text-[10px] text-[#7A7A7A] italic">
            {t("adminPage.studentsModal.lastUpdated", "Salvo em")} {new Date(student.evaluation.updatedAt).toLocaleDateString()}
            {student.evaluation.instructorName ? ` • ${student.evaluation.instructorName}` : ''}
          </span>
        )}
      </div>

      {/* Avaliação por Estrelas */}
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-[#9A9A9A] text-[11px] mr-1">
            {t("adminPage.studentsModal.ratingLabel", "Nível / Avaliação:")}
          </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(prev => (prev === star ? 0 : star))}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 text-zinc-600 hover:scale-110 transition-transform focus:outline-none"
              title={`${star} estrelas`}
            >
              <Star
                className={`w-4 h-4 transition-colors ${
                  star <= activeRating
                    ? 'fill-accent text-accent'
                    : 'text-zinc-600'
                }`}
              />
            </button>
          ))}
        </div>

        {activeRating > 0 && (
          <span className="text-[11px] font-mono text-accent font-semibold">
            {ratingDescriptions[activeRating]}
          </span>
        )}
      </div>

      {/* Textarea de Observações e Jornada CRM */}
      <div className="mt-3">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder={t("adminPage.studentsModal.notesPlaceholder", "Anotações internas sobre participação, evolução do aluno, presença e recomendações para a jornada...")}
          className="w-full bg-[#121218] border border-[#262636] focus:border-accent rounded-[2px] p-2.5 text-xs text-[#F0EDE8] placeholder-[#555566] transition-colors focus:outline-none resize-y min-h-[58px]"
        />
      </div>

      {/* Barra de Ação */}
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-[10px] text-[#666677]">
          {hasChanges ? t("adminPage.studentsModal.unsavedChanges", "Alterações não salvas") : ""}
        </span>

        <button
          type="button"
          onClick={() => onSave(rating, notes)}
          disabled={isSaving || (!hasChanges && !isSavedSuccess)}
          className={`px-3 py-1.5 rounded-[2px] font-heading text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isSavedSuccess
              ? 'bg-green-600 text-white'
              : hasChanges
              ? 'bg-accent text-primary hover:bg-[#F0EDE8] shadow-md'
              : 'bg-[#1C1C24] text-[#A0A0B0] hover:bg-[#252532]'
          }`}
        >
          {isSaving ? (
            <>
              <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>{t("adminPage.studentsModal.saving", "Salvando...")}</span>
            </>
          ) : isSavedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t("adminPage.studentsModal.saved", "Avaliação Salva!")}</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>{t("adminPage.studentsModal.saveEvaluation", "Salvar Avaliação")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function StudentsModal({ event, isInstructor = false, onClose, onEventUpdated }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';
  const { currentUser } = useAuth();
  const userRole = currentUser?.profile?.role || 'student';
  const isInstructorUser = isInstructor || userRole === 'instructor';
  const { title: localizedTitle, location: localizedLocation } = getLocalizedEvent(event, currentLang);
  const [activeTab, setActiveTab] = useState('enrolled'); // 'enrolled' or 'waitlist'
  const [viewMode, setViewMode] = useState('simple'); // 'simple' or 'complete'
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [savingEvalId, setSavingEvalId] = useState(null);
  const [savedSuccessId, setSavedSuccessId] = useState(null);
  const [expandedCrm, setExpandedCrm] = useState({});

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

        // Mescla dados cadastrais mais recentes (blindando dados de contato contra acesso por instrutores)
        const enrichedList = list.map(e => {
          const prof = userProfiles[e.userId] || {};
          return {
            ...e,
            userName: prof.fullName || prof.nome || e.userName || 'Aluno sem nome',
            // Dados de contato protegidos: NUNCA carregados no estado do instrutor
            userEmail: isInstructorUser ? '' : (prof.email || e.userEmail || ''),
            userPhone: isInstructorUser ? '' : (prof.phone || prof.telefone || e.userPhone || ''),
            userAddress: isInstructorUser ? '' : (prof.address || prof.endereco || e.userAddress || ''),
            userNeighborhood: isInstructorUser ? '' : (prof.neighborhood || prof.bairro || e.userNeighborhood || ''),
            userCity: isInstructorUser ? '' : (prof.city || prof.cidade || e.userCity || ''),
            userZip: isInstructorUser ? '' : (prof.zip || prof.cep || e.userZip || ''),
            userCountry: isInstructorUser ? '' : (prof.country || prof.pais || e.userCountry || ''),
            // Dados pedagógicos e de saúde (essenciais para a condução segura do workshop)
            userBirthDate: prof.birthDate || prof.birthdate || prof.dataNascimento || prof.nascimento || e.userBirthDate || '',
            userExperience: prof.experiencia || prof.experience || e.userExperience || '',
            userRestrictions: prof.restricoes || prof.restrictions || e.userRestrictions || ''
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
  }, [event, isInstructorUser]);

  const enrolledStudents = enrollments.filter(e => e.status === 'enrolled');
  const waitlistStudents = enrollments.filter(e => e.status === 'waitlist');
  const currentList = activeTab === 'enrolled' ? enrolledStudents : waitlistStudents;

  // 1. Copiar e-mails (Apenas Administrador Geral)
  function handleCopyEmails() {
    if (isInstructorUser) return;
    const emails = currentList.map(e => e.userEmail).filter(Boolean).join(', ');
    if (!emails) return;
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  // 2. Exportar CSV (Respeita a privacidade: instrutor recebe apenas dados pedagógicos/CRM)
  function handleExportCsv() {
    if (currentList.length === 0) {
      alert(t("adminPage.studentsModal.noStudentsToExport", "Não há alunos na lista atual para exportar."));
      return;
    }

    const yearsLabel = t("adminPage.studentsModal.yearsOld", "anos");

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const clean = String(val)
        .replace(/"/g, '""')
        .replace(/\r\n/g, ' ')
        .replace(/[\r\n]/g, ' ')
        .trim();
      return `"${clean}"`;
    };

    // Cabeçalhos diferenciados por perfil
    const adminHeaders = [
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
      "Data de Inscricao",
      "CRM Nota (1-5)",
      "CRM Observacoes",
      "CRM Avaliador"
    ];

    const instructorHeaders = [
      "#", 
      "Nome", 
      "Status", 
      "Data de Nascimento", 
      "Idade", 
      "Experiencia Previa", 
      "Restricoes de Saude", 
      "Data de Inscricao",
      "CRM Nota (1-5)",
      "CRM Observacoes",
      "CRM Avaliador"
    ];

    const headers = isInstructorUser ? instructorHeaders : adminHeaders;

    const rows = currentList.map((e, idx) => {
      const birthInfo = formatBirthDateAndAge(e.userBirthDate, yearsLabel);

      if (isInstructorUser) {
        return [
          idx + 1,
          escapeCsv(e.userName || ''),
          escapeCsv(e.status === 'enrolled' ? 'Inscrito' : 'Espera'),
          escapeCsv(birthInfo?.formattedDate || e.userBirthDate || ''),
          birthInfo?.age !== null && birthInfo?.age !== undefined ? birthInfo.age : '',
          escapeCsv(e.userExperience || 'Nenhuma'),
          escapeCsv(e.userRestrictions || 'Nenhuma'),
          escapeCsv(e.createdAt ? new Date(e.createdAt).toLocaleString() : ''),
          e.evaluation?.rating || '',
          escapeCsv(e.evaluation?.notes || ''),
          escapeCsv(e.evaluation?.instructorName || '')
        ];
      }

      return [
        idx + 1,
        escapeCsv(e.userName || ''),
        escapeCsv(e.status === 'enrolled' ? 'Inscrito' : 'Espera'),
        escapeCsv(birthInfo?.formattedDate || e.userBirthDate || ''),
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
        escapeCsv(e.createdAt ? new Date(e.createdAt).toLocaleString() : ''),
        e.evaluation?.rating || '',
        escapeCsv(e.evaluation?.notes || ''),
        escapeCsv(e.evaluation?.instructorName || '')
      ];
    });

    // Configura o separador e o conteúdo com sep=, para compatibilidade universal
    const csvContent = "sep=,\r\n" + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

    // UTF-8 BOM (\uFEFF) para garantir suporte correto a acentos no Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const eventName = localizedTitle || event.title || 'workshop';
    const safeTitle = eventName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_');

    const filename = `alunos_${safeTitle}_${activeTab}.csv`;

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

  // Salvar Avaliação e Anotações de CRM do Aluno
  async function handleSaveEvaluation(studentId, rating, notes) {
    setSavingEvalId(studentId);
    try {
      const instructorName = currentUser?.displayName || currentUser?.profile?.nome || currentUser?.email || 'Instrutor';
      const evaluationData = {
        rating: Number(rating) || 0,
        notes: (notes || '').trim(),
        instructorName,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'enrollments', studentId), {
        evaluation: evaluationData
      });

      // Atualiza estado local imediatamente
      setEnrollments(prev => prev.map(e => e.id === studentId ? { ...e, evaluation: evaluationData } : e));
      setSavedSuccessId(studentId);
      setTimeout(() => setSavedSuccessId(null), 3000);
    } catch (err) {
      console.error("Erro ao salvar avaliação do CRM:", err);
      alert("Erro ao salvar avaliação: " + err.message);
    } finally {
      setSavingEvalId(null);
    }
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
                {event.category === 'biostretch' ? 'BIOSTRETCH' : event.category === 'kroppsskole' ? 'KROPPSSKOLE' : 'BE THE DANCE'}
              </span>
              {event.instructor && (
                <span className="text-xs font-heading text-[#9A9A9A]">
                  {t("adminPage.instructor", "Instrutor")}: <strong className="text-[#F0EDE8]">{event.instructor}</strong>
                </span>
              )}
            </div>
            <h2 className="font-drama text-2xl md:text-3xl text-[#F0EDE8]">
              {localizedTitle || event.title}
            </h2>
            <p className="font-heading text-xs text-[#9A9A9A] mt-1">
              {formatEventDate(event.startDate, event.endDate, currentLang)} 
              {event.startTime && ` • ${event.startTime} - ${event.endTime || ''}`}
              {event.totalHours ? ` (${event.totalHours}h)` : ''}
              {localizedLocation ? ` | ${localizedLocation}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={generateInstructorCalendarUrl(event, currentLang, event.instructorEmail)}
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
            {!isInstructorUser && (
              <button
                onClick={handleCopyEmails}
                disabled={currentList.length === 0}
                className="px-3 py-1.5 border border-[#333333] hover:border-accent text-[#CFCFCF] hover:text-accent font-heading text-xs rounded-[2px] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
                title="Copiar e-mails dos alunos listados"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t("adminPage.studentsModal.emailsCopied", "Copiados!") : t("adminPage.studentsModal.copyEmails", "Copiar E-mails")}</span>
              </button>
            )}

            <button
              onClick={handleExportCsv}
              disabled={currentList.length === 0}
              className="px-3 py-1.5 border border-[#333333] hover:border-accent text-[#CFCFCF] hover:text-accent font-heading text-xs rounded-[2px] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              title={isInstructorUser ? "Baixar lista de alunos com dados pedagógicos em CSV" : "Baixar lista completa com todos os dados cadastrais em formato CSV"}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t("adminPage.studentsModal.exportCsv", "Exportar CSV")}</span>
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
              const birthInfo = formatBirthDateAndAge(student.userBirthDate, yearsLabel);

              return (
                <div key={student.id} className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-sm text-[#7A7A7A] w-6 shrink-0 mt-0.5">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="font-heading font-semibold text-[#F0EDE8] text-base">
                          {student.userName || 'Aluno sem nome'}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#9A9A9A] font-heading">
                          {!isInstructorUser && student.userEmail && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-accent/70" />
                              <a href={`mailto:${student.userEmail}`} className="hover:text-accent transition-colors">
                                {student.userEmail}
                              </a>
                            </span>
                          )}
                          {!isInstructorUser && student.userPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-accent/70" />
                              <a href={`tel:${student.userPhone}`} className="hover:text-accent transition-colors">
                                {student.userPhone}
                              </a>
                            </span>
                          )}
                          {isInstructorUser && birthInfo && (
                            <span className="flex items-center gap-1 text-[#CFCFCF]">
                              <Cake className="w-3 h-3 text-accent/70" />
                              {birthInfo.display}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[#7A7A7A]">
                            <Calendar className="w-3 h-3" />
                            {enrolledDate}
                          </span>
                        </div>

                        {/* Exibição resumida de CRM se houver e não estiver expandido */}
                        {student.evaluation && !expandedCrm[student.id] && (
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                            {student.evaluation.rating > 0 && (
                              <span className="inline-flex items-center gap-1 text-accent font-mono font-bold bg-accent/10 px-2 py-0.5 rounded-[2px] border border-accent/20 text-[11px]">
                                <Star className="w-3 h-3 fill-accent text-accent" />
                                {student.evaluation.rating}/5
                              </span>
                            )}
                            {student.evaluation.notes && (
                              <span className="text-zinc-400 italic text-[11px] truncate max-w-[320px]">
                                "{student.evaluation.notes}"
                              </span>
                            )}
                          </div>
                        )}

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
                      {/* Botão de Toggle CRM */}
                      <button
                        type="button"
                        onClick={() => setExpandedCrm(prev => ({ ...prev, [student.id]: !prev[student.id] }))}
                        className={`px-2.5 py-1.5 text-xs font-heading rounded-[2px] border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          student.evaluation?.rating || student.evaluation?.notes
                            ? 'border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 font-semibold'
                            : 'border-[#2D2D3B] text-[#9A9A9A] hover:text-[#F0EDE8] hover:border-[#444455]'
                        }`}
                        title={t("adminPage.studentsModal.crmBtnTooltip", "Avaliação e Anotações Internas de CRM")}
                      >
                        <Star className={`w-3.5 h-3.5 ${student.evaluation?.rating ? 'fill-accent text-accent' : ''}`} />
                        <span>
                          {student.evaluation?.rating 
                            ? `${student.evaluation.rating}★ CRM` 
                            : t("adminPage.studentsModal.crmBtn", "CRM")}
                        </span>
                        {expandedCrm[student.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

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

                  {/* Painel Expansível de CRM */}
                  {expandedCrm[student.id] && (
                    <div className="mt-3 pl-0 sm:pl-10">
                      <StudentCrmCard
                        student={student}
                        currentUser={currentUser}
                        onSave={(rating, notes) => handleSaveEvaluation(student.id, rating, notes)}
                        isSaving={savingEvalId === student.id}
                        isSavedSuccess={savedSuccessId === student.id}
                      />
                    </div>
                  )}
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

                      {/* E-mail (Apenas Administrador) */}
                      {!isInstructorUser && (
                        <div className="p-3 bg-[#0d0d12] border border-[#1c1c24] rounded-[2px]">
                          <span className="text-[10px] uppercase tracking-[1.5px] text-[#7A7A7A] block mb-1 font-semibold flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-accent" />
                            E-mail
                          </span>
                          <a href={`mailto:${student.userEmail}`} className="text-[#F0EDE8] hover:text-accent transition-colors truncate block">
                            {student.userEmail || '-'}
                          </a>
                        </div>
                      )}

                      {/* Telefone / WhatsApp (Apenas Administrador) */}
                      {!isInstructorUser && (
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
                      )}

                      {/* Endereço Completo (Apenas Administrador) */}
                      {!isInstructorUser && (
                        <div className="p-3 bg-[#0d0d12] border border-[#1c1c24] rounded-[2px] md:col-span-2 lg:col-span-3">
                          <span className="text-[10px] uppercase tracking-[1.5px] text-[#7A7A7A] block mb-1 font-semibold flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            {t("adminPage.studentsModal.address", "Endereço Completo")}
                          </span>
                          <p className="text-[#F0EDE8] leading-relaxed">
                            {fullAddress || <span className="text-[#555555] italic">{t("adminPage.studentsModal.notInformed", "Não informado")}</span>}
                          </p>
                        </div>
                      )}

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

                    {/* CRM • Avaliação e Observações do Instrutor */}
                    <div className="mt-4 pt-4 border-t border-[#1E1E28]">
                      <StudentCrmCard
                        student={student}
                        currentUser={currentUser}
                        onSave={(rating, notes) => handleSaveEvaluation(student.id, rating, notes)}
                        isSaving={savingEvalId === student.id}
                        isSavedSuccess={savedSuccessId === student.id}
                      />
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
