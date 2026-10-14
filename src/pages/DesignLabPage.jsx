import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Sun, Moon, Check, Heart, Shield, Compass, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Brand from '../components/Brand';
import SEOHead from '../components/SEOHead';

export default function DesignLabPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="bg-[#110F0D] text-[#FAF8F5] min-h-screen selection:bg-[#C9A84C]/30 selection:text-[#FAF8F5] overflow-x-hidden">
      <SEOHead 
        title="Design Lab — Breathing Light & Contrast | Dance2Dance"
        description="Laboratório experimental de design: testando contraste de luz, calor e bem-estar para o Dance2Dance."
        url="/lab"
      />

      <Navbar />

      {/* Floating Lab Badge */}
      <div className="fixed bottom-6 right-6 z-50 bg-[#16130F]/90 backdrop-blur-md border border-[#C9A84C]/40 text-[#FAF8F5] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 text-xs font-heading">
        <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-ping" />
        <span className="font-semibold text-[#C9A84C] uppercase tracking-wider">Design Lab</span>
        <span className="text-[#FAF8F5]/60 hidden sm:inline">|</span>
        <span className="text-[#FAF8F5]/80 hidden sm:inline">Fase 2: Luz & Contraste</span>
      </div>

      <main>
        {/* ==============================================================
            SEÇÃO 1: HERO (CINEMATOGRÁFICA & AQUECIDA)
            Mantém o mistério e a nobreza de entrada no teatro
        ============================================================== */}
        <section className="relative min-h-[90vh] flex flex-col justify-end pb-20 md:pb-28 px-6 lg:px-16 overflow-hidden pt-36">
          {/* Background Ambient Glow & Video Placeholder */}
          <div className="absolute inset-0 z-0">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-60 filter contrast-[1.05]"
              poster="/gallery/sequence/frame-001.jpg"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            
            {/* Gradientes que deixam o vídeo respirar sem sufocar */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#110F0D] via-[#110F0D]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#110F0D]/80 via-transparent to-[#110F0D]/60" />
            
            {/* Spotlight Dourado Sutil */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto w-full">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A84C]/40 bg-[#16130F]/70 backdrop-blur-md mb-6">
              <Sparkles size={14} className="text-[#C9A84C]" />
              <span className="text-[11px] font-heading uppercase tracking-[3px] text-[#C9A84C] font-medium">
                Protótipo Editorial — Luz & Movimento
              </span>
            </div>

            <h1 className="font-batang text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.08] tracking-tight text-[#FAF8F5] mb-6">
              O corpo é a nossa <br />
              <span className="italic font-drama text-[#C9A84C] pr-2">primeira casa.</span>
            </h1>

            <p className="font-heading text-lg md:text-2xl text-[#FAF8F5]/80 max-w-2xl font-light leading-relaxed mb-10">
              Excelência em dança, práticas somáticas e consciência corporal em Oslo — agora concebidas com ar, calor humano e luz natural.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="#praticas" 
                className="btn-magnetic bg-[#C9A84C] text-[#110F0D] px-8 py-4 rounded-full font-heading font-semibold text-sm tracking-wider uppercase inline-flex items-center gap-2 shadow-[0_12px_30px_rgba(201,168,76,0.3)] transition-all hover:bg-[#D4B55C]"
              >
                <span>Explorar as Práticas</span>
                <ArrowRight size={16} />
              </a>
              <a 
                href="#filosofia" 
                className="px-8 py-4 rounded-full font-heading text-sm text-[#FAF8F5]/80 border border-[#FAF8F5]/20 hover:border-[#C9A84C]/60 hover:text-[#FAF8F5] transition-all"
              >
                Ver Nossa Visão
              </a>
            </div>
          </div>

          <div className="relative z-10 w-full flex justify-center mt-12 animate-bounce">
            <a href="#praticas" className="text-[#C9A84C]/70 hover:text-[#C9A84C] flex flex-col items-center gap-1 text-[11px] font-heading uppercase tracking-[2px]">
              <span>Rolar para a Luz</span>
              <ChevronDown size={18} />
            </a>
          </div>
        </section>

        {/* ==============================================================
            TRANSIÇÃO 1: MARCO DE TRANSIÇÃO (DO ESCURO PARA A LUZ)
            Abertura intencional com corte suave e divisor dourado
        ============================================================== */}
        <div className="relative bg-gradient-to-b from-[#110F0D] via-[#2A231C] to-[#F5F2EB] pt-20 pb-8 text-center px-6">
          <div className="max-w-xl mx-auto flex flex-col items-center">
            <div className="w-16 h-[1.5px] bg-[#C9A84C] mb-4" />
            <p className="font-heading text-xs uppercase tracking-[4px] text-[#C9A84C] font-semibold mb-2">
              Abertura de Espaço &middot; O Estúdio em Luz
            </p>
            <p className="font-drama italic text-xl md:text-2xl text-[#1A1715]/80">
              "Respirar fundo é o primeiro passo para habitar o próprio corpo."
            </p>
          </div>
        </div>

        {/* ==============================================================
            SEÇÃO 2: ATIVIDADES & WORKSHOPS (SEÇÃO CLARA — LINHO NÓRDICO)
            Aqui o site 'respira' com luz natural de estúdio escandinavo
        ============================================================== */}
        <section id="praticas" className="relative bg-[#F5F2EB] text-[#1A1715] py-28 md:py-36 px-6 lg:px-16 transition-colors">
          <div className="max-w-6xl mx-auto">
            {/* Header da Seção Clara */}
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="inline-block text-[11px] font-heading uppercase tracking-[4px] text-[#8C6D23] font-bold mb-3">
                Nossas Frentes de Atuação
              </span>
              <h2 className="font-batang text-4xl sm:text-5xl md:text-6xl font-normal text-[#1A1715] tracking-tight leading-tight mb-6">
                Práticas desenhadas para a <span className="italic font-drama text-[#8C6D23]">vida real</span>
              </h2>
              <div className="w-12 h-[2px] bg-[#C9A84C] mx-auto mb-6" />
              <p className="font-heading text-base md:text-lg text-[#5A534B] leading-relaxed font-light">
                Do condicionamento somático à expressão artística de alta performance. Cada modalidade abre um diálogo diferente com quem você é.
              </p>
            </div>

            {/* Grid dos Cards em Fundo Claro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Card 1: Be The Dance */}
              <div className="group bg-[#FFFFFF] rounded-2xl p-10 flex flex-col items-center text-center shadow-[0_12px_40px_rgba(30,20,10,0.06)] hover:shadow-[0_20px_60px_rgba(30,20,10,0.12)] border border-[#E8E2D5] hover:border-[#8BBCD8]/60 transition-all duration-500 hover:-translate-y-2">
                <div className="h-28 flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 bg-[#8BBCD8]/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                  <img src="/logo-bethedance.png" alt="Be the Dance" className="max-h-full max-w-[140px] object-contain relative z-10" />
                </div>
                
                <h3 className="font-batang text-2xl font-normal text-[#1A1715] mb-3">
                  Be the Dance
                </h3>
                <span className="text-[11px] font-heading uppercase tracking-[2px] text-[#8BBCD8] font-semibold mb-4">
                  Dança Contemporânea & Criação
                </span>
                
                <div className="w-8 h-[1px] bg-[#E8E2D5] group-hover:w-16 group-hover:bg-[#8BBCD8] transition-all duration-300 mb-5" />
                
                <p className="font-heading text-sm text-[#5A534B] leading-relaxed font-light mb-8 flex-1">
                  Metodologia autoral de dança contemporânea focada no desbloqueio expressivo, fluidez articular e presença cênica para todos os corpos.
                </p>

                <Link 
                  to="/be-the-dance"
                  className="font-heading text-xs uppercase tracking-[3px] font-semibold text-[#1A1715] group-hover:text-[#8C6D23] inline-flex items-center gap-1.5 transition-colors border-b border-[#1A1715]/20 group-hover:border-[#8C6D23] pb-1"
                >
                  <span>Conhecer Turmas</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Card 2: Biostretch */}
              <div className="group bg-[#FFFFFF] rounded-2xl p-10 flex flex-col items-center text-center shadow-[0_12px_40px_rgba(30,20,10,0.06)] hover:shadow-[0_20px_60px_rgba(30,20,10,0.12)] border border-[#E8E2D5] hover:border-[#5AA87A]/60 transition-all duration-500 hover:-translate-y-2">
                <div className="h-28 flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 bg-[#5AA87A]/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                  <img src="/logo-biostretch.png" alt="Biostretch" className="max-h-full max-w-[160px] object-contain relative z-10 scale-105" />
                </div>
                
                <h3 className="font-batang text-2xl font-normal text-[#1A1715] mb-3">
                  Biostretch
                </h3>
                <span className="text-[11px] font-heading uppercase tracking-[2px] text-[#5AA87A] font-semibold mb-4">
                  Saúde Fascial & Descompressão
                </span>
                
                <div className="w-8 h-[1px] bg-[#E8E2D5] group-hover:w-16 group-hover:bg-[#5AA87A] transition-all duration-300 mb-5" />
                
                <p className="font-heading text-sm text-[#5A534B] leading-relaxed font-light mb-8 flex-1">
                  Alívio de dores posturais, reidratação das fáscias musculares e flexibilidade consciente através de trações suaves e biomecânica precisa.
                </p>

                <Link 
                  to="/biostretch"
                  className="font-heading text-xs uppercase tracking-[3px] font-semibold text-[#1A1715] group-hover:text-[#8C6D23] inline-flex items-center gap-1.5 transition-colors border-b border-[#1A1715]/20 group-hover:border-[#8C6D23] pb-1"
                >
                  <span>Sessões & Horários</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Card 3: Kroppsskole */}
              <div className="group bg-[#FFFFFF] rounded-2xl p-10 flex flex-col items-center text-center shadow-[0_12px_40px_rgba(30,20,10,0.06)] hover:shadow-[0_20px_60px_rgba(30,20,10,0.12)] border border-[#E8E2D5] hover:border-[#4A9B8E]/60 transition-all duration-500 hover:-translate-y-2">
                <div className="h-28 flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 bg-[#4A9B8E]/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                  <img src="/logo-kroppsskole.png" alt="Kroppsskole" className="max-h-full max-w-[140px] object-contain relative z-10" />
                </div>
                
                <h3 className="font-batang text-2xl font-normal text-[#1A1715] mb-3">
                  Kroppsskole
                </h3>
                <span className="text-[11px] font-heading uppercase tracking-[2px] text-[#4A9B8E] font-semibold mb-4">
                  Educação do Movimento
                </span>
                
                <div className="w-8 h-[1px] bg-[#E8E2D5] group-hover:w-16 group-hover:bg-[#4A9B8E] transition-all duration-300 mb-5" />
                
                <p className="font-heading text-sm text-[#5A534B] leading-relaxed font-light mb-8 flex-1">
                  A nossa escola do corpo em Oslo. Cursos progressivos que ensinam autonomia corporal, prevenção de lesões e sensibilidade proprioceptiva.
                </p>

                <Link 
                  to="/kroppsskole"
                  className="font-heading text-xs uppercase tracking-[3px] font-semibold text-[#1A1715] group-hover:text-[#8C6D23] inline-flex items-center gap-1.5 transition-colors border-b border-[#1A1715]/20 group-hover:border-[#8C6D23] pb-1"
                >
                  <span>Explorar Programa</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Destaque Solar de Apoio às Bolsas */}
            <div className="mt-20 bg-[#EFE9DC] border border-[#DDD3C2] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <span className="inline-block text-[10px] font-heading uppercase tracking-[3px] text-[#8C6D23] font-bold mb-2">
                  Nosso Modelo Social &middot; Tøyen & Grønland
                </span>
                <h4 className="font-batang text-2xl md:text-3xl text-[#1A1715] mb-3">
                  Cada inscrição pagante financia uma bolsa integral
                </h4>
                <p className="font-heading text-sm md:text-base text-[#5A534B] leading-relaxed font-light max-w-xl">
                  Acreditamos que saúde corporal e arte de ponta não devem ser privilégios. Nosso programa social abre portas gratuitas para jovens e mulheres da comunidade em Oslo.
                </p>
              </div>
              <Link 
                to="/social" 
                className="whitespace-nowrap px-8 py-3.5 rounded-full bg-[#1A1715] text-[#FAF8F5] text-xs font-heading font-semibold uppercase tracking-wider hover:bg-[#8C6D23] transition-colors"
              >
                Conhecer o Impacto
              </Link>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SEÇÃO 3: FILOSOFIA & MANIFESTO (RETORNO AO PALCO ESCURO & ÍNTIMO)
            O contraste: após a luz, o momento de intimidade e foco
        ============================================================== */}
        <section id="filosofia" className="relative py-36 md:py-48 px-6 lg:px-16 bg-[#110F0D] flex items-center justify-center overflow-hidden border-t border-[#C9A84C]/20">
          {/* Watermark Bailarina com Parallax suave */}
          <div 
            className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-no-repeat bg-center"
            style={{ 
              backgroundImage: 'url(/logo-D2D-dancer.png)',
              backgroundSize: 'contain'
            }} 
          />

          {/* Halo Dourado de Iluminação Teatral */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col gap-8">
            <span className="font-heading text-xs tracking-[5px] uppercase text-[#C9A84C] font-semibold">
              O Princípio Fundamental
            </span>
            
            <p className="font-heading font-light text-[#FAF8F5]/60 text-xl sm:text-2xl md:text-3xl tracking-tight leading-relaxed">
              Não ensinamos a reproduzir formas prontas. <br className="hidden sm:block" />
              <span className="text-[#FAF8F5] font-normal">Devolvemos ao corpo a autoria do seu próprio movimento.</span>
            </p>
            
            <h2 className="font-drama italic text-4xl sm:text-6xl md:text-7xl leading-tight text-[#FAF8F5]">
              Você pode <br />
              <span className="text-[#C9A84C]">muito mais.</span>
            </h2>

            <div className="w-16 h-[1.5px] bg-[#C9A84C]/60 mx-auto mt-4" />
          </div>
        </section>

        {/* ==============================================================
            SEÇÃO 4: BEM-ESTAR & BENEFÍCIOS (SEÇÃO CLARA — MARFIM ACOLHEDOR)
            Apresenta a tríade de saúde que os amigos do usuário queriam ver
        ============================================================== */}
        <section className="bg-[#FAF7F2] text-[#1A1715] py-28 md:py-36 px-6 lg:px-16 border-t border-[#E8E2D5]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="max-w-xl">
                <span className="text-[11px] font-heading uppercase tracking-[4px] text-[#8C6D23] font-bold mb-3 block">
                  Por que Praticar Conosco?
                </span>
                <h3 className="font-batang text-3xl sm:text-5xl font-normal text-[#1A1715] leading-tight">
                  Três dimensões da sua <br />
                  <span className="italic font-drama text-[#8C6D23]">saúde integrada</span>
                </h3>
              </div>
              <p className="font-heading text-sm md:text-base text-[#6E665D] max-w-md font-light leading-relaxed">
                Nosso trabalho une a ciência do movimento humano com a sensibilidade da arte contemporânea, gerando resultados profundos e duradouros.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pilar 1 */}
              <div className="bg-[#FFFFFF] p-8 rounded-xl border border-[#E8E2D5] shadow-sm flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FAF5EB] border border-[#C9A84C]/30 flex items-center justify-center text-[#8C6D23]">
                  <Heart size={22} />
                </div>
                <h4 className="font-batang text-xl text-[#1A1715]">
                  Alívio de Tensão & Postura
                </h4>
                <p className="font-heading text-sm text-[#5A534B] leading-relaxed font-light">
                  A descompressão articular e o trabalho fascial devolvem espaço para a coluna e neutralizam o impacto das horas sentado.
                </p>
              </div>

              {/* Pilar 2 */}
              <div className="bg-[#FFFFFF] p-8 rounded-xl border border-[#E8E2D5] shadow-sm flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FAF5EB] border border-[#C9A84C]/30 flex items-center justify-center text-[#8C6D23]">
                  <Compass size={22} />
                </div>
                <h4 className="font-batang text-xl text-[#1A1715]">
                  Consciência Proprioceptiva
                </h4>
                <p className="font-heading text-sm text-[#5A534B] leading-relaxed font-light">
                  Aprenda a reconhecer sinais do corpo antes que virem dor crônica. Uma relação lúcida e generosa consigo mesmo.
                </p>
              </div>

              {/* Pilar 3 */}
              <div className="bg-[#FFFFFF] p-8 rounded-xl border border-[#E8E2D5] shadow-sm flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FAF5EB] border border-[#C9A84C]/30 flex items-center justify-center text-[#8C6D23]">
                  <Shield size={22} />
                </div>
                <h4 className="font-batang text-xl text-[#1A1715]">
                  Vitalidade e Energia Limpa
                </h4>
                <p className="font-heading text-sm text-[#5A534B] leading-relaxed font-light">
                  A dança consciente oxigena tecidos e desperta energia sem exaustão. Saia das aulas mais presente e revigorado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SEÇÃO 5: CTA FINAL LUMINOSO & CONVIDATIVO
            Não um buraco negro, mas um convite elegante
        ============================================================== */}
        <section className="relative py-28 md:py-36 px-6 lg:px-16 bg-[#16130F] text-[#FAF8F5] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.1)_0%,transparent_70%)] pointer-events-none blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
            <span className="font-heading text-xs tracking-[4px] uppercase text-[#C9A84C] font-semibold">
              Comece Sua Jornada
            </span>

            <h2 className="font-drama italic text-4xl sm:text-6xl md:text-7xl text-[#FAF8F5] leading-tight">
              Pronto para sentir <br />
              <span className="text-[#C9A84C]">a diferença na pele?</span>
            </h2>

            <p className="font-heading text-base md:text-lg text-[#FAF8F5]/80 max-w-xl font-light leading-relaxed">
              Consulte a nossa agenda de workshops em Oslo, reserve uma sessão individual de Biostretch ou inscreva-se nos projetos sociais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link
                to="/agenda"
                className="btn-magnetic bg-[#C9A84C] text-[#110F0D] px-10 py-4 rounded-full font-heading font-semibold text-sm tracking-wider uppercase flex items-center gap-2 justify-center shadow-[0_10px_25px_rgba(201,168,76,0.3)] hover:bg-[#D4B55C] transition-all"
              >
                <span>Ver Agenda Completa</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/contato"
                className="px-10 py-4 rounded-full font-heading text-sm text-[#FAF8F5]/70 border border-[#FAF8F5]/20 hover:border-[#C9A84C] hover:text-[#FAF8F5] transition-all flex items-center justify-center"
              >
                Falar Conosco
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
