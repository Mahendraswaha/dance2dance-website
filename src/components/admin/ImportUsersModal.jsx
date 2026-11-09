import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { collection, doc, writeBatch, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  X, Upload, Download, FileSpreadsheet, CheckCircle2, 
  AlertTriangle, Users, Calendar, ArrowRight, RefreshCw, 
  Check, Info, Search, Filter
} from 'lucide-react';
import { getLocalizedEvent, getEventCategory, formatEventDate } from '../../utils/eventHelpers';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// Normaliza nomes de colunas removendo acentos e caracteres especiais
function normalizeHeader(key) {
  return String(key || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_');
}

// Mapeia colunas da planilha para o modelo interno
function mapRowData(rawRow) {
  const row = {};
  Object.keys(rawRow).forEach(key => {
    const norm = normalizeHeader(key);
    row[norm] = typeof rawRow[key] === 'string' ? rawRow[key].trim() : rawRow[key];
  });

  // Busca por variações em PT, EN e NO
  const nome = 
    row.nome_completo || row.nome || row.name || row.full_name || 
    row.fullname || row.navn || row.aluno || row.student || '';

  const email = (
    row.email || row.e_mail || row.mail || row.epost || ''
  ).toLowerCase().trim();

  const telefone = String(
    row.telefone || row.phone || row.celular || row.tel || 
    row.tlf || row.telefon || row.mobile || ''
  ).trim();

  const cidade = row.cidade || row.city || row.by || row.bosted || '';
  const bairro = row.bairro || row.neighborhood || row.bydel || '';
  const pais = row.pais || row.country || row.land || 'Norway';
  
  let idioma = (row.idioma || row.language || row.sprak || row.lang || 'no').toLowerCase();
  if (!['pt', 'en', 'no'].includes(idioma)) idioma = 'no';

  const parceiro = row.parceiro || row.partner || row.parceiro_origem || row.partner_name || row.kilde || '';
  const observacoes = row.observacoes || row.observacao || row.notes || row.note || row.notater || row.obs || '';

  return {
    nome,
    email,
    telefone,
    cidade,
    bairro,
    pais,
    idioma,
    parceiro,
    observacoes
  };
}

// Validador simples de e-mail
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ImportUsersModal({ 
  isOpen, 
  onClose, 
  events = [], 
  existingUsers = [], 
  onImportComplete 
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';

  const [step, setStep] = useState(1); // 1: Upload & Config, 2: Preview & Confirm, 3: Processing
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  
  // Configurações da Importação
  const [targetEventId, setTargetEventId] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState('attended'); // 'attended' | 'enrolled'
  const [defaultPartnerName, setDefaultPartnerName] = useState('');
  const [previewFilter, setPreviewFilter] = useState('all'); // 'all' | 'new' | 'existing' | 'invalid'
  const [previewSearch, setPreviewSearch] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const fileInputRef = useRef(null);

  // Mapa rápido de e-mails existentes no banco para deduplicação instantânea
  const existingUsersMap = useMemo(() => {
    const map = new Map();
    existingUsers.forEach(u => {
      const em = (u.email || '').toLowerCase().trim();
      if (em) map.set(em, u);
    });
    return map;
  }, [existingUsers]);

  // Reseta estado ao fechar
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedFile(null);
      setFileName('');
      setParsedRows([]);
      setTargetEventId('');
      setEnrollmentStatus('attended');
      setDefaultPartnerName('');
      setPreviewFilter('all');
      setPreviewSearch('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Fecha no ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && !isProcessing) onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, isProcessing]);

  // Lê e processa o arquivo carregado (.xlsx ou .csv)
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          toast.error(t('adminPage.usersManager.importEmptyFile', 'O arquivo selecionado está vazio.'));
          return;
        }

        // Normaliza e classifica cada linha
        const processed = rawJson.map((raw, index) => {
          const mapped = mapRowData(raw);
          const hasValidEmail = isValidEmail(mapped.email);
          const hasName = Boolean(mapped.nome);
          const existingUser = hasValidEmail ? existingUsersMap.get(mapped.email) : null;

          let validationStatus = 'new';
          let errorMessage = '';

          if (!hasName) {
            validationStatus = 'invalid';
            errorMessage = t('adminPage.usersManager.importMissingName', 'Nome ausente');
          } else if (!hasValidEmail) {
            validationStatus = 'invalid';
            errorMessage = t('adminPage.usersManager.importInvalidEmail', 'E-mail inválido');
          } else if (existingUser) {
            validationStatus = 'existing';
          }

          return {
            rowId: index + 1,
            ...mapped,
            validationStatus,
            errorMessage,
            existingUserId: existingUser?.id || existingUser?.uid || null,
            existingUserData: existingUser || null
          };
        });

        setParsedRows(processed);
        setStep(2);
      } catch (err) {
        console.error("Erro ao ler planilha:", err);
        toast.error(t('adminPage.usersManager.importReadError', 'Erro ao processar arquivo. Verifique o formato.'));
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // Estatísticas do lote
  const stats = useMemo(() => {
    let newCount = 0;
    let existingCount = 0;
    let invalidCount = 0;

    parsedRows.forEach(r => {
      if (r.validationStatus === 'new') newCount++;
      else if (r.validationStatus === 'existing') existingCount++;
      else if (r.validationStatus === 'invalid') invalidCount++;
    });

    return {
      total: parsedRows.length,
      valid: newCount + existingCount,
      newCount,
      existingCount,
      invalidCount
    };
  }, [parsedRows]);

  // Linhas filtradas para a tabela de pré-visualização
  const previewRows = useMemo(() => {
    return parsedRows.filter(r => {
      if (previewFilter !== 'all' && r.validationStatus !== previewFilter) return false;
      if (previewSearch.trim()) {
        const q = previewSearch.toLowerCase().trim();
        const matches = 
          r.nome.toLowerCase().includes(q) || 
          r.email.toLowerCase().includes(q) || 
          r.cidade.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [parsedRows, previewFilter, previewSearch]);

  // Workshop selecionado
  const selectedEvent = useMemo(() => {
    return events.find(e => e.id === targetEventId) || null;
  }, [events, targetEventId]);

  // Execução da Importação em Lote no Firestore
  async function handleConfirmImport() {
    const validRows = parsedRows.filter(r => r.validationStatus !== 'invalid');
    if (validRows.length === 0) {
      toast.error(t('adminPage.usersManager.importNoValidRows', 'Nenhum registro válido para importar.'));
      return;
    }

    setIsProcessing(true);
    setStep(3);
    setProgress({ current: 0, total: validRows.length });

    try {
      const nowIso = new Date().toISOString();
      const CHUNK_SIZE = 200; // Mantém cada batch com folga bem abaixo do limite de 500 do Firestore
      let processedCount = 0;

      for (let i = 0; i < validRows.length; i += CHUNK_SIZE) {
        const chunk = validRows.slice(i, i + CHUNK_SIZE);
        const batch = writeBatch(db);

        for (const row of chunk) {
          let userId = row.existingUserId;
          const partner = row.parceiro || defaultPartnerName.trim() || 'Parceiro Externo';

          // 1. Atualizar ou Criar Usuário na coleção 'users'
          if (row.validationStatus === 'existing' && userId) {
            const userRef = doc(db, 'users', userId);
            const updatePayload = {
              updatedAt: nowIso,
              lastPartnerImport: partner,
              lastPartnerImportAt: nowIso
            };
            // Enriquece campos ausentes sem sobrescrever dados preenchidos pelo aluno
            if (row.telefone && !row.existingUserData?.phone && !row.existingUserData?.telefone) {
              updatePayload.phone = row.telefone;
              updatePayload.telefone = row.telefone;
            }
            if (row.cidade && !row.existingUserData?.city && !row.existingUserData?.cidade) {
              updatePayload.city = row.cidade;
              updatePayload.cidade = row.cidade;
            }
            if (row.bairro && !row.existingUserData?.neighborhood && !row.existingUserData?.bairro) {
              updatePayload.neighborhood = row.bairro;
              updatePayload.bairro = row.bairro;
            }
            if (row.pais && !row.existingUserData?.country && !row.existingUserData?.pais) {
              updatePayload.country = row.pais;
              updatePayload.pais = row.pais;
            }
            batch.update(userRef, updatePayload);
          } else {
            // Novo Usuário
            const newUserRef = doc(collection(db, 'users'));
            userId = newUserRef.id;

            batch.set(newUserRef, {
              fullName: row.nome,
              nome: row.nome,
              email: row.email,
              phone: row.telefone,
              telefone: row.telefone,
              city: row.cidade,
              cidade: row.cidade,
              neighborhood: row.bairro,
              bairro: row.bairro,
              country: row.pais || 'Norway',
              pais: row.pais || 'Norway',
              preferredLang: row.idioma || 'no',
              role: 'student',
              source: 'partner_import',
              partnerName: partner,
              observacoes: row.observacoes,
              hasAuthAccount: false,
              createdAt: nowIso,
              importedAt: nowIso
            });
          }

          // 2. Criar Inscrição na coleção 'enrollments' (se houver workshop selecionado)
          if (selectedEvent) {
            const enrollRef = doc(collection(db, 'enrollments'));
            batch.set(enrollRef, {
              eventId: selectedEvent.id,
              userId: userId,
              userName: row.nome,
              userEmail: row.email,
              userPhone: row.telefone || '',
              userCity: row.cidade || '',
              userNeighborhood: row.bairro || '',
              userCountry: row.pais || 'Norway',
              userLang: row.idioma || 'no',
              status: enrollmentStatus, // 'attended' ou 'enrolled'
              emailSent: true, // CRÍTICO: Previne disparo do crm-cron para eventos passados
              source: 'partner_import',
              partnerName: partner,
              observacoes: row.observacoes || '',
              importedAt: nowIso,
              createdAt: selectedEvent.startDate ? new Date(selectedEvent.startDate).toISOString() : nowIso
            });
          }

          processedCount++;
        }

        await batch.commit();
        setProgress({ current: processedCount, total: validRows.length });
      }

      // Se vinculou a workshop, atualiza o contador do evento
      if (selectedEvent && validRows.length > 0) {
        try {
          const eventRef = doc(db, 'events', selectedEvent.id);
          await updateDoc(eventRef, {
            enrolledCount: increment(validRows.length)
          });
        } catch (cntErr) {
          console.warn("Aviso ao atualizar contador de vagas:", cntErr);
        }
      }

      toast.success(
        t('adminPage.usersManager.importSuccessToast', 
          'Importação concluída com sucesso: {{count}} alunos registrados.', 
          { count: validRows.length }
        )
      );

      if (onImportComplete) {
        onImportComplete();
      }

      onClose();
    } catch (err) {
      console.error("Erro na importação:", err);
      toast.error(t('adminPage.usersManager.importGenericError', 'Ocorreu um erro durante a importação. Verifique o console.'));
    } finally {
      setIsProcessing(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pt-24 md:pt-32">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isProcessing && onClose()}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-5xl max-h-[calc(100vh-7rem)] md:max-h-[calc(100vh-9rem)] bg-[#0A0A0E] border border-[#1E1E28] rounded-[4px] shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col z-10 font-sans text-background"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#1A1A24] bg-[#0D0D12] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/40 text-accent flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-drama text-2xl text-[#FAF8F5]">
                {t('adminPage.usersManager.importModalTitle', 'Importar Alunos de Parceiros')}
              </h2>
              <p className="text-xs text-zinc-400 font-heading">
                {t('adminPage.usersManager.importModalSubtitle', 'Carga em lote para o Micro CRM com vinculação opcional a workshops.')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-9 h-9 rounded-full bg-[#141418] border border-[#22222C] text-zinc-400 hover:text-white hover:border-zinc-500 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            title={t('common.close', 'Fechar')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body com Scroll */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* Banner do Modelo Oficial (.xlsx) */}
          <div className="p-4 rounded-[3px] bg-[#121218] border border-[#262634] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-heading font-semibold text-[#FAF8F5]">
                  {t('adminPage.usersManager.templateBannerTitle', 'Planilha Modelo Oficial (.xlsx)')}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {t('adminPage.usersManager.templateBannerDesc', 'Utilize o modelo oficial formatado com os cabeçalhos padrão e guia de preenchimento.')}
                </p>
              </div>
            </div>

            <a
              href="/templates/modelo_importacao_alunos.xlsx"
              download="modelo_importacao_alunos.xlsx"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[2px] bg-accent/15 hover:bg-accent text-accent hover:text-primary border border-accent/40 hover:border-accent font-heading text-xs uppercase tracking-wider font-bold transition-all shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('adminPage.usersManager.downloadTemplateBtn', 'Baixar Modelo .xlsx')}</span>
            </a>
          </div>

          {/* ETAPA 1: Upload e Configuração */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Área de Drop / Seleção de Arquivo */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#2A2A38] hover:border-accent/70 bg-[#0E0E14] hover:bg-[#12121A] rounded-[4px] p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center group"
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".xlsx,.xls,.csv" 
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <div className="w-14 h-14 rounded-full bg-[#181824] border border-[#2A2A3A] group-hover:border-accent text-accent flex items-center justify-center mb-3 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-sm sm:text-base font-semibold text-[#FAF8F5]">
                  {t('adminPage.usersManager.dropzoneTitle', 'Clique para selecionar a lista (.xlsx ou .csv)')}
                </h3>
                <p className="text-xs text-zinc-500 font-heading mt-1 max-w-md">
                  {t('adminPage.usersManager.dropzoneSub', 'Compatível com o modelo oficial, planilhas Excel ou exportações em CSV de parceiros.')}
                </p>
              </div>

              {/* Parâmetros Globais da Importação */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-[3px] bg-[#0E0E14] border border-[#1E1E28]">
                {/* 1. Vincular a Workshop */}
                <div>
                  <label className="block text-[11px] font-heading uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                    {t('adminPage.usersManager.targetWorkshopLabel', 'Vincular a Workshop (Opcional)')}
                  </label>
                  <select
                    value={targetEventId}
                    onChange={(e) => setTargetEventId(e.target.value)}
                    className="w-full bg-[#14141A] border border-[#2A2A36] text-[#FAF8F5] px-3 py-2.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent"
                  >
                    <option value="">{t('adminPage.usersManager.noWorkshopOption', 'Nenhum (Apenas cadastrar contato no CRM)')}</option>
                    {events.map(ev => {
                      const { title } = getLocalizedEvent(ev, currentLang);
                      const dateStr = ev.startDate ? formatEventDate(ev.startDate, currentLang) : '';
                      return (
                        <option key={ev.id} value={ev.id}>
                          {title || 'Workshop'} {dateStr ? `(${dateStr})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 2. Status da Inscrição */}
                <div>
                  <label className="block text-[11px] font-heading uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                    {t('adminPage.usersManager.enrollmentStatusLabel', 'Status da Inscrição')}
                  </label>
                  <select
                    value={enrollmentStatus}
                    disabled={!targetEventId}
                    onChange={(e) => setEnrollmentStatus(e.target.value)}
                    className="w-full bg-[#14141A] border border-[#2A2A36] text-[#FAF8F5] px-3 py-2.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent disabled:opacity-40"
                  >
                    <option value="attended">{t('adminPage.usersManager.statusAttended', 'Concluído / Participou (attended)')}</option>
                    <option value="enrolled">{t('adminPage.usersManager.statusEnrolled', 'Inscrito / Futuro (enrolled)')}</option>
                  </select>
                </div>

                {/* 3. Parceiro Padrão */}
                <div>
                  <label className="block text-[11px] font-heading uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                    {t('adminPage.usersManager.defaultPartnerLabel', 'Nome do Parceiro')}
                  </label>
                  <input
                    type="text"
                    value={defaultPartnerName}
                    onChange={(e) => setDefaultPartnerName(e.target.value)}
                    placeholder={t('adminPage.usersManager.defaultPartnerPlaceholder', 'Ex: Sentralen, Dansens Hus...')}
                    className="w-full bg-[#14141A] border border-[#2A2A36] text-[#FAF8F5] px-3 py-2.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent placeholder:text-zinc-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2: Pré-visualização e Validação dos Dados */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Resumo do Arquivo e Estatísticas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[3px] bg-[#0E0E14] border border-[#1E1E28]">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-accent" />
                  <div>
                    <span className="text-xs font-heading font-semibold text-[#FAF8F5] block">
                      {fileName}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {t('adminPage.usersManager.previewRowsSummary', '{{total}} linhas lidas ({{valid}} válidas)', {
                        total: stats.total,
                        valid: stats.valid
                      })}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setParsedRows([]);
                    setStep(1);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-heading text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t('adminPage.usersManager.chooseAnotherFile', 'Trocar arquivo')}</span>
                </button>
              </div>

              {/* Cards de Métricas do Lote */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Total */}
                <div 
                  onClick={() => setPreviewFilter('all')}
                  className={`p-3.5 rounded-[2px] bg-[#0E0E12] border transition-all cursor-pointer ${
                    previewFilter === 'all' ? 'border-accent bg-accent/5' : 'border-[#1E1E26] hover:border-zinc-700'
                  }`}
                >
                  <span className="text-[9px] font-heading uppercase tracking-wider text-zinc-400 block mb-1">
                    {t('common.total', 'Total')}
                  </span>
                  <span className="font-drama text-2xl text-[#FAF8F5]">{stats.total}</span>
                </div>

                {/* Novos Contatos */}
                <div 
                  onClick={() => setPreviewFilter('new')}
                  className={`p-3.5 rounded-[2px] bg-[#0E0E12] border transition-all cursor-pointer ${
                    previewFilter === 'new' ? 'border-emerald-500 bg-emerald-950/20' : 'border-[#1E1E26] hover:border-zinc-700'
                  }`}
                >
                  <span className="text-[9px] font-heading uppercase tracking-wider text-emerald-400 block mb-1">
                    {t('adminPage.usersManager.filterNewContacts', 'Novos Contatos')}
                  </span>
                  <span className="font-drama text-2xl text-emerald-300">+{stats.newCount}</span>
                </div>

                {/* Contatos Existentes (Merge) */}
                <div 
                  onClick={() => setPreviewFilter('existing')}
                  className={`p-3.5 rounded-[2px] bg-[#0E0E12] border transition-all cursor-pointer ${
                    previewFilter === 'existing' ? 'border-sky-500 bg-sky-950/20' : 'border-[#1E1E26] hover:border-zinc-700'
                  }`}
                >
                  <span className="text-[9px] font-heading uppercase tracking-wider text-sky-400 block mb-1">
                    {t('adminPage.usersManager.filterExistingContacts', 'Existentes (Atualizar)')}
                  </span>
                  <span className="font-drama text-2xl text-sky-300">{stats.existingCount}</span>
                </div>

                {/* Inválidos */}
                <div 
                  onClick={() => setPreviewFilter('invalid')}
                  className={`p-3.5 rounded-[2px] bg-[#0E0E12] border transition-all cursor-pointer ${
                    previewFilter === 'invalid' ? 'border-red-500 bg-red-950/20' : 'border-[#1E1E26] hover:border-zinc-700'
                  }`}
                >
                  <span className="text-[9px] font-heading uppercase tracking-wider text-red-400 block mb-1">
                    {t('adminPage.usersManager.filterInvalid', 'Inválidos (Ignorados)')}
                  </span>
                  <span className="font-drama text-2xl text-red-300">{stats.invalidCount}</span>
                </div>
              </div>

              {/* Filtro e Busca na Tabela */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                    placeholder={t('adminPage.usersManager.searchPreviewPlaceholder', 'Filtrar por nome ou e-mail...')}
                    className="w-full bg-[#141418] border border-[#242430] text-[#FAF8F5] pl-9 pr-3 py-1.5 text-xs font-heading rounded-[2px] focus:outline-none focus:border-accent"
                  />
                </div>

                {selectedEvent && (
                  <div className="text-xs font-heading text-accent/90 flex items-center gap-1.5 self-start sm:self-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {t('adminPage.usersManager.linkingTo', 'Vinculando ao workshop:')}{' '}
                      <strong>{getLocalizedEvent(selectedEvent, currentLang).title || 'Workshop'}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Tabela de Pré-visualização */}
              <div className="border border-[#1E1E28] rounded-[3px] overflow-hidden bg-[#0A0A0E] max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs font-heading border-collapse">
                  <thead className="bg-[#121218] border-b border-[#1E1E28] sticky top-0 z-10">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold text-zinc-400">#</th>
                      <th className="py-2.5 px-3 font-semibold text-zinc-400">{t('adminPage.usersManager.colStatus', 'Status')}</th>
                      <th className="py-2.5 px-3 font-semibold text-zinc-400">{t('adminPage.usersManager.colName', 'Nome')}</th>
                      <th className="py-2.5 px-3 font-semibold text-zinc-400">{t('adminPage.usersManager.colEmail', 'E-mail')}</th>
                      <th className="py-2.5 px-3 font-semibold text-zinc-400">{t('adminPage.usersManager.colPhone', 'Telefone')}</th>
                      <th className="py-2.5 px-3 font-semibold text-zinc-400">{t('adminPage.usersManager.colLocation', 'Cidade / Bairro')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181822]">
                    {previewRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-zinc-500">
                          {t('adminPage.usersManager.noRowsForFilter', 'Nenhum registro encontrado para este filtro.')}
                        </td>
                      </tr>
                    ) : (
                      previewRows.map((r) => (
                        <tr key={r.rowId} className="hover:bg-[#12121A] transition-colors">
                          <td className="py-2 px-3 text-zinc-500 font-mono text-[10px]">{r.rowId}</td>
                          <td className="py-2 px-3">
                            {r.validationStatus === 'new' && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-[2px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                                <Check className="w-2.5 h-2.5" />
                                {t('adminPage.usersManager.statusBadgeNew', 'Novo')}
                              </span>
                            )}
                            {r.validationStatus === 'existing' && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-[2px] bg-sky-950/40 text-sky-400 border border-sky-800/40">
                                <RefreshCw className="w-2.5 h-2.5" />
                                {t('adminPage.usersManager.statusBadgeExisting', 'Existente')}
                              </span>
                            )}
                            {r.validationStatus === 'invalid' && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-[2px] bg-red-950/40 text-red-400 border border-red-800/40" title={r.errorMessage}>
                                <AlertTriangle className="w-2.5 h-2.5" />
                                {r.errorMessage || t('adminPage.usersManager.statusBadgeInvalid', 'Inválido')}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-[#FAF8F5] font-medium">{r.nome || '-'}</td>
                          <td className="py-2 px-3 text-zinc-300 font-mono text-[11px]">{r.email || '-'}</td>
                          <td className="py-2 px-3 text-zinc-400">{r.telefone || '-'}</td>
                          <td className="py-2 px-3 text-zinc-400">
                            {[r.cidade, r.bairro].filter(Boolean).join(' - ') || '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ETAPA 3: Processando */}
          {step === 3 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-accent animate-spin" />
              <h3 className="font-drama text-2xl text-[#FAF8F5]">
                {t('adminPage.usersManager.importingTitle', 'Importando alunos para o Micro CRM...')}
              </h3>
              <p className="text-xs text-zinc-400 font-heading">
                {t('adminPage.usersManager.importingDesc', 'Salvando dados no Firestore em lotes seguros. Por favor, não feche a janela.')}
              </p>
              <div className="w-full max-w-xs bg-[#181822] h-2 rounded-full overflow-hidden mt-4">
                <div 
                  className="bg-accent h-full transition-all duration-300"
                  style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                {progress.current} / {progress.total}
              </span>
            </div>
          )}

        </div>

        {/* Footer com Ações */}
        <div className="p-4 sm:p-6 border-t border-[#1A1A24] bg-[#0D0D12] flex items-center justify-between gap-4 shrink-0">
          {step === 2 ? (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-[2px] bg-[#141418] hover:bg-[#1E1E26] text-zinc-300 border border-[#242430] font-heading text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                {t('common.back', 'Voltar')}
              </button>

              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={isProcessing || stats.valid === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[2px] bg-accent hover:bg-accent/90 text-primary font-heading text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {t('adminPage.usersManager.confirmImportBtn', 'Confirmar Importação de {{count}} Alunos', { count: stats.valid })}
                </span>
              </button>
            </>
          ) : step === 1 ? (
            <div className="w-full flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-[2px] bg-[#141418] hover:bg-[#1E1E26] text-zinc-300 border border-[#242430] font-heading text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                {t('common.cancel', 'Cancelar')}
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
