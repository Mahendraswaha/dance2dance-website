import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { 
  X, Mail, Phone, Calendar, MapPin, HeartPulse, Sparkles, 
  Cake, CheckCircle2, Clock, MessageSquare, AlertTriangle, 
  Compass, ExternalLink, CalendarDays, Star, Shield, Award
} from 'lucide-react';
import { getCategoryTheme, formatEventDate, getLocalizedEvent, isEventPast } from '../../utils/eventHelpers';
import { toast } from 'sonner';

// Helper para calcular idade a partir da data de nascimento
function formatBirthDateAndAge(birthDateStr, yearsOldLabel = 'anos') {
  if (!birthDateStr) return null;

  let year, month, day;
  let formattedDate = birthDateStr;

  if (birthDateStr.includes('-')) {
    const parts = birthDateStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        [year, month, day] = parts.map(Number);
        formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
      } else {
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

// Limpa caracteres especiais do telefone para o link do WhatsApp
function cleanPhoneForWhatsApp(phone) {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '').replace('+', '');
}

export default function UserDetailModal({ user, userEnrollments = [], onClose, onRoleChange, onEvaluationUpdated, onUserDeleted, onUserUpdated }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';

  const [currentRole, setCurrentRole] = useState(user?.role || 'student');
  const [updatingRole, setUpdatingRole] = useState(false);
  const [roleSuccess, setRoleSuccess] = useState(false);

  useEffect(() => {
    if (user?.role) setCurrentRole(user.role);
  }, [user?.role]);

  async function handleRoleChange(e) {
    const newRole = e.target.value;
    setCurrentRole(newRole);
    setUpdatingRole(true);
    try {
      await updateDoc(doc(db, 'users', user.id || user.uid), { role: newRole });
      if (onRoleChange) onRoleChange(user.id || user.uid, newRole);
      setRoleSuccess(true);
      setTimeout(() => setRoleSuccess(false), 3000);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      toast.error(t('adminPage.usersManager.roleError', 'Erro ao atualizar perfil do usuário.'));
    } finally {
      setUpdatingRole(false);
    }
  }

  const { currentUser } = useAuth();
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  // EDIT STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isEditing && user) {
      setEditData({
        phone: user.phone || '',
        birthDate: user.birthDate || user.birthdate || user.dataNascimento || user.nascimento || '',
        city: user.city || '',
        country: user.country || '',
        address: user.address || user.endereco || '',
        zip: user.zip || user.cep || '',
        experiencia: user.experiencia || user.experience || '',
        restricoes: user.restricoes || user.restrictions || ''
      });
    }
  }, [isEditing, user]);

  const handleEditChange = (e) => {
    setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveEdit = async () => {
    setIsSavingEdit(true);
    try {
      const uid = user.id || user.uid;
      await updateDoc(doc(db, 'users', uid), editData);
      if (onUserUpdated) onUserUpdated(uid, editData);
      setIsEditing(false);
      toast.success(t('adminPage.usersManager.updateSuccess', 'Cadastro atualizado com sucesso.'));
    } catch (error) {
      console.error(error);
      toast.error(t('adminPage.usersManager.updateError', 'Erro ao atualizar cadastro.'));
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm(t('adminPage.usersManager.confirmDelete', 'Tem certeza que deseja excluir permanentemente este cadastro? Esta ação não pode ser desfeita.'))) return;
    
    setIsDeleting(true);
    try {
      const uid = user.id || user.uid;
      await deleteDoc(doc(db, 'users', uid));
      if (onUserDeleted) onUserDeleted(uid);
      toast.success(t('adminPage.usersManager.deleteSuccess', 'Cadastro excluído com sucesso.'));
    } catch (error) {
      console.error(error);
      toast.error(t('adminPage.usersManager.deleteError', 'Erro ao excluir cadastro.'));
    } finally {
      setIsDeleting(false);
    }
  };
  const [editingEnrId, setEditingEnrId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editNotes, setEditNotes] = useState('');
  const [isSavingEval, setIsSavingEval] = useState(false);
  const [localEnrollments, setLocalEnrollments] = useState(userEnrollments || []);

  useEffect(() => {
    setLocalEnrollments(userEnrollments || []);
  }, [userEnrollments]);

  async function handleSaveEvaluation(enrId) {
    setIsSavingEval(true);
    try {
      const updatedEval = {
        rating: editRating,
        notes: editNotes,
        instructorName: currentUser?.profile?.fullName || currentUser?.profile?.nome || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Admin'),
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'enrollments', enrId), {
        evaluation: updatedEval
      });
      
      setLocalEnrollments(prev => prev.map(e => e.id === enrId ? { ...e, evaluation: updatedEval } : e));
      if (onEvaluationUpdated) onEvaluationUpdated(enrId, updatedEval);
      setEditingEnrId(null);
      toast.success(t('adminPage.usersManager.evalSavedSuccess', 'Avaliação do workshop salva com sucesso!'));
    } catch (err) {
      console.error('Erro ao salvar avaliação do workshop:', err);
      toast.error(t('adminPage.usersManager.evalSavedError', 'Erro ao salvar avaliação.'));
    } finally {
      setIsSavingEval(false);
    }
  }
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [localNotes, setLocalNotes] = useState(user?.adminNotes || []);

  async function handleAddNote() {
    if (!newNoteText.trim()) return;
    setIsSubmittingNote(true);
    try {
      const newNote = {
        text: newNoteText.trim(),
        author: currentUser?.profile?.fullName || currentUser?.profile?.nome || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Admin'),
        date: new Date().toISOString()
      };
      await updateDoc(doc(db, 'users', user.id || user.uid), {
        adminNotes: arrayUnion(newNote)
      });
      setLocalNotes(prev => [...prev, newNote]);
      setNewNoteText('');
      setIsAddingNote(false);
      toast.success(t('adminPage.usersManager.noteAddedSuccess', 'Anotação adicionada com sucesso!'));
    } catch (err) {
      console.error("Erro ao adicionar anotação:", err);
      toast.error(t('adminPage.usersManager.noteAddedError', 'Erro ao adicionar anotação.'));
    } finally {
      setIsSubmittingNote(false);
    }
  }

  // Fecha no ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!user) return null;

  const fullName = user.fullName || user.nome || user.email || t('adminPage.usersManager.anonymous', 'Usuário sem nome');
  const email = user.email || '';
  const phone = user.phone || user.telefone || '';
  const birthDate = user.birthDate || user.birthdate || user.dataNascimento || '';
  const birthInfo = formatBirthDateAndAge(birthDate, t('adminPage.studentsModal.yearsOld', 'anos'));

  // Endereço
  const address = user.address || user.endereco || '';
  const neighborhood = user.neighborhood || user.bairro || '';
  const city = user.city || user.cidade || '';
  const zip = user.zip || user.cep || '';
  const country = user.country || user.pais || '';
  const fullAddress = [address, neighborhood, city, zip, country].filter(Boolean).join(', ');

  // Ficha Médica e Experiência
  const restrictions = user.restricoes || user.restrictions || '';
  const experience = user.experiencia || user.experience || '';

  // Data de cadastro formatada
  const createdAtFormatted = user.createdAt ? (() => {
    try {
      const dt = new Date(user.createdAt);
      return dt.toLocaleDateString(currentLang, { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return user.createdAt;
    }
  })() : '-';

  // Iniciais para o avatar
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || 'U';

  const cleanPhone = cleanPhoneForWhatsApp(phone);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pt-28 md:pt-36">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-4xl max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)] bg-[#0A0A0E] border border-[#1E1E28] rounded-[4px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10 font-sans text-background"
      >
        {/* Header do Modal */}
        <div className="p-6 sm:p-8 border-b border-[#1A1A24] bg-[#0D0D12] flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar em Ouro Fosco */}
            <div className="w-14 h-14 rounded-full bg-accent/15 border border-accent/40 text-accent font-heading font-bold text-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
              {initials}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="font-drama text-2xl sm:text-3xl text-[#FAF8F5] truncate">
                  {fullName}
                </h2>
                {currentRole === 'admin' ? (
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-red-950/40 text-red-400 border border-red-800/40 font-semibold">
                    Admin
                  </span>
                ) : currentRole === 'instructor' ? (
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-amber-950/40 text-amber-300 border border-amber-800/40 font-semibold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    {t('adminPage.usersManager.instructorRole', 'Instrutor')}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {t('adminPage.usersManager.studentRole', 'Aluno')}
                  </span>
                )}
              </div>

              {/* Seletor de Perfil do Usuário */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-heading uppercase tracking-wider text-zinc-500">
                  {t('adminPage.usersManager.roleSelectorLabel', 'Alterar Perfil')}:
                </span>
                <select
                  value={currentRole}
                  onChange={handleRoleChange}
                  disabled={updatingRole}
                  className="bg-[#14141A] text-xs font-heading text-[#FAF8F5] border border-zinc-700/80 rounded-[2px] px-2 py-0.5 focus:outline-none focus:border-accent cursor-pointer hover:border-zinc-500 transition-colors"
                >
                  <option value="student">🎓 {t('adminPage.usersManager.studentRole', 'Aluno (Padrão)')}</option>
                  <option value="instructor">🎭 {t('adminPage.usersManager.instructorRole', 'Instrutor')}</option>
                  <option value="admin">👑 {t('adminPage.usersManager.adminRole', 'Administrador')}</option>
                </select>
                {roleSuccess && (
                  <span className="text-[10px] font-heading font-semibold text-emerald-400">
                    ✓ {t('adminPage.usersManager.roleUpdated', 'Perfil salvo!')}
                  </span>
                )}
              </div>

              <p className="font-heading text-xs text-[#9A9A9A] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent/70 shrink-0" />
                <span className="truncate">{email}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">
                  {t('adminPage.usersManager.memberSince', 'Membro desde')} {createdAtFormatted}
                </span>
              </p>
            </div>
          </div>

          {/* Ações Rápidas de Contato + Fechar */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {cleanPhone && (
              <a 
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-[2px] bg-[#121216] hover:bg-green-950/40 border border-zinc-800 hover:border-green-600/40 text-xs font-heading font-medium text-green-400 transition-all flex items-center gap-1.5"
                title={t('adminPage.usersManager.openWhatsApp', 'Conversar no WhatsApp')}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}

            {email && (
              <a 
                href={`mailto:${email}`}
                className="px-3 py-2 rounded-[2px] bg-[#121216] hover:bg-[#1A1A22] border border-zinc-800 hover:border-accent/40 text-xs font-heading font-medium text-[#CFCFCF] hover:text-accent transition-all flex items-center gap-1.5"
                title={t('adminPage.usersManager.sendEmail', 'Enviar E-mail')}
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">E-mail</span>
              </a>
            )}

            <button 
              onClick={onClose}
              className="p-2 rounded-[2px] bg-[#14141A] hover:bg-[#1E1E26] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors ml-1 cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 divide-y divide-[#1A1A24]">

          {/* Seção 1: Dados Pessoais e Endereço */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Cadastrais */}
            <div className="space-y-4">
              <h3 className="font-heading text-xs uppercase tracking-[2px] text-accent font-semibold flex items-center gap-2">
                <Compass className="w-4 h-4 text-accent" />
                {t('adminPage.usersManager.personalInfo', 'Dados Pessoais')}
              </h3>

              <div className="space-y-2.5 text-xs font-heading bg-[#121216] border border-[#1E1E24] p-4 rounded-[2px]">
                <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-[#888888]">{t('adminPage.usersManager.phoneLabel', 'Telefone / WhatsApp')}:</span>
                  {isEditing ? (
                      <input type="text" name="phone" value={editData.phone} onChange={handleEditChange} className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-40" />
                    ) : (
                      <span className="text-[#E0DDD5] font-mono">{phone || '-'}</span>
                    )}
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-[#888888] flex items-center gap-1.5">
                    <Cake className="w-3.5 h-3.5 text-accent/60" />
                    {t('adminPage.usersManager.birthDateLabel', 'Data de Nascimento')}:
                  </span>
                  {isEditing ? (
                      <input type="date" name="birthDate" value={editData.birthDate} onChange={handleEditChange} className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-32" />
                    ) : (
                      <span className="text-[#E0DDD5] font-mono">{birthInfo?.display || birthDate || '-'}</span>
                    )}
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#888888]">{t('adminPage.usersManager.cityCountry', 'Cidade / País')}:</span>
                  <span className="text-[#E0DDD5]">{[city, country].filter(Boolean).join(' • ') || '-'}</span>
                </div>
              </div>
            </div>

            {/* Endereço Completo */}
            <div className="space-y-4">
              <h3 className="font-heading text-xs uppercase tracking-[2px] text-accent font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                {t('adminPage.usersManager.addressSection', 'Endereço Residencial')}
              </h3>

              <div className="text-xs font-heading bg-[#121216] border border-[#1E1E24] p-4 rounded-[2px] space-y-2">
                {fullAddress ? (
                  <>
                    <p className="text-[#E0DDD5] leading-relaxed">
                      {address || '-'}
                    </p>
                    <p className="text-[#888888]">
                      {[neighborhood, city].filter(Boolean).join(', ')}
                    </p>
                    <p className="text-zinc-500 font-mono">
                      {[zip, country].filter(Boolean).join(' • ')}
                    </p>
                  </>
                ) : (
                  <p className="text-zinc-500 italic py-3">
                    {t('adminPage.usersManager.noAddress', 'Nenhum endereço cadastrado.')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Seção 2: Ficha de Saúde e Experiência */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Restrições Físicas / Saúde */}
            <div className="space-y-3">
              <h3 className="font-heading text-xs uppercase tracking-[2px] text-accent font-semibold flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-accent" />
                {t('adminPage.usersManager.healthRestrictions', 'Restrições Físicas / Saúde')}
              </h3>

              {restrictions ? (
                <div className="p-4 rounded-[2px] bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs font-heading leading-relaxed flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5 text-amber-300">
                      {t('adminPage.usersManager.attentionRequired', 'Atenção do Instrutor Requerida:')}
                    </span>
                    {restrictions}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-[2px] bg-[#121216] border border-[#1E1E24] text-zinc-500 text-xs font-heading italic">
                  {t('adminPage.usersManager.noRestrictions', 'Nenhuma restrição de saúde informada.')}
                </div>
              )}
            </div>

            {/* Experiência Prévia */}
            <div className="space-y-3">
              <h3 className="font-heading text-xs uppercase tracking-[2px] text-accent font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                {t('adminPage.usersManager.priorExperience', 'Experiência Prévia')}
              </h3>

              <div className="p-4 rounded-[2px] bg-[#121216] border border-[#1E1E24] text-xs font-heading leading-relaxed text-[#D0CDC5]">
                {experience ? experience : (
                  <span className="text-zinc-500 italic">
                    {t('adminPage.usersManager.noExperience', 'Nenhuma experiência prévia detalhada.')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Seção 3: Histórico de Cursos & Datas */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs uppercase tracking-[2px] text-accent font-semibold flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-accent" />
                {t('adminPage.usersManager.courseHistoryTitle', 'Histórico de Cursos & Inscrições')}
              </h3>

              <span className="font-mono text-xs px-2.5 py-0.5 rounded-[2px] bg-[#14141C] border border-[#1E1E28] text-zinc-300">
                {userEnrollments.length} {userEnrollments.length === 1 ? t('adminPage.usersManager.courseSingular', 'curso') : t('adminPage.usersManager.coursePlural', 'cursos')}
              </span>
            </div>

            {localEnrollments.length === 0 ? (
              <div className="p-8 text-center bg-[#121216] border border-[#1E1E24] rounded-[2px]">
                <p className="text-zinc-400 font-heading text-xs">
                  {t('adminPage.usersManager.noEnrollmentsYet', 'Este aluno ainda não se inscreveu em nenhum workshop ou aula.')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {localEnrollments.map((enr, idx) => {
                  const ev = enr.event;
                  if (!ev) {
                    return (
                      <div key={idx} className="p-4 bg-[#121216] border border-[#1E1E24] rounded-[2px] text-xs text-zinc-400">
                        {t('adminPage.usersManager.eventNotFound', 'Inscrição em evento arquivado ou ID:')} {enr.eventId}
                      </div>
                    );
                  }

                  const category = ev.category || 'bethedance';
                  const theme = getCategoryTheme(category);
                  const { title: eventTitle, location: eventLocation } = getLocalizedEvent(ev, currentLang);
                  const isPast = isEventPast(ev);
                  const isWaitlist = enr.status === 'waitlist';

                  const dateRange = formatEventDate(ev.startDate, ev.endDate, currentLang);
                  const timeRange = ev.startTime && ev.endTime ? `${ev.startTime} – ${ev.endTime}` : '';
                  const sessionsCount = Array.isArray(ev.sessions) ? ev.sessions.length : 0;

                  return (
                    <div 
                      key={idx}
                      className={`p-4 md:p-5 rounded-[2px] border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isPast 
                          ? 'bg-[#0E0E11] border-[#181820] opacity-80 hover:opacity-100' 
                          : 'bg-[#121216] border-[#1E1E24] hover:border-[#2A2A35]'
                      }`}
                    >
                      {/* Coluna Esquerda: Categoria, Título e Datas */}
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[9px] font-heading font-bold uppercase tracking-wider ${theme.badgeBg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
                            {theme.label}
                          </span>

                          {isWaitlist ? (
                            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-yellow-950/40 text-yellow-400 border border-yellow-800/40 font-semibold">
                              {t('agendaPage.waitlist', 'Lista de Espera')}
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-green-950/40 text-green-400 border border-green-800/40 font-semibold">
                              {t('agendaPage.enrolled', 'Confirmado')}
                            </span>
                          )}

                          {isPast ? (
                            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-zinc-900 text-zinc-500 border border-zinc-800">
                              {t('agendaPage.pastBadge', 'Realizado')}
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-accent/15 text-accent border border-accent/30 font-semibold">
                              {t('adminPage.usersManager.upcomingBadge', 'Próximo')}
                            </span>
                          )}
                        </div>

                        <h4 className="font-heading font-semibold text-sm sm:text-base text-[#FAF8F5] truncate">
                          {eventTitle}
                        </h4>

                        {/* Datas e Horários detalhados */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9A9A9A] font-heading">
                          <span className="flex items-center gap-1.5 text-[#D0CDC5]">
                            <Calendar className="w-3.5 h-3.5 text-accent/70" />
                            {dateRange}
                          </span>

                          {timeRange && (
                            <span className="flex items-center gap-1.5 text-zinc-400 font-mono">
                              <Clock className="w-3.5 h-3.5 text-accent/70" />
                              {timeRange}
                            </span>
                          )}

                          {sessionsCount > 1 && (
                            <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.2 bg-[#1A1A24] rounded border border-zinc-800">
                              {sessionsCount} {t('agendaPage.sessionsCount', { count: sessionsCount, defaultValue: 'encontros' })}
                            </span>
                          )}

                          {ev.totalHours && (
                            <span className="text-[10px] font-mono text-accent px-1.5 py-0.2 bg-[#1A1A24] rounded border border-zinc-800">
                              {ev.totalHours}h
                            </span>
                          )}

                          {eventLocation && (
                            <span className="flex items-center gap-1.5 text-zinc-400">
                              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                              <span className="truncate max-w-[200px]">{eventLocation}</span>
                            </span>
                          )}
                        </div>

                        {/* Anotação Interna de CRM / Avaliação do Instrutor */}
                        <div className="mt-3 pt-2.5 border-t border-white/[0.06] w-full">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-heading uppercase tracking-wider text-accent font-semibold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-accent text-accent" />
                              {t('adminPage.usersManager.crmNoteTitle', 'CRM • Avaliação do Instrutor')}
                            </span>
                            
                            {editingEnrId !== enr.id && (
                              <button 
                                onClick={() => {
                                  setEditingEnrId(enr.id);
                                  setEditRating(enr.evaluation?.rating || 0);
                                  setEditNotes(enr.evaluation?.notes || '');
                                }}
                                className="text-[10px] text-zinc-400 hover:text-accent underline font-heading uppercase tracking-wider cursor-pointer"
                              >
                                {enr.evaluation ? t('adminPage.usersManager.editEvaluation', 'Editar') : t('adminPage.usersManager.addEvaluation', 'Adicionar Avaliação')}
                              </button>
                            )}
                          </div>

                          {editingEnrId === enr.id ? (
                            <div className="space-y-3 bg-[#121216] border border-[#1E1E24] p-3 rounded-[2px] mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-heading text-zinc-500 uppercase tracking-wider">Rating:</span>
                                <div className="flex items-center gap-1 cursor-pointer">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star 
                                      key={s} 
                                      onClick={() => setEditRating(s)}
                                      className={`w-4 h-4 ${s <= editRating ? 'fill-accent text-accent' : 'text-zinc-700 hover:text-zinc-500'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <textarea 
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                placeholder={t('adminPage.usersManager.notePlaceholder', 'Escreva uma anotação sobre o desempenho...')}
                                className="w-full h-20 bg-[#0A0A0E] border border-[#1E1E28] rounded-[2px] p-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-accent/50 resize-none font-sans"
                              />
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => setEditingEnrId(null)}
                                  className="px-3 py-1.5 rounded-[2px] text-zinc-400 hover:text-white font-heading text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  {t('adminPage.usersManager.cancel', 'Cancelar')}
                                </button>
                                <button 
                                  onClick={() => handleSaveEvaluation(enr.id)}
                                  disabled={isSavingEval}
                                  className="px-3 py-1.5 rounded-[2px] bg-accent hover:bg-accent-hover text-primary font-heading text-[10px] uppercase tracking-wider font-bold transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                                >
                                  {isSavingEval ? t('adminPage.usersManager.saving', 'Salvando...') : t('adminPage.usersManager.saveEvaluation', 'Salvar Avaliação')}
                                </button>
                              </div>
                            </div>
                          ) : (
                            enr.evaluation && (
                              <div className="mt-1">
                                <div className="flex items-center gap-1.5 mb-2">
                                  {enr.evaluation.rating > 0 && (
                                    <div className="flex items-center gap-0.5">
                                      {[1, 2, 3, 4, 5].map((s) => (
                                        <Star 
                                          key={s} 
                                          className={`w-3 h-3 ${s <= enr.evaluation.rating ? 'fill-accent text-accent' : 'text-zinc-700'}`} 
                                        />
                                      ))}
                                    </div>
                                  )}
                                  {enr.evaluation.instructorName && (
                                    <span className="text-[10px] font-heading text-zinc-400">
                                      ({enr.evaluation.instructorName?.includes('@') ? enr.evaluation.instructorName.split('@')[0].charAt(0).toUpperCase() + enr.evaluation.instructorName.split('@')[0].slice(1) : enr.evaluation.instructorName})
                                    </span>
                                  )}
                                </div>
                                {enr.evaluation.notes && (
                                  <p className="text-xs font-heading italic text-zinc-300 bg-[#161620] p-2.5 rounded-[2px] border border-[#22222E] whitespace-pre-wrap leading-relaxed">
                                    "{enr.evaluation.notes}"
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>

                      </div>

                      {/* Coluna Direita: Data da Inscrição */}
                      <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 border-white/[0.04] pt-2 sm:pt-0">
                        <span className="text-[10px] font-heading uppercase tracking-wider text-zinc-500 block">
                          {t('adminPage.usersManager.enrolledOn', 'Inscrito em')}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {enr.createdAt ? new Date(enr.createdAt).toLocaleDateString(currentLang, { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Seção 4: Acompanhamento e Avaliações (Admin) */}
          <div className="pt-8 space-y-4 border-t border-[#1A1A24]">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs uppercase tracking-[2px] text-accent font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                {t('adminPage.usersManager.crmNotesTitle', 'Acompanhamento & Avaliações (CRM)')}
              </h3>
              <button 
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="text-[10px] font-heading uppercase tracking-wider text-accent border border-accent/30 hover:bg-accent hover:text-primary transition-colors px-3 py-1 rounded-[2px] cursor-pointer"
              >
                {isAddingNote ? t('adminPage.usersManager.cancel', 'Cancelar') : t('adminPage.usersManager.addNote', '+ Nova Anotação')}
              </button>
            </div>
            
            <AnimatePresence>
              {isAddingNote && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-[#121216] border border-[#1E1E24] rounded-[2px] space-y-3 mb-4">
                    <textarea 
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder={t('adminPage.usersManager.notePlaceholder', 'Escreva uma anotação sobre o desempenho, restrições ou acompanhamento do aluno...')}
                      className="w-full h-24 bg-[#0A0A0E] border border-[#1E1E28] rounded-[2px] p-3 text-xs text-[#FAF8F5] focus:outline-none focus:border-accent/50 resize-none font-sans"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={handleAddNote}
                        disabled={isSubmittingNote || !newNoteText.trim()}
                        className="px-4 py-2 rounded-[2px] bg-accent hover:bg-accent-hover text-primary font-heading text-[10px] uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                      >
                        {isSubmittingNote ? t('adminPage.usersManager.saving', 'Salvando...') : t('adminPage.usersManager.saveNote', 'Salvar Anotação')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!localNotes || localNotes.length === 0 ? (
              <div className="p-6 text-center bg-[#121216] border border-[#1E1E24] rounded-[2px]">
                <p className="text-zinc-500 font-heading text-xs italic">
                  {t('adminPage.usersManager.noCrmNotes', 'Nenhum histórico de acompanhamento registrado para este aluno.')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {localNotes.map((note, idx) => (
                  <div key={idx} className="p-4 bg-[#121216] border border-[#1E1E24] rounded-[2px]">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-heading font-semibold text-[#E0DDD5]">{note.author?.includes('@') ? note.author.split('@')[0].charAt(0).toUpperCase() + note.author.split('@')[0].slice(1) : (note.author || 'Admin')}</span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {note.date ? new Date(note.date).toLocaleDateString(currentLang, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção 5: Feedback do Usuário */}
          <div className="pt-8 space-y-4 border-t border-[#1A1A24]">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs uppercase tracking-[2px] text-accent font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                {t('adminPage.usersManager.userFeedbackTitle', 'Feedbacks do Usuário')}
              </h3>
            </div>
            
            {localEnrollments.filter(e => e.userFeedback).length === 0 ? (
              <div className="p-6 text-center bg-[#121216] border border-[#1E1E24] rounded-[2px]">
                <p className="text-zinc-500 font-heading text-xs italic">
                  {t('adminPage.usersManager.noUserFeedback', 'Este aluno ainda não enviou nenhum feedback de curso.')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {localEnrollments.filter(e => e.userFeedback).map((enr, idx) => (
                  <div key={idx} className="p-4 bg-[#161620] border border-[#22222E] rounded-[2px]">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-heading font-semibold text-accent uppercase tracking-wide">
                        {enr.event?.title || 'Workshop'}
                      </span>
                      {enr.userFeedback.rating && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-3 h-3 ${s <= enr.userFeedback.rating ? 'fill-accent text-accent' : 'text-zinc-700'}`} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-sans italic text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      "{enr.userFeedback.text || enr.userFeedback.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

                  {/* Footer do Modal */}
          <div className="p-4 sm:p-6 bg-[#0D0D12] border-t border-[#1A1A24] flex items-center justify-between gap-4">
            <span className="text-xs text-zinc-500 font-heading">
              ID: <span className="font-mono text-zinc-400">{user.id || user.uid}</span>
            </span>

            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 rounded-[2px] bg-red-950/20 hover:bg-red-900/40 border border-red-900/40 text-xs font-heading font-semibold uppercase tracking-wider text-red-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>

              {isEditing ? (
                <>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-[2px] bg-[#14141C] hover:bg-[#1E1E28] border border-[#2A2A38] text-xs font-heading font-semibold uppercase tracking-wider text-zinc-400 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSaveEdit}
                    disabled={isSavingEdit}
                    className="px-4 py-2 rounded-[2px] bg-accent/20 hover:bg-accent/30 border border-accent/40 text-xs font-heading font-semibold uppercase tracking-wider text-accent transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSavingEdit ? 'Salvando...' : 'Salvar'}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-[2px] bg-[#14141C] hover:bg-[#1E1E28] border border-[#2A2A38] text-xs font-heading font-semibold uppercase tracking-wider text-zinc-300 transition-colors cursor-pointer"
                  >
                    Editar
                  </button>
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="px-6 py-2 rounded-[2px] bg-[#14141C] hover:bg-[#1E1E28] border border-[#2A2A38] text-xs font-heading font-semibold uppercase tracking-wider text-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    {t('adminPage.usersManager.close', 'Fechar')}
                  </button>
                </>
              )}
            </div>
          </div>
      </motion.div>
    </div>
  );
}
