import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, Heart, Users, CheckCircle2, CalendarPlus, 
  Download, Copy, Check, Search, Filter, ChevronDown, 
  ChevronUp, Trash2, ExternalLink, Mail, Phone, Flame,
  AlertCircle
} from 'lucide-react';
import { getCategoryTheme } from '../../utils/eventHelpers';

const GOAL_COUNT = 10;

export default function WishlistManager({ onScheduleWorkshop }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';

  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'goal_reached' | 'in_progress'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'be-the-dance' | 'biostretch' | 'kroppsskole'
  const [sortBy, setSortBy] = useState('most_wished'); // 'most_wished' | 'recent' | 'name'
  const [expandedWorkshops, setExpandedWorkshops] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Escuta em tempo real da coleção 'wishlists'
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'wishlists'), (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setWishes(docs);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao carregar wishlists no painel admin:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Agrupa os desejos por Workshop
  const groupedWorkshops = useMemo(() => {
    const map = {};

    wishes.forEach(item => {
      const key = item.workshopKey || item.targetPath || 'outro';
      if (!map[key]) {
        map[key] = {
          key,
          workshopTitle: item.workshopTitle || item.workshopSlug || 'Workshop',
          programId: item.programId || (item.targetPath?.includes('biostretch') ? 'biostretch' : 'be-the-dance'),
          workshopSlug: item.workshopSlug || '',
          targetPath: item.targetPath || '',
          students: []
        };
      }
      map[key].students.push(item);
    });

    return Object.values(map).map(group => {
      // Ordena estudantes pelo mais recente
      group.students.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      const count = group.students.length;
      const progressPercent = Math.min(100, Math.round((count / GOAL_COUNT) * 100));
      const isGoalReached = count >= GOAL_COUNT;
      const latestWishDate = group.students[0]?.createdAt ? new Date(group.students[0].createdAt) : null;

      return {
        ...group,
        count,
        progressPercent,
        isGoalReached,
        latestWishDate
      };
    });
  }, [wishes]);

  // Estatísticas do topo
  const stats = useMemo(() => {
    const totalWishes = wishes.length;
    const totalWorkshops = groupedWorkshops.length;
    const goalsReached = groupedWorkshops.filter(g => g.isGoalReached).length;
    const inProgress = totalWorkshops - goalsReached;

    return { totalWishes, totalWorkshops, goalsReached, inProgress };
  }, [wishes, groupedWorkshops]);

  // Filtragem e ordenação
  const filteredWorkshops = useMemo(() => {
    return groupedWorkshops.filter(workshop => {
      // Filtro de busca (nome do workshop ou nome/email de algum aluno)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        workshop.workshopTitle.toLowerCase().includes(q) ||
        workshop.students.some(s => 
          (s.userName || '').toLowerCase().includes(q) || 
          (s.userEmail || '').toLowerCase().includes(q)
        );

      // Filtro de status
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'goal_reached' && workshop.isGoalReached) || 
        (statusFilter === 'in_progress' && !workshop.isGoalReached);

      // Filtro de categoria
      const matchesCategory = 
        categoryFilter === 'all' || 
        workshop.programId === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'most_wished') {
        return b.count - a.count;
      }
      if (sortBy === 'recent') {
        const dateA = a.latestWishDate ? a.latestWishDate.getTime() : 0;
        const dateB = b.latestWishDate ? b.latestWishDate.getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'name') {
        return a.workshopTitle.localeCompare(b.workshopTitle);
      }
      return 0;
    });
  }, [groupedWorkshops, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Toggle expansão do accordion de alunos
  function toggleExpand(workshopKey) {
    setExpandedWorkshops(prev => ({
      ...prev,
      [workshopKey]: !prev[workshopKey]
    }));
  }

  // Copiar e-mails dos alunos de um workshop
  function handleCopyEmails(workshop) {
    const emails = workshop.students
      .map(s => s.userEmail)
      .filter(Boolean)
      .join(', ');

    if (!emails) return;

    navigator.clipboard.writeText(emails).then(() => {
      setCopiedKey(workshop.key);
      setTimeout(() => setCopiedKey(null), 2500);
    });
  }

  // Exportar lista de alunos em CSV
  function handleExportCsv(workshop) {
    const headers = [
      'Nome do Aluno',
      'E-mail',
      'Telefone',
      'Workshop',
      'Data de Interesse'
    ];

    const rows = workshop.students.map(s => [
      `"${(s.userName || 'Aluno').replace(/"/g, '""')}"`,
      `"${(s.userEmail || '').replace(/"/g, '""')}"`,
      `"${(s.userPhone || '').replace(/"/g, '""')}"`,
      `"${workshop.workshopTitle.replace(/"/g, '""')}"`,
      `"${s.createdAt ? new Date(s.createdAt).toLocaleString('pt-BR') : ''}"`
    ].join(';'));

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = workshop.workshopTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.setAttribute('download', `wishlist_${safeTitle}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Excluir um registro de interesse
  async function handleDeleteWish(wishId) {
    if (!window.confirm(t('adminPage.wishlistManager.confirmDelete', 'Deseja remover este registro de interesse da lista?'))) {
      return;
    }

    setDeletingId(wishId);
    try {
      await deleteDoc(doc(db, 'wishlists', wishId));
    } catch (err) {
      console.error("Erro ao deletar interesse:", err);
      alert("Erro ao remover registro.");
    } finally {
      setDeletingId(null);
    }
  }

  // Disparar agendamento do workshop
  function handleScheduleClick(workshop) {
    if (onScheduleWorkshop) {
      const category = workshop.programId?.includes('biostretch') 
        ? 'biostretch' 
        : (workshop.programId?.includes('kroppsskole') ? 'kroppsskole' : 'bethedance');

      onScheduleWorkshop({
        category,
        targetPath: workshop.targetPath,
        title: workshop.workshopTitle,
        title_pt: workshop.workshopTitle,
        title_en: workshop.workshopTitle,
        title_no: workshop.workshopTitle
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Banner Superior de Alerta se houver Metas Atingidas */}
      {stats.goalsReached > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-[4px] bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading text-sm uppercase tracking-wider text-amber-300 font-bold flex items-center gap-2">
                <span>{stats.goalsReached === 1 ? '1 Workshop com Meta Atingida!' : `${stats.goalsReached} Workshops com Metas Atingidas!`}</span>
                <span className="bg-amber-400 text-primary text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">10+ Interessados</span>
              </h3>
              <p className="font-heading text-xs text-[#CFCFCF] mt-0.5">
                {t('adminPage.wishlistManager.alertReadyDesc', 'Há demanda confirmada para a abertura de novas turmas na agenda.')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter('goal_reached')}
            className="px-4 py-2 bg-amber-500 text-primary font-heading text-xs uppercase tracking-wider font-bold rounded-[2px] hover:bg-amber-400 transition-colors shrink-0"
          >
            {t('adminPage.wishlistManager.viewReadyOnly', 'Ver Prontos para Agendar')}
          </button>
        </motion.div>
      )}

      {/* 2. Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[2px] bg-[#0E0E12] border border-[#1E1E26] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-heading uppercase tracking-[2px] text-[#888888] font-medium block mb-1">
              {t('adminPage.wishlistManager.totalWishes', 'Desejos Registrados')}
            </span>
            <span className="font-drama text-3xl text-[#FAF8F5]">
              {stats.totalWishes}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1A1A22] flex items-center justify-center text-accent">
            <Heart className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-[2px] bg-[#0E0E12] border border-[#1E1E26] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-heading uppercase tracking-[2px] text-[#888888] font-medium block mb-1">
              {t('adminPage.wishlistManager.workshopsWithDemand', 'Workshops com Demanda')}
            </span>
            <span className="font-drama text-3xl text-[#FAF8F5]">
              {stats.totalWorkshops}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1A1A22] flex items-center justify-center text-[#FAF8F5]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-[2px] bg-[#0E0E12] border border-[#1E1E26] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-heading uppercase tracking-[2px] text-[#888888] font-medium block mb-1">
              {t('adminPage.wishlistManager.goalsReached', 'Metas Atingidas (10+)')}
            </span>
            <span className="font-drama text-3xl text-amber-400">
              {stats.goalsReached}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-[2px] bg-[#0E0E12] border border-[#1E1E26] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-heading uppercase tracking-[2px] text-[#888888] font-medium block mb-1">
              {t('adminPage.wishlistManager.inProgress', 'Em Captação (< 10)')}
            </span>
            <span className="font-drama text-3xl text-[#CFCFCF]">
              {stats.inProgress}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1A1A22] flex items-center justify-center text-[#9A9A9A]">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Barra de Controles (Busca, Filtros, Ordenação) */}
      <div className="p-4 rounded-[4px] bg-[#0E0E12] border border-[#1E1E26] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('adminPage.wishlistManager.searchPlaceholder', 'Buscar por workshop ou nome/email de aluno...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#141418] border border-[#262630] rounded-[2px] text-xs font-heading text-[#FAF8F5] placeholder-[#666666] focus:outline-none focus:border-accent/60 transition-colors"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#141418] border border-[#262630] rounded-[2px] text-xs font-heading text-[#FAF8F5] px-3 py-2 focus:outline-none focus:border-accent/60"
          >
            <option value="all">{t('adminPage.wishlistManager.filterAllStatus', 'Todos os Status')}</option>
            <option value="goal_reached">🎉 {t('adminPage.wishlistManager.filterGoalReached', 'Metas Atingidas (10+)')}</option>
            <option value="in_progress">{t('adminPage.wishlistManager.filterInProgress', 'Em Andamento (< 10)')}</option>
          </select>

          {/* Categoria */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#141418] border border-[#262630] rounded-[2px] text-xs font-heading text-[#FAF8F5] px-3 py-2 focus:outline-none focus:border-accent/60"
          >
            <option value="all">{t('adminPage.wishlistManager.filterAllCategories', 'Todas Categorias')}</option>
            <option value="be-the-dance">Be The Dance</option>
            <option value="biostretch">Biostretch</option>
            <option value="kroppsskole">Kroppsskole</option>
          </select>

          {/* Ordenação */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#141418] border border-[#262630] rounded-[2px] text-xs font-heading text-[#FAF8F5] px-3 py-2 focus:outline-none focus:border-accent/60"
          >
            <option value="most_wished">{t('adminPage.wishlistManager.sortMostWished', 'Mais Interessados')}</option>
            <option value="recent">{t('adminPage.wishlistManager.sortRecent', 'Mais Recentes')}</option>
            <option value="name">{t('adminPage.wishlistManager.sortName', 'Nome do Workshop')}</option>
          </select>
        </div>
      </div>

      {/* 4. Lista de Cards de Workshops */}
      {loading ? (
        <div className="py-20 text-center text-[#888888] font-heading text-sm">
          {t('common.loading', 'Carregando demandas da lista de desejos...')}
        </div>
      ) : filteredWorkshops.length === 0 ? (
        <div className="py-20 text-center rounded-[4px] bg-[#0E0E12] border border-[#1E1E26] p-8">
          <Heart className="w-10 h-10 text-[#555555] mx-auto mb-3 opacity-50" />
          <h4 className="font-heading text-base text-[#FAF8F5] mb-1">
            {t('adminPage.wishlistManager.noResultsTitle', 'Nenhuma demanda encontrada')}
          </h4>
          <p className="font-heading text-xs text-[#888888] max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? t('adminPage.wishlistManager.noResultsFilter', 'Tente ajustar os filtros ou a busca acima.')
              : t('adminPage.wishlistManager.noWishesYet', 'Assim que os alunos demonstrarem interesse pelos workshops sem data definida, os pedidos aparecerão aqui.')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWorkshops.map((workshop) => {
            const isExpanded = !!expandedWorkshops[workshop.key];
            const isCopied = copiedKey === workshop.key;

            return (
              <div 
                key={workshop.key}
                className={`rounded-[4px] transition-all overflow-hidden border ${
                  workshop.isGoalReached 
                    ? 'bg-[#101014] border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.06)]' 
                    : 'bg-[#0E0E12] border-[#1E1E26]'
                }`}
              >
                {/* Cabeçalho do Card */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Informações Principais */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Tag Categoria */}
                        <span className="text-[10px] font-heading uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#1A1A22] text-[#CFCFCF] border border-[#2A2A35]">
                          {workshop.programId}
                        </span>

                        {/* Tag Meta */}
                        {workshop.isGoalReached ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-heading uppercase tracking-wider font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                            <Sparkles className="w-3 h-3" />
                            {t('adminPage.wishlistManager.goalReachedTag', 'Meta Atingida!')} ({workshop.count}/{GOAL_COUNT})
                          </span>
                        ) : (
                          <span className="text-[10px] font-heading uppercase tracking-wider text-[#888888] px-2 py-0.5 rounded bg-[#16161C]">
                            {workshop.count} / {GOAL_COUNT} {t('adminPage.wishlistManager.interested', 'interessados')}
                          </span>
                        )}

                        {/* Link para a página do workshop */}
                        {workshop.targetPath && (
                          <a
                            href={workshop.targetPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#888888] hover:text-accent transition-colors p-1"
                            title={t('adminPage.wishlistManager.viewWorkshopPage', 'Ver página do workshop')}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <h3 className="font-heading text-lg sm:text-xl text-[#FAF8F5] font-semibold tracking-wide">
                        {workshop.workshopTitle}
                      </h3>

                      {/* Barra de Progresso */}
                      <div className="pt-2 max-w-xl">
                        <div className="flex justify-between items-center text-[10px] font-heading tracking-wider mb-1.5">
                          <span className="text-[#888888]">
                            {t('adminPage.wishlistManager.progressToGoal', 'Progresso para abertura de turma')}
                          </span>
                          <span className={`font-mono font-bold ${workshop.isGoalReached ? 'text-amber-400' : 'text-accent'}`}>
                            {workshop.count} de {GOAL_COUNT} ({workshop.progressPercent}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[#1A1A22] rounded-full overflow-hidden p-0.5 border border-white/[0.04]">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, workshop.progressPercent)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              workshop.isGoalReached 
                                ? 'bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                                : 'bg-accent'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/[0.04]">
                      {/* Botão de Agendar */}
                      <button
                        type="button"
                        onClick={() => handleScheduleClick(workshop)}
                        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-[2px] font-heading text-xs uppercase tracking-wider font-bold transition-all ${
                          workshop.isGoalReached 
                            ? 'bg-amber-500 hover:bg-amber-400 text-primary shadow-sm' 
                            : 'bg-accent hover:bg-accent/90 text-primary'
                        }`}
                        title={t('adminPage.wishlistManager.scheduleTooltip', 'Abrir formulário e agendar este workshop')}
                      >
                        <CalendarPlus className="w-4 h-4" />
                        <span>{t('adminPage.wishlistManager.scheduleBtn', 'Agendar Workshop')}</span>
                      </button>

                      {/* Botão Copiar E-mails */}
                      <button
                        type="button"
                        onClick={() => handleCopyEmails(workshop)}
                        className="p-2.5 rounded-[2px] bg-[#1A1A22] hover:bg-[#252530] text-[#CFCFCF] hover:text-[#FAF8F5] border border-[#2A2A35] transition-colors flex items-center gap-1.5 text-xs font-heading"
                        title={t('adminPage.wishlistManager.copyEmailsTooltip', 'Copiar e-mails de todos os interessados')}
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">
                          {isCopied ? t('common.copied', 'Copiado!') : t('adminPage.wishlistManager.copyEmails', 'Copiar E-mails')}
                        </span>
                      </button>

                      {/* Botão Exportar CSV */}
                      <button
                        type="button"
                        onClick={() => handleExportCsv(workshop)}
                        className="p-2.5 rounded-[2px] bg-[#1A1A22] hover:bg-[#252530] text-[#CFCFCF] hover:text-[#FAF8F5] border border-[#2A2A35] transition-colors"
                        title={t('adminPage.wishlistManager.exportCsvTooltip', 'Baixar planilha (.csv) com os dados dos interessados')}
                        aria-label="Exportar CSV"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Botão Toggle Ver Alunos */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(workshop.key)}
                        className="px-3 py-2.5 rounded-[2px] bg-[#141418] hover:bg-[#1A1A22] text-[#888888] hover:text-[#FAF8F5] border border-[#262630] transition-colors flex items-center gap-1.5 text-xs font-heading uppercase tracking-wider"
                      >
                        <span>{isExpanded ? t('common.hide', 'Ocultar') : `${t('adminPage.wishlistManager.viewStudents', 'Alunos')} (${workshop.count})`}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                  </div>
                </div>

                {/* Lista Expansível de Alunos Interessados */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#1E1E26] bg-[#0A0A0E] px-5 py-4"
                    >
                      <h4 className="text-[11px] font-heading uppercase tracking-wider text-[#888888] mb-3 flex items-center justify-between">
                        <span>{t('adminPage.wishlistManager.interestedStudentsList', 'Alunos na Lista de Espera')}</span>
                        <span className="font-mono text-[10px]">{workshop.students.length} registro(s)</span>
                      </h4>

                      <div className="divide-y divide-white/[0.04] max-h-80 overflow-y-auto">
                        {workshop.students.map((student) => {
                          const cleanPhone = (student.userPhone || '').replace(/\D/g, '');
                          const dateFormatted = student.createdAt 
                            ? new Date(student.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                            : '—';

                          return (
                            <div key={student.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                              {/* Aluno & Contatos */}
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-xs shrink-0">
                                  {(student.userName || 'A').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-heading text-[#FAF8F5] font-medium block">
                                    {student.userName || t('common.student', 'Aluno')}
                                  </span>
                                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#888888] mt-0.5">
                                    {student.userEmail && (
                                      <a 
                                        href={`mailto:${student.userEmail}`} 
                                        className="flex items-center gap-1 hover:text-accent transition-colors"
                                      >
                                        <Mail className="w-3 h-3" />
                                        <span>{student.userEmail}</span>
                                      </a>
                                    )}
                                    {student.userPhone && (
                                      <a 
                                        href={`https://wa.me/${cleanPhone}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-emerald-400/80 hover:text-emerald-300 transition-colors"
                                      >
                                        <Phone className="w-3 h-3" />
                                        <span>{student.userPhone}</span>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Data e Remoção */}
                              <div className="flex items-center gap-4 text-[11px] text-[#666666] self-end sm:self-center">
                                <span className="font-mono">{dateFormatted}</span>
                                <button
                                  type="button"
                                  disabled={deletingId === student.id}
                                  onClick={() => handleDeleteWish(student.id)}
                                  className="text-[#666666] hover:text-red-400 p-1 transition-colors"
                                  title={t('adminPage.wishlistManager.removeEntry', 'Remover registro')}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
