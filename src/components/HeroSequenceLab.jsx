import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Brand from './Brand';
import { preloadFrames } from '../utils/frameCache';

gsap.registerPlugin(ScrollTrigger);

const HeroSequenceLab = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const heroContentRef = useRef(null);
  const videoRef = useRef(null);
  const spotlightRef = useRef(null);
  const imagesRef = useRef([]);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const frameCount = 240;

  // Pré-carregamento dos frames
  useEffect(() => {
    imagesRef.current = preloadFrames((progress) => {
      if (progress > 0) setFirstFrameLoaded(true);
    });

    if (imagesRef.current.length > 0 && imagesRef.current[0].complete) {
      setFirstFrameLoaded(true);
    }
  }, []);

  // Spotlight do mouse no Desktop (efeito sutil de luz teatral de estúdio)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Orquestração Master do GSAP e Canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });

    // Suporte a tela Retina com nitidez cristalina
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const render = (index) => {
      const imgs = imagesRef.current;
      const floorIndex = Math.floor(index);
      let img = imgs[floorIndex];

      // Fallback gracioso para frames que ainda estão em buffer
      if (!img || !img.complete || img.naturalHeight === 0) {
        img = null;
        for (let i = floorIndex - 1; i >= 0; i--) {
          if (imgs[i] && imgs[i].complete && imgs[i].naturalHeight !== 0) {
            img = imgs[i];
            break;
          }
        }
      }

      if (img) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const hRatio = w / img.width;
        const vRatio = h / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (w - img.width * ratio) / 2;
        const centerShift_y = (h - img.height * ratio) / 2;

        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShift_x,
          centerShift_y,
          img.width * ratio,
          img.height * ratio
        );
      }
    };

    render(0);

    const animationData = { frame: 0 };

    const gsapCtx = gsap.context(() => {
      // 1. Entrada suave e majestosa do Hero
      gsap.from('.hero-node', {
        y: 35,
        opacity: 0,
        duration: 1.4,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.1
      });

      // Timeline mestre ancorada ao Scroll
      // No mobile usamos 350% (ritmo orgânico e rápido sem exaustão); no desktop 550%
      const scrollDistance = isTouch ? '+=350%' : '+=550%';

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: scrollDistance,
          pin: true,
          scrub: isTouch ? 0.8 : 1.2,
          pinSpacing: true
        }
      });

      // A. O conteúdo inicial do Hero sai com leveza para cima
      tl.to(heroContentRef.current, { y: -100, autoAlpha: 0, duration: 0.08 }, 0);
      tl.to(videoRef.current, { opacity: 0, duration: 0.06 }, 0);

      // B. Scrubbing contínuo dos 240 frames
      tl.to(
        animationData,
        {
          frame: frameCount - 1,
          snap: 'frame',
          ease: 'none',
          duration: 1,
          onUpdate: () => {
            requestAnimationFrame(() => render(animationData.frame));
          }
        },
        0
      );

      // C. Iluminação: a cena clareia gradativamente a partir do início da rolagem (revelando o estúdio)
      tl.to('.theatre-bloom', { opacity: 0.85, duration: 0.5, ease: 'power1.inOut' }, 0.2);
      tl.to('.theatre-vignette', { opacity: 0.35, duration: 0.5, ease: 'power1.inOut' }, 0.3);

      // ==========================================
      // MOVIMENTO 1: A Primeira Frase
      // "Há lugares que não existem no mapa. Só no corpo."
      // ==========================================
      tl.fromTo(
        '.seq-movement-1',
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'power2.out' },
        0.06
      );
      tl.to(
        '.seq-movement-1',
        { opacity: 0, y: -25, scale: 1.02, duration: 0.06, ease: 'power1.in' },
        0.16
      );

      // ==========================================
      // MOVIMENTO 2: O Manifesto Poético
      // Tipografia pura, sem caixas, flutuando no ar com sombra profunda
      // ==========================================
      tl.fromTo(
        '.seq-movement-2',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
        0.20
      );
      tl.to(
        '.seq-movement-2',
        { opacity: 0, y: -35, duration: 0.1, ease: 'power2.in' },
        0.50
      );

      // ==========================================
      // MOVIMENTO 3: O Clímax do Encontro
      // "A dança e o movimento fazem o resto."
      // Surge com expansão óptica e brilho dourado antes de dissolver
      // ==========================================
      tl.fromTo(
        '.seq-movement-3',
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1.06, y: 0, duration: 0.15, ease: 'power2.out' },
        0.54
      );
      tl.to(
        '.seq-movement-3',
        { opacity: 0, scale: 1.15, filter: 'blur(8px)', duration: 0.14, ease: 'power2.in' },
        0.86
      );

    }, containerRef);

    let lastWidth = window.innerWidth;
    const handleResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
        render(animationData.frame);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      gsapCtx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Re-render inicial imediato
  useEffect(() => {
    if (firstFrameLoaded && canvasRef.current && imagesRef.current[0]) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imagesRef.current[0];
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      const hRatio = w / img.width;
      const vRatio = h / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (w - img.width * ratio) / 2;
      const centerShift_y = (h - img.height * ratio) / 2;
      ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }
  }, [firstFrameLoaded]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[100dvh] w-full bg-[#08080C] overflow-hidden select-none"
    >
      {/* 1. SISTEMA DE ILUMINAÇÃO CÊNICA (VIVA E NÍTIDA, SEM O BREU EXCESSIVO) */}

      {/* Camada A: Luz de Teatro Central (destaca a pele e o movimento sem escurecer o centro) */}
      <div 
        className="theatre-vignette absolute inset-0 pointer-events-none z-[1] transition-opacity duration-700"
        style={{
          background: 'radial-gradient(ellipse 85% 75% at 55% 45%, transparent 25%, rgba(8, 8, 12, 0.45) 65%, rgba(8, 8, 12, 0.95) 100%)'
        }}
      />

      {/* Camada B: Aurora Cênica / "Vai Clareando" (acende uma luz dourada-âmbar quente conforme a dança avança) */}
      <div 
        className="theatre-bloom absolute inset-0 pointer-events-none z-[2] opacity-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle 800px at 50% 55%, rgba(201, 168, 76, 0.22) 0%, rgba(255, 235, 185, 0.06) 40%, transparent 75%)'
        }}
      />

      {/* Camada C: Spotlight de Ribalta do Cursor (Desktop) */}
      <div 
        ref={spotlightRef}
        className="hidden md:block absolute -top-64 -left-64 w-[520px] h-[520px] rounded-full pointer-events-none z-[3] mix-blend-screen opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(201, 168, 76, 0.3) 0%, rgba(255, 255, 255, 0.05) 35%, transparent 70%)',
          willChange: 'transform'
        }}
      />

      {/* 2. BASE VISUAL: CANVAS EM RETINA REAL E VÍDEO LÍMPIDO */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        
        {/* Vídeo do primeiro frame: nítido e iluminado (opacidade 95% em vez de 60%) */}
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          poster="/gallery/sequence/frame-001.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-95 transition-opacity duration-500"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Gradiente inferior ultra-suave apenas para fundir com a seção seguinte */}
      <div 
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-[3]"
        style={{
          background: 'linear-gradient(to top, #08080C 0%, rgba(8, 8, 12, 0.6) 50%, transparent 100%)'
        }}
      />

      {/* 3. HERO PRINCIPAL (Título, Subtítulo e CTA com Contraste Perfeito) */}
      <div 
        ref={heroContentRef} 
        className="absolute inset-0 z-10 w-full max-w-7xl mx-auto flex flex-col md:w-2/3 lg:w-1/2 items-start justify-end pb-24 md:pb-32 px-6 lg:px-12 pointer-events-none"
      >
        <h1 className="flex flex-col gap-2">
          <span 
            className="hero-node font-heading font-bold text-3xl md:text-5xl text-[#FAF8F5] tracking-tight"
            style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.9), 0 4px 40px rgba(0, 0, 0, 0.7)' }}
          >
            {t("hero.subtitle1")}
          </span>
          <span 
            className="hero-node font-drama italic text-[42px] sm:text-6xl md:text-8xl text-accent leading-none"
            style={{ textShadow: '0 2px 25px rgba(0, 0, 0, 0.9), 0 0 35px rgba(201, 168, 76, 0.35)' }}
          >
            {t("hero.subtitle2")}
          </span>
        </h1>

        <p 
          className="hero-node mt-6 text-base md:text-xl text-[#F0EDE8]/90 font-heading max-w-md leading-relaxed"
          style={{ textShadow: '0 2px 16px rgba(0, 0, 0, 0.9)' }}
        >
          {t("hero.desc")}
        </p>

        <div className="hero-node mt-8 pointer-events-auto">
          <button 
            onClick={() => {
              const el = document.getElementById('workshops');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} 
            className="btn-magnetic bg-accent text-primary px-8 py-4 rounded-full font-heading font-bold text-base md:text-lg flex items-center gap-2 shadow-[0_4px_24px_rgba(201,168,76,0.35)] hover:shadow-[0_6px_32px_rgba(201,168,76,0.55)] cursor-pointer active:scale-95 transition-transform"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("hero.cta")} <ArrowRight size={20} />
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. TIPOGRAFIA PURA DO MANIFESTO (SEM CAIXAS, SEM BORDAS) */}
      {/* ========================================================= */}

      {/* Movimento 1: Primeira Frase no Centro */}
      <div className="seq-movement-1 absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 z-10 pointer-events-none opacity-0">
        <h2 
          className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-[#FAF8F5] max-w-4xl leading-tight"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.95), 0 6px 50px rgba(0,0,0,0.8)' }}
        >
          {t("hero.seq1.p1")}{' '}
          <br className="hidden sm:inline" />
          <span 
            className="text-accent italic font-drama text-3xl sm:text-5xl md:text-6xl block sm:inline mt-2 sm:mt-0"
            style={{ textShadow: '0 2px 25px rgba(0,0,0,0.95), 0 0 40px rgba(201,168,76,0.45)' }}
          >
            {t("hero.seq1.p2")}
          </span>
        </h2>
      </div>

      {/* Movimento 2: O Manifesto Poético Flutuante (Alta Costura Editorial) */}
      <div className="seq-movement-2 absolute inset-0 z-10 w-full max-w-4xl mx-auto flex flex-col justify-center items-start px-6 md:px-12 pointer-events-none opacity-0 gap-6 sm:gap-7">
        <p 
          className="font-heading text-base sm:text-xl md:text-2xl text-[#FAF8F5] leading-relaxed max-w-3xl"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.95), 0 4px 45px rgba(0,0,0,0.85)' }}
        >
          <Brand className="text-[#FAF8F5] text-xl sm:text-2xl md:text-3xl" /> {t("hero.seq2.p1")}
        </p>

        <p 
          className="font-heading text-base sm:text-xl md:text-2xl text-[#FAF8F5]/90 leading-relaxed max-w-3xl"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.95), 0 4px 45px rgba(0,0,0,0.85)' }}
        >
          {t("hero.seq2.p3")}{' '}
          <strong className="text-accent font-semibold underline decoration-accent/50 underline-offset-4">
            {t("hero.seq2.p4")}
          </strong>.
        </p>

        <p 
          className="font-heading text-base sm:text-xl md:text-2xl text-[#FAF8F5]/95 leading-relaxed max-w-3xl"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.95), 0 4px 45px rgba(0,0,0,0.85)' }}
        >
          <Brand className="text-[#FAF8F5] text-xl sm:text-2xl md:text-3xl" /> {t("hero.seq2.p6")}
        </p>
      </div>

      {/* Movimento 3: O Clímax Magnífico */}
      <div className="seq-movement-3 absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 z-10 pointer-events-none opacity-0">
        <h2 
          className="font-drama italic text-3xl sm:text-5xl md:text-7xl text-[#FAF8F5] max-w-4xl leading-tight"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.95), 0 0 50px rgba(201,168,76,0.5)' }}
        >
          <span className="text-accent drop-shadow-[0_0_30px_rgba(201,168,76,0.6)]">
            {t('hero.seq3.p1')}
          </span>{' '}
          {t('hero.seq3.p2')}
        </h2>
      </div>
    </section>
  );
};

export default HeroSequenceLab;
