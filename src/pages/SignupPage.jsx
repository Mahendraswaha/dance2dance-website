import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefone: '',
    endereco: '',
    cep: '',
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
      return setError('As senhas não coincidem.');
    }
    
    try {
      setError('');
      setLoading(true);
      
      const userData = {
        nome: formData.nome,
        telefone: formData.telefone,
        endereco: formData.endereco,
        cep: formData.cep,
        experiencia: formData.experiencia,
        restricoes: formData.restricoes,
        role: 'student'
      };
      
      await signup(formData.email, formData.password, userData);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Falha ao criar conta. Verifique se o e-mail já está em uso.');
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
          className="w-full max-w-2xl bg-[#0a0a0a] border border-[#222222] p-8 md:p-12 rounded-full shadow-2xl relative z-10"
        >
          <div className="text-center mb-10">
            <h1 className="font-batang text-3xl text-[#F0EDE8] mb-2">Criar Conta</h1>
            <p className="font-heading text-sm font-light text-[#9A9A9A]">Junte-se ao Dance2Dance e reserve suas aulas.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 text-red-400 text-sm font-heading rounded-full">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Nome Completo *</label>
                <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-full font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">E-mail *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-full font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Senha *</label>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-full font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Confirmar Senha *</label>
                <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-full font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Telefone *</label>
                <input required type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-full font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Código Postal (CEP) *</label>
                <input required type="text" name="cep" value={formData.cep} onChange={handleChange} placeholder="Ex: 0190 (Tøyen)" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-full font-heading font-light" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Endereço Completo</label>
                <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-full font-heading font-light" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Experiência prévia com dança?</label>
                <textarea name="experiencia" value={formData.experiencia} onChange={handleChange} rows="2" placeholder="Conte-nos brevemente sobre sua experiência..." className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-full font-heading font-light resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Restrições físicas ou de saúde?</label>
                <textarea name="restricoes" value={formData.restricoes} onChange={handleChange} rows="2" placeholder="Alguma lesão ou condição que o professor deva saber?" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-full font-heading font-light resize-none" />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-accent text-primary font-heading text-[11px] uppercase tracking-[3px] font-semibold py-4 hover:bg-[#F0EDE8] transition-colors duration-300 rounded-full mt-8 disabled:opacity-50"
            >
              {loading ? 'Criando Conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#222222] pt-6">
            <p className="font-heading text-sm text-[#9A9A9A] font-light">
              Já tem uma conta? <Link to="/login" className="text-accent hover:text-[#F0EDE8] transition-colors">Entrar</Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
