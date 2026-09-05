import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SignupPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nome: '',
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    neighborhood: '',
    zip: '',
    country: '',
    experiencia: '',
    restricoes: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError(t('auth.passwordMismatch', 'As senhas não coincidem.'));
    }
    
    try {
      setError('');
      setLoading(true);
      
      const userData = {
        fullName: formData.nome,
        nome: formData.nome, // fallback for legacy
        birthDate: formData.birthDate,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        neighborhood: formData.neighborhood,
        zip: formData.zip,
        country: formData.country,
        telefone: formData.phone, // fallback
        endereco: formData.address, // fallback
        cep: formData.zip, // fallback
        experiencia: formData.experiencia,
        restricoes: formData.restricoes,
        role: 'student'
      };
      
      await signup(formData.email, formData.password, userData);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(t('auth.signupError', 'Falha ao criar conta. Verifique se o e-mail já está em uso.'));
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
          <div className="text-center mb-10">
            <h1 className="font-batang text-3xl text-[#F0EDE8] mb-2">{t('auth.signupTitle', 'Criar Conta')}</h1>
            <p className="font-heading text-sm font-light text-[#9A9A9A]">{t('auth.signupSubtitle', 'Junte-se ao Dance2Dance e reserve suas aulas.')}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 text-red-400 text-sm font-heading rounded-[2px]">
              {error}
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

              {/* E-mail */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.emailLabel', 'E-mail *')}
                </label>
                <input 
                  required 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder={t('auth.emailPlaceholder', 'seuemail@exemplo.com')}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]" 
                />
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

              {/* Senha */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.passwordLabel', 'Senha *')}
                </label>
                <input 
                  required 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder={t('auth.passwordPlaceholder', '••••••••')}
                  className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]" 
                />
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.confirmPasswordLabel', 'Confirmar Senha *')}
                </label>
                <input 
                  required 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder={t('auth.confirmPasswordPlaceholder', '••••••••')}
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
              className="w-full bg-accent text-primary font-heading text-[11px] uppercase tracking-[3px] font-semibold py-4 hover:bg-[#F0EDE8] transition-colors duration-300 rounded-[2px] mt-8 disabled:opacity-50"
            >
              {loading ? t('auth.creatingAccount', 'Criando Conta...') : t('auth.signupBtn', 'Criar Conta')}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#222222] pt-6">
            <p className="font-heading text-sm text-[#9A9A9A] font-light">
              {t('auth.alreadyHaveAccount', 'Já tem uma conta?')}{' '}
              <Link to="/login" className="text-accent hover:text-[#F0EDE8] transition-colors">
                {t('auth.loginLink', 'Entrar')}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
