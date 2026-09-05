import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { TURNSTILE_SITE_KEY } from '../utils/constants';

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();

  const isExecutiveMeeting = searchParams.get('subject') === 'reuniao-executiva';

  const [formData, setFormData] = useState({
    name: currentUser?.profile?.fullName || currentUser?.profile?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.profile?.phone || '',
    address: currentUser?.profile?.address || '',
    city: currentUser?.profile?.city || '',
    neighborhood: currentUser?.profile?.neighborhood || '',
    zip: currentUser?.profile?.zip || '',
    country: currentUser?.profile?.country || '',
    subject: isExecutiveMeeting ? 'reuniao-executiva' : 'geral',
    message: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || currentUser.profile?.fullName || currentUser.profile?.name || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.profile?.phone || '',
        address: prev.address || currentUser.profile?.address || '',
        city: prev.city || currentUser.profile?.city || '',
        neighborhood: prev.neighborhood || currentUser.profile?.neighborhood || '',
        zip: prev.zip || currentUser.profile?.zip || '',
        country: prev.country || currentUser.profile?.country || ''
      }));
    }
  }, [currentUser]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    if (isExecutiveMeeting) {
      setFormData(prev => ({ ...prev, subject: 'reuniao-executiva' }));
    }
  }, [isExecutiveMeeting]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.email.trim()) {
      setError(t('contactPage.emailRequired', 'Por favor, insira um e-mail válido.'));
      return;
    }

    if (!turnstileToken) {
      setError(t('contactPage.captchaRequired', 'Por favor, aguarde a verificação de segurança.'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'contacts'), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject || 'geral',
        message: formData.message.trim(),
        turnstileToken, // Save token for future backend validation if needed
        status: 'unread',
        createdAt: new Date().toISOString()
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError(t('contactPage.sendError', 'Falha ao enviar mensagem. Tente novamente mais tarde.'));
    }
    setLoading(false);
  }

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <Navbar />

      <main className="flex-grow pt-44 md:pt-52 pb-24 px-6 max-w-6xl mx-auto w-full relative z-10">
        
        {/* Cabeçalho */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="font-heading text-xs uppercase tracking-[4px] text-accent font-semibold block mb-4">
            {t('contactPage.kicker', 'CONTATO & PARCERIAS')}
          </span>
          <h1 className="font-drama text-5xl md:text-7xl text-[#F0EDE8] mb-6">
            {isExecutiveMeeting 
              ? t('contactPage.executiveTitle', 'Agendar Reunião Executiva')
              : t('contactPage.title', 'Entre em Contato')}
          </h1>
          <p className="font-heading text-[#9A9A9A] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {isExecutiveMeeting
              ? t('contactPage.executiveSubtitle', 'Conecte sua organização ou empresa com o Dance 2 Dance para projetos sociais, bem-estar corporativo ou parcerias.')
              : t('contactPage.subtitle', 'Tem dúvidas sobre workshops, aulas regulares ou parcerias institucionais? Fale diretamente conosco.')}
          </p>
        </motion.div>

        {/* Grid: Formulário (Esq) + Info Card (Dir) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Card do Formulário */}
          <div className="lg:col-span-7 bg-[#0d0d12] border border-[#22222a] p-8 md:p-10 rounded-[4px] shadow-2xl">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-6 text-accent">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-drama text-3xl text-[#F0EDE8] mb-3">
                  {t('contactPage.successTitle', 'Mensagem Enviada!')}
                </h3>
                <p className="font-heading text-sm text-[#9A9A9A] max-w-md mx-auto mb-8 leading-relaxed">
                  {t('contactPage.successDesc', 'Recebemos sua mensagem com sucesso. Entraremos em contato o mais breve possível.')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="px-6 py-3 border border-[#333333] hover:border-accent text-[#CFCFCF] hover:text-accent font-heading text-xs uppercase tracking-wider font-semibold rounded-[2px] transition-colors"
                >
                  {t('contactPage.sendAnother', 'Enviar Outra Mensagem')}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="p-4 rounded-[2px] bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-heading">
                    {error}
                  </div>
                )}

                {/* E-mail (OBRIGATÓRIO) */}
                <div>
                  <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                    {t('contactPage.emailLabel', 'E-mail')} <span className="text-accent">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contactPage.emailPlaceholder', 'seuemail@exemplo.com')}
                    className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                  />
                </div>

                {/* Nome e Telefone/WhatsApp (Lado a Lado) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.nameLabel', 'Nome (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contactPage.namePlaceholder', 'Seu nome ou empresa')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>

                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.phoneLabel', 'Telefone / WhatsApp (Opcional)')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('contactPage.phonePlaceholder', '+47 ...')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>
                </div>
                {/* Endereço e Cidade (Lado a Lado) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.addressLabel', 'Endereço (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={t('contactPage.addressPlaceholder', 'Nome da rua, número')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>

                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.cityLabel', 'Cidade (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={t('contactPage.cityPlaceholder', 'Sua cidade')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.zipLabel', 'CEP / Código Postal (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder={t('contactPage.zipPlaceholder', '00000-000')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.countryLabel', 'País (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder={t('contactPage.countryPlaceholder', 'Norway...')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>
                </div>

                {/* Assunto */}
                <div>
                  <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                    {t('contactPage.subjectLabel', 'Assunto')}
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm cursor-pointer"
                  >
                    <option value="geral">{t('contactPage.subjectGeneral', 'Dúvidas Gerais / Informações')}</option>
                    <option value="reuniao-executiva">{t('contactPage.subjectExecutive', 'Reunião Executiva / Projeto Social')}</option>
                    <option value="biostretch-empresas">{t('contactPage.subjectCorporate', 'Biostretch para Empresas')}</option>
                    <option value="sessao-individual">{t('contactPage.subjectIndividual', 'Sessão Individual / Personal')}</option>
                    <option value="parcerias">{t('contactPage.subjectPartnership', 'Parcerias & Patrocínios')}</option>
                  </select>
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                    {t('contactPage.messageLabel', 'Mensagem *')}
                  </label>
                  <textarea
                    required
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contactPage.messagePlaceholder', 'Como podemos te ajudar?')}
                    className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555] resize-none"
                  />
                </div>

                <Turnstile
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={(token) => setTurnstileToken(token)}
                  options={{
                    theme: 'dark'
                  }}
                />

                {/* Botão de Enviar */}
                <button
                  type="submit"
                  disabled={loading || !turnstileToken}
                  className="w-full btn-magnetic bg-accent text-primary font-heading text-xs uppercase tracking-[3px] font-bold py-4 rounded-full hover:bg-[#F0EDE8] transition-colors duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(200,160,80,0.2)] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? t('contactPage.sending', 'Enviando...') : t('contactPage.submitBtn', 'Enviar Mensagem')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Card Lateral: Informações e Filosofia */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#0d0d12] border border-[#22222a] p-8 rounded-[4px]">
              <h3 className="font-drama text-2xl text-[#F0EDE8] mb-4">
                Dance<span className="text-accent text-[1.28em]">2</span>Dance
              </h3>
              <p className="font-heading text-sm text-[#9A9A9A] leading-relaxed mb-6 font-light">
                {t('contactPage.infoDesc', 'Espaço de encontro, movimento e transformação social através da arte da dança e do bem-estar corporal.')}
              </p>

              <div className="space-y-4 pt-4 border-t border-[#1A1A24] font-heading text-xs text-[#CFCFCF]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#F0EDE8]">Oslo, Norway</strong>
                    
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <a href="mailto:contact@dance2dance.no" className="hover:text-accent transition-colors">
                    contact@dance2dance.no
                  </a>
                </div>
              </div>
            </div>

            {/* Banner de Direcionamento rápido para Workshops */}
            <div className="p-8 rounded-[4px] border border-accent/20 bg-gradient-to-br from-accent/10 to-transparent">
              <span className="font-heading text-[10px] uppercase tracking-[2px] text-accent font-bold block mb-2">
                {t('contactPage.bannerKicker', 'AGENDA ATIVA')}
              </span>
              <h4 className="font-drama text-2xl text-[#F0EDE8] mb-3">
                {t('contactPage.bannerTitle', 'Quer participar de um workshop?')}
              </h4>
              <p className="font-heading text-xs text-[#9A9A9A] leading-relaxed mb-6">
                {t('contactPage.bannerDesc', 'Confira nossas próximas datas e garanta sua vaga diretamente na nossa programação oficial.')}
              </p>
              <Link 
                to="/agenda" 
                className="inline-flex items-center gap-2 text-xs font-heading font-bold text-accent hover:text-[#F0EDE8] transition-colors uppercase tracking-wider"
              >
                <span>{t('contactPage.bannerCta', 'Explorar Agenda')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
