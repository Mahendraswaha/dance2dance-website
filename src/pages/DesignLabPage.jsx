import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSequence from '../components/HeroSequence';
import Philosophy from '../components/Philosophy';
import Protocol from '../components/Protocol';
import Action from '../components/Action';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { Sparkles, Sun, Moon } from 'lucide-react';

export default function DesignLabPage() {
  const { t } = useTranslation();
  // Permite ao usuário e aos amigos alternar e comparar visualmente
  const [styleMode, setStyleMode] = useState('linen'); // 'linen' (luz nas atividades) ou 'stage' (iluminação de palco)

  return (
    <div className="bg-[#0D0D12] text-background min-h-[100dvh] overflow-x-hidden selection:bg-accent/30 selection:text-background">
      <SEOHead 
        title="Design Lab — Proposta Visual | Dance2Dance"
        description="Laboratório de teste visual: transições de seção, iluminação e contraste mantendo textos e diagramação originais."
        url="/lab"
      />

      <Navbar />

      {/* Barra de Controle Flutuante do Laboratório */}
      <aside aria-label="Controles do Design Lab" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#141418]/95 backdrop-blur-md border border-[#C9A84C]/40 px-4 py-2.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center gap-3 text-xs font-heading">
        <div className="flex items-center gap-2 pr-2 border-r border-white/10">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent uppercase tracking-wider font-semibold">Design Lab</span>
        </div>

        <span className="text-background/60 hidden sm:inline text-[11px]">Seção Atividades:</span>
        
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/5">
          <button
            onClick={() => setStyleMode('linen')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              styleMode === 'linen'
                ? 'bg-[#F5F2EB] text-[#1A1715] shadow-sm font-semibold'
                : 'text-background/60 hover:text-background'
            }`}
          >
            <Sun size={12} className={styleMode === 'linen' ? 'text-[#8C6D23]' : ''} />
            <span>Linho Claro</span>
          </button>

          <button
            onClick={() => setStyleMode('stage')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              styleMode === 'stage'
                ? 'bg-accent text-[#0D0D12] shadow-sm font-semibold'
                : 'text-background/60 hover:text-background'
            }`}
          >
            <Moon size={12} />
            <span>Iluminação de Palco</span>
          </button>
        </div>
      </aside>

      <main>
        {/* ==============================================================
            1. HERO SEQUENCE
            Mantida 100% original para preservar a fusão exata do vídeo
        ============================================================== */}
        <HeroSequence />

        {/* ==============================================================
            TRANSIÇÃO MARCADA: HERO -> ATIVIDADES
            Delimitação sutil e elegante com divisor em degradê dourado
        ============================================================== */}
        <div className="relative z-20 w-full flex flex-col items-center justify-center -mt-8 mb-4 pointer-events-none">
          <div className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        </div>

        {/* ==============================================================
            2. ATIVIDADES (WORKSHOPS) — PROPOSTA VISUAL
            Exatos mesmos textos, fontes e logos — testando a atmosfera
        ============================================================== */}
        {styleMode === 'linen' ? (
          /* VARIAÇÃO A: RESPIRO EM LINHO NÓRDICO (#F5F2EB) */
          <section id="workshops" className="pt-32 pb-28 px-8 bg-[#F5F2EB] text-[#1A1715] min-h-screen flex items-center transition-colors duration-500 relative z-10">
            <div className="max-w-[1200px] w-full mx-auto text-center">
              
              <p className="font-heading text-[10px] tracking-[5px] uppercase text-[#8C6D23] font-semibold mb-5">
                {t("activities.kicker")}
              </p>
              
              <h2 className="font-batang text-[38px] font-normal text-[#1A1715] mb-4 leading-tight tracking-tight">
                {t("activities.title")}
              </h2>
              
              <div className="w-12 h-[1.5px] bg-[#C9A84C] mx-auto mb-16" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
                
                {/* Card 1 - Be The Dance */}
                <Link 
                  to="/be-the-dance" 
                  className="group relative bg-[#FFFFFF] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#E5DFD3] rounded-[2px] hover:-translate-y-[10px] hover:border-[#8BBCD8]/80 hover:shadow-[0_20px_50px_rgba(40,30,20,0.08)] flex flex-col items-center"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(139,188,216,0.35)_0%,transparent_70%)]" />
                  
                  <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
                    <img src="/logo-bethedance.png" alt="Be the Dance" className="max-h-full max-w-[150px] object-contain" />
                  </div>
                  
                  <h3 className="text-[22px] font-normal text-[#1A1715] mb-3.5 tracking-wide relative z-10 font-batang">
                    Be the Dance
                  </h3>
                  
                  <div className="w-7 h-[1px] bg-[#8C6D23]/30 group-hover:bg-[#8BBCD8] mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10" />
                  
                  <p className="font-heading text-[14px] leading-[1.75] text-[#5C554E] font-light relative z-10">
                    {t("activities.card1.desc")}
                  </p>
                </Link>
                
                {/* Card 2 - Biostretch */}
                <Link 
                  to="/biostretch" 
                  className="group relative bg-[#FFFFFF] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#E5DFD3] rounded-[2px] hover:-translate-y-[10px] hover:border-[#5AA87A]/80 hover:shadow-[0_20px_50px_rgba(40,30,20,0.08)] flex flex-col items-center"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(90,168,122,0.35)_0%,transparent_70%)]" />
                  
                  <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
                    <img src="/logo-biostretch.png" alt="Biostretch" className="max-h-full max-w-[180px] scale-110 object-contain" />
                  </div>
                  
                  <h3 className="text-[22px] font-normal text-[#1A1715] mb-3.5 tracking-wide relative z-10 font-batang">
                    Biostretch
                  </h3>
                  
                  <div className="w-7 h-[1px] bg-[#8C6D23]/30 group-hover:bg-[#5AA87A] mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10" />
                  
                  <p className="font-heading text-[14px] leading-[1.75] text-[#5C554E] font-light relative z-10">
                    {t("activities.card2.desc")}
                  </p>
                </Link>
                
                {/* Card 3 - Kroppsskole */}
                <Link 
                  to="/kroppsskole" 
                  className="group relative bg-[#FFFFFF] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#E5DFD3] rounded-[2px] hover:-translate-y-[10px] hover:border-[#4A9B8E]/80 hover:shadow-[0_20px_50px_rgba(40,30,20,0.08)] flex flex-col items-center"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(74,155,142,0.35)_0%,transparent_70%)]" />
                  
                  <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
                    <img src="/logo-kroppsskole.png" alt="Kroppsskole" className="max-h-full max-w-[150px] object-contain" />
                  </div>
                  
                  <h3 className="text-[22px] font-normal text-[#1A1715] mb-3.5 tracking-wide relative z-10 font-batang">
                    Kroppsskole
                  </h3>
                  
                  <div className="w-7 h-[1px] bg-[#8C6D23]/30 group-hover:bg-[#4A9B8E] mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10" />
                  
                  <p className="font-heading text-[14px] leading-[1.75] text-[#5C554E] font-light relative z-10">
                    {t("activities.card3.desc")}
                  </p>
                </Link>

              </div>
              
              <div className="mt-16">
                <Link 
                  to="/agenda" 
                  className="inline-block font-heading text-[11px] tracking-[4px] uppercase text-[#8C6D23] border-b border-[#8C6D23]/40 pb-2 transition-all duration-300 hover:border-[#1A1715] hover:text-[#1A1715]"
                >
                  {t("activities.cta")}
                </Link>
              </div>
              
            </div>
          </section>
        ) : (
          /* VARIAÇÃO B: ILUMINAÇÃO DE PALCO (FUNDO ESCURO ORIGINAL COM SPOTLIGHT DE TEATRO) */
          <section id="workshops" className="pt-32 pb-24 px-8 bg-[#0C0C0C] min-h-screen flex items-center relative overflow-hidden">
            {/* Halo de luz ambiente sutil atrás do conteúdo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl" />

            <div className="max-w-[1200px] w-full mx-auto text-center relative z-10">
              
              <p className="font-heading text-[10px] tracking-[5px] uppercase text-accent mb-5">
                {t("activities.kicker")}
              </p>
              
              <h2 className="font-batang text-[38px] font-normal text-[#F0EDE8] mb-4 leading-tight tracking-tight">
                {t("activities.title")}
              </h2>
              
              <div className="w-12 h-[1px] bg-[#C4B49A]/70 mx-auto mb-16" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
                
                {/* Card 1 - Be The Dance */}
                <Link to="/be-the-dance" className="group relative bg-[#141414] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#222222] rounded-[2px] hover:-translate-y-[10px] hover:border-[#8BBCD8]/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(139,188,216,0.15)] flex flex-col items-center">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(139,188,216,0.4)_0%,transparent_70%)]" />
                  
                  <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
                    <img src="/logo-bethedance.png" alt="Be the Dance" className="max-h-full max-w-[150px] object-contain" />
                  </div>
                  
                  <h3 className="text-[22px] font-normal text-[#F0EDE8] mb-3.5 tracking-wide relative z-10 font-batang">Be the Dance</h3>
                  
                  <div className="w-7 h-[1px] bg-[#C4B49A]/40 group-hover:bg-[#8BBCD8]/60 mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10" />
                  
                  <p className="font-heading text-[14px] leading-[1.75] text-[#9A9A9A] font-light relative z-10">
                    {t("activities.card1.desc")}
                  </p>
                </Link>
                
                {/* Card 2 - Biostretch */}
                <Link to="/biostretch" className="group relative bg-[#141414] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#222222] rounded-[2px] hover:-translate-y-[10px] hover:border-[#5AA87A]/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(90,168,122,0.15)] flex flex-col items-center">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(90,168,122,0.4)_0%,transparent_70%)]" />
                  
                  <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
                    <img src="/logo-biostretch.png" alt="Biostretch" className="max-h-full max-w-[180px] scale-110 object-contain" />
                  </div>
                  
                  <h3 className="text-[22px] font-normal text-[#F0EDE8] mb-3.5 tracking-wide relative z-10 font-batang">Biostretch</h3>
                  
                  <div className="w-7 h-[1px] bg-[#C4B49A]/40 group-hover:bg-[#5AA87A]/60 mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10" />
                  
                  <p className="font-heading text-[14px] leading-[1.75] text-[#9A9A9A] font-light relative z-10">
                    {t("activities.card2.desc")}
                  </p>
                </Link>
                
                {/* Card 3 - Kroppsskole */}
                <Link to="/kroppsskole" className="group relative bg-[#141414] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#222222] rounded-[2px] hover:-translate-y-[10px] hover:border-[#4A9B8E]/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(74,155,142,0.15)] flex flex-col items-center">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(74,155,142,0.4)_0%,transparent_70%)]" />
                  
                  <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
                    <img src="/logo-kroppsskole.png" alt="Kroppsskole" className="max-h-full max-w-[150px] object-contain" />
                  </div>
                  
                  <h3 className="text-[22px] font-normal text-[#F0EDE8] mb-3.5 tracking-wide relative z-10 font-batang">Kroppsskole</h3>
                  
                  <div className="w-7 h-[1px] bg-[#C4B49A]/40 group-hover:bg-[#4A9B8E]/60 mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10" />
                  
                  <p className="font-heading text-[14px] leading-[1.75] text-[#9A9A9A] font-light relative z-10">
                    {t("activities.card3.desc")}
                  </p>
                </Link>

              </div>
              
              <div className="mt-16">
                <Link to="/agenda" className="inline-block font-heading text-[10px] tracking-[4px] uppercase text-[#C4B49A] decoration-transparent border-b border-[#C4B49A]/30 pb-2 transition-all duration-400 hover:border-[#C4B49A]/80 hover:text-[#F0EDE8] hover:pb-2.5">
                  {t("activities.cta")}
                </Link>
              </div>
              
            </div>
          </section>
        )}

        {/* ==============================================================
            TRANSIÇÃO MARCADA: ATIVIDADES -> FILOSOFIA
            Divisor arquitetônico para definir o início do manifesto
        ============================================================== */}
        <div className="relative z-20 w-full flex flex-col items-center justify-center -mb-8 pointer-events-none">
          <div className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>

        {/* ==============================================================
            3. FILOSOFIA
            Mantida com a marca d'água original e iluminação suave de palco
        ============================================================== */}
        <Philosophy />

        {/* ==============================================================
            TRANSIÇÃO MARCADA: FILOSOFIA -> PROTOCOLO
        ============================================================== */}
        <div className="relative z-20 w-full flex flex-col items-center justify-center -mb-4 pointer-events-none">
          <div className="w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        </div>

        {/* ==============================================================
            4. PROTOCOLO
            Mantido original
        ============================================================== */}
        <Protocol />

        {/* ==============================================================
            5. ACTION (AGENDA & CTA)
            Mantido com a sequência exata de frames e integração do canvas
        ============================================================== */}
        <Action />
      </main>

      {/* ==============================================================
          6. FOOTER
          Original
      ============================================================== */}
      <Footer />
    </div>
  );
}
