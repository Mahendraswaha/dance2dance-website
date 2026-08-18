import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * BE THE DANCE — Direção A: "Revelação Editorial"
 * Narrativa linear em 7 momentos com tipografia como protagonista.
 */
const BeTheDancePhilosophyA = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.btda-reveal').forEach((elem) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: 'top 85%' },
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      });

      const m2Lines = gsap.utils.toArray('.btda-m2-line');
      if (m2Lines.length) {
        gsap.from(m2Lines, {
          scrollTrigger: { trigger: m2Lines[0], start: 'top 85%' },
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        });
      }

      gsap.utils.toArray('.btda-draw-line').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'power3.out',
        });
      });

      gsap.utils.toArray('.btda-displacement').forEach((elem) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: 'top 85%' },
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-primary px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">

        {/* ─── MOMENTO 1 ─── */}
        <div className="pt-32 pb-24">
          <p className="btda-reveal font-drama italic text-[7vw] md:text-[4vw] lg:text-[3.2vw] text-background/90 leading-[1.15] md:max-w-[70%]">
            Você não precisa aprender a dançar.
          </p>
        </div>

        {/* ─── MOMENTO 2 — Nome ─── */}
        <div className="pb-20">
          <span className="btda-m2-line font-heading text-[10px] tracking-[5px] uppercase text-slate-500 block mb-8">
            Um programa de quatro workshops
          </span>
          <h2 className="btda-m2-line font-drama italic text-[14vw] md:text-[9vw] lg:text-[7vw] text-background/90 leading-[0.85] tracking-tight">
            BE THE
          </h2>
          <h2 className="btda-m2-line font-drama italic text-[14vw] md:text-[9vw] lg:text-[7vw] text-background/90 leading-[0.85] tracking-tight">
            DANCE
          </h2>
          <div className="btda-draw-line h-[1px] bg-white/8 mt-10" />
        </div>

        {/* ─── MOMENTO 3 — A Inversão ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pb-28 md:pb-32">
          <div className="md:col-span-3">
            <span className="btda-reveal font-heading text-[10px] tracking-[4px] uppercase text-slate-500 block">
              A ideia
            </span>
          </div>
          <div className="md:col-span-9 flex flex-col gap-10 btda-reveal">
            <p className="font-heading text-base md:text-lg text-background/50 leading-[1.9] font-light">
              Existe uma possibilidade de dança em cada corpo.
              Não uma dança que se aprende — uma que se descobre.
            </p>
            <p className="font-heading text-base md:text-lg text-background/50 leading-[1.9] font-light">
              Ritmo, impulso, pausa. O corpo já conhece esses
              vocabulários. O workshop cria as condições para que
              eles se tornem expressão.
            </p>
          </div>
        </div>

        {/* ─── MOMENTO 4 — Silêncio ─── */}
        <div className="py-28 md:py-36 flex justify-center">
          <p className="btda-reveal font-drama italic text-2xl md:text-3xl text-slate-300/40 leading-[1.35] text-center max-w-2xl">
            Há milênios, antes de qualquer técnica,
            <br className="hidden md:block" />
            {' '}o corpo já dançava.
          </p>
        </div>

        {/* ─── MOMENTO 5 — Deslocamentos ─── */}
        <div className="pb-32 flex flex-col gap-14 md:max-w-[55%]">
          <div className="btda-displacement flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Do esforço ao fluxo.
            </p>
            <p className="font-heading text-sm md:text-[15px] text-background/35 font-light leading-[1.85]">
              Soltar a tensão acumulada. Deixar o movimento
              encontrar seu próprio caminho.
            </p>
          </div>
          <div className="btda-displacement flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Da forma à presença.
            </p>
            <p className="font-heading text-sm md:text-[15px] text-background/35 font-light leading-[1.85]">
              Sair da preocupação com "como estou dançando"
              para perceber o que o corpo quer dizer.
            </p>
          </div>
          <div className="btda-displacement flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Do controle à escuta.
            </p>
            <p className="font-heading text-sm md:text-[15px] text-background/35 font-light leading-[1.85]">
              Ouvir a respiração. Seguir o impulso.
              Responder à música antes de pensar.
            </p>
          </div>
          <div className="btda-displacement flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Do isolamento à percepção.
            </p>
            <p className="font-heading text-sm md:text-[15px] text-background/35 font-light leading-[1.85]">
              Reconhecer o corpo inteiro. Sentir como uma
              parte se conecta a outra, e outra, e outra.
            </p>
          </div>
        </div>

        {/* ─── MOMENTO 6 — Síntese ─── */}
        <div className="pb-24">
          <p className="btda-reveal font-drama italic text-3xl md:text-5xl lg:text-6xl text-background/90 leading-[1.1] md:max-w-[70%]">
            A dança não precisa ser aprendida.
          </p>
          <p className="btda-reveal font-drama italic text-3xl md:text-5xl lg:text-6xl text-background/40 leading-[1.1] mt-2 md:max-w-[70%]">
            Precisa ser permitida.
          </p>
        </div>

        {/* ─── MOMENTO 7 — Transição ─── */}
        <div className="pb-20 flex flex-col items-center text-center gap-5 btda-reveal">
          <span className="font-heading text-[10px] tracking-[5px] uppercase text-slate-500 block">
            Quatro caminhos
          </span>
          <p className="font-heading text-lg md:text-xl text-background/50 font-light leading-[1.6]">
            Cada workshop explora um território.
            <br />
            Escolha o que chama primeiro.
          </p>
        </div>

      </div>
    </section>
  );
};

export default BeTheDancePhilosophyA;
