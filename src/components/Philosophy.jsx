import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

import Brand from './Brand';

const Philosophy = () => {
  const { t } = useTranslation();
  const philRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.phil-line', {
        scrollTrigger: {
          trigger: philRef.current,
          start: 'top 60%'
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, philRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={philRef} className="relative py-48 px-6 lg:px-12 bg-[#08080C] flex items-center justify-center">
      
      {/* Watermark - Fixed while scrolling */}
      <style>{`
        .watermark-bg {
          background-image: url(/logo-D2D-dancer.png);
          background-attachment: fixed;
          background-repeat: no-repeat;
          background-size: auto 60vh;
          background-position: center;
        }
        @media (min-width: 1024px) {
          .watermark-bg {
            background-position: calc(50% - 400px) center;
          }
        }
      `}</style>
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none watermark-bg" />

      <div className="relative z-10 max-w-4xl w-full mx-auto text-center flex flex-col gap-8">
        <p className="phil-line font-heading font-normal text-background/50 text-2xl md:text-3xl tracking-tight">
          {t("phil.line1.p1")} <span className="text-background/80">{t("phil.line1.p2")}</span>.
        </p>
        <h2 className="phil-line font-drama italic text-3xl md:text-6xl lg:text-7xl leading-tight text-background">
          {t("phil.line2.p1")} <br/>
          <span className="text-accent">{t("phil.line2.p2")}</span>
        </h2>
      </div>
    </section>
  );
};

export default Philosophy;
