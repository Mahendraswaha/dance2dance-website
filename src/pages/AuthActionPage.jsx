import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { applyActionCode, checkActionCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AuthActionPage() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Estados apenas para o reset de senha
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (!mode || !oobCode) {
      setStatus('error');
      setErrorMessage(t('authAction.invalidLink', 'O link é inválido ou está incompleto.'));
      return;
    }

    if (mode === 'verifyEmail') {
      handleVerifyEmail(oobCode);
    } else if (mode === 'resetPassword') {
      // Apenas verifica se o cdigo de reset  vǭlido antes de mostrar o formulǭrio
      handleCheckResetCode(oobCode);
    } else {
      setStatus('error');
      setErrorMessage(t('authAction.unknownMode', 'Ação não reconhecida.'));
    }
  }, [mode, oobCode]);

  async function handleVerifyEmail(code) {
    try {
      await applyActionCode(auth, code);
      setStatus('success');
      // Se o usuǭrio estiver logado, podemos forar um reload nele silenciosamente
      if (auth.currentUser) {
        await auth.currentUser.reload();
      }
    } catch (error) {
      console.error('Verify Email Error:', error);
      setStatus('error');
      setErrorMessage(t('authAction.verifyError', 'Este link de verificação já foi usado ou expirou. Tente solicitar um novo e-mail no seu perfil.'));
    }
  }

  async function handleCheckResetCode(code) {
    try {
      await checkActionCode(auth, code);
      setStatus('awaiting_password');
    } catch (error) {
      console.error('Check Reset Code Error:', error);
      setStatus('error');
      setErrorMessage(t('authAction.resetError', 'O link de redefinição de senha expirou ou é inválido.'));
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.success(t('auth.passwordTooShort', 'A senha deve ter pelo menos 6 caracteres.'));
      return;
    }

    setIsResetting(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus('success');
    } catch (error) {
      console.error('Confirm Reset Error:', error);
      setStatus('error');
      setErrorMessage(error.message);
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-4 relative">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #222 0%, transparent 60%)' }} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#0a0a0a] border border-[#222222] p-8 sm:p-10 rounded-[2px] shadow-2xl relative z-10"
        >
          {status === 'loading' && (
            <div className="text-center py-8">
              <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-6" />
              <h2 className="font-batang text-2xl text-[#F0EDE8] mb-2">{t('authAction.processing', 'Processando...')}</h2>
              <p className="text-sm text-zinc-400">{t('authAction.wait', 'Por favor, aguarde enquanto validamos seu link.')}</p>
            </div>
          )}

          {status === 'success' && mode === 'verifyEmail' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-900/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="font-batang text-3xl text-[#F0EDE8] mb-4">{t('authAction.verifiedTitle', 'E-mail Confirmado!')}</h2>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                {t('authAction.verifiedDesc', 'Sua conta foi verificada com sucesso. Agora você tem acesso completo para se inscrever em nossos workshops e eventos.')}
              </p>
              <Link 
                to="/agenda"
                className="w-full flex items-center justify-center gap-2 bg-accent text-primary hover:bg-[#F0EDE8] transition-colors font-heading text-[11px] font-bold uppercase tracking-[2px] py-4 rounded-[2px]"
              >
                {t('authAction.goToAgenda', 'Ir para a Agenda')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {status === 'awaiting_password' && mode === 'resetPassword' && (
            <div className="py-2">
              <h2 className="font-batang text-3xl text-[#F0EDE8] mb-2 text-center">{t('authAction.resetTitle', 'Nova Senha')}</h2>
              <p className="text-zinc-400 text-sm mb-8 text-center leading-relaxed">
                {t('authAction.resetDesc', 'Digite sua nova senha abaixo para redefinir o acesso à sua conta.')}
              </p>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-semibold uppercase tracking-[2px] text-zinc-500 ml-1">
                    {t('auth.newPassword', 'Nova Senha')}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#0F0F13] border border-[#222222] text-[#F0EDE8] text-sm px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px]"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full btn-magnetic bg-accent text-primary font-heading text-[11px] uppercase tracking-[2px] font-bold py-4 hover:bg-[#F0EDE8] transition-colors rounded-[2px] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('authAction.savePassword', 'Salvar Nova Senha')}
                </button>
              </form>
            </div>
          )}

          {status === 'success' && mode === 'resetPassword' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-900/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="font-batang text-3xl text-[#F0EDE8] mb-4">{t('authAction.passwordSaved', 'Senha Redefinida')}</h2>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                {t('authAction.passwordSavedDesc', 'Sua nova senha foi salva com sucesso. Você já pode acessar sua conta.')}
              </p>
              <Link 
                to="/login"
                className="w-full flex items-center justify-center gap-2 bg-accent text-primary hover:bg-[#F0EDE8] transition-colors font-heading text-[11px] font-bold uppercase tracking-[2px] py-4 rounded-[2px]"
              >
                {t('auth.login', 'Fazer Login')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-900/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="font-batang text-2xl text-[#F0EDE8] mb-4">{t('authAction.errorTitle', 'Ops, algo deu errado')}</h2>
              <p className="text-red-300 text-sm mb-8 leading-relaxed">
                {errorMessage}
              </p>
              <Link 
                to="/"
                className="w-full flex items-center justify-center gap-2 bg-[#1A1A24] text-white hover:bg-[#2A2A35] transition-colors font-heading text-[11px] font-bold uppercase tracking-[2px] py-4 rounded-[2px]"
              >
                {t('nav.home', 'Voltar para o Início')}
              </Link>
            </div>
          )}

        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
