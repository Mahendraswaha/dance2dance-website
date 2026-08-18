import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * BIOSTRETCH — Direção A: "Camadas de Percepção"
 * 
 * Conceito: Descida vertical através de camadas. 
 * Começa na superfície do corpo e aprofunda pelo sutil.
 * Ritmo mais lento e respirado.
 */
const BiostretchPhilosophy = () => {
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
      const m2Lines = gsap.utils.toArray('.bio-m2-line');
      if (m2Lines.length) {
        gsap.from(m2Lines, {
          scrollTrigger: { trigger: m2Lines[0], start: 'top 85%' },
          opacity: 0,
          y: 10,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }

      // Line draw
      gsap.utils.toArray('.bio-draw-line').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.5,
          ease: 'power3.out',
        });
      });

      // Staggered layers
      gsap.utils.toArray('.bio-layer').forEach((elem, i) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: 'top 85%' },
          y: 20,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-primary px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* ─── MOMENTO 1 — O Reconhecimento ─── */}
        <div className="pt-32 pb-64 md:pl-[20%]">
          <p className="bio-fade font-drama italic text-3xl md:text-5xl text-background/90 leading-[1.2]">
            Seu corpo já sabe o que está tenso.
            <br />
            <span className="text-accent">Você só deixou de escutá-lo.</span>
          </p>
        </div>

        {/* ─── MOMENTO 2 — O Nome como Método ─── */}
        <div className="pb-20 md:pl-[20%]">
          <span className="bio-m2-line font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
            Quatro décadas de pesquisa em movimento
          </span>
          <h2 className="bio-m2-line font-drama italic text-[14vw] md:text-[11vw] lg:text-[9vw] text-background/90 leading-[0.85] tracking-tight">
            BIOSTRETCH
          </h2>
          <div className="bio-draw-line h-[1px] bg-white/10 mt-12 md:max-w-[70%]" />
        </div>

        {/* ─── MOMENTO 3 — O Princípio ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pb-32 md:pl-[20%]">
          <div className="md:col-span-3">
            <span className="bio-fade font-heading text-[10px] tracking-[4px] uppercase text-accent block">
              O princípio
            </span>
          </div>
          <div className="md:col-span-8 flex flex-col gap-10 bio-fade">
            <p className="font-heading text-lg md:text-xl text-background/60 leading-[1.8] font-light">
              Movimentos simples. Atenção precisa.<br className="hidden md:block" />
              O Biostretch usa a ferramenta mais acessível que existe, a sua atenção, para transformar a maneira como o corpo se organiza.
            </p>
            <p className="font-heading text-xl md:text-2xl text-background/80 leading-[1.6] font-light">
              Importa menos o que se faz<br />
              e mais como se faz.
            </p>
          </div>
        </div>

        {/* ─── MOMENTO 4 — A Pausa ─── */}
        <div className="py-32 flex justify-center text-center">
          <p className="bio-fade font-drama italic text-2xl md:text-3xl text-slate-300/40 leading-[1.4] max-w-2xl">
            O corpo não esqueceu como se mover.
            <br />
            Prestar atenção é que foi esquecido.
          </p>
        </div>

        {/* ─── MOMENTO 5 — As Camadas ─── */}
        <div className="pb-32 flex flex-col gap-14 md:pl-[20%] md:max-w-[75%]">
          <div className="bio-layer flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Na superfície, tensão se dissolve.
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.85]">
              O que se acumulou no pescoço, nos ombros, nas costas
              encontra espaço para se soltar.
            </p>
          </div>
          
          <div className="bio-layer flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Abaixo, padrões se revelam.
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.85]">
              Hábitos automáticos de movimento — que nunca foram
              escolhidos — tornam-se visíveis pela primeira vez.
            </p>
          </div>
          
          <div className="bio-layer flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Mais fundo, o ritmo muda.
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.85]">
              O sistema nervoso encontra equilíbrio. A respiração
              se aprofunda. O estresse perde terreno.
            </p>
          </div>
          
          <div className="bio-layer flex flex-col gap-3">
            <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2]">
              Na base, algo se reorganiza.
            </p>
            <p className="font-heading text-sm md:text-base text-background/40 font-light leading-[1.85]">
              O corpo descobre caminhos mais inteligentes para
              se mover. Não por esforço, por percepção.
            </p>
          </div>
        </div>

        {/* ─── MOMENTO 6 — Síntese ─── */}
        <div className="pb-24 md:pl-[20%]">
          <div className="bio-fade">
            <p className="font-drama italic text-3xl md:text-5xl lg:text-6xl text-background/90 leading-[1.1] md:max-w-[70%]">
              Menos esforço.
            </p>
            <p className="font-drama italic text-3xl md:text-5xl lg:text-6xl text-background/90 leading-[1.1] mt-2 md:max-w-[70%]">
              Mais consciência.
            </p>
            <p className="font-heading text-base md:text-lg text-background/45 font-light leading-[1.6] mt-8">
              Qualquer corpo, qualquer idade, qualquer ponto de partida.
            </p>
          </div>
        </div>

        {/* ─── MOMENTO 7 — Transição ─── */}
        <div className="pb-20 flex flex-col items-center text-center gap-5 bio-fade">
          <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block">
            Seis práticas
          </span>
          <p className="font-heading text-lg md:text-xl text-background/50 font-light leading-[1.6]">
            Cada workshop trabalha uma camada.<br />
            Comece pela que seu corpo pedir.
          </p>
        </div>

      </div>
    </section>
  );
};

export default BiostretchPhilosophy;
