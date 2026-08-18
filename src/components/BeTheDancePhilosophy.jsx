import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * BE THE DANCE — Direção C: "Pergunta e Silêncio"
 * 
 * Conceito: A seção é uma sequência de perguntas que o visitante
 * responde internamente. Cada resposta interna revela o próximo conteúdo.
 * O ritmo é: tensão → pausa → recontextualização → nova tensão.
 * 
 * Cada pergunta aparece sozinha com muito espaço.
 * O scroll preenche o vazio com uma observação que recontextualiza.
 */
const BeTheDancePhilosophy = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Each "answer" block fades in as the visitor scrolls past the question
      gsap.utils.toArray('.btd-answer').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
          opacity: 0,
          y: 30,
          duration: 1.2,
          ease: 'power3.out',
        });
      });

      // Questions fade in cleanly
      gsap.utils.toArray('.btd-question').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
          },
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
        });
      });

      // The name reveal
      gsap.from('.btd-name', {
        scrollTrigger: {
          trigger: '.btd-name',
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        duration: 1.4,
        ease: 'power4.out',
      });

      // Synthesis reveal
      gsap.from('.btd-synthesis', {
        scrollTrigger: {
          trigger: '.btd-synthesis',
          start: 'top 80%',
        },
        opacity: 0,
        duration: 1.4,
        ease: 'power2.out',
      });

      // Line draw
      gsap.utils.toArray('.btd-line').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          ease: 'power3.out',
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-primary">

      {/* ━━━ PERGUNTA 1 ━━━ */}
      <div className="min-h-[60vh] flex items-center px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <p className="btd-question font-drama italic text-[7vw] md:text-[4vw] lg:text-[3.2vw] text-background/90 leading-[1.15]">
            Quando foi a última vez que você<br className="hidden md:block" /> se moveu sem pensar em como?
          </p>
        </div>
      </div>

      {/* ━━━ RESPOSTA 1 — O corpo como silêncio recoberto ━━━ */}
      <div className="px-6 lg:px-12 pb-40">
        <div className="max-w-7xl mx-auto">
          <div className="btd-answer md:ml-[30%] max-w-xl">
            <div className="btd-line h-[1px] bg-white/10 mb-10" />
            <p className="font-heading text-base md:text-lg text-background/50 font-light leading-[1.9]">
              Antes de qualquer técnica, antes de qualquer nome para isso,
              o corpo já sabia dançar. Não como performance —
              como impulso. Como ritmo. Como resposta ao que se ouve
              e ao que se sente.
            </p>
          </div>
        </div>
      </div>

      {/* ━━━ O NOME ━━━ */}
      <div className="py-32 md:py-44 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center btd-name">
          <span className="font-heading text-[10px] tracking-[5px] uppercase text-slate-500 block mb-8">
            Um programa de quatro workshops
          </span>
          <h2 className="font-drama italic text-[14vw] md:text-[9vw] lg:text-[7vw] text-background/90 leading-[0.85] tracking-tight">
            BE THE DANCE
          </h2>
        </div>
      </div>

      {/* ━━━ PERGUNTA 2 ━━━ */}
      <div className="min-h-[50vh] flex items-center px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <p className="btd-question font-drama italic text-[7vw] md:text-[4vw] lg:text-[3.2vw] text-background/90 leading-[1.15]">
            E se a dança não fosse algo<br className="hidden md:block" /> que se aprende?
          </p>
        </div>
      </div>

      {/* ━━━ RESPOSTA 2 — A inversão ━━━ */}
      <div className="px-6 lg:px-12 pb-40">
        <div className="max-w-7xl mx-auto">
          <div className="btd-answer md:ml-[30%] max-w-xl">
            <div className="btd-line h-[1px] bg-white/10 mb-10" />
            <p className="font-heading text-base md:text-lg text-background/50 font-light leading-[1.9] mb-8">
              Existe uma possibilidade de dança em cada corpo.
              Não uma dança que se aprende — uma que se descobre.
            </p>
            <p className="font-heading text-base md:text-lg text-background/50 font-light leading-[1.9]">
              Ritmo, impulso, pausa. O corpo já conhece esses vocabulários.
              O workshop cria as condições para que eles se tornem expressão.
            </p>
          </div>
        </div>
      </div>

      {/* ━━━ PERGUNTA 3 ━━━ */}
      <div className="min-h-[50vh] flex items-center px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <p className="btd-question font-drama italic text-[7vw] md:text-[4vw] lg:text-[3.2vw] text-background/90 leading-[1.15]">
            O que acontece quando<br className="hidden md:block" /> você para de controlar?
          </p>
        </div>
      </div>

      {/* ━━━ RESPOSTA 3 — Os deslocamentos ━━━ */}
      <div className="px-6 lg:px-12 pb-40">
        <div className="max-w-7xl mx-auto">
          <div className="md:ml-[30%] max-w-xl">
            <div className="btd-line h-[1px] bg-white/10 mb-16" />

            <div className="btd-answer flex flex-col gap-14">

              <div>
                <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2] mb-3">
                  Do esforço ao fluxo.
                </p>
                <p className="font-heading text-sm md:text-[15px] text-background/35 font-light leading-[1.85]">
                  Soltar a tensão acumulada. Deixar o movimento
                  encontrar seu próprio caminho.
                </p>
              </div>

              <div>
                <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2] mb-3">
                  Da forma à presença.
                </p>
                <p className="font-heading text-sm md:text-[15px] text-background/35 font-light leading-[1.85]">
                  Sair da preocupação com "como estou dançando"
                  para perceber o que o corpo quer dizer.
                </p>
              </div>

              <div>
                <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2] mb-3">
                  Do controle à escuta.
                </p>
                <p className="font-heading text-sm md:text-[15px] text-background/35 font-light leading-[1.85]">
                  Ouvir a respiração. Seguir o impulso.
                  Responder à música antes de pensar.
                </p>
              </div>

              <div>
                <p className="font-drama italic text-xl md:text-2xl text-background/80 leading-[1.2] mb-3">
                  Do isolamento à percepção.
                </p>
                <p className="font-heading text-sm md:text-[15px] text-background/35 font-light leading-[1.85]">
                  Reconhecer o corpo inteiro. Sentir como uma
                  parte se conecta a outra, e outra, e outra.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ━━━ SÍNTESE ━━━ */}
      <div className="py-32 md:py-44 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center btd-synthesis">
          <p className="font-drama italic text-3xl md:text-5xl lg:text-6xl text-background/90 leading-[1.1] max-w-3xl mx-auto">
            A dança não precisa<br /> ser aprendida.
          </p>
          <p className="font-drama italic text-3xl md:text-5xl lg:text-6xl text-background/40 leading-[1.1] mt-3 max-w-3xl mx-auto">
            Precisa ser permitida.
          </p>
        </div>
      </div>

      {/* ━━━ TRANSIÇÃO PARA OS WORKSHOPS ━━━ */}
      <div className="pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center btd-answer">
          <span className="font-heading text-[10px] tracking-[5px] uppercase text-slate-500 block mb-5">
            Quatro caminhos
          </span>
          <p className="font-heading text-lg md:text-xl text-background/50 font-light leading-[1.6]">
            Cada workshop explora um território.<br />
            Escolha o que chama primeiro.
          </p>
        </div>
      </div>

    </section>
  );
};

export default BeTheDancePhilosophy;
