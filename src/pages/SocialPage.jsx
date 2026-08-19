import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, Users, Building2, Landmark, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SocialPillars from '../components/SocialPillars';

gsap.registerPlugin(ScrollTrigger);

const SocialPage = () => {
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
      <Navbar />

      {/* ─── HERO ────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[100dvh] flex flex-col justify-end pt-40 pb-16 md:pb-24 overflow-hidden bg-primary">
        
        {/* Background Layer - Video aligned perfectly to the right */}
        <div className="absolute top-1/2 left-0 w-full px-6 lg:px-12 h-[70vh] -translate-y-1/2 z-0 pointer-events-none">
          <div className="w-full max-w-7xl mx-auto h-full relative md:translate-x-1">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              poster={heroBlurPlaceholder}
              className="w-full h-full object-contain object-right opacity-50 mix-blend-luminosity"
            >
              <source src="/hero-social-project-small.mp4" type="video/mp4" />
            </video>
          </div>
          {/* Subtle gradient to blend left edge */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-transparent" />
        </div>

        {/* Content Layer: Unified wrapper matches HeroSequence floating alignment exactly */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:w-2/3 lg:w-1/2 items-start mt-auto px-6 lg:px-12 pointer-events-none">
          
          {/* B2B Authority Badge */}
          <div className="hero-elem inline-flex items-center gap-3 px-4 py-2 mb-8 rounded-full border border-slate-700/50 bg-black/40 backdrop-blur-md">
            <span className="text-xs text-slate-400 uppercase tracking-widest">{t('social_page_b2b.hero.badge')}</span>
            <span className="font-heading font-bold text-sm text-accent">{t('social_page_b2b.hero.badge_brand')}</span>
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

          <div className="hero-elem flex flex-col items-start gap-3 mt-12 text-slate-400/40 pointer-events-auto">
            <ArrowDown size={18} />
            <span className="font-heading text-[10px] tracking-[4px] uppercase">{t('social_page_b2b.hero.scroll')}</span>
          </div>
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
            <div className="value-card border border-slate-300/20 bg-[#0C0C0C] p-8 md:p-12 flex flex-col gap-6 relative overflow-hidden">
              <span className="font-heading text-[10px] tracking-[2px] md:tracking-[4px] uppercase text-slate-300 break-words w-full">
                {t('social_page_b2b.value.paid.label')}
              </span>
              <div className="font-drama italic text-3xl sm:text-4xl md:text-6xl text-slate-200 break-words w-full">
                {t('social_page_b2b.value.paid.price')}
              </div>
              <div className="h-[1px] bg-slate-300/15 draw-line" />
              <p className="font-heading text-slate-300/60 text-sm leading-[1.8] font-light">
                {t('social_page_b2b.value.paid.desc')}
              </p>
            </div>

            {/* Free card (Gamle Oslo) */}
            <div className="value-card border border-slate-300/20 bg-[#0C0C0C] p-8 md:p-12 flex flex-col gap-6 relative overflow-hidden">
              <span className="font-heading text-[10px] tracking-[2px] md:tracking-[4px] uppercase text-slate-300 break-words w-full">
                {t('social_page_b2b.value.free.label')}
              </span>
              <div className="font-drama italic text-3xl sm:text-4xl md:text-6xl text-slate-200 break-words w-full">
                {t('social_page_b2b.value.free.price')}
              </div>
              <div className="h-[1px] bg-slate-300/15 draw-line" />
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
            <button className="bg-accent text-primary px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(200,160,80,0.3)]">
              {t('social_page_b2b.cta.btn1')}
            </button>
            <button className="bg-transparent text-white border border-slate-600 px-8 py-4 rounded-full font-bold text-sm hover:bg-white/5 transition-colors">
              {t('social_page_b2b.cta.btn2')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SocialPage;
