import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const SocialPage = () => {
  const { t } = useTranslation();

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

      // Subtle background float
      gsap.to('.hero-dancer', {
        y: -20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Scroll-triggered reveals
      gsap.utils.toArray('.reveal-elem').forEach((elem) => {
        gsap.from(elem, {
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
          },
          y: 36,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // Model cards stagger
      gsap.from('.model-card', {
        scrollTrigger: {
          trigger: '.model-section',
          start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // Horizontal line draw animation
      gsap.from('.draw-line', {
        scrollTrigger: {
          trigger: '.draw-line',
          start: 'top 80%',
        },
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.out'
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-primary text-background min-h-[100dvh] overflow-x-hidden">
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">

        {/* Background dancer silhouette */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/logo-D2D-dancer.png"
            className="hero-dancer absolute right-[-5%] bottom-0 h-[95%] opacity-[0.07] object-contain"
            alt=""
          />
          {/* Gold radial glow */}
          <div className="absolute top-[30%] left-[20%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full opacity-[0.04] pointer-events-none"
               style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 flex flex-col items-start">
          <span className="hero-elem font-heading text-[10px] md:text-[11px] tracking-[5px] uppercase text-accent mb-10">
            {t('social_page.hero.kicker')}
          </span>
          <h1 className="hero-elem font-drama italic text-[3.5rem] md:text-[6rem] lg:text-[7.5rem] leading-[0.92] text-background mb-10">
            {t('social_page.hero.title_line1')}
            <br />
            <span className="text-background/40">{t('social_page.hero.title_line2')}</span>
          </h1>

          <div className="hero-elem w-full max-w-xl">
            <div className="h-[1px] w-full bg-background/10 mb-10 draw-line" />
            <p className="font-heading text-background/55 text-base md:text-lg leading-[1.75] font-light">
              {t('social_page.hero.subtitle')}
            </p>
          </div>

          <div className="hero-elem flex flex-col items-start gap-3 mt-20 text-accent/40">
            <ArrowDown size={18} />
            <span className="font-heading text-[10px] tracking-[4px] uppercase">{t('social_page.hero.scroll')}</span>
          </div>
        </div>
      </section>

      {/* ─── CONTEXT / MANIFESTO ──────────────────────────────────────── */}
      <section className="py-28 md:py-48 px-6 lg:px-12 bg-[#0B0B0F] relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20 items-start">

          {/* Left: sticky label column */}
          <div className="md:col-span-4 reveal-elem">
            <span className="font-heading text-[10px] tracking-[4px] uppercase text-accent block mb-8">
              {t('social_page.context.kicker')}
            </span>
            <h2 className="font-drama italic text-4xl md:text-5xl lg:text-6xl leading-[1.0] text-background/90">
              {t('social_page.context.title')}
            </h2>
          </div>

          {/* Right: text content */}
          <div className="md:col-span-8 flex flex-col gap-10 reveal-elem">
            <div className="h-[1px] bg-background/10 draw-line" />
            <p className="font-heading text-background/60 text-base md:text-lg leading-[1.85] font-light">
              {t('social_page.context.p1')}
            </p>
            <p className="font-heading text-background/60 text-base md:text-lg leading-[1.85] font-light">
              {t('social_page.context.p2')}
            </p>

            {/* Pull quote */}
            <div className="border-l-2 border-accent/30 pl-8 mt-4">
              <p className="font-drama italic text-2xl md:text-3xl text-background/80 leading-[1.35]">
                {t('social_page.context.quote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MODEL SECTION ────────────────────────────────────────────── */}
      <section className="model-section py-28 md:py-48 px-6 lg:px-12 bg-primary relative">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20 reveal-elem">
            <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
              {t('social_page.model.kicker')}
            </span>
            <h2 className="font-drama italic text-4xl md:text-6xl text-background leading-tight">
              {t('social_page.model.title')}
            </h2>
          </div>

          {/* 3-step model diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative mt-16">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-[60px] left-[16.7%] right-[16.7%] h-[1px] bg-background/10 draw-line" />

            {[
              { num: '01', key: 'step1' },
              { num: '02', key: 'step2' },
              { num: '03', key: 'step3' }
            ].map(({ num, key }) => (
              <div key={num} className="model-card flex flex-col items-center text-center px-8 py-12 relative group">
                {/* Number circle */}
                <div className="w-[56px] h-[56px] rounded-full border border-background/15 flex items-center justify-center mb-10 group-hover:border-accent/50 transition-all duration-500 relative z-10 bg-primary">
                  <span className="font-heading text-xs text-accent">{num}</span>
                </div>

                <h3 className="font-heading font-semibold text-sm md:text-base tracking-wide text-background/90 mb-5 uppercase">
                  {t(`social_page.model.${key}.title`)}
                </h3>
                <p className="font-heading text-background/50 text-sm md:text-base leading-[1.8] font-light">
                  {t(`social_page.model.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>

          {/* Summary strip */}
          <div className="mt-24 reveal-elem border border-background/8 bg-[#0D0D11] rounded-[2px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 font-heading text-background/50 text-sm leading-[1.8] font-light">
              {t('social_page.model.summary')}
            </div>
            <div className="shrink-0 font-drama italic text-3xl md:text-4xl text-accent/80 text-center md:text-right leading-tight max-w-[280px]">
              {t('social_page.model.highlight')}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARTNERS ─────────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 px-6 lg:px-12 bg-[#0B0B0F] relative">
        <div className="max-w-5xl mx-auto reveal-elem">
          <div className="text-center mb-20">
            <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
              {t('social_page.partners.kicker')}
            </span>
            <h3 className="font-drama italic text-3xl md:text-5xl text-background/80 leading-tight">
              {t('social_page.partners.title')}
            </h3>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-24 mt-16">
            <a href="https://toyenunlimited.no/" target="_blank" rel="noopener noreferrer"
               className="group flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-500">
              <img src="/logo-toyen-unlimited.png" alt="Toyen Unlimited"
                   className="h-10 md:h-14 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
            </a>
            <div className="hidden md:block w-[1px] h-14 bg-white/8" />
            <a href="https://poaciadanca.com.br/en/" target="_blank" rel="noopener noreferrer"
               className="group flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-500">
              <img src="/logo-poaciadanca.png" alt="POA Cia de Dança"
                   className="h-14 md:h-20 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
            </a>
          </div>

          <p className="mt-16 font-heading text-background/40 font-light text-sm md:text-base text-center max-w-2xl mx-auto leading-[1.8]">
            {t('social_page.partners.desc')}
          </p>
        </div>
      </section>

      {/* ─── CTA / SUPPORT ────────────────────────────────────────────── */}
      <section id="apoie" className="py-40 md:py-56 px-6 lg:px-12 bg-primary relative overflow-hidden">
        {/* Soft glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] opacity-[0.05]"
               style={{ background: 'radial-gradient(ellipse, #C9A84C 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center reveal-elem flex flex-col items-center">
          <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-10">
            {t('social_page.cta.kicker')}
          </span>
          <h2 className="font-drama italic text-5xl md:text-7xl lg:text-8xl text-background leading-[0.95] mb-10">
            {t('social_page.cta.title')}
          </h2>
          <div className="h-[1px] w-24 bg-accent/30 mb-10 draw-line" />
          <p className="font-heading text-background/55 text-base md:text-lg font-light max-w-2xl mb-16 leading-[1.8]">
            {t('social_page.cta.desc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <button className="btn-magnetic bg-accent text-primary px-10 py-5 rounded-full font-heading font-bold text-sm tracking-wide flex items-center gap-2">
              {t('social_page.cta.btn1')} <ArrowRight size={15} />
            </button>
            <button className="px-10 py-5 rounded-full font-heading font-light text-sm border border-background/20 text-background/70 hover:border-accent/50 hover:text-background transition-all duration-400">
              {t('social_page.cta.btn2')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SocialPage;
