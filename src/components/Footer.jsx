import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

import Brand from './Brand';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-primary relative z-20 border-t border-[#1a1a1a]">
      <footer className="bg-primary text-background rounded-t-[4rem] px-6 lg:px-12 pt-16 pb-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-sm flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="cursor-pointer hover:opacity-80 transition-opacity">
                <img src="/logo-dance2dance.png" alt="Dance2Dance Logo" className="h-12 object-contain" />
              </button>
            </div>
            <p className="font-heading text-background/60 text-sm">{t("footer.desc")}</p>
            
            <div className="flex flex-row gap-10 items-start mt-14 md:mt-24">
              <a href="https://toyenunlimited.no/" target="_blank" rel="noopener noreferrer" className="flex flex-col gap-4 group">
                <span className="text-[9px] font-heading text-background/40 uppercase tracking-[1px] group-hover:text-accent transition-colors">We are unlimiters</span>
                <img src="/logo-toyen-unlimited.png" alt="Toyen Unlimited" className="h-7 md:h-8 object-contain object-left group-hover:opacity-80 transition-opacity" />
              </a>
              <a href="https://poaciadanca.com.br/en/" target="_blank" rel="noopener noreferrer" className="flex flex-col gap-4 group">
                <span className="text-[9px] font-heading text-background/40 uppercase tracking-[1px] group-hover:text-accent transition-colors">Strategic partner</span>
                <img src="/logo-poaciadanca.png" alt="Cia de Dança" className="h-9 md:h-12 -mt-1 object-contain object-left group-hover:opacity-80 transition-opacity" />
              </a>
            </div>
          </div>
          
          <div className="flex gap-16 font-heading text-sm font-medium">
            <div className="flex flex-col gap-4">
              <Link to="/be-the-dance" onClick={() => window.scrollTo(0,0)} className="hover:text-accent transition-colors">Be The Dance</Link>
              <Link to="/biostretch" onClick={() => window.scrollTo(0,0)} className="hover:text-accent transition-colors">Biostretch</Link>
              <Link to="/kroppsskole" onClick={() => window.scrollTo(0,0)} className="hover:text-accent transition-colors">Kroppsskole</Link>
              <Link to="/social" onClick={() => window.scrollTo(0,0)} className="hover:text-accent transition-colors">{t("footer.links.impact")}</Link>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-accent transition-colors">Instagram</a>
              <a href="#" className="hover:text-accent transition-colors">Facebook</a>
              <a href="#" className="hover:text-accent transition-colors">YouTube</a>
              <a href="#" className="hover:text-accent transition-colors">TikTok</a>
              <Link to="/contato" onClick={() => window.scrollTo(0,0)} className="hover:text-accent transition-colors">{t("footer.links.contact")}</Link>
              <Link to="/termos" onClick={() => window.scrollTo(0,0)} className="hover:text-accent transition-colors">{t("footer.links.terms")}</Link>
              <Link to="/privacidade" onClick={() => window.scrollTo(0,0)} className="hover:text-accent transition-colors">{t("footer.links.privacy")}</Link>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-textDark/50 text-xs font-data text-background/40">
          <p>© {new Date().getFullYear()} Dance2Dance. {t("footer.rights")}</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Mahendra</span>
          </div>
        </div>
        
      </div>
    </footer>
    </div>
  );
};

export default Footer;
