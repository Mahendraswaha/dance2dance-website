import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

import Brand from './Brand';

const Protocol = () => {
  const { t } = useTranslation();
  const protocolRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.proto-card');
      
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          pin: true,
          pinSpacing: false,
          end: 'bottom+=100% top',
          animation: gsap.to(card, {
            scale: 0.9,
            opacity: 0.3,
            filter: 'blur(10px)',
            ease: 'none'
          }),
          scrub: true
        });
      });
    }, protocolRef);
    return () => ctx.revert();
  }, []);

  const protocols = [
    {
      num: '01',
      label: t("proto.1.kicker"),
      title: t("proto.1.title"),
      desc: t("proto.1.desc"),
      visual: (
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute w-64 h-64 rounded-full border border-accent/10 animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-44 h-44 rounded-full border border-accent/20 animate-[spin_14s_linear_infinite_reverse]" />
          <div className="absolute w-24 h-24 rounded-full border border-accent/40 animate-[spin_8s_linear_infinite]" />
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
        </div>
      )
    },
    {
      num: '02',
      label: t("proto.2.kicker"),
      title: t("proto.2.title"),
      desc: t("proto.2.desc"),
      visual: (
        <div className="relative w-64 h-64 flex items-center justify-center overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-[1px] bg-accent/30"
              style={{
                top: `${20 + i * 15}%`,
                animation: `pulse ${2 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                transform: `scaleX(${0.4 + i * 0.15})`
              }}
            />
          ))}
          <div className="w-12 h-12 rounded-full border-2 border-accent/60 animate-[ping_3s_ease-in-out_infinite]" />
        </div>
      )
    },
    {
      num: '03',
      label: t("proto.3.kicker"),
      title: t("proto.3.title"),
      desc: t("proto.3.desc"),
      visual: (
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Triângulo que se forma */}
          <svg viewBox="0 0 200 200" className="absolute w-full h-full">
            <polygon
              points="100,20 180,160 20,160"
              fill="none"
              stroke="rgba(201,168,76,0.15)"
              strokeWidth="1"
              className="animate-[spin_30s_linear_infinite]"
              style={{ transformOrigin: '100px 100px' }}
            />
            <polygon
              points="100,40 160,150 40,150"
              fill="none"
              stroke="rgba(201,168,76,0.25)"
              strokeWidth="1"
              className="animate-[spin_20s_linear_infinite_reverse]"
              style={{ transformOrigin: '100px 100px' }}
            />
            <polygon
              points="100,60 140,140 60,140"
              fill="none"
              stroke="rgba(201,168,76,0.5)"
              strokeWidth="1"
              className="animate-[spin_12s_linear_infinite]"
              style={{ transformOrigin: '100px 100px' }}
            />
          </svg>
          <div className="w-2 h-2 rounded-full bg-accent animate-[ping_2s_ease-in-out_infinite]" />
        </div>
      )
    },
    {
      num: '04',
      label: t("proto.4.kicker"),
      title: t("proto.4.title"),
      desc: t("proto.4.desc"),
      visual: (
        <div className="relative w-64 h-64 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-accent/10 border border-accent/20"
              style={{
                width: `${80 + i * 64}px`,
                height: `${80 + i * 64}px`,
                animation: `ping ${2.5 + i * 0.8}s ease-out infinite`,
                animationDelay: `${i * 0.6}s`
              }}
            />
          ))}
          <div className="w-8 h-8 rounded-full bg-accent/60" />
        </div>
      )
    }
  ];

  return (
    <section id="social" ref={protocolRef} className="relative bg-primary text-background">
      {protocols.map((p, i) => (
        <div key={p.num} className="proto-card h-[100dvh] w-full flex items-center justify-center sticky top-0 bg-primary border-b border-textDark/30">
          <div className="max-w-5xl mx-auto px-6 lg:px-12 w-full flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="w-full md:w-1/2 flex justify-center">
              {p.visual}
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col gap-5">
              <span className="font-heading text-xs tracking-[4px] uppercase text-accent/70">{p.label}</span>
              <h2 className="font-drama italic text-[42px] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-none text-background whitespace-nowrap">{p.title}</h2>
              <div className="w-8 h-[1px] bg-accent/40" />
              <p className="font-heading text-background/60 text-base md:text-lg max-w-md leading-relaxed">{p.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Protocol;
