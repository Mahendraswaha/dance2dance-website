import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { 
  Search, Users, UserCheck, CalendarPlus, Download, 
  ExternalLink, Mail, Phone, MapPin, Calendar, HeartPulse, 
  Sparkles, Filter, ChevronRight, MessageSquare, AlertTriangle,
  ArrowUpDown, CheckCircle2, Clock
} from 'lucide-react';
import UserDetailModal from './UserDetailModal';
import { getCategoryTheme, formatEventDate, getLocalizedEvent, isEventPast } from '../../utils/eventHelpers';

export default function RegisteredUsersManager({ events = [] }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';

  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollmentFilter, setEnrollmentFilter] = useState('all'); // 'all' | 'with_enrollments' | 'no_enrollments'
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'student' | 'instructor' | 'admin'
  const [sortBy, setSortBy] = useState('recent_created'); // 'recent_created' | 'name_asc' | 'most_courses'
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);

  // Mapa rápido de eventos por ID
  const eventsMap = useMemo(() => {
    const map = {};
    events.forEach(ev => {
      if (ev.id) map[ev.id] = ev;
    });
    return map;
  }, [events]);

  // Carrega Usuários e Inscrições do Firestore
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [usersSnap, enrollSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'enrollments'))
        ]);

        const fetchedUsers = usersSnap.docs.map(doc => ({
          id: doc.id,
          uid: doc.id,
          ...doc.data()
        }));

        const fetchedEnrollments = enrollSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setUsers(fetchedUsers);
        setEnrollments(fetchedEnrollments);
      } catch (err) {
        console.error("Erro ao buscar usuários e inscrições:", err);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // Mapeia inscrições por Usuário (userId -> Array de inscrições com evento acoplado)
  const enrollmentsByUserId = useMemo(() => {
    const map = {};
    enrollments.forEach(enr => {
      const uid = enr.userId;
      if (!uid) return;
      if (!map[uid]) map[uid] = [];

      const ev = eventsMap[enr.eventId];
      map[uid].push({
        ...enr,
        event: ev || null
      });
    });

    // Ordena as inscrições de cada usuário (mais recentes primeiro)
    Object.keys(map).forEach(uid => {
      map[uid].sort((a, b) => {
        const dateA = a.event?.startDate || a.createdAt || '';
        const dateB = b.event?.startDate || b.createdAt || '';
        return dateB.localeCompare(dateA);
      });
    });

    return map;
  }, [enrollments, eventsMap]);

  // Estatísticas e Métricas Rápidas
  const metrics = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let withEnrollmentsCount = 0;
    let newThisMonthCount = 0;

    users.forEach(u => {
      const userEnrs = enrollmentsByUserId[u.id] || enrollmentsByUserId[u.uid] || [];
      if (userEnrs.length > 0) withEnrollmentsCount++;

      if (u.createdAt) {
        try {
          const d = new Date(u.createdAt);
          if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
            newThisMonthCount++;
          }
        } catch {}
      }
    });

    return {
      totalUsers: users.length,
      withEnrollments: withEnrollmentsCount,
      newThisMonth: newThisMonthCount
    };
  }, [users, enrollmentsByUserId]);

  // Filtro e Ordenação da Lista de Usuários
  const filteredUsers = useMemo(() => {
    return users
      .filter(u => {
        const name = (u.fullName || u.nome || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const phone = (u.phone || u.telefone || '').toLowerCase();
        const city = (u.city || u.cidade || '').toLowerCase();
        const country = (u.country || u.pais || '').toLowerCase();
        const q = searchQuery.trim().toLowerCase();

        const matchesQuery = !q || name.includes(q) || email.includes(q) || phone.includes(q) || city.includes(q) || country.includes(q);
        if (!matchesQuery) return false;

        const userEnrs = enrollmentsByUserId[u.id] || enrollmentsByUserId[u.uid] || [];
        if (enrollmentFilter === 'with_enrollments' && userEnrs.length === 0) return false;
        if (enrollmentFilter === 'no_enrollments' && userEnrs.length > 0) return false;

        // Filtro por Perfil
        const userRole = u.role || 'student';
        if (roleFilter === 'student' && userRole !== 'student') return false;
        if (roleFilter === 'instructor' && userRole !== 'instructor') return false;
        if (roleFilter === 'admin' && userRole !== 'admin') return false;

        return true;
      })
      .sort((a, b) => {
        const enrsA = (enrollmentsByUserId[a.id] || enrollmentsByUserId[a.uid] || []).length;
        const enrsB = (enrollmentsByUserId[b.id] || enrollmentsByUserId[b.uid] || []).length;

        if (sortBy === 'most_courses') {
          return enrsB - enrsA;
        }

        if (sortBy === 'name_asc') {
          const nameA = a.fullName || a.nome || a.email || '';
          const nameB = b.fullName || b.nome || b.email || '';
          return nameA.localeCompare(nameB);
        }

        // 'recent_created'
        const dateA = a.createdAt || '';
        const dateB = b.createdAt || '';
        return dateB.localeCompare(dateA);
      });
  }, [users, searchQuery, enrollmentFilter, roleFilter, sortBy, enrollmentsByUserId]);

  // Função para Exportar Lista Completa em CSV (Excel UTF-8 compatível)
  function handleExportCsv() {
    if (users.length === 0) return;

    const headers = [
      'Nome Completo',
      'E-mail',
      'Telefone',
      'Data Nascimento',
      'Endereço',
      'Bairro',
      'Cidade',
      'CEP',
      'País',
      'Restrições de Saúde',
      'Experiência Prévia',
      'Total de Inscrições',
      'Histórico de Cursos',
      'Data de Cadastro'
    ];

    const rows = users.map(u => {
      const userEnrs = enrollmentsByUserId[u.id] || enrollmentsByUserId[u.uid] || [];
      const coursesSummary = userEnrs.map(e => {
        const ev = e.event;
        const { title } = getLocalizedEvent(ev, currentLang);
        const eventTitle = title || 'Workshop';
        const dates = ev?.startDate ? `${ev.startDate}${ev.endDate && ev.endDate !== ev.startDate ? ` a ${ev.endDate}` : ''}` : '';
        return `${eventTitle} (${dates} - ${e.status === 'waitlist' ? 'Espera' : 'Confirmado'})`;
      }).join(' | ');

      return [
        `"${(u.fullName || u.nome || '').replace(/"/g, '""')}"`,
        `"${(u.email || '').replace(/"/g, '""')}"`,
        `"${(u.phone || u.telefone || '').replace(/"/g, '""')}"`,
        `"${(u.birthDate || u.birthdate || u.dataNascimento || '').replace(/"/g, '""')}"`,
        `"${(u.address || u.endereco || '').replace(/"/g, '""')}"`,
        `"${(u.neighborhood || u.bairro || '').replace(/"/g, '""')}"`,
        `"${(u.city || u.cidade || '').replace(/"/g, '""')}"`,
        `"${(u.zip || u.cep || '').replace(/"/g, '""')}"`,
        `"${(u.country || u.pais || '').replace(/"/g, '""')}"`,
        `"${(u.restricoes || u.restrictions || '').replace(/"/g, '""')}"`,
        `"${(u.experiencia || u.experience || '').replace(/"/g, '""')}"`,
        userEnrs.length,
        `"${coursesSummary.replace(/"/g, '""')}"`,
        `"${(u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '').replace(/"/g, '""')}"`
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dance2dance_alunos_cadastrados_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Inscrições do usuário atualmente aberto no Modal
  const activeModalEnrollments = useMemo(() => {
    if (!selectedUserForModal) return [];
    return enrollmentsByUserId[selectedUserForModal.id] || enrollmentsByUserId[selectedUserForModal.uid] || [];
  }, [selectedUserForModal, enrollmentsByUserId]);

  return (
    <div className="space-y-8">
      {/* 1. Barra Superior de Métricas & Exportação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total de Membros */}
        <div className="p-5 rounded-[2px] bg-[#0E0E12] border border-[#1E1E26] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-heading uppercase tracking-[2px] text-[#888888] font-medium block mb-1">
              {t('adminPage.usersManager.totalRegistered', 'Total Cadastrados')}
            </span>
            <span className="font-drama text-3xl text-[#FAF8F5]">
              {metrics.totalUsers}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Alunos com Inscrições */}
        <div className="p-5 rounded-[2px] bg-[#0E0E12] border border-[#1E1E26] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-heading uppercase tracking-[2px] text-[#888888] font-medium block mb-1">
              {t('adminPage.usersManager.withEnrollments', 'Com Inscrições')}
            </span>
            <span className="font-drama text-3xl text-green-400">
              {metrics.withEnrollments}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-950/30 border border-green-700/40 text-green-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Novos Este Mês */}
        <div className="p-5 rounded-[2px] bg-[#0E0E12] border border-[#1E1E26] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-heading uppercase tracking-[2px] text-[#888888] font-medium block mb-1">
              {t('adminPage.usersManager.newThisMonth', 'Novos Este Mês')}
            </span>
            <span className="font-drama text-3xl text-accent">
              +{metrics.newThisMonth}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/40 text-accent flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Botão de Exportação CSV */}
        <div className="p-5 rounded-[2px] bg-[#0E0E12] border border-[#1E1E26] shadow-sm flex flex-col justify-center">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={users.length === 0}
            className="w-full h-full py-3 px-4 rounded-[2px] bg-[#14141E] hover:bg-accent text-accent hover:text-primary border border-accent/40 hover:border-accent font-heading text-xs uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            title={t('adminPage.usersManager.exportCsvTitle', 'Baixar planilha completa de contatos')}
          >
            <Download className="w-4 h-4" />
            <span>{t('adminPage.usersManager.exportCsvBtn', 'Exportar Contatos (CSV)')}</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Busca, Filtros e Ordenação */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-[2px] bg-[#0E0E12] border border-[#1E1E26]">
        {/* Campo de Busca */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('adminPage.usersManager.searchPlaceholder', 'Buscar por nome, e-mail, telefone ou cidade...')}
            className="w-full bg-[#141418] border border-[#262632] text-[#FAF8F5] pl-10 pr-4 py-2.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent/60 placeholder:text-zinc-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtros e Ordenação */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-start md:justify-end">
          {/* Filtro de Perfil (Role) */}
          <div className="flex flex-wrap items-center p-1 rounded-[2px] bg-[#141418] border border-[#22222C] max-w-full">
            <button
              type="button"
              onClick={() => setRoleFilter('all')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-[2px] text-[10px] font-heading font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                roleFilter === 'all' ? 'bg-accent text-primary' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t('adminPage.usersManager.filterRoleAll', 'Todos Perfis')}
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('student')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-[2px] text-[10px] font-heading font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                roleFilter === 'student' ? 'bg-accent text-primary' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t('adminPage.usersManager.studentRole', 'Alunos')}
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('instructor')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-[2px] text-[10px] font-heading font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                roleFilter === 'instructor' ? 'bg-amber-500 text-primary font-bold shadow-sm' : 'text-zinc-400 hover:text-amber-300'
              }`}
            >
              {t('adminPage.usersManager.instructorRole', 'Instrutores')}
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('admin')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-[2px] text-[10px] font-heading font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                roleFilter === 'admin' ? 'bg-red-500 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-red-300'
              }`}
            >
              Admins
            </button>
          </div>

          {/* Filtro de Inscrição */}
          <div className="flex flex-wrap items-center p-1 rounded-[2px] bg-[#141418] border border-[#22222C] max-w-full">
            <button
              type="button"
              onClick={() => setEnrollmentFilter('all')}
              className={`px-3 py-1.5 rounded-[2px] text-[10px] font-heading font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                enrollmentFilter === 'all' ? 'bg-accent text-primary' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t('adminPage.usersManager.filterAll', 'Todos')} ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setEnrollmentFilter('with_enrollments')}
              className={`px-3 py-1.5 rounded-[2px] text-[10px] font-heading font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                enrollmentFilter === 'with_enrollments' ? 'bg-accent text-primary' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t('adminPage.usersManager.filterWithEnrollments', 'Com Cursos')} ({metrics.withEnrollments})
            </button>
            <button
              type="button"
              onClick={() => setEnrollmentFilter('no_enrollments')}
              className={`px-3 py-1.5 rounded-[2px] text-[10px] font-heading font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                enrollmentFilter === 'no_enrollments' ? 'bg-accent text-primary' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t('adminPage.usersManager.filterNoEnrollments', 'Sem Cursos')} ({users.length - metrics.withEnrollments})
            </button>
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-1.5 text-xs font-heading">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#141418] border border-[#22222C] text-zinc-300 px-3 py-1.5 text-[11px] rounded-[2px] focus:outline-none focus:border-accent/60 cursor-pointer"
            >
              <option value="recent_created">{t('adminPage.usersManager.sortRecent', 'Mais Recentes')}</option>
              <option value="name_asc">{t('adminPage.usersManager.sortName', 'Ordem Alfabética (A-Z)')}</option>
              <option value="most_courses">{t('adminPage.usersManager.sortCourses', 'Mais Cursos Realizados')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Lista de Membros / Alunos */}
      {loading ? (
        <div className="py-24 text-center text-accent font-heading tracking-widest animate-pulse">
          {t('adminPage.loading', 'Carregando lista de alunos...')}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-20 text-center bg-[#0E0E12] border border-[#1E1E26] rounded-[2px] p-8">
          <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3 opacity-40" />
          <h3 className="font-heading text-sm text-[#FAF8F5] mb-1">
            {t('adminPage.usersManager.noResultsTitle', 'Nenhum usuário encontrado')}
          </h3>
          <p className="text-zinc-500 font-heading text-xs">
            {searchQuery 
              ? t('adminPage.usersManager.noResultsHintSearch', 'Tente ajustar os termos da busca.')
              : t('adminPage.usersManager.noResultsHintGeneral', 'Novos alunos aparecerão aqui conforme se cadastrarem.')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-right text-zinc-500 text-xs font-mono pr-1">
            {filteredUsers.length} {filteredUsers.length === 1 ? t('adminPage.usersManager.userCountSingular', 'usuário exibido') : t('adminPage.usersManager.userCountPlural', 'usuários exibidos')}
          </div>

          {filteredUsers.map((u) => {
            const fullName = u.fullName || u.nome || u.email || 'Usuário';
            const email = u.email || '';
            const phone = u.phone || u.telefone || '';
            const city = u.city || u.cidade || '';
            const country = u.country || u.pais || '';
            const userEnrs = enrollmentsByUserId[u.id] || enrollmentsByUserId[u.uid] || [];
            const hasRestrictions = !!(u.restricoes || u.restrictions);

            // Iniciais
            const initials = fullName
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map(w => w[0])
              .join('')
              .toUpperCase() || 'U';

            const cleanPhone = phone.replace(/[^\d+]/g, '').replace('+', '');

            return (
              <motion.div
                key={u.id || u.uid}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-5 md:p-6 rounded-[2px] bg-[#121214] border border-[#1E1E24] hover:border-[#2A2A35] hover:bg-[#161619] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group shadow-sm"
              >
                {/* Identificação Principal (Avatar, Nome, E-mail, Localidade) */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/40 text-accent font-heading font-bold text-base flex items-center justify-center shrink-0">
                    {initials}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-semibold text-base text-[#FAF8F5] group-hover:text-accent transition-colors truncate">
                        {fullName}
                      </h3>

                      {hasRestrictions && (
                        <span 
                          className="p-1 rounded-[2px] bg-amber-950/40 border border-amber-800/40 text-amber-300"
                          title={t('adminPage.usersManager.hasRestrictionsHint', 'Possui restrições de saúde registradas')}
                        >
                          <AlertTriangle className="w-3 h-3" />
                        </span>
                      )}

                      {u.role === 'admin' ? (
                        <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded-[2px] bg-red-950/40 text-red-400 border border-red-800/40 font-semibold">
                          Admin
                        </span>
                      ) : u.role === 'instructor' ? (
                        <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded-[2px] bg-amber-950/40 text-amber-300 border border-amber-800/40 font-semibold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                          {t('adminPage.usersManager.instructorRole', 'Instrutor')}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9A9A9A] font-heading">
                      <span className="flex items-center gap-1.5 text-[#CFCFCF] truncate">
                        <Mail className="w-3 h-3 text-accent/60 shrink-0" />
                        <span>{email}</span>
                      </span>

                      {phone && (
                        <span className="flex items-center gap-1.5 font-mono text-zinc-400">
                          <Phone className="w-3 h-3 text-zinc-500 shrink-0" />
                          <span>{phone}</span>
                        </span>
                      )}

                      {(city || country) && (
                        <span className="flex items-center gap-1.5 text-zinc-400">
                          <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                          <span>{[city, country].filter(Boolean).join(', ')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resumo de Cursos & Ações */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                  {/* Cursos Participados / Inscrições */}
                  <div className="flex flex-col sm:items-end min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-heading uppercase tracking-wider text-zinc-500">
                        {t('adminPage.usersManager.enrollmentsCount', 'Inscrições')}:
                      </span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-[2px] ${
                        userEnrs.length > 0 
                          ? 'bg-accent/20 text-accent border border-accent/40' 
                          : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                      }`}>
                        {userEnrs.length} {userEnrs.length === 1 ? t('adminPage.usersManager.courseSingular', 'curso') : t('adminPage.usersManager.coursePlural', 'cursos')}
                      </span>
                    </div>

                    {/* Mini Pills dos Cursos Recentes */}
                    {userEnrs.length > 0 && (
                      <div className="flex flex-wrap sm:justify-end gap-1.5 max-w-xs">
                        {userEnrs.slice(0, 2).map((enr, i) => {
                          const ev = enr.event;
                          if (!ev) return null;
                          const cat = ev.category || 'bethedance';
                          const theme = getCategoryTheme(cat);
                          const { title: eventTitle } = getLocalizedEvent(ev, currentLang);
                          const dateRange = formatEventDate(ev.startDate, null, currentLang);

                          return (
                            <span 
                              key={i}
                              className={`text-[10px] font-heading px-2 py-0.5 rounded-[2px] border truncate max-w-[180px] ${theme.badgeBg}`}
                              title={`${eventTitle} (${dateRange})`}
                            >
                              {eventTitle} {dateRange ? `• ${dateRange}` : ''}
                            </span>
                          );
                        })}
                        {userEnrs.length > 2 && (
                          <span className="text-[9px] font-mono text-zinc-500 self-center">
                            +{userEnrs.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botões de Ação: WhatsApp Rápido + Ver Ficha Completa */}
                  <div className="flex items-center gap-2 shrink-0">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-[2px] bg-[#161620] hover:bg-green-950/40 text-zinc-400 hover:text-green-400 border border-[#22222E] hover:border-green-600/40 transition-colors"
                        title={t('adminPage.usersManager.chatWhatsApp', 'Iniciar conversa no WhatsApp')}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedUserForModal(u)}
                      className="px-4 py-2.5 rounded-[2px] bg-accent/15 hover:bg-accent text-accent hover:text-primary border border-accent/40 font-heading text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>{t('adminPage.usersManager.viewProfileBtn', 'Ver Ficha & Histórico')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal de Ficha Completa e Histórico de Cursos do Aluno */}
      <AnimatePresence>
        {selectedUserForModal && (
          <UserDetailModal
            user={selectedUserForModal}
            userEnrollments={activeModalEnrollments}
            onClose={() => setSelectedUserForModal(null)}
            onRoleChange={(userId, newRole) => {
              setUsers(prev => prev.map(u => (u.id === userId || u.uid === userId) ? { ...u, role: newRole } : u));
              setSelectedUserForModal(prev => prev ? { ...prev, role: newRole } : null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
