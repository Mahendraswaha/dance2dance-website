import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'sonner';
import { Edit2, CheckCircle2, Loader2, Save, Eye } from 'lucide-react';

const TEMPLATES_LIST = [
  { id: 'enrollment_confirmed', name: 'Confirmação de Inscrição' },
  { id: 'waitlist_joined', name: 'Entrada na Fila de Espera' },
  { id: 'waitlist_promoted', name: 'Vaga Liberada da Fila (Promoted)' },
  { id: 'contact_received', name: 'Formulário de Contato Recebido' },
  { id: 'reminder_1_day', name: 'Lembrete (1 Dia Antes)' },
  { id: 'post_event_feedback', name: 'Feedback (Pós-Evento)' },
  { id: 'inactive_90_days', name: 'Inatividade (90 Dias)' }
];

const LANGUAGES = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'Inglês' },
  { code: 'no', label: 'Norueguês' }
];

export default function CommunicationsTab() {
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('enrollment_confirmed');
  const [selectedLang, setSelectedLang] = useState('pt');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    loadTemplateData();
  }, [selectedTemplate, selectedLang, templates]);

  async function fetchTemplates() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'crm_email_templates'));
      const data = {};
      snap.forEach(d => {
        data[d.id] = d.data();
      });
      setTemplates(data);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar templates de e-mail.');
    } finally {
      setLoading(false);
    }
  }

  function loadTemplateData() {
    const docId = `${selectedTemplate}_${selectedLang}`;
    const tpl = templates[docId];
    if (tpl) {
      setSubject(tpl.subject || '');
      setBodyHtml(tpl.body_html || '');
    } else {
      setSubject('');
      setBodyHtml('');
    }
    setIsEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    const docId = `${selectedTemplate}_${selectedLang}`;
    
    try {
      const docRef = doc(db, 'crm_email_templates', docId);
      
      const payload = {
        id: docId,
        subject,
        body_html: bodyHtml,
        isActive: true
      };
      
      await setDoc(docRef, payload, { merge: true });
      
      setTemplates(prev => ({
        ...prev,
        [docId]: { ...prev[docId], ...payload }
      }));
      
      toast.success('Template salvo com sucesso!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar template: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  // Função para renderizar o preview com variáveis preenchidas
  const getPreviewHtml = () => {
    if (!bodyHtml) return "<p class='text-zinc-500 italic'>Nenhum conteúdo no template.</p>";
    return bodyHtml
      .replace(/{{userName}}/g, "<strong>Safia Costa</strong>")
      .replace(/{{workshopName}}/g, "<strong>Be The Dance Masterclass</strong>")
      .replace(/{{workshopDate}}/g, "<strong>15/10/2026</strong>")
      .replace(/{{workshopTime}}/g, "<strong>19:00</strong>")
      .replace(/{{locationName}}/g, "<strong>Studio Tøyen, Oslo</strong>");
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-heading uppercase tracking-[2px] text-xs">Carregando CRM...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0E] border border-[#222222] rounded-md overflow-hidden">
      <div className="p-6 border-b border-[#222222]">
        <h2 className="text-xl font-heading text-accent mb-2">Comunicações e E-mails</h2>
        <p className="text-sm text-zinc-400 max-w-2xl">
          Gerencie os textos automáticos disparados para os alunos. As variáveis entre chaves 
          como <code className="text-accent bg-accent/10 px-1 py-0.5 rounded">{'{{userName}}'}</code> serão 
          substituídas automaticamente pelo sistema.
        </p>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#222222] bg-[#121214]">
          <div className="p-4 border-b border-[#222222]">
            <h3 className="font-heading uppercase tracking-[1px] text-xs text-zinc-500 font-semibold mb-3">Selecione o Gatilho</h3>
            <div className="space-y-1">
              {TEMPLATES_LIST.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`w-full text-left px-3 py-2.5 rounded text-sm transition-colors ${
                    selectedTemplate === t.id 
                      ? 'bg-accent/10 text-accent font-medium border border-accent/20' 
                      : 'text-zinc-400 hover:bg-[#1a1a1f] hover:text-zinc-200'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-heading uppercase tracking-[1px] text-xs text-zinc-500 font-semibold mb-3">Idioma do E-mail</h3>
            <div className="flex gap-2">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLang(l.code)}
                  className={`flex-1 py-2 text-center text-xs font-heading uppercase tracking-wider rounded transition-colors ${
                    selectedLang === l.code
                      ? 'bg-[#222222] text-white border border-[#333333]'
                      : 'bg-transparent text-zinc-500 border border-transparent hover:text-zinc-300'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="w-full md:w-2/3 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg text-white">
              {TEMPLATES_LIST.find(t => t.id === selectedTemplate)?.name} 
              <span className="text-zinc-500 ml-2 text-sm uppercase">({selectedLang})</span>
            </h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-heading uppercase tracking-[1px] transition-colors border ${
                  showPreview ? 'bg-accent text-primary border-accent font-bold' : 'bg-[#1a1a1f] hover:bg-[#222222] text-zinc-300 border-[#333333]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {showPreview ? 'Ocultar Preview' : 'Ver Preview'}
              </button>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1f] hover:bg-[#222222] text-zinc-300 rounded text-xs font-heading uppercase tracking-[1px] transition-colors border border-[#333333]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Editar Texto
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-white text-xs font-heading uppercase tracking-[1px]"
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-primary rounded text-xs font-heading uppercase tracking-[1px] transition-colors font-bold disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Salvar Mudanças
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-heading uppercase tracking-[1px] text-zinc-500 mb-1.5">Assunto do E-mail</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={!isEditing}
                className="w-full bg-[#121214] border border-[#333333] rounded px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent disabled:opacity-70 disabled:cursor-not-allowed"
                placeholder="Ex: Confirmação de Vaga: {{workshopName}}"
              />
            </div>

            <div>
              <label className="block text-xs font-heading uppercase tracking-[1px] text-zinc-500 mb-1.5">Corpo do E-mail (HTML permitido)</label>
              
              {showPreview ? (
                <div 
                  className="w-full bg-white border border-[#333333] rounded p-6 text-zinc-900 text-base font-sans overflow-auto"
                  style={{ minHeight: '300px' }}
                  dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                />
              ) : (
                <>
                  <textarea
                    value={bodyHtml}
                    onChange={(e) => setBodyHtml(e.target.value)}
                    disabled={!isEditing}
                    rows={12}
                    className="w-full bg-[#121214] border border-[#333333] rounded px-4 py-3 text-zinc-300 text-sm focus:outline-none focus:border-accent font-mono disabled:opacity-70 disabled:cursor-not-allowed leading-relaxed"
                    placeholder="<p>Olá {{userName}}...</p>"
                  />
                  <p className="mt-2 text-xs text-zinc-500">
                    Variáveis disponíveis: <code className="text-zinc-400">{'{{userName}}'}</code>, <code className="text-zinc-400">{'{{workshopName}}'}</code>, <code className="text-zinc-400">{'{{workshopDate}}'}</code>, <code className="text-zinc-400">{'{{workshopTime}}'}</code>, <code className="text-zinc-400">{'{{locationName}}'}</code>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
