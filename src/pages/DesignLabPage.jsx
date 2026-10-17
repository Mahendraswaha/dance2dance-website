import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSequence from '../components/HeroSequence';
import Philosophy from '../components/Philosophy';
import Protocol from '../components/Protocol';
import Action from '../components/Action';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

export default function DesignLabPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#0D0D12] text-background min-h-[100dvh] overflow-x-hidden selection:bg-accent/30 selection:text-background">
      <SEOHead 
        title="Design Lab — Proposta Visual | Dance2Dance"
        description="Laboratório de teste visual: transições de seção, iluminação e contraste mantendo textos e diagramação originais."
        url="/lab"
      />

      <Navbar />

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
            2. ATIVIDADES (WORKSHOPS) — PROPOSTA VISUAL COM PAPEL DE PAREDE
        ============================================================== */}
        <section 
          id="workshops" 
          className="pt-32 pb-28 px-8 text-[#1A1715] min-h-screen flex items-center transition-colors duration-500 relative z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg-activities-lab.jpg')" }}
        >
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
                  className="group relative bg-[#FFFFFF] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#E5DFD3] rounded-2xl hover:-translate-y-[10px] hover:border-[#8BBCD8]/80 hover:shadow-[0_20px_50px_rgba(40,30,20,0.08)] flex flex-col items-center"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(139,188,216,0.35)_0%,transparent_70%)]" />
                  
                  <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
                    <img src="/logo-bethedance-light.png" alt="Be the Dance" className="max-h-full max-w-[150px] object-contain" />
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
                  className="group relative bg-[#FFFFFF] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#E5DFD3] rounded-2xl hover:-translate-y-[10px] hover:border-[#5AA87A]/80 hover:shadow-[0_20px_50px_rgba(40,30,20,0.08)] flex flex-col items-center"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(90,168,122,0.35)_0%,transparent_70%)]" />
                  
                  <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
                    <img src="/logo-biostretch-light.png" alt="Biostretch" className="max-h-full max-w-[180px] scale-110 object-contain" />
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
                  className="group relative bg-[#FFFFFF] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#E5DFD3] rounded-2xl hover:-translate-y-[10px] hover:border-[#4A9B8E]/80 hover:shadow-[0_20px_50px_rgba(40,30,20,0.08)] flex flex-col items-center"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(74,155,142,0.35)_0%,transparent_70%)]" />
                  
                  <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
                    <img src="/logo-kroppsskole-light.png" alt="Kroppsskole" className="max-h-full max-w-[150px] object-contain" />
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
