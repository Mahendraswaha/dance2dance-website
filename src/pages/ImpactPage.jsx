import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, Users, Building2, Landmark, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SocialPillars from '../components/SocialPillars';
import SEOHead from '../components/SEOHead';

gsap.registerPlugin(ScrollTrigger);

const ImpactPage = () => {
  const { t } = useTranslation();

  const heroBlurPlaceholder = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAALAAtAAD//gAPTGF2YzYzLjEuMTAwAP/bAEMACAQEBAQEBQUFBQUFBgYGBgYGBgYGBgYGBgcHBwgICAcHBwYGBwcICAgICQkJCAgICAkJCgoKDAwLCw4ODhERFP/EAHQAAAIDAQAAAAAAAAAAAAAAAAUEAwIHBgEAAwEAAAAAAAAAAAAAAAAAAAIEBRAAAgEEAQICCwEAAAAAAAAAAgEDBBIAEQYFE9IhBxUUVJSTkVMXMjEiEQEAAgEEAwEAAAAAAAAAAAABAgARUQWCMiMEAyH/wAARCAALABQDASIAAhEAAxEA/9oADAMBAAIRAxEAPwDDNvGenxlUTRU4sEU0wRh3DGMLjaQojkaAU3pXE0K35vWL5Sb9H9cZzimb19X6KOUqV9n2I1/q8TOalKGQTITiYVMEZFYSdsgJxmOiFvIvxVzH7dB8YHgwzxLkvX6/jtBLU9Sq5TEJI7u4xJiE0iG5jq4tf0y2ZPzJt4S9cdV9+q/nSeLIZbh9oyRT8U6acroR2315RJBPCCeTXi3/2Q==";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero reveal
      gsap.from('.hero-elem', {
        y: 50,
        opacity: 0,
        duration: 1.4,
        stagger: 0.18,
        ease: 'power4.out',
        delay: 0.3
      });

      // Subtle float on dancer
      gsap.to('.hero-dancer', {
        y: -18,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Generic scroll reveals
      gsap.utils.toArray('.reveal-elem').forEach((elem) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: 'top 85%' },
          y: 36,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // Value cards stagger
      gsap.from('.value-card', {
        scrollTrigger: { trigger: '.value-section', start: 'top 75%' },
        scale: 0.96,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });

      // Line draw
      gsap.utils.toArray('.draw-line').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'power3.out'
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-primary text-background min-h-[100dvh] overflow-x-hidden">
      <SEOHead
        title="Social Impact"
        description="Dance2Dance's social project brings movement, inclusion and wellbeing to communities in Oslo and beyond. Discover our partnerships and impact."
        url="/social"
      />
      <Navbar />

      {/* ─── HERO ────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[100dvh] flex flex-col pt-32 md:pt-48 lg:pt-56 pb-16 md:pb-24 overflow-hidden bg-primary">
        
        {/* Content Layer: Unified wrapper matches HeroSequence floating alignment exactly */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-auto px-6 lg:px-12 pointer-events-none">
          <div className="flex flex-col md:w-3/4 lg:w-[65%] items-start">
          
          {/* B2B Authority Badge */}
          <div className="hero-elem inline-flex items-center gap-3 px-5 py-3 mb-8 rounded-[24px] border border-slate-700/50 bg-black/40 backdrop-blur-md">
              <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest whitespace-nowrap shrink-0">{t('social_page_b2b.hero.badge')}</span>
              <span className="font-heading font-bold text-[13px] md:text-sm text-accent text-left leading-[1.2]">{t('social_page_b2b.hero.badge_brand')}</span>
            </div>

          <span className="hero-elem font-heading text-[10px] md:text-[11px] tracking-[5px] uppercase text-slate-400 mb-6 block">
            {t('social_page_b2b.hero.kicker')}
          </span>
          <h1 className="flex flex-col gap-0 md:gap-2 mb-8 pointer-events-none">
            {/* Reduced max size from 8xl to 7xl to respect viewport heights */}
            <span className="hero-elem font-drama italic text-5xl md:text-6xl lg:text-7xl text-background leading-none">
              {t('social_page_b2b.hero.title_line1')}
            </span>
            <span className="hero-elem font-drama italic text-5xl md:text-6xl lg:text-7xl text-slate-300/40 leading-none">
              {t('social_page_b2b.hero.title_line2')}
            </span>
          </h1>

          <div className="hero-elem w-full pointer-events-auto">
            <div className="h-[1px] w-full max-w-md bg-slate-100/10 mb-8 draw-line" />
            <p className="font-heading text-background/70 text-base md:text-lg lg:text-xl leading-[1.6] max-w-lg">
              {t('social_page_b2b.hero.subtitle')}
            </p>
          </div>
          </div>
        </div>

        {/* Video Layer - Mobile: Below text. Desktop: Original absolute floating position */}
        <div className="relative lg:absolute lg:top-[60%] left-0 w-full lg:px-12 h-[40vh] lg:h-[70vh] lg:-translate-y-1/2 z-0 pointer-events-none mt-12 lg:mt-0">
          <div className="w-full max-w-5xl mx-auto h-full relative md:translate-x-1">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              poster={heroBlurPlaceholder}
              className="w-full h-full object-contain object-center lg:object-right opacity-60 mix-blend-luminosity"
            >
              <source src="/hero-social-project-small.mp4" type="video/mp4" />
            </video>
          </div>
          {/* Subtle gradient to blend left edge on Desktop */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-primary via-transparent to-transparent" />
          {/* Bottom fade gradient - HIDES THE HARD WRIST CUTOFF FOREVER */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary to-transparent" />
          {/* Top fade gradient for Mobile to blend smoothly with text above */}
          <div className="lg:hidden absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* ─── CONTEXT / MANIFESTO ─────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0C0C0C] relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20 items-start">

          <div className="md:col-span-4 reveal-elem">
            <span className="font-heading text-[10px] tracking-[4px] uppercase text-slate-400 block mb-8">
              {t('social_page_b2b.context.kicker')}
            </span>
            <h2 className="font-drama italic text-4xl md:text-5xl lg:text-6xl leading-[1.0] text-background/90">
              {t('social_page_b2b.context.title')}
            </h2>
          </div>

          <div className="md:col-span-8 flex flex-col gap-10 reveal-elem">
            <div className="h-[1px] bg-slate-100/10 draw-line" />
            <p className="font-heading text-background/60 text-base md:text-lg leading-[1.85] font-light">
              {t('social_page_b2b.context.p1')}
            </p>
            <p className="font-heading text-background/60 text-base md:text-lg leading-[1.85] font-light">
              {t('social_page_b2b.context.p2')}
            </p>
            <div className="border-l-2 border-slate-300/30 pl-8 mt-4">
              <p className="font-drama italic text-2xl md:text-3xl text-slate-200/80 leading-[1.35]">
                {t('social_page_b2b.context.quote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PERCEIVED VALUE SECTION ─────────────────────────────────── */}
      <section className="value-section py-24 md:py-32 px-6 lg:px-12 bg-primary relative overflow-hidden">
        {/* Subtle dividing glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] opacity-[0.02]"
               style={{ background: 'radial-gradient(ellipse, #E2E8F0 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 reveal-elem">
            <span className="font-heading text-[10px] tracking-[5px] uppercase text-slate-400 block mb-6">
              {t('social_page_b2b.value.kicker')}
            </span>
            <h2 className="font-drama italic text-4xl md:text-5xl lg:text-6xl text-background leading-tight">
              {t('social_page_b2b.value.title')}
            </h2>
            <p className="font-heading text-background/50 text-base md:text-lg font-light max-w-2xl mx-auto mt-8 leading-[1.8]">
              {t('social_page_b2b.value.subtitle')}
            </p>
          </div>

          {/* Value cards: Free vs Paid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">

            {/* Paid card */}
            <div className="value-card border border-slate-300/20 bg-[#0C0C0C] p-8 md:p-12 flex flex-col relative overflow-hidden h-full">
              <div className="flex flex-col gap-6 mb-6">
                <span className="font-heading text-[10px] tracking-[2px] md:tracking-[4px] uppercase text-slate-300 break-words w-full">
                  {t('social_page_b2b.value.paid.label')}
                </span>
                <div className="font-drama italic text-4xl md:text-5xl lg:text-6xl text-slate-200 min-h-[2.2em]">
                  {t('social_page_b2b.value.paid.price')}
                </div>
              </div>
              <div className="h-[1px] bg-slate-300/15 draw-line mb-6" />
              <p className="font-heading text-slate-300/60 text-sm leading-[1.8] font-light">
                {t('social_page_b2b.value.paid.desc')}
              </p>
            </div>

            {/* Free card (Tøyen / Grønland) */}
            <div className="value-card border border-slate-300/20 bg-[#0C0C0C] p-8 md:p-12 flex flex-col relative overflow-hidden h-full">
              <div className="flex flex-col gap-6 mb-6">
                <span className="font-heading text-[10px] tracking-[2px] md:tracking-[4px] uppercase text-slate-300 break-words w-full">
                  {t('social_page_b2b.value.free.label')}
                </span>
                <div className="font-drama italic text-4xl md:text-5xl lg:text-6xl text-slate-200 min-h-[2.2em]">
                  {t('social_page_b2b.value.free.price')}
                </div>
              </div>
              <div className="h-[1px] bg-slate-300/15 draw-line mb-6" />
              <p className="font-heading text-slate-300/60 text-sm leading-[1.8] font-light">
                {t('social_page_b2b.value.free.desc')}
              </p>
            </div>
          </div>

          {/* Value insight quote */}
          <div className="mt-16 max-w-3xl mx-auto text-center reveal-elem">
            <p className="font-drama italic text-xl md:text-2xl text-slate-300/50 leading-[1.5]">
              {t('social_page_b2b.value.insight')}
            </p>
          </div>
        </div>
      </section>

      {/* ─── FUNDING PILLARS ─────────────────────────────────────────── */}
      <SocialPillars translationKey="social_page_b2b" />

      {/* ─── PARTNERS ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-primary relative">
        <div className="max-w-5xl mx-auto reveal-elem">
          <div className="text-center mb-20">
            <span className="font-heading text-[10px] tracking-[5px] uppercase text-slate-400 block mb-6">
              {t('social_page_b2b.partners.kicker')}
            </span>
            <h3 className="font-drama italic text-3xl md:text-5xl text-background/80 leading-tight">
              {t('social_page_b2b.partners.title')}
            </h3>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-24 mt-16">
            <a href="https://toyenunlimited.no/" target="_blank" rel="noopener noreferrer"
               className="group opacity-40 hover:opacity-80 transition-opacity duration-500">
              <img src="/logo-toyen-unlimited.png" alt="Toyen Unlimited"
                   className="h-10 md:h-14 object-contain filter grayscale transition-all duration-500 brightness-200" />
            </a>
            <div className="hidden md:block w-[1px] h-14 bg-white/10" />
            <a href="https://poaciadanca.com.br/en/" target="_blank" rel="noopener noreferrer"
               className="group opacity-40 hover:opacity-80 transition-opacity duration-500">
              <img src="/logo-poaciadanca.png" alt="POA Cia de Dança"
                   className="h-14 md:h-20 object-contain filter grayscale transition-all duration-500 brightness-200" />
            </a>
          </div>

          <p className="mt-16 font-heading text-background/40 font-light text-sm md:text-base text-center max-w-2xl mx-auto leading-[1.8]">
            {t('social_page_b2b.partners.desc')}
          </p>
        </div>
      </section>

      {/* ─── CTA B2B ─────────────────────────────────────────────────── */}
      
        {/* ⚡ IMPACT PROJECTS (YOUTH & WOMEN) ⚡ */}
        <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#080808] border-t border-slate-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-16 md:mb-24 reveal-elem text-center">
              <span className="font-heading text-[10px] md:text-[11px] tracking-[5px] uppercase text-accent mb-6 block">
                {t('social_page_b2b.projects.kicker')}
              </span>
              <h2 className="font-drama italic text-4xl md:text-5xl lg:text-6xl text-background mb-8 leading-tight">
                {t('social_page_b2b.projects.title')}
              </h2>
              <p className="font-heading font-light text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {t('social_page_b2b.projects.desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              
              {/* Project 1: Be the Dance Ung (Youth) */}
              <div className="group reveal-elem relative bg-[#111111] border border-slate-800 rounded-sm overflow-hidden hover:border-accent/30 transition-all duration-700 flex flex-col">
                <div className="w-full h-64 md:h-80 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/10 transition-colors duration-700"></div>
                  {/* Using the hero animation vibe placeholder */}
                  <img src="/gallery/sequence/frame-240.jpg" alt="Be the Dance Ung" className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000" />
                  <div className="absolute top-6 right-6 z-20">
                    <span className="px-4 py-1.5 bg-background text-primary text-[9px] uppercase tracking-[3px] font-heading font-bold rounded-full">
                      Tøyen & Grønland
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex-grow flex flex-col">
                  <h3 className="font-drama text-3xl text-background mb-2 group-hover:text-accent transition-colors">{t('social_page_b2b.projects.youth.title')}</h3>
                  <p className="font-heading text-[11px] uppercase tracking-[2px] text-accent/80 mb-6 font-semibold">{t('social_page_b2b.projects.youth.subtitle')}</p>
                  <p className="font-heading font-light text-slate-300 leading-[1.8] mb-10 flex-grow">
                    {t('social_page_b2b.projects.youth.desc')}
                  </p>
                  <Link to="/projects/be-the-dance-ung" className="inline-flex items-center gap-4 text-xs font-heading uppercase tracking-[3px] text-background hover:text-accent transition-colors w-fit group/btn mt-auto">
                    {t('social_page_b2b.projects.youth.btn')}
                    <div className="w-8 h-[1px] bg-white/30 group-hover/btn:w-12 group-hover/btn:bg-accent transition-all duration-300 relative">
                      <ArrowRight className="absolute -right-1 -top-[7px] w-4 h-4 text-white/30 group-hover/btn:text-accent transition-colors" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Project 2: Dance2Dance Kvinne (Women) */}
              <div className="group reveal-elem relative bg-[#111111] border border-slate-800 rounded-sm overflow-hidden hover:border-accent/30 transition-all duration-700 flex flex-col">
                <div className="w-full h-64 md:h-80 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/10 transition-colors duration-700"></div>
                  {/* Using a biostretch/women placeholder */}
                  <img src="/images/dance2dance-kvinne.jpg" alt="Dance2Dance Kvinne" className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000" />
                  <div className="absolute top-6 right-6 z-20">
                    <span className="px-4 py-1.5 bg-background text-primary text-[9px] uppercase tracking-[3px] font-heading font-bold rounded-full">
                      Tøyen & Grønland
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex-grow flex flex-col">
                  <h3 className="font-drama text-3xl text-background mb-2 group-hover:text-accent transition-colors">{t('social_page_b2b.projects.women.title')}</h3>
                  <p className="font-heading text-[11px] uppercase tracking-[2px] text-accent/80 mb-6 font-semibold">{t('social_page_b2b.projects.women.subtitle')}</p>
                  <p className="font-heading font-light text-slate-300 leading-[1.8] mb-10 flex-grow">
                    {t('social_page_b2b.projects.women.desc')}
                  </p>
                  <Link to="/projects/dance2dance-kvinne" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-4 text-xs font-heading uppercase tracking-[3px] text-background hover:text-accent transition-colors w-fit group/btn mt-auto">
                    {t('social_page_b2b.projects.women.btn')}
                    <div className="w-8 h-[1px] bg-white/30 group-hover/btn:w-12 group-hover/btn:bg-accent transition-all duration-300 relative">
                      <ArrowRight className="absolute -right-1 -top-[7px] w-4 h-4 text-white/30 group-hover/btn:text-accent transition-colors" />
                    </div>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

<section id="apoie" className="py-24 bg-gradient-to-br from-[#0a0a0e] to-[#1a1a24] border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] opacity-[0.03]"
               style={{ background: 'radial-gradient(ellipse, #E2E8F0 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center reveal-elem px-6">
          <span className="text-accent uppercase tracking-widest text-xs font-bold mb-4 block">
            {t('social_page_b2b.cta.kicker')}
          </span>
          <h2 className="font-drama italic text-5xl md:text-7xl text-white mb-6">
            {t('social_page_b2b.cta.title')}
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
            {t('social_page_b2b.cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contato?subject=reuniao-executiva" 
              className="inline-flex items-center justify-center bg-accent text-primary px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(200,160,80,0.3)] text-center"
            >
              {t('social_page_b2b.cta.btn1')}
            </Link>
            <a href="/pitch-deck.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-transparent text-white border border-slate-600 px-8 py-4 rounded-full font-bold text-sm hover:bg-white/5 transition-colors text-center">
                {t('social_page_b2b.cta.btn2')}
              </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ImpactPage;



