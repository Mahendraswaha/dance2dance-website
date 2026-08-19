import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

import Brand from './Brand';

const HeroSequence = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const heroContentRef = useRef(null);
  const videoRef = useRef(null);
  const imagesRef = useRef([]);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameCount = 240;

  useEffect(() => {
    let loadedCount = 0;
    imagesRef.current = new Array(frameCount).fill(null);
    
    const firstImg = new Image();
    firstImg.src = `/gallery/sequence/frame-001.jpg`;
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      loadedCount++;
      setFirstFrameLoaded(true); // Libera a tela imediatamente com o frame 1
      
      // Começa a carregar o resto em background
      for (let i = 2; i <= frameCount; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(3, '0');
        img.src = `/gallery/sequence/frame-${frameNumber}.jpg`;
        img.onload = () => {
          imagesRef.current[i-1] = img;
          loadedCount++;
          if (loadedCount === frameCount) {
            setIsLoaded(true);
          }
        };
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const render = (index) => {
      const imgs = imagesRef.current;
      const floorIndex = Math.floor(index);
      
      let img = imgs[floorIndex];
      
      // Se o frame exato não carregou (scroll muito rápido), acha o último frame que carregou
      if (!img) {
        for(let i = floorIndex - 1; i >= 0; i--) {
          if (imgs[i]) {
            img = imgs[i];
            break;
          }
        }
      }
      
      if (img) {
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height,
          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
      }
    };

    render(0);

    const animationData = { frame: 0 };
    
    const gsapCtx = gsap.context(() => {
      
      // Animação inicial de entrada
      gsap.from('.hero-elem', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=800%', 
          pin: true,
          scrub: true,
          pinSpacing: true, // Força a criação do espaço para não sobrepor
        }
      });
      
      // Quando começa a rolar, o video some suavemente
      tl.to(videoRef.current, { opacity: 0, duration: 0.05 }, 0);
      
      // O texto principal do hero sobe e some
      tl.to(heroContentRef.current, { y: -200, opacity: 0, duration: 0.1 }, 0);

      // Reprodução do canvas frame a frame
      tl.to(animationData, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        duration: 1, // timeline normalizada
        onUpdate: () => {
          requestAnimationFrame(() => render(animationData.frame));
        }
      }, 0);
      
      // 1. A primeira frase original aparece no centro
      tl.fromTo('.seq-text-1', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.05 }, 
        0.1
      );
      // Fade out mais cedo
      tl.to('.seq-text-1', { opacity: 0, y: -50, duration: 0.05 }, 0.20);
      
      // 2. O bloco de texto rola continuamente (como créditos de filme)
      // Ele começa fisicamente abaixo da tela (top-full) e rola até sair completamente pelo topo
      tl.to('.seq-block-rest', 
        { 
          yPercent: -100,
          y: () => -window.innerHeight,
          ease: 'none', 
          duration: 0.5 
        }, 
        0.15 // <- COMEÇA A SUBIR MAIS CEDO (antes era 0.25)
      );

      // O bloco começa a desaparecer em fade mais cedo para acompanhar
      tl.to('.seq-block-rest', { opacity: 0, duration: 0.15, ease: 'power2.inOut' }, 0.50);

      // 3. A última frase aparece no centro em cross-fade acompanhando a saída do bloco
      tl.fromTo('.seq-text-last', 
        { opacity: 0, scale: 0.95 }, 
        { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.1 }, 
        0.55 // <- Aparece um pouco antes também
      );
      
      // Teste: Clareia o filtro escuro no momento em que a última frase entra (0.8) até o fim da timeline
      tl.to('.dark-overlay', { opacity: 0, duration: 0.2 }, 0.8);

    }, containerRef);

    let lastWidth = window.innerWidth;
    const handleResize = () => {
      // No mobile, ignorar mudanças de altura (causadas pela barra de endereço)
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render(animationData.frame);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      gsapCtx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Dependência vazia: roda IMEDIATAMENTE no mount para travar a tela

  // Re-render inicial frame once first image is loaded
  useEffect(() => {
    if (firstFrameLoaded && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imagesRef.current[0];
      if (img) {
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
      }
    }
  }, [firstFrameLoaded]);

  return (
    <section ref={containerRef} className="relative h-[100dvh] w-full bg-primary overflow-hidden">
      
      {/* Fallback de carregamento (apenas para o primeiro frame) */}
      {!firstFrameLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary z-0">
          <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        </div>
      )}
      
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Vídeo do Hero em loop (frame 1 da animação essencialmente) */}
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          poster="/gallery/sequence/frame-001.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
      </div>
      
      {/* Texto do Hero */}
      <div ref={heroContentRef} className="absolute inset-0 z-10 w-full max-w-7xl mx-auto flex flex-col md:w-2/3 lg:w-1/2 items-start justify-end pb-24 md:pb-32 px-6 lg:px-12 pointer-events-none">
        <h1 className="flex flex-col gap-2">
          <span className="hero-elem font-heading font-bold text-3xl md:text-5xl text-background/90 tracking-tight">{t("hero.subtitle1")}</span>
          <span className="hero-elem font-drama italic text-4xl sm:text-5xl md:text-8xl text-accent leading-none">{t("hero.subtitle2")}</span>
        </h1>
        <p className="hero-elem mt-8 text-lg md:text-xl text-background/70 font-heading max-w-md">
          {t("hero.desc")}
        </p>
        <div className="hero-elem mt-10 pointer-events-auto">
          <a href="/#workshops" className="btn-magnetic bg-accent text-primary px-8 py-4 rounded-full font-heading font-bold text-lg flex items-center gap-2 inline-flex">
            <span className="relative z-10 flex items-center gap-2">{t("hero.cta")} <ArrowRight size={20}/></span>
          </a>
        </div>
      </div>

      <div className="dark-overlay absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Textos da Sequência (Surgem depois) */}
      
      {/* 1. Primeira frase (Centralizada como o original) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 z-10 pointer-events-none">
        <h2 className="seq-text-1 font-heading font-bold text-3xl md:text-5xl text-background/90 opacity-0 max-w-4xl leading-tight">
          {t("hero.seq1.p1")} <br/><span className="text-accent italic font-drama">{t("hero.seq1.p2")}</span>
        </h2>
      </div>

      {/* 2. Restante do texto (Rola continuamente) */}
      <div className="seq-block-rest absolute top-full left-0 right-0 z-10 w-full max-w-7xl mx-auto flex flex-col md:w-2/3 lg:w-1/2 items-start px-6 lg:px-12 pointer-events-none gap-6">
          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            <Brand className="text-background text-2xl md:text-3xl" /> {t("hero.seq2.p1")}
          </p>

          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            {t("hero.seq2.p2")}
          </p>

          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            {t("hero.seq2.p3")} <strong className="text-accent">{t("hero.seq2.p4")}</strong>.
          </p>

          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            <Brand className="text-background text-2xl md:text-3xl" /> {t("hero.seq2.p6")}
          </p>
      </div>

      {/* 3. Última frase (Centralizada com destaque dourado) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 z-10 pointer-events-none">
        <h2 className="seq-text-last font-drama italic text-4xl md:text-6xl text-background opacity-0 max-w-4xl leading-tight">
          <span className="text-accent">{t('hero.seq3.p1')}</span> {t('hero.seq3.p2')}
        </h2>
      </div>
    </section>
  );
};

export default HeroSequence;
