import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSequenceLab from '../components/HeroSequenceLab';
import Activities from '../components/Activities';
import Philosophy from '../components/Philosophy';
import Protocol from '../components/Protocol';
import Action from '../components/Action';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { Smartphone, Monitor, Sparkles, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeLab = () => {
  // 'auto' detecta o dispositivo real, mas permite forçar 'mobile' ou 'desktop' para simulação
  const [forcedMode, setForcedMode] = useState('auto');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-primary text-background min-h-[100dvh] overflow-x-hidden relative">
      <SEOHead url="/lab" />

      {/* BARRA DE CONTROLE FLUTUANTE DO LABORATÓRIO (Apenas visível nesta rota de teste) */}
      <aside 
        aria-label="Controles do Laboratório"
        className="fixed top-20 right-4 z-50 flex flex-col items-end transition-all duration-300"
      >
        <div className="bg-[#12121A]/90 backdrop-blur-md border border-accent/40 rounded-2xl p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.8)] text-xs text-background flex flex-col gap-2">
          
          {/* Cabeçalho do Card */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-1.5 font-heading font-semibold text-accent">
              <Sparkles size={14} className="text-accent animate-spin" style={{ animationDuration: '6s' }} />
              <span>LAB DANCE2DANCE</span>
            </div>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="text-background/60 hover:text-background p-0.5 rounded transition-colors"
              title={collapsed ? "Expandir Controles" : "Recolher Controles"}
            >
              {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

          {/* Opções expandidas */}
          {!collapsed && (
            <>
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setForcedMode('auto')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    forcedMode === 'auto'
                      ? 'bg-accent text-primary font-bold shadow'
                      : 'text-background/70 hover:text-background'
                  }`}
                >
                  Auto
                </button>
                <button
                  onClick={() => setForcedMode('mobile')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all ${
                    forcedMode === 'mobile'
                      ? 'bg-accent text-primary font-bold shadow'
                      : 'text-background/70 hover:text-background'
                  }`}
                  title="Forçar visualização mobile"
                >
                  <Smartphone size={12} />
                  <span>Mobile</span>
                </button>
                <button
                  onClick={() => setForcedMode('desktop')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all ${
                    forcedMode === 'desktop'
                      ? 'bg-accent text-primary font-bold shadow'
                      : 'text-background/70 hover:text-background'
                  }`}
                  title="Forçar visualização desktop"
                >
                  <Monitor size={12} />
                  <span>Desktop</span>
                </button>
              </div>

              <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-background/60">
                <Link 
                  to="/" 
                  className="flex items-center gap-1 hover:text-accent transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Ver Original</span>
                  <ExternalLink size={10} />
                </Link>
                <span className="text-accent/80 font-mono">v2.0-Lab</span>
              </div>
            </>
          )}
        </div>
      </aside>

      <Navbar />

      <main>
        <HeroSequenceLab key={forcedMode} forcedMode={forcedMode} />
        <Activities />
        <Philosophy />
        <Protocol />
        <Action />
      </main>

      <Footer />
    </div>
  );
};

export default HomeLab;
