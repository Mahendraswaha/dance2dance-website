import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

import Brand from './Brand';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -100',
        onUpdate: (self) => {
          if (self.direction === 1) {
            gsap.to(navRef.current, { backgroundColor: 'rgba(13, 13, 18, 0.8)', borderColor: '#2A2A35', duration: 0.3, backdropFilter: 'blur(16px)' });
            gsap.to(logoRef.current, { height: '2rem', duration: 0.3, ease: 'power2.out' });
          } else if (self.progress === 0) {
            gsap.to(navRef.current, { backgroundColor: 'transparent', borderColor: 'transparent', duration: 0.3, backdropFilter: 'blur(0px)' });
            gsap.to(logoRef.current, { height: '5rem', duration: 0.3, ease: 'power2.out' });
          }
        }
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
      <div ref={navRef} className="px-4 md:px-6 py-3 md:py-4 rounded-full border border-transparent transition-colors flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img ref={logoRef} src="/logo-dance2dance.png" alt="Dance2Dance Logo" className="h-10 md:h-20 object-contain" />
        </div>
        <div className="hidden md:flex gap-8 text-sm font-heading font-semibold text-background/80">
          <a href="#workshops" className="hover:text-accent transition-colors hover:-translate-y-[1px]">{t('nav.workshops')}</a>
          <a href="#social" className="hover:text-accent transition-colors hover:-translate-y-[1px]">{t('nav.social')}</a>
          <a href="#agenda" className="hover:text-accent transition-colors hover:-translate-y-[1px]">{t('nav.agenda')}</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-heading font-bold text-background/50">
            <button onClick={() => i18n.changeLanguage('pt')} className={`hover:text-accent transition-colors ${i18n.language === 'pt' ? 'text-accent' : ''}`}>PT</button>
            <span>|</span>
            <button onClick={() => i18n.changeLanguage('en')} className={`hover:text-accent transition-colors ${i18n.language === 'en' ? 'text-accent' : ''}`}>EN</button>
            <span>|</span>
            <button onClick={() => i18n.changeLanguage('no')} className={`hover:text-accent transition-colors ${i18n.language === 'no' ? 'text-accent' : ''}`}>NO</button>
          </div>
          <button className="btn-magnetic bg-accent text-primary px-4 md:px-6 py-2 rounded-full font-heading font-bold text-xs md:text-sm whitespace-nowrap">
            <span className="relative z-10">{t('nav.subscribe')}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
