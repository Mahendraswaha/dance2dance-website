const fs = require('fs');

// 1. Locales
const authTranslations = {
  pt: {
    signupTitle: "Criar Conta",
    signupSubtitle: "Junte-se ao Dance2Dance e reserve suas aulas.",
    loginTitle: "Bem-vindo de volta",
    loginSubtitle: "Acesse sua conta para gerenciar suas aulas.",
    fullNameLabel: "Nome Completo *",
    fullNamePlaceholder: "Seu nome completo",
    emailLabel: "E-mail *",
    emailPlaceholder: "seuemail@exemplo.com",
    passwordLabel: "Senha *",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirmar Senha *",
    confirmPasswordPlaceholder: "••••••••",
    phoneLabel: "Telefone / WhatsApp *",
    phonePlaceholder: "+55 ... / +47 ...",
    addressLabel: "Endereço *",
    addressPlaceholder: "Nome da rua, número",
    neighborhoodLabel: "Bairro *",
    neighborhoodPlaceholder: "Seu bairro",
    cityLabel: "Cidade *",
    cityPlaceholder: "Sua cidade",
    zipLabel: "CEP / Código Postal *",
    zipPlaceholder: "00000-000",
    countryLabel: "País *",
    countryPlaceholder: "Brasil, Noruega...",
    experienceLabel: "Experiência prévia com dança?",
    experiencePlaceholder: "Conte-nos brevemente sobre sua experiência...",
    restrictionsLabel: "Restrições físicas ou de saúde?",
    restrictionsPlaceholder: "Alguma lesão ou condição que o professor deva saber?",
    signupBtn: "Criar Conta",
    creatingAccount: "Criando Conta...",
    alreadyHaveAccount: "Já tem uma conta?",
    loginLink: "Entrar",
    loginBtn: "Entrar",
    loggingIn: "Entrando...",
    noAccount: "Ainda não tem uma conta?",
    createAccountLink: "Criar conta",
    forgotPassword: "Esqueceu a senha?",
    passwordMismatch: "As senhas não coincidem.",
    signupError: "Falha ao criar conta. Verifique se o e-mail já está em uso.",
    loginError: "Falha ao fazer login. Verifique seu email e senha.",
    resetEnterEmail: "Digite seu e-mail acima para redefinir a senha.",
    resetSuccess: "Verifique sua caixa de entrada para redefinir a senha.",
    resetError: "Falha ao redefinir a senha. Verifique o e-mail digitado."
  },
  en: {
    signupTitle: "Create Account",
    signupSubtitle: "Join Dance2Dance and book your classes.",
    loginTitle: "Welcome Back",
    loginSubtitle: "Access your account to manage your classes.",
    fullNameLabel: "Full Name *",
    fullNamePlaceholder: "Your full name",
    emailLabel: "Email *",
    emailPlaceholder: "your.email@example.com",
    passwordLabel: "Password *",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirm Password *",
    confirmPasswordPlaceholder: "••••••••",
    phoneLabel: "Phone / WhatsApp *",
    phonePlaceholder: "+47 ...",
    addressLabel: "Address *",
    addressPlaceholder: "Street name, number",
    neighborhoodLabel: "Neighborhood / District *",
    neighborhoodPlaceholder: "Your neighborhood",
    cityLabel: "City *",
    cityPlaceholder: "Your city",
    zipLabel: "ZIP / Postal Code *",
    zipPlaceholder: "Postal / ZIP code (e.g. 0190)",
    countryLabel: "Country *",
    countryPlaceholder: "Norway...",
    experienceLabel: "Previous dance experience?",
    experiencePlaceholder: "Tell us briefly about your dance experience...",
    restrictionsLabel: "Physical or health restrictions?",
    restrictionsPlaceholder: "Any injury or condition the instructor should know about?",
    signupBtn: "Create Account",
    creatingAccount: "Creating Account...",
    alreadyHaveAccount: "Already have an account?",
    loginLink: "Log in",
    loginBtn: "Log In",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account yet?",
    createAccountLink: "Create account",
    forgotPassword: "Forgot password?",
    passwordMismatch: "Passwords do not match.",
    signupError: "Failed to create account. Check if the email is already in use.",
    loginError: "Failed to log in. Please check your email and password.",
    resetEnterEmail: "Enter your email above to reset your password.",
    resetSuccess: "Check your inbox for password reset instructions.",
    resetError: "Failed to reset password. Please check the entered email."
  },
  no: {
    signupTitle: "Opprett Konto",
    signupSubtitle: "Bli med i Dance2Dance og bestill dine timer.",
    loginTitle: "Velkommen Tilbake",
    loginSubtitle: "Logg inn på kontoen din for å administrere timene dine.",
    fullNameLabel: "Fullt Navn *",
    fullNamePlaceholder: "Ditt fulle navn",
    emailLabel: "E-post *",
    emailPlaceholder: "din.epost@eksempel.no",
    passwordLabel: "Passord *",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Bekreft Passord *",
    confirmPasswordPlaceholder: "••••••••",
    phoneLabel: "Telefon / WhatsApp *",
    phonePlaceholder: "+47 ...",
    addressLabel: "Adresse *",
    addressPlaceholder: "Gatenavn, husnummer",
    neighborhoodLabel: "Nabolag / Bydel *",
    neighborhoodPlaceholder: "Ditt nabolag",
    cityLabel: "By *",
    cityPlaceholder: "Din by",
    zipLabel: "Postnummer *",
    zipPlaceholder: "Postnummer (f.eks. 0190)",
    countryLabel: "Land *",
    countryPlaceholder: "Norge...",
    experienceLabel: "Tidligere danseerfaring?",
    experiencePlaceholder: "Fortell oss kort om din erfaring...",
    restrictionsLabel: "Fysiske eller helsemessige hensyn?",
    restrictionsPlaceholder: "Skader eller tilstander læreren bør vite om?",
    signupBtn: "Opprett Konto",
    creatingAccount: "Oppretter Konto...",
    alreadyHaveAccount: "Har du allerede en konto?",
    loginLink: "Logg inn",
    loginBtn: "Logg Inn",
    loggingIn: "Logger inn...",
    noAccount: "Har du ikke konto ennå?",
    createAccountLink: "Opprett konto",
    forgotPassword: "Glemt passord?",
    passwordMismatch: "Passordene samsvarer ikke.",
    signupError: "Kunne ikke opprette konto. Sjekk om e-posten allerede er i bruk.",
    loginError: "Kunne ikke logge inn. Vennligst sjekk e-post og passord.",
    resetEnterEmail: "Skriv inn e-posten din ovenfor for å tilbakestille passordet.",
    resetSuccess: "Sjekk innboksen din for å tilbakestille passordet.",
    resetError: "Kunne ikke tilbakestille passordet. Sjekk oppgitt e-post."
  }
};

['pt', 'en', 'no'].forEach(lang => {
  const filePath = `src/i18n/locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.auth = authTranslations[lang];
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
});
console.log('Locales updated with auth translations');

// 2. SignupPage.jsx
const signupCode = `import React, { useState } from 'react';
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
              <div>
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
              
              <div className="md:col-span-2">
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                  {t('auth.experienceLabel', 'Experiência prévia com dança?')}
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
`;

fs.writeFileSync('src/pages/SignupPage.jsx', signupCode, 'utf8');
console.log('SignupPage.jsx updated');

// 3. LoginPage.jsx
const loginCode = `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleResetPassword(e) {
    e.preventDefault();
    if (!email) {
      return setError(t('auth.resetEnterEmail', 'Digite seu e-mail acima para redefinir a senha.'));
    }
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage(t('auth.resetSuccess', 'Verifique sua caixa de entrada para redefinir a senha.'));
    } catch (err) {
      setError(t('auth.resetError', 'Falha ao redefinir a senha. Verifique o e-mail digitado.'));
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(t('auth.loginError', 'Falha ao fazer login. Verifique seu email e senha.'));
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
          className="w-full max-w-md mx-auto bg-[#0a0a0a] border border-[#222222] p-8 md:p-12 rounded-[2px] shadow-2xl relative z-10"
        >
          <div className="text-center mb-10">
            <h1 className="font-batang text-3xl text-[#F0EDE8] mb-2">{t('auth.loginTitle', 'Bem-vindo de volta')}</h1>
            <p className="font-heading text-sm font-light text-[#9A9A9A]">{t('auth.loginSubtitle', 'Acesse sua conta para gerenciar suas aulas.')}</p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/20 text-green-400 text-sm font-heading rounded-[2px]">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 text-red-400 text-sm font-heading rounded-[2px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                {t('auth.emailLabel', 'E-mail *')}
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder', 'seuemail@exemplo.com')}
                className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
              />
            </div>
            
            <div>
              <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                {t('auth.passwordLabel', 'Senha *')}
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder', '••••••••')}
                className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light placeholder:text-[#555555]"
              />
            </div>

            <div className="flex justify-between items-center mt-2 mb-4">
              <button 
                type="button" 
                onClick={handleResetPassword}
                className="text-[#9A9A9A] hover:text-[#F0EDE8] text-xs font-heading transition-colors"
              >
                {t('auth.forgotPassword', 'Esqueceu a senha?')}
              </button>
            </div>
            
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-accent text-primary font-heading text-[11px] uppercase tracking-[3px] font-semibold py-4 hover:bg-[#F0EDE8] transition-colors duration-300 rounded-full mt-4 disabled:opacity-50"
            >
              {loading ? t('auth.loggingIn', 'Entrando...') : t('auth.loginBtn', 'Entrar')}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#222222] pt-6">
            <p className="font-heading text-sm text-[#9A9A9A] font-light">
              {t('auth.noAccount', 'Ainda não tem uma conta?')}{' '}
              <Link to="/cadastro" className="text-accent hover:text-[#F0EDE8] transition-colors">
                {t('auth.createAccountLink', 'Criar conta')}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
`;

fs.writeFileSync('src/pages/LoginPage.jsx', loginCode, 'utf8');
console.log('LoginPage.jsx updated');
