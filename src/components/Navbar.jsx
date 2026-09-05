import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

gsap.registerPlugin(ScrollTrigger);

import Brand from './Brand';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Previne rolagem do body quando o menu está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-4 md:top-6 left-0 w-full z-50 px-6 lg:px-12 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto relative">
          <div ref={navRef} className="-mx-4 px-4 md:-mx-6 md:px-6 py-3 md:py-4 rounded-full border border-transparent transition-colors flex items-center justify-between relative">
            
            {/* Logo (Esquerda) */}
            <div className="flex items-center justify-start flex-1 z-20">
              <Link to="/">
                <img ref={logoRef} src="/logo-dance2dance.png" alt="Dance2Dance Logo" className="h-10 md:h-20 object-contain" />
              </Link>
            </div>

            {/* Links (Centro Absoluto) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-30">
              {/* Desktop Links */}
              <div className="hidden md:flex gap-8 text-sm font-heading font-semibold text-background/80 whitespace-nowrap">
                <Link to="/#workshops" className="hover:text-accent transition-colors hover:-translate-y-[1px]">{t('nav.workshops')}</Link>
                <Link to="/social" className="hover:text-accent transition-colors hover:-translate-y-[1px]">{t('nav.social')}</Link>
                <Link to="/agenda" className="hover:text-accent transition-colors hover:-translate-y-[1px]">{t('nav.agenda')}</Link>
              </div>
            </div>

            {/* Botão e Idiomas (Direita) */}
            <div className="flex items-center justify-end gap-3 md:gap-4 flex-1 z-20">
              {/* Desktop Languages */}
              <div className="hidden md:flex items-center gap-2 text-xs font-heading font-bold text-background/50">
                <button onClick={() => i18n.changeLanguage('no')} className={`hover:text-accent transition-colors px-1 ${i18n.resolvedLanguage === 'no' ? 'text-accent' : ''}`}>NO</button>
                <span>|</span>
                <button onClick={() => i18n.changeLanguage('en')} className={`hover:text-accent transition-colors px-1 ${i18n.resolvedLanguage === 'en' ? 'text-accent' : ''}`}>EN</button>
                <span>|</span>
                <button onClick={() => i18n.changeLanguage('pt')} className={`hover:text-accent transition-colors px-1 ${i18n.resolvedLanguage === 'pt' ? 'text-accent' : ''}`}>PT</button>
              </div>
              
              {/* Mobile Hamburger Button */}
              <button 
                className="flex md:hidden text-background/80 hover:text-accent transition-colors p-2"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} strokeWidth={1.5} />
              </button>

              {currentUser ? (
                <div className="hidden md:flex items-center gap-2 ml-1">
                  <span className="font-heading text-xs text-[#9A9A9A] max-w-[110px] truncate" title={currentUser.profile?.nome || 'Aluno'}>
                    {currentUser.profile?.nome?.split(' ')[0] || 'Aluno'}
                  </span>
                  <button 
                    onClick={() => { logout(); navigate('/'); }}
                    title={t("nav.logout")}
                    aria-label={t("nav.logout")}
                    className="p-2 rounded-full text-[#9A9A9A] hover:text-accent hover:bg-white/5 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-1 ml-1">
                  <Link 
                    to="/login" 
                    title={t("nav.login")}
                    aria-label={t("nav.login")}
                    className="p-2 rounded-full text-[#9A9A9A] hover:text-accent hover:bg-white/5 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/cadastro" 
                    title={t("nav.signup")}
                    aria-label={t("nav.signup")}
                    className="p-2 rounded-full text-[#9A9A9A] hover:text-accent hover:bg-white/5 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar Menu (Esquerda) */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[340px] bg-[#0C0C0C] z-[100] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header do Menu */}
        <div className="flex items-center justify-between px-8 py-8 border-b border-white/5">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/logo-dance2dance.png" alt="Dance2Dance" className="h-8 object-contain" />
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-background/80 hover:text-accent transition-colors rounded-full bg-white/5"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Links Principais */}
        <div className="flex flex-col items-start justify-center flex-1 gap-10 px-8">
          <Link to="/#workshops" onClick={() => setIsMobileMenuOpen(false)} className="font-drama italic text-4xl text-background hover:text-accent transition-colors">
            {t('nav.workshops')}
          </Link>
          <Link to="/social" onClick={() => setIsMobileMenuOpen(false)} className="font-drama italic text-4xl text-background hover:text-accent transition-colors">
            {t('nav.social')}
          </Link>
          <Link to="/agenda" onClick={() => setIsMobileMenuOpen(false)} className="font-drama italic text-4xl text-background hover:text-accent transition-colors">
            {t('nav.agenda')}
          </Link>
        </div>

        {/* Footer do Menu */}
        <div className="px-8 py-10 flex flex-col items-start gap-8 border-t border-white/5">
          {/* Idiomas */}
          <div className="flex items-center gap-6 text-sm font-heading font-bold text-background/50">
            <button onClick={() => { i18n.changeLanguage('no'); setIsMobileMenuOpen(false); }} className={`hover:text-accent transition-colors ${i18n.resolvedLanguage === 'no' ? 'text-accent' : ''}`}>NO</button>
            <button onClick={() => { i18n.changeLanguage('en'); setIsMobileMenuOpen(false); }} className={`hover:text-accent transition-colors ${i18n.resolvedLanguage === 'en' ? 'text-accent' : ''}`}>EN</button>
            <button onClick={() => { i18n.changeLanguage('pt'); setIsMobileMenuOpen(false); }} className={`hover:text-accent transition-colors ${i18n.resolvedLanguage === 'pt' ? 'text-accent' : ''}`}>PT</button>
          </div>
          {currentUser ? (
            <div className="flex flex-col w-full gap-4">
              <span className="font-heading text-sm text-[#9A9A9A]">
                {t("nav.hello")}, {currentUser.profile?.nome?.split(' ')[0] || 'Aluno'}
              </span>
              <button 
                onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }}
                className="bg-transparent border border-[#333333] text-background hover:border-accent hover:text-accent px-6 py-4 rounded-full font-heading font-bold text-xs w-full uppercase tracking-wider text-center transition-colors"
              >{t("nav.logout")}</button>
            </div>
          ) : (
            <div className="flex flex-col w-full gap-4">
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="border border-[#333333] text-background hover:border-accent hover:text-accent px-6 py-4 rounded-full font-heading font-bold text-xs w-full uppercase tracking-wider text-center transition-colors"
              >{t("nav.login")}</Link>
              <Link 
                to="/cadastro" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-accent text-primary px-6 py-4 rounded-full font-heading font-bold text-xs w-full uppercase tracking-wider text-center"
              >{t("nav.signup")}</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
