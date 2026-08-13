import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

import Brand from './Brand';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
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
    });

    mm.add("(max-width: 767px)", () => {
      ScrollTrigger.create({
        start: 'top -100',
        onUpdate: (self) => {
          if (self.direction === 1) {
            gsap.to(navRef.current, { backgroundColor: 'rgba(13, 13, 18, 0.8)', borderColor: '#2A2A35', duration: 0.3, backdropFilter: 'blur(16px)' });
            gsap.to(logoRef.current, { height: '1.5rem', duration: 0.3, ease: 'power2.out' });
          } else if (self.progress === 0) {
            gsap.to(navRef.current, { backgroundColor: 'transparent', borderColor: 'transparent', duration: 0.3, backdropFilter: 'blur(0px)' });
            gsap.to(logoRef.current, { height: '2.5rem', duration: 0.3, ease: 'power2.out' });
          }
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <nav className="fixed top-4 md:top-6 left-0 w-full z-50 px-6 lg:px-12 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto relative">
        <div ref={navRef} className="-mx-4 px-4 md:-mx-6 md:px-6 py-3 md:py-4 rounded-full border border-transparent transition-colors flex items-center justify-between relative">
          
          {/* Logo (Esquerda) */}
          <div className="flex items-center justify-start flex-1 z-20">
            <Link to="/">
              <img ref={logoRef} src="/logo-dance2dance.png" alt="Dance2Dance Logo" className="h-10 md:h-20 object-contain" />
            </Link>
          </div>

          {/* Links e Idiomas (Centro Absoluto) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-30">
            <div className="hidden md:flex gap-8 text-sm font-heading font-semibold text-background/80 whitespace-nowrap">
              <Link to="/#workshops" className="hover:text-accent transition-colors hover:-translate-y-[1px]">{t('nav.workshops')}</Link>
              <Link to="/#social" className="hover:text-accent transition-colors hover:-translate-y-[1px]">{t('nav.social')}</Link>
              <Link to="/agenda" className="hover:text-accent transition-colors hover:-translate-y-[1px]">{t('nav.agenda')}</Link>
            </div>
            <div className="flex md:hidden items-center gap-1 text-[10px] font-heading font-bold text-background/50">
              <button onClick={() => i18n.changeLanguage('no')} className={`hover:text-accent transition-colors px-1 ${i18n.language === 'no' ? 'text-accent' : ''}`}>NO</button>
              <span>|</span>
              <button onClick={() => i18n.changeLanguage('en')} className={`hover:text-accent transition-colors px-1 ${i18n.language === 'en' ? 'text-accent' : ''}`}>EN</button>
              <span>|</span>
              <button onClick={() => i18n.changeLanguage('pt')} className={`hover:text-accent transition-colors px-1 ${i18n.language === 'pt' ? 'text-accent' : ''}`}>PT</button>
            </div>
          </div>

          {/* Botão e Idiomas (Direita) */}
          <div className="flex items-center justify-end gap-3 md:gap-4 flex-1 z-20">
            <div className="hidden md:flex items-center gap-2 text-xs font-heading font-bold text-background/50">
              <button onClick={() => i18n.changeLanguage('no')} className={`hover:text-accent transition-colors px-1 ${i18n.language === 'no' ? 'text-accent' : ''}`}>NO</button>
              <span>|</span>
              <button onClick={() => i18n.changeLanguage('en')} className={`hover:text-accent transition-colors px-1 ${i18n.language === 'en' ? 'text-accent' : ''}`}>EN</button>
              <span>|</span>
              <button onClick={() => i18n.changeLanguage('pt')} className={`hover:text-accent transition-colors px-1 ${i18n.language === 'pt' ? 'text-accent' : ''}`}>PT</button>
            </div>
            <button className="btn-magnetic bg-accent text-primary px-3 md:px-6 py-2 rounded-full font-heading font-bold text-[10px] md:text-sm whitespace-nowrap">
              <span className="relative z-10">{t('nav.subscribe')}</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
