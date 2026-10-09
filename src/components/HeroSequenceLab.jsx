import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Smartphone, Monitor, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Brand from './Brand';
import { preloadFrames } from '../utils/frameCache';

gsap.registerPlugin(ScrollTrigger);

const HeroSequenceLab = ({ forcedMode = 'auto' }) => {
  const { t } = useTranslation();
  
  // Elementos do DOM
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const heroContentRef = useRef(null);
  const spotlightRef = useRef(null);
  const imagesRef = useRef([]);

  // Estados de detecção e carregamento
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameCount = 240;

  // Determina se o modo efetivo é mobile
  const effectiveMobile = forcedMode === 'mobile' ? true : forcedMode === 'desktop' ? false : isMobileDevice;

  useEffect(() => {
    const checkMobile = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const isNarrow = window.innerWidth < 768;
      setIsMobileDevice(isCoarse || isNarrow);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cursor Spotlight interativo (Desktop)
  useEffect(() => {
    if (effectiveMobile) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateSpotlight = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      animId = requestAnimationFrame(animateSpotlight);
    };

    window.addEventListener('mousemove', onMouseMove);
    animId = requestAnimationFrame(animateSpotlight);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [effectiveMobile]);

  // Carregamento dos 240 frames APENAS no Desktop
  useEffect(() => {
    if (effectiveMobile) {
      // No mobile usamos o vídeo nativo de 1.4MB (instantâneo e fluido)
      setFirstFrameLoaded(true);
      return;
    }

    imagesRef.current = preloadFrames((progress) => {
      if (progress > 0) setFirstFrameLoaded(true);
      if (progress === 1) setIsLoaded(true);
    });

    if (imagesRef.current.length > 0 && imagesRef.current[0].complete) {
      setFirstFrameLoaded(true);
    }
  }, [effectiveMobile]);

  // ==========================================
  // ANIMAÇÃO DESKTOP: Canvas + Scrubbing + Luz
  // ==========================================
  useEffect(() => {
    if (effectiveMobile || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const render = (index) => {
      const imgs = imagesRef.current;
      const floorIndex = Math.floor(index);
      let img = imgs[floorIndex];

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
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      // Animação de entrada do Hero
      gsap.from('.hero-elem-lab', {
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
          end: '+=500%', // Reduzido de 800% para 500% (muito mais agradável)
          pin: true,
          scrub: 1.2,
          pinSpacing: true
        }
      });

      // 1. Saída suave do hero inicial
      tl.to(heroContentRef.current, { y: -120, autoAlpha: 0, duration: 0.08 }, 0);
      tl.to(videoRef.current, { opacity: 0, duration: 0.06 }, 0);

      // 2. Transição do canvas frame a frame
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

      // 3. Frase 1: Aparição com luz e escala sutil
      tl.fromTo(
        '.seq-text-1-lab',
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: 'power2.out' },
        0.04
      );
      tl.to(
        '.seq-text-1-lab',
        { opacity: 0, y: -25, scale: 1.02, duration: 0.05, ease: 'power1.in' },
        0.13
      );

      // 4. Bloco do Manifesto (Editorial fluido em 3 estrofes luminosas)
      tl.fromTo(
        '.seq-block-lab',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
        0.16
      );
      tl.to(
        '.seq-block-lab',
        { opacity: 0, y: -50, duration: 0.1, ease: 'power2.in' },
        0.52
      );

      // 5. Frase Final (Iluminação cênica dourada em clímax)
      tl.fromTo(
        '.seq-text-last-lab',
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1.08, y: 0, duration: 0.16, ease: 'power2.out' },
        0.55
      );
      tl.to(
        '.seq-text-last-lab',
        { opacity: 0, scale: 1.15, filter: 'blur(8px)', duration: 0.15, ease: 'power2.in' },
        0.86
      );

      // Iluminação cênica de amanhecer: a luz dourada acende no fundo suavemente
      tl.to('.stage-dawn-light', { opacity: 0.85, duration: 0.45, ease: 'power1.inOut' }, 0.35);

    }, containerRef);

    let lastWidth = window.innerWidth;
    const handleResize = () => {
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
  }, [effectiveMobile]);

  // ==========================================
  // ANIMAÇÃO MOBILE: 100% NATIVA, FLUIDA E ÁGIL
  // ==========================================
  useEffect(() => {
    if (!effectiveMobile || !containerRef.current) return;

    // NUNCA acionar normalizeScroll no mobile: preservar física natural a 120Hz
    const gsapCtx = gsap.context(() => {
      // Animação de entrada do Hero no Mobile
      gsap.from('.mobile-hero-elem', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.15
      });

      // Pin leve e ágil de apenas 200% (2 telas de scroll natural com o dedão)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=220%', // Apenas 2 telas: o usuário nunca se sente preso
          pin: true,
          scrub: 0.6,
          pinSpacing: true
        }
      });

      // Saída rápida e elegante do conteúdo inicial
      tl.to('.mobile-hero-header', { opacity: 0, y: -60, duration: 0.12 }, 0);

      // O vídeo sutilmente ganha um zoom cinematográfico de respiração
      tl.to('.mobile-video-bg', { scale: 1.08, opacity: 0.85, duration: 1, ease: 'none' }, 0);

      // Estrofe 1 surge no centro
      tl.fromTo(
        '.mobile-seq-1',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
        0.08
      );
      tl.to('.mobile-seq-1', { opacity: 0, y: -25, duration: 0.1, ease: 'power1.in' }, 0.28);

      // Estrofe 2 (Manifesto central com foco e contraste nítido)
      tl.fromTo(
        '.mobile-seq-2',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' },
        0.32
      );
      tl.to('.mobile-seq-2', { opacity: 0, y: -30, duration: 0.12, ease: 'power1.in' }, 0.62);

      // Estrofe 3 (Clímax poético)
      tl.fromTo(
        '.mobile-seq-3',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1.05, duration: 0.18, ease: 'power2.out' },
        0.66
      );
      tl.to('.mobile-seq-3', { opacity: 0, scale: 1.12, filter: 'blur(6px)', duration: 0.12 }, 0.88);

      // Luz de amanhecer no mobile
      tl.to('.mobile-stage-glow', { opacity: 0.9, duration: 0.4 }, 0.3);

    }, containerRef);

    return () => gsapCtx.revert();
  }, [effectiveMobile]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[100dvh] w-full bg-primary overflow-hidden select-none"
    >
      {/* 1. LUZES CÊNICAS (Eliminam a sensação de breu e criam profundidade) */}
      
      {/* Spotlight do Palco Central (Refletor cênico dourado/âmbar atrás dos bailarinos) */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 35%, rgba(201, 168, 76, 0.16) 0%, rgba(13, 13, 18, 0.25) 50%, rgba(13, 13, 18, 0.9) 100%)'
        }}
      />

      {/* Luz de Amanhecer/Aurora Cênica (Acende progressivamente ao final do manifesto) */}
      <div 
        className="stage-dawn-light mobile-stage-glow absolute inset-0 pointer-events-none z-[2] opacity-0 transition-opacity"
        style={{
          background: 'radial-gradient(circle at 50% 80%, rgba(201, 168, 76, 0.28) 0%, rgba(255, 240, 200, 0.08) 35%, transparent 70%)'
        }}
      />

      {/* Spotlight interativo com o mouse (Apenas Desktop) */}
      {!effectiveMobile && (
        <div 
          ref={spotlightRef}
          className="hidden md:block absolute -top-48 -left-48 w-96 h-96 rounded-full pointer-events-none z-[3] mix-blend-screen opacity-40 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(201, 168, 76, 0.35) 0%, rgba(255, 255, 255, 0.08) 30%, transparent 70%)',
            willChange: 'transform'
          }}
        />
      )}

      {/* 2. BASE VISUAL: VÍDEO E CANVAS */}
      
      {/* MODO DESKTOP: Canvas com os 240 frames scrubbable */}
      {!effectiveMobile ? (
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
          
          {/* Vídeo sutil inicial para o primeiro frame */}
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            poster="/gallery/sequence/frame-001.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-500"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
      ) : (
        /* MODO MOBILE: Vídeo 100% nativo e super fluido (1.4MB, 120Hz nativo) */
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            poster="/gallery/sequence/frame-001.jpg"
            className="mobile-video-bg absolute inset-0 w-full h-full object-cover opacity-85 transition-transform"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Gradiente inferior suave para conectar com a próxima seção */}
      <div 
        className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-[3]"
        style={{
          background: 'linear-gradient(to top, #0D0D12 0%, rgba(13,13,18,0.7) 40%, transparent 100%)'
        }}
      />

      {/* 3. CONTEÚDO PRINCIPAL (HERO) */}
      {!effectiveMobile ? (
        /* --- DESKTOP HERO --- */
        <div 
          ref={heroContentRef} 
          className="absolute inset-0 z-10 w-full max-w-7xl mx-auto flex flex-col md:w-2/3 lg:w-1/2 items-start justify-end pb-24 md:pb-32 px-6 lg:px-12 pointer-events-none"
        >
          <div className="hero-elem-lab inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs uppercase tracking-widest font-heading font-medium mb-6">
            <Sparkles size={13} className="text-accent animate-pulse" />
            <span>Dança, Presença & Impacto Social</span>
          </div>

          <h1 className="flex flex-col gap-2">
            <span className="hero-elem-lab font-heading font-bold text-3xl md:text-5xl text-background/95 tracking-tight">
              {t("hero.subtitle1")}
            </span>
            <span className="hero-elem-lab font-drama italic text-[44px] sm:text-6xl md:text-8xl text-accent leading-none drop-shadow-[0_4px_24px_rgba(201,168,76,0.35)]">
              {t("hero.subtitle2")}
            </span>
          </h1>

          <p className="hero-elem-lab mt-8 text-lg md:text-xl text-background/85 font-heading max-w-md leading-relaxed">
            {t("hero.desc")}
          </p>

          <div className="hero-elem-lab mt-10 pointer-events-auto">
            <button 
              onClick={() => {
                const el = document.getElementById('workshops');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="btn-magnetic bg-accent text-primary px-8 py-4 rounded-full font-heading font-bold text-lg flex items-center gap-2 shadow-[0_4px_20px_rgba(201,168,76,0.4)] hover:shadow-[0_6px_28px_rgba(201,168,76,0.6)] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("hero.cta")} <ArrowRight size={20} />
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* --- MOBILE HERO (Otimizado ergonomicamente para telas verticais) --- */
        <div className="mobile-hero-header absolute inset-0 z-10 w-full flex flex-col justify-end pb-20 px-6 pointer-events-none">
          <div className="mobile-hero-elem inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs uppercase tracking-widest font-heading font-medium mb-4 self-start backdrop-blur-sm">
            <Sparkles size={12} className="text-accent" />
            <span>Presença & Arte</span>
          </div>

          <h1 className="flex flex-col gap-1">
            <span className="mobile-hero-elem font-heading font-bold text-3xl text-background/95 tracking-tight leading-tight">
              {t("hero.subtitle1")}
            </span>
            <span className="mobile-hero-elem font-drama italic text-5xl text-accent leading-none drop-shadow-[0_2px_16px_rgba(201,168,76,0.4)]">
              {t("hero.subtitle2")}
            </span>
          </h1>

          <p className="mobile-hero-elem mt-5 text-base text-background/85 font-heading leading-relaxed max-w-sm">
            {t("hero.desc")}
          </p>

          <div className="mobile-hero-elem mt-7 pointer-events-auto">
            <button 
              onClick={() => {
                const el = document.getElementById('workshops');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="bg-accent text-primary px-7 py-3.5 rounded-full font-heading font-bold text-base flex items-center gap-2 shadow-[0_4px_16px_rgba(201,168,76,0.4)] active:scale-95 transition-transform"
            >
              <span>{t("hero.cta")}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 4. SEQUÊNCIAS DO MANIFESTO (DESKTOP) */}
      {!effectiveMobile && (
        <>
          {/* Frase 1 Desktop */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 z-10 pointer-events-none">
            <h2 className="seq-text-1-lab font-heading font-bold text-3xl md:text-5xl text-background/95 opacity-0 max-w-4xl leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              {t("hero.seq1.p1")}{' '}
              <br />
              <span className="text-accent italic font-drama text-4xl md:text-6xl drop-shadow-[0_2px_20px_rgba(201,168,76,0.4)]">
                {t("hero.seq1.p2")}
              </span>
            </h2>
          </div>

          {/* Manifesto Desktop (Editorial Premium com Respiração) */}
          <div className="seq-block-lab absolute inset-0 z-10 max-w-3xl mx-auto flex flex-col justify-center items-start px-8 lg:px-0 pointer-events-none opacity-0 gap-6">
            <div className="bg-primary/60 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col gap-5">
              <p className="font-heading text-lg md:text-xl text-background/95 leading-relaxed">
                <Brand className="text-background text-2xl md:text-3xl" /> {t("hero.seq2.p1")}
              </p>

              <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
                {t("hero.seq2.p2")}
              </p>

              <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
                {t("hero.seq2.p3")}{' '}
                <strong className="text-accent font-semibold underline decoration-accent/40 underline-offset-4">
                  {t("hero.seq2.p4")}
                </strong>.
              </p>

              <p className="font-heading text-lg md:text-xl text-background/95 leading-relaxed">
                <Brand className="text-background text-2xl md:text-3xl" /> {t("hero.seq2.p6")}
              </p>
            </div>
          </div>

          {/* Frase Final Desktop */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 z-10 pointer-events-none">
            <h2 className="seq-text-last-lab font-drama italic text-4xl md:text-7xl text-background opacity-0 max-w-4xl leading-tight drop-shadow-[0_4px_35px_rgba(201,168,76,0.5)]">
              <span className="text-accent">{t('hero.seq3.p1')}</span> {t('hero.seq3.p2')}
            </h2>
          </div>
        </>
      )}

      {/* 5. SEQUÊNCIAS DO MANIFESTO (MOBILE: Centrado, Nítido e Iluminado) */}
      {effectiveMobile && (
        <>
          {/* Estrofe 1 Mobile */}
          <div className="mobile-seq-1 absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none opacity-0">
            <div className="bg-primary/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
              <h2 className="font-heading font-bold text-2xl text-background/95 leading-snug">
                {t("hero.seq1.p1")}
              </h2>
              <p className="text-accent italic font-drama text-4xl mt-2 drop-shadow-[0_2px_12px_rgba(201,168,76,0.5)]">
                {t("hero.seq1.p2")}
              </p>
            </div>
          </div>

          {/* Estrofe 2 Mobile (Card Editorial de Alta Legibilidade) */}
          <div className="mobile-seq-2 absolute inset-0 flex flex-col items-center justify-center px-5 z-10 pointer-events-none opacity-0">
            <div className="bg-primary/75 backdrop-blur-md p-6 rounded-2xl border border-accent/25 shadow-2xl flex flex-col gap-4 text-left">
              <p className="font-heading text-sm text-background/95 leading-relaxed">
                <Brand className="text-background text-lg" /> {t("hero.seq2.p1")}
              </p>
              <p className="font-heading text-sm text-background/90 leading-relaxed">
                {t("hero.seq2.p3")}{' '}
                <strong className="text-accent">{t("hero.seq2.p4")}</strong>.
              </p>
            </div>
          </div>

          {/* Estrofe 3 Mobile (Clímax Poético) */}
          <div className="mobile-seq-3 absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none opacity-0">
            <div className="bg-primary/60 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
              <h2 className="font-drama italic text-3xl sm:text-4xl text-background leading-tight">
                <span className="text-accent drop-shadow-[0_2px_15px_rgba(201,168,76,0.6)]">
                  {t('hero.seq3.p1')}
                </span>{' '}
                {t('hero.seq3.p2')}
              </h2>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSequenceLab;
