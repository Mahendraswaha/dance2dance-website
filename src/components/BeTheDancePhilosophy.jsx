import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * BE THE DANCE — Direção B: "A Margem e o Centro"
 * 
 * Conceito: A tensão entre margem e centro da página como metáfora. 
 * As ideias começam na margem esquerda (fragmentos, provocações) e gradualmente migram 
 * para o centro à medida que se tornam mais completas.
 */
const BeTheDancePhilosophy = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Elements that just fade in
      gsap.utils.toArray('.btdb-fade').forEach((elem) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: 'top 85%' },
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
        });
      });

      // Elements that fade and slide slightly horizontally (the migration to center)
      gsap.utils.toArray('.btdb-slide-right').forEach((elem, i) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: 'top 85%' },
          opacity: 0,
          x: -40, // start a bit further left
          duration: 1.2,
          ease: 'power3.out',
        });
      });

      // Name reveal (the center)
      gsap.from('.btdb-center-reveal', {
        scrollTrigger: { trigger: '.btdb-center-reveal', start: 'top 80%' },
        opacity: 0,
        scale: 0.95,
        duration: 1.5,
        ease: 'power4.out',
      });

      // Staggered blocks
      gsap.utils.toArray('.btdb-stagger-block').forEach((elem, i) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: 'top 85%' },
          opacity: 0,
          x: -20,
          y: 20,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { t } = useTranslation();

  return (
    <section ref={sectionRef} className="bg-primary px-6 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ─── MOMENTO 1 — Esquerda (com respiro) ─── */}
        <div className="pt-32 pb-32 flex justify-start md:pl-[20%]">
          <p className="btdb-slide-right font-drama italic text-3xl md:text-5xl text-background/90 leading-[1.2] max-w-sm">
            {t('be_the_dance_philosophy.m1.l1')}
          </p>
        </div>

        {/* ─── MOMENTO 3 — Começa a migrar para a direita ─── */}
        <div className="pb-40 flex justify-start md:pl-[25%]">
          <div className="btdb-slide-right max-w-xl border-l border-white/10 pl-6 md:pl-10">
            <span className="font-heading text-[10px] tracking-[4px] uppercase text-accent block mb-6">
              {t('be_the_dance_philosophy.m3.kicker')}
            </span>
            <div className="flex flex-col gap-6">
              <p className="font-heading text-lg md:text-xl text-background/60 leading-[1.8] font-light">
                {t('be_the_dance_philosophy.m3.p1')}<br />
                {t('be_the_dance_philosophy.m3.p2')}
              </p>
              <p className="font-heading text-lg md:text-xl text-background/60 leading-[1.8] font-light">
                {t('be_the_dance_philosophy.m3.p3')}<br />
                {t('be_the_dance_philosophy.m3.p4')}<br />
                {t('be_the_dance_philosophy.m3.p5')}
              </p>
            </div>
          </div>
        </div>

        {/* ─── MOMENTO 5 — Deslocamentos (Escada visual em direção ao centro) ─── */}
        <div className="pb-40 flex flex-col gap-16 relative">
          
          <div className="btdb-stagger-block md:w-[45%] md:ml-[30%]">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2] mb-2">
              {t('be_the_dance_philosophy.m5.c1.title')}
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.8]">
              {t('be_the_dance_philosophy.m5.c1.desc')}
            </p>
          </div>

          <div className="btdb-stagger-block md:w-[45%] md:ml-[36%]">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2] mb-2">
              {t('be_the_dance_philosophy.m5.c2.title')}
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.8]">
              {t('be_the_dance_philosophy.m5.c2.desc')}
            </p>
          </div>

          <div className="btdb-stagger-block md:w-[45%] md:ml-[42%]">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2] mb-2">
              {t('be_the_dance_philosophy.m5.c3.title')}
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.8]">
              {t('be_the_dance_philosophy.m5.c3.desc')}
            </p>
          </div>

          <div className="btdb-stagger-block md:w-[45%] md:ml-[48%]">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2] mb-2">
              {t('be_the_dance_philosophy.m5.c4.title')}
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.8]">
              {t('be_the_dance_philosophy.m5.c4.desc')}
            </p>
          </div>

        </div>

        {/* ─── MOMENTO 2 — O NOME NO CENTRO (O clímax da forma) ─── */}
        <div className="py-40 flex justify-center text-center btdb-center-reveal relative">
          <div className="absolute top-1/2 left-0 w-[20%] h-[1px] bg-gradient-to-r from-transparent to-white/10 -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-[20%] h-[1px] bg-gradient-to-l from-transparent to-white/10 -translate-y-1/2" />
          
          <div className="relative z-10">
            <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-8">
              {t('be_the_dance_philosophy.m2.kicker')}
            </span>
            <h2 className="font-drama italic text-[15vw] md:text-[11vw] lg:text-[9vw] text-background/90 leading-[0.85] tracking-tight">
              {t('be_the_dance_philosophy.m2.t1')}
            </h2>
            <h2 className="font-drama italic text-[15vw] md:text-[11vw] lg:text-[9vw] text-background/90 leading-[0.85] tracking-tight">
              {t('be_the_dance_philosophy.m2.t2')}
            </h2>
          </div>
        </div>

        {/* ─── MOMENTO 4 — A Citação Histórica (O eco do centro) ─── */}
        <div className="pb-32 flex justify-center text-center">
          <p className="btdb-fade font-drama italic text-2xl md:text-3xl text-slate-300/40 leading-[1.35] max-w-2xl">
            {t('be_the_dance_philosophy.m4.l1')}
            <br className="hidden md:block" />
            {' '}{t('be_the_dance_philosophy.m4.l2')}
          </p>
        </div>

        {/* ─── MOMENTO 6 — Síntese (Mantém-se no centro, mas suave) ─── */}
        <div className="pb-32 flex justify-center text-center">
          <div className="btdb-fade">
            <p className="font-drama italic text-3xl md:text-5xl text-background/90 leading-[1.2] max-w-2xl mx-auto">
              {t('be_the_dance_philosophy.m6.l1')}
            </p>
            <p className="font-drama italic text-3xl md:text-5xl text-accent leading-[1.2] mt-4 max-w-2xl mx-auto">
              {t('be_the_dance_philosophy.m6.l2')}
            </p>
          </div>
        </div>

        {/* ─── MOMENTO 7 — Transição para os Workshops ─── */}
        <div className="pb-24 flex justify-center text-center">
          <div className="btdb-fade">
            <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
              {t('be_the_dance_philosophy.m7.kicker')}
            </span>
            <p className="font-heading text-lg md:text-xl text-background/50 font-light leading-[1.6]">
              {t('be_the_dance_philosophy.m7.l1')}<br />
              {t('be_the_dance_philosophy.m7.l2')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BeTheDancePhilosophy;
