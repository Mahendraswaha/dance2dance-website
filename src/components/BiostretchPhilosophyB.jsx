import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * BIOSTRETCH — Direção B: "O Manual Invertido"
 * 
 * Conceito: Começa pelo resultado (o que muda) e vai retrocedendo até revelar
 * o princípio e o nome do método no final.
 */
const BiostretchPhilosophyB = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in base
      gsap.utils.toArray('.bio-fade').forEach((elem) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: 'top 85%' },
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });

      // Name reveal stagger
      const m2Lines = gsap.utils.toArray('.bio-name-line');
      if (m2Lines.length) {
        gsap.from(m2Lines, {
          scrollTrigger: { trigger: m2Lines[0], start: 'top 85%' },
          opacity: 0,
          y: 20,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-primary px-6 lg:px-12 py-32">
      <div className="max-w-7xl mx-auto flex flex-col gap-40">

        {/* ─── BLOCO 1: O RESULTADO ─── */}
        <div className="md:pl-[10%] max-w-2xl">
          <p className="bio-fade font-drama italic text-3xl md:text-5xl lg:text-6xl text-background/90 leading-[1.1] mb-6">
            A tensão se dissolve.
          </p>
          <p className="bio-fade font-heading text-lg md:text-xl text-background/60 leading-[1.8] font-light">
            A respiração ganha profundidade. O movimento encontra um caminho mais livre, mais inteligente. O corpo descobre que pode existir com menos peso.
          </p>
        </div>

        {/* ─── BLOCO 2: O MEIO ─── */}
        <div className="md:ml-[25%] max-w-2xl">
          <p className="bio-fade font-drama italic text-2xl md:text-4xl text-background/80 leading-[1.2] mb-6">
            Isso acontece não por esforço, mas por pausa.
          </p>
          <p className="bio-fade font-heading text-lg md:text-xl text-background/60 leading-[1.8] font-light">
            Ao direcionar a atenção para movimentos simples, os padrões automáticos se revelam. O que era contração inconsciente torna-se espaço escolhido.
          </p>
        </div>

        {/* ─── BLOCO 3: O PRINCÍPIO ─── */}
        <div className="md:ml-[40%] max-w-2xl">
          <p className="bio-fade font-drama italic text-2xl md:text-4xl text-background/80 leading-[1.2] mb-6">
            O corpo é um sistema que responde à escuta.
          </p>
          <p className="bio-fade font-heading text-lg md:text-xl text-background/60 leading-[1.8] font-light">
            Quando a velocidade diminui, a percepção se amplia. Importa menos o que se faz e mais como se faz. A ferramenta mais poderosa é a sua própria atenção.
          </p>
        </div>

        {/* ─── BLOCO 4: O NOME ─── */}
        <div className="flex flex-col items-center text-center mt-20">
          <span className="bio-name-line font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-8">
            Quatro décadas de pesquisa em movimento
          </span>
          <h2 className="bio-name-line font-drama italic text-[14vw] md:text-[11vw] lg:text-[9vw] text-background/90 leading-[0.85] tracking-tight">
            BIOSTRETCH
          </h2>
        </div>

        {/* ─── BLOCO 5: TRANSIÇÃO ─── */}
        <div className="flex justify-center text-center -mt-10">
          <div className="bio-fade">
            <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
              Seis práticas
            </span>
            <p className="font-heading text-lg md:text-xl text-background/50 font-light leading-[1.6]">
              Cada workshop trabalha uma camada.<br />
              Comece pela que seu corpo pedir.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BiostretchPhilosophyB;
