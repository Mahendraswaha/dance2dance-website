import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, doc, runTransaction, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import { X, Copy, Check, Download, UserCheck, Trash2, ArrowUpRight, Phone, HeartPulse, Mail, Calendar } from 'lucide-react';

export default function StudentsModal({ event, onClose, onEventUpdated }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('enrolled'); // 'enrolled' or 'waitlist'
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
        // Ordena por data de criação
        list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        setEnrollments(list);
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
    if (currentList.length === 0) return;
    const headers = ["#", "Nome", "Email", "Telefone", "Status", "Data de Inscricao", "Restricoes de Saude"];
    const rows = currentList.map((e, idx) => [
      idx + 1,
      `"${(e.userName || '').replace(/"/g, '""')}"`,
      `"${(e.userEmail || '').replace(/"/g, '""')}"`,
      `"${(e.userPhone || '').replace(/"/g, '""')}"`,
      e.status,
      e.createdAt ? new Date(e.createdAt).toLocaleString() : '',
      `"${(e.userRestrictions || 'Nenhuma').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `alunos-${event.title || 'workshop'}-${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        className="bg-[#0e0e11] border border-[#2A2A35] w-full max-w-4xl max-h-[90vh] rounded-[4px] shadow-2xl flex flex-col z-10 overflow-hidden relative"
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

          <button 
            onClick={onClose}
            className="p-2 text-[#9A9A9A] hover:text-[#F0EDE8] rounded-[2px] hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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

        {/* Barra de Abas e Ferramentas */}
        <div className="px-6 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#1A1A24]">
          {/* Abas */}
          <div className="flex gap-2">
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
          ) : (
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
          )}
        </div>
      </motion.div>
    </div>
  );
}
