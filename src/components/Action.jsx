import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

import Brand from './Brand';

const Action = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameCount = 240;

  // Carrega as imagens (virão do cache do browser, pois o Hero já as carregou)
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(3, '0');
      img.src = `/gallery/sequence/frame-${frameNumber}.jpg`;
      img.onload = () => {
        loadedCount++;
        loadedImages.push(img);
        if (loadedCount === frameCount) {
          loadedImages.sort((a, b) => a.src.localeCompare(b.src));
          imagesRef.current = loadedImages;
          setIsLoaded(true);
        }
      };
      // Se a imagem já estava em cache, onload pode não disparar
      if (img.complete) {
        loadedCount++;
        loadedImages.push(img);
        if (loadedCount === frameCount) {
          loadedImages.sort((a, b) => a.src.localeCompare(b.src));
          imagesRef.current = loadedImages;
          setIsLoaded(true);
        }
      }
    }
  }, []);

  // Animação automática em loop com transição suave
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (index) => {
      const img = imagesRef.current[index];
      if (!img || !canvas.width) return;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const cx = (canvas.width - img.width * ratio) / 2;
      const cy = (canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
    };

    const fadingRef = { current: false };
    const FADE_STEPS = 45; // ~3s

    const setOverlayOpacity = (val) => {
      if (overlayRef.current) overlayRef.current.style.opacity = val;
    };

    const startFadeOut = () => {
      let step = 0;
      const timer = setInterval(() => {
        step++;
        setOverlayOpacity(step / FADE_STEPS);
        if (step >= FADE_STEPS) {
          clearInterval(timer);
          frameRef.current = 0;
          render(0);
          setTimeout(() => {
            startFadeIn();
          }, 1500); // 1.5s suspiro/pause
        }
      }, 1000 / 15);
    };

    const startFadeIn = () => {
      let step = FADE_STEPS;
      const timer = setInterval(() => {
        step--;
        setOverlayOpacity(step / FADE_STEPS);
        if (step <= 0) {
          clearInterval(timer);
          fadingRef.current = false;
        }
      }, 1000 / 15);
    };

    // Loop fixo a 15fps — suave e consistente
    const interval = setInterval(() => {
      if (fadingRef.current) return;

      const current = frameRef.current;
      render(current);

      if (current >= frameCount - 1) {
        fadingRef.current = true;
        startFadeOut();
      } else {
        frameRef.current = current + 1;
      }
    }, 1000 / 15);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [isLoaded]);

  return (
    <section id="agenda" className="relative z-20 bg-[#0C0C0C] py-48 px-6 lg:px-12 overflow-hidden flex items-center justify-center min-h-[80vh]">

      {/* Canvas com a sequência de frames em loop */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'brightness(0.7)' }}
      />

      {/* Overlay de transição fade-to-black no loop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-primary pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* Gradiente para legibilidade e transição suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/10 to-primary/60 pointer-events-none" />

      {/* Desfoque suave invisível estendido na marca d'água usando máscara radial alargada */}
      <div 
        className="hidden md:block absolute bottom-0 right-0 w-[36rem] h-10 pointer-events-none" 
        style={{ 
          backdropFilter: 'blur(10px)', 
          WebkitBackdropFilter: 'blur(10px)', 
          WebkitMaskImage: 'radial-gradient(ellipse at bottom right, black 60%, transparent 90%)',
          maskImage: 'radial-gradient(ellipse at bottom right, black 60%, transparent 90%)'
        }} 
      />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-10">

        <p className="font-heading text-[11px] tracking-[5px] uppercase text-accent font-semibold">
          {t("action.kicker")}
        </p>

        <h2 className="font-drama italic text-5xl md:text-7xl lg:text-8xl text-background leading-tight break-words">
          {t("action.title.p1")}{' '}
          <span className="text-accent pr-2 md:pr-4">{t("action.title.p2")}</span>
        </h2>

        <p className="font-heading text-background/90 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
          {t("action.desc").split(". ")[0] + "."} <br className="hidden sm:block" />{t("action.desc").split(". ")[1]}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a
            href="/agenda"
            className="btn-magnetic bg-accent text-primary px-10 py-4 rounded-full font-heading font-bold text-sm flex items-center gap-2 justify-center"
          >
            <span className="relative z-10 flex items-center gap-2">{t("action.btn1")} <ArrowRight size={16}/></span>
          </a>
          <Link
            to="/social"
            onClick={() => window.scrollTo(0, 0)}
            className="px-10 py-4 rounded-full font-heading font-normal text-sm border border-background/20 text-background/60 hover:border-background/50 hover:text-background/90 transition-all duration-300 flex items-center justify-center"
          >
            {t("action.btn2")}
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Action;
