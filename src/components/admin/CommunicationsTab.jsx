import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';
import { Edit2, CheckCircle2, Loader2, Save, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TEMPLATE_IDS = [
  'enrollment_confirmed',
  'waitlist_joined',
  'waitlist_promoted',
  'contact_received',
  'reminder_1_day',
  'post_event_feedback',
  'inactive_90_days'
];

const LANG_CODES = ['pt', 'en', 'no'];

export default function CommunicationsTab() {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('enrollment_confirmed');
  const [selectedLang, setSelectedLang] = useState('pt');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    const key = `${selectedTemplate}_${selectedLang}`;
    if (templates[key]) {
      setSubject(templates[key].subject || '');
      setBodyHtml(templates[key].body_html || '');
      setIsActive(templates[key].isActive !== false);
    } else {
      setSubject('');
      setBodyHtml('');
      setIsActive(true);
    }
    setIsEditing(false);
  }, [selectedTemplate, selectedLang, templates]);

  const fetchTemplates = async () => {
    try {
      const snap = await getDocs(collection(db, 'crm_email_templates'));
      const data = {};
      snap.forEach(doc => {
        data[doc.id] = doc.data();
      });
      setTemplates(data);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const key = `${selectedTemplate}_${selectedLang}`;
      const docRef = doc(db, 'crm_email_templates', key);
      
      const payload = {
        id: key,
        subject: subject,
        body_html: bodyHtml,
        isActive: isActive
      };

      await setDoc(docRef, payload, { merge: true });
      
      setTemplates(prev => ({
        ...prev,
        [key]: { ...prev[key], ...payload }
      }));
      
      toast.success(t('adminPage.tabs.communications.saveSuccess'));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(t('adminPage.tabs.communications.saveError') + ' ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  const getPreviewHtml = () => {
    if (!bodyHtml) return `<p class='text-zinc-500 italic'>${t('adminPage.tabs.communications.empty')}</p>`;
    return bodyHtml
      .replace(/{{userName}}/g, "<strong>Safia Costa</strong>")
      .replace(/{{workshopName}}/g, "<strong>Be The Dance Masterclass</strong>")
      .replace(/{{workshopDate}}/g, "<strong>15/10/2026</strong>")
      .replace(/{{workshopTime}}/g, "<strong>19:00</strong>")
      .replace(/{{locationName}}/g, "<strong>Studio Tøyen, Oslo</strong>")
      .replace(/{{eventId}}/g, "preview_event_123");
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-heading uppercase tracking-[2px] text-xs">{t('adminPage.tabs.communications.loading')}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0E] border border-[#222222] rounded-md overflow-hidden">
      <div className="p-6 border-b border-[#222222]">
        <h2 className="text-xl font-heading text-accent mb-2">{t('adminPage.tabs.communications.title')}</h2>
        <p className="text-sm text-zinc-400 max-w-2xl">
          {t('adminPage.tabs.communications.desc').split('{{userName}}')[0]}
          <code className="text-accent bg-accent/10 px-1 py-0.5 rounded">{'{{userName}}'}</code>
          {t('adminPage.tabs.communications.desc').split('{{userName}}')[1]}
        </p>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#222222] bg-[#121214]">
          <div className="p-4 border-b border-[#222222]">
            <h3 className="font-heading tracking-[1px] text-xs text-zinc-500 font-semibold mb-3">{t('adminPage.tabs.communications.selectTrigger')}</h3>
            <div className="space-y-1">
              {TEMPLATE_IDS.map(id => (
                <button
                  key={id}
                  onClick={() => setSelectedTemplate(id)}
                  className={`w-full text-left px-3 py-2.5 rounded text-sm transition-colors ${
                    selectedTemplate === id 
                      ? 'bg-accent/10 text-accent font-medium border border-accent/20' 
                      : 'text-zinc-400 hover:bg-[#1a1a1f] hover:text-zinc-200'
                  }`}
                >
                  {t(`adminPage.tabs.communications.triggers.${id}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-heading tracking-[1px] text-xs text-zinc-500 font-semibold mb-3">{t('adminPage.tabs.communications.emailLang')}</h3>
            <div className="flex gap-2">
              {LANG_CODES.map(code => (
                <button
                  key={code}
                  onClick={() => setSelectedLang(code)}
                  className={`flex-1 py-2 text-center text-xs font-heading tracking-wider rounded transition-colors ${
                    selectedLang === code
                      ? 'bg-[#222222] text-white border border-[#333333]'
                      : 'bg-transparent text-zinc-500 border border-transparent hover:text-zinc-300'
                  }`}
                >
                  {t(`adminPage.tabs.communications.langs.${code}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="w-full md:w-2/3 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg text-white">
              {t(`adminPage.tabs.communications.triggers.${selectedTemplate}`)} 
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
                {showPreview ? t('adminPage.tabs.communications.hidePreview') : t('adminPage.tabs.communications.showPreview')}
              </button>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1f] hover:bg-[#222222] text-zinc-300 rounded text-xs font-heading uppercase tracking-[1px] transition-colors border border-[#333333]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {t('adminPage.tabs.communications.edit')}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-white text-xs font-heading uppercase tracking-[1px]"
                    disabled={saving}
                  >
                    {t('adminPage.tabs.communications.cancel')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-primary rounded text-xs font-heading uppercase tracking-[1px] transition-colors font-bold disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {t('adminPage.tabs.communications.save')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Toggle Status */}
            <div className="flex items-center justify-between bg-[#121214] border border-[#222222] p-4 rounded mb-2">
              <div>
                <h4 className="text-sm font-heading text-white">Status do E-mail</h4>
                <p className="text-xs text-zinc-500">Quando desativado, este e-mail será pausado e não será enviado.</p>
              </div>
              <button
                type="button"
                disabled={!isEditing}
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? 'bg-accent' : 'bg-[#333333]'} ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-heading tracking-[1px] text-zinc-500 mb-1.5">{t('adminPage.tabs.communications.subject')}</label>
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
              <label className="block text-xs font-heading tracking-[1px] text-zinc-500 mb-1.5">{t('adminPage.tabs.communications.body')}</label>
              
              {showPreview ? (
                <div 
                  className="w-full bg-white border border-[#333333] rounded p-6 text-zinc-900 text-base font-sans overflow-auto"
                  style={{ minHeight: '300px' }}
                  dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                />
              ) : (
                <>
                  {isEditing ? <RichTextEditor value={bodyHtml} onChange={setBodyHtml} /> : <div className="prose prose-invert prose-sm max-w-none min-h-[300px] p-6 border border-[#222222] rounded bg-[#0A0A0E] text-zinc-300" dangerouslySetInnerHTML={{ __html: bodyHtml }} />}
                  <p className="mt-2 text-xs text-zinc-500">
                    {t('adminPage.tabs.communications.availableVars')} <code className="text-zinc-400">{'{{userName}}'}</code>, <code className="text-zinc-400">{'{{workshopName}}'}</code>, <code className="text-zinc-400">{'{{workshopDate}}'}</code>, <code className="text-zinc-400">{'{{workshopTime}}'}</code>, <code className="text-zinc-400">{'{{locationName}}'}</code>, <code className="text-zinc-400">{'{{eventId}}'}</code>
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
