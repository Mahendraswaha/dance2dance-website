import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BeTheDancePhilosophy = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade-in for all reveal elements
      gsap.utils.toArray('.btd-reveal').forEach((elem) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: 'top 85%' },
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      });

      // Stagger fade for moment 2 lines
      const m2Lines = gsap.utils.toArray('.btd-m2-line');
      if (m2Lines.length) {
        gsap.from(m2Lines, {
          scrollTrigger: { trigger: m2Lines[0], start: 'top 85%' },
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        });
      }

      // Line draw
      gsap.utils.toArray('.btd-draw-line').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'power3.out',
        });
      });

      // Displacement blocks with translate-y
      gsap.utils.toArray('.btd-displacement').forEach((elem, i) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: 'top 85%' },
          y: 20,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-primary px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* ─── MOMENTO 1 — A Quebra de Expectativa ─── */}
        <div className="pt-32 pb-24">
          <p className="btd-reveal font-drama italic text-3xl md:text-4xl lg:text-5xl text-background/90 leading-[1.15] md:max-w-[55%]">
            Você não precisa aprender a dançar.
          </p>
        </div>

        {/* ─── MOMENTO 2 — A Revelação do Nome ─── */}
        <div className="pb-20">
          <span className="btd-m2-line font-heading text-[10px] md:text-[11px] tracking-[5px] uppercase text-slate-500 block mb-8">
            Um programa de quatro workshops
          </span>
          <h2 className="btd-m2-line font-drama italic text-[15vw] md:text-[10vw] lg:text-[8vw] text-background/90 leading-[0.9] tracking-tight">
            BE THE
          </h2>
          <h2 className="btd-m2-line font-drama italic text-[15vw] md:text-[10vw] lg:text-[8vw] text-background/90 leading-[0.9] tracking-tight">
            DANCE
          </h2>
          <div className="btd-draw-line h-[1px] bg-white/8 mt-10 max-w-full" />
        </div>

        {/* ─── MOMENTO 3 — A Inversão ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pb-28 md:pb-32">
          <div className="md:col-span-4">
            <span className="btd-reveal font-heading text-[10px] tracking-[4px] uppercase text-slate-500 block">
              A ideia
            </span>
          </div>
          <div className="md:col-span-8 flex flex-col gap-10 btd-reveal">
            <p className="font-heading text-lg md:text-xl text-background/60 leading-[1.85] font-light">
              Existe uma possibilidade de dança em cada corpo.
              Não uma dança que se aprende — uma que se descobre.
            </p>
            <p className="font-heading text-lg md:text-xl text-background/60 leading-[1.85] font-light">
              Ritmo, impulso, pausa. O corpo já conhece esses
              vocabulários. O workshop cria as condições para que
              eles se tornem expressão.
            </p>
          </div>
        </div>

        {/* ─── MOMENTO 4 — A Pergunta Silenciosa ─── */}
        <div className="py-28 md:py-32 flex justify-center">
          <p className="btd-reveal font-drama italic text-2xl md:text-3xl text-slate-300/50 leading-[1.35] text-center max-w-2xl">
            Há milênios, antes de qualquer técnica,
            <br className="hidden md:block" />
            {' '}o corpo já dançava.
          </p>
        </div>

        {/* ─── MOMENTO 5 — Os Deslocamentos ─── */}
        <div className="pb-32 flex flex-col gap-16 md:max-w-[50%]">

          <div className="btd-displacement flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Do esforço ao fluxo.
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.8]">
              Soltar a tensão acumulada. Deixar o movimento
              encontrar seu próprio caminho.
            </p>
          </div>

          <div className="btd-displacement flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Da forma à presença.
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.8]">
              Sair da preocupação com "como estou dançando"
              para perceber o que o corpo quer dizer.
            </p>
          </div>

          <div className="btd-displacement flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Do controle à escuta.
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.8]">
              Ouvir a respiração. Seguir o impulso.
              Responder à música antes de pensar.
            </p>
          </div>

          <div className="btd-displacement flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Do isolamento à percepção.
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.8]">
              Reconhecer o corpo inteiro. Sentir como uma
              parte se conecta a outra, e outra, e outra.
            </p>
          </div>

        </div>

        {/* ─── MOMENTO 6 — A Síntese ─── */}
        <div className="pb-24">
          <p className="btd-reveal font-drama italic text-3xl md:text-4xl lg:text-5xl text-background/90 leading-[1.15] md:max-w-[65%]">
            A dança não precisa ser aprendida.
            <br />
            Precisa ser permitida.
          </p>
        </div>

        {/* ─── MOMENTO 7 — A Passagem para os Workshops ─── */}
        <div className="pb-20 flex flex-col items-center text-center gap-5 btd-reveal">
          <span className="font-heading text-[10px] md:text-[11px] tracking-[5px] uppercase text-slate-500 block">
            Quatro caminhos
          </span>
          <p className="font-heading text-xl md:text-2xl text-background/60 font-light leading-[1.6] max-w-md">
            Cada workshop explora um território.
            <br />
            Escolha o que chama primeiro.
          </p>
        </div>

      </div>
    </section>
  );
};

export default BeTheDancePhilosophy;
