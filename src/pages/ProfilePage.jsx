import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle2, User, Save, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { currentUser, updateProfileData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    birthDate: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: '',
    zip: '',
    country: '',
    experiencia: '',
    restricoes: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Se não estiver logado, redireciona para login
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Carrega dados do perfil atual
  useEffect(() => {
    if (currentUser?.profile) {
      const p = currentUser.profile;
      setFormData({
        nome: p.fullName || p.nome || '',
        birthDate: p.birthDate || '',
        phone: p.phone || p.telefone || '',
        address: p.address || p.endereco || '',
        neighborhood: p.neighborhood || p.bairro || '',
        city: p.city || p.cidade || '',
        zip: p.zip || p.cep || '',
        country: p.country || p.pais || '',
        experiencia: p.experiencia || '',
        restricoes: p.restricoes || ''
      });
    }
  }, [currentUser]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const updatedData = {
        fullName: formData.nome,
        nome: formData.nome,
        birthDate: formData.birthDate,
        phone: formData.phone,
        telefone: formData.phone,
        address: formData.address,
        endereco: formData.address,
        neighborhood: formData.neighborhood,
        bairro: formData.neighborhood,
        city: formData.city,
        cidade: formData.city,
        zip: formData.zip,
        cep: formData.zip,
        country: formData.country,
        pais: formData.country,
        experiencia: formData.experiencia,
        restricoes: formData.restricoes,
        updatedAt: new Date().toISOString()
      };

      await updateProfileData(updatedData);
      setSuccessMsg(t('auth.profileSuccess', 'Cadastro atualizado com sucesso!'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMsg(t('auth.profileError', 'Erro ao atualizar cadastro. Tente novamente.'));
    }
    setLoading(false);
  }

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <Navbar />

      <main className="flex-grow pt-44 md:pt-52 pb-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #222 0%, transparent 60%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-2xl mx-auto bg-[#0a0a0a] border border-[#222222] p-8 md:p-12 rounded-[2px] shadow-2xl relative z-10"
        >
          {/* Top Bar / Back */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1A1A24]">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-[#9A9A9A] hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('actions.back', 'Voltar')}</span>
            </button>
            <span className="text-[10px] uppercase font-heading tracking-[2px] text-accent font-bold px-2.5 py-1 bg-accent/10 border border-accent/20 rounded-[2px]">
              {t('auth.myProfile', 'Meu Perfil')}
            </span>
          </div>

          <div className="text-center mb-10">
            <h1 className="font-batang text-3xl text-[#F0EDE8] mb-2">{t('auth.profileTitle', 'Meu Perfil')}</h1>
            <p className="font-heading text-sm font-light text-[#9A9A9A]">{t('auth.profileSubtitle', 'Mantenha seus dados cadastrais atualizados.')}</p>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-sm font-heading rounded-[2px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 text-red-400 text-sm font-heading rounded-[2px]">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome Completo */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.fullNameLabel', 'Nome Completo *')}
                </label>
                <input
                  required
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder={t('auth.fullNamePlaceholder', 'Seu nome completo')}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                />
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.birthDateLabel', 'Data de Nascimento *')}
                </label>
                <input
                  required
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light [color-scheme:dark]"
                />
              </div>

              {/* E-mail (Apenas Leitura) */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.emailLabel', 'E-mail')}
                </label>
                <input
                  disabled
                  type="email"
                  value={currentUser?.email || ''}
                  className="w-full bg-[#1A1A1E] border border-[#2A2A35] text-[#888888] px-4 py-3 rounded-[2px] font-heading font-light cursor-not-allowed select-none"
                />
                <p className="text-[10px] text-[#666666] font-heading mt-1">
                  {t('auth.readOnlyEmail', 'O e-mail não pode ser alterado diretamente.')}
                </p>
              </div>

              {/* Telefone / WhatsApp */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.phoneLabel', 'Telefone / WhatsApp *')}
                </label>
                <input
                  required
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('auth.phonePlaceholder', '+55 ... / +47 ...')}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                />
              </div>

              {/* Endereço */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.addressLabel', 'Endereço *')}
                </label>
                <input
                  required
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t('auth.addressPlaceholder', 'Nome da rua, número')}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                />
              </div>

              {/* Bairro */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.neighborhoodLabel', 'Bairro *')}
                </label>
                <input
                  required
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  placeholder={t('auth.neighborhoodPlaceholder', 'Seu bairro')}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                />
              </div>

              {/* Cidade */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.cityLabel', 'Cidade *')}
                </label>
                <input
                  required
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t('auth.cityPlaceholder', 'Sua cidade')}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                />
              </div>

              {/* CEP / Código Postal */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.zipLabel', 'CEP / Código Postal *')}
                </label>
                <input
                  required
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder={t('auth.zipPlaceholder', '00000-000')}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                />
              </div>

              {/* País */}
              <div className="md:col-span-2">
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.countryLabel', 'País *')}
                </label>
                <input
                  required
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder={t('auth.countryPlaceholder', 'Brasil, Noruega...')}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
                />
              </div>

              {/* Experiência Prévia */}
              <div className="md:col-span-2">
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.experienceLabel', 'Experiência prévia com dança ou trabalho corporal?')}
                </label>
                <textarea
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleChange}
                  rows="2"
                  placeholder={t('auth.experiencePlaceholder', 'Conte-nos brevemente sobre sua experiência...')}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none placeholder:text-[#555555]"
                />
              </div>

              {/* Restrições */}
              <div className="md:col-span-2">
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.restrictionsLabel', 'Restrições físicas ou de saúde?')}
                </label>
                <textarea
                  name="restricoes"
                  value={formData.restricoes}
                  onChange={handleChange}
                  rows="2"
                  placeholder={t('auth.restrictionsPlaceholder', 'Alguma lesão ou condição que o professor deva saber?')}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none placeholder:text-[#555555]"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-accent text-primary font-heading text-[11px] uppercase tracking-[3px] font-semibold py-4 hover:bg-[#F0EDE8] transition-colors duration-300 rounded-[2px] mt-8 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? t('auth.savingProfile', 'Salvando...') : t('auth.saveProfile', 'Salvar Alterações')}</span>
            </button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
