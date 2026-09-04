import React, { useState } from 'react';
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
      return setError('Digite seu e-mail acima para redefinir a senha.');
    }
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Verifique sua caixa de entrada para redefinir a senha.');
    } catch (err) {
      setError('Falha ao redefinir a senha. Verifique o e-mail digitado.');
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
      setError('Falha ao fazer login. Verifique seu email e senha.');
    }
    setLoading(false);
  }

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #222 0%, transparent 60%)' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md bg-[#0a0a0a] border border-[#222222] p-8 md:p-12 rounded-full shadow-2xl relative z-10"
        >
          <div className="text-center mb-10">
            <h1 className="font-batang text-3xl text-[#F0EDE8] mb-2">Bem-vindo de volta</h1>
            <p className="font-heading text-sm font-light text-[#9A9A9A]">Acesse sua conta para gerenciar suas aulas.</p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/20 text-green-400 text-sm font-heading rounded-full">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 text-red-400 text-sm font-heading rounded-full">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">E-mail</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-full font-heading font-light"
              />
            </div>
            
            <div>
              <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Senha</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-full font-heading font-light"
              />
            </div>

            <div className="flex justify-between items-center mt-2 mb-4">
              <button 
                type="button" 
                onClick={handleResetPassword}
                className="text-[#9A9A9A] hover:text-[#F0EDE8] text-xs font-heading transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>
            
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-accent text-primary font-heading text-[11px] uppercase tracking-[3px] font-semibold py-4 hover:bg-[#F0EDE8] transition-colors duration-300 rounded-full mt-4 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#222222] pt-6">
            <p className="font-heading text-sm text-[#9A9A9A] font-light">
              Ainda não tem uma conta? <Link to="/cadastro" className="text-accent hover:text-[#F0EDE8] transition-colors">Criar conta</Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
