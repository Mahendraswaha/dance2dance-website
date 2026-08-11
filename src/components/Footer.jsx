import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

import Brand from './Brand';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#0C0C0C] relative z-20 pt-10">
      <footer className="bg-primary text-background rounded-t-[4rem] px-6 lg:px-12 pt-24 pb-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-24">
        
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-4 mb-6">
              <img src="/logo-dance2dance.png" alt="Dance2Dance Logo" className="h-12 object-contain" />
            </div>
            <p className="font-heading text-background/60 text-sm">{t("footer.desc")}</p>
          </div>
          
          <div className="flex gap-16 font-heading text-sm font-medium">
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-accent transition-colors">Be The Dance</a>
              <a href="#" className="hover:text-accent transition-colors">Biostretch</a>
              <a href="#" className="hover:text-accent transition-colors">Kroppsskole</a>
              <a href="#" className="hover:text-accent transition-colors">{t("footer.links.impact")}</a>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-accent transition-colors">Instagram</a>
              <a href="#" className="hover:text-accent transition-colors">Facebook</a>
              <a href="#" className="hover:text-accent transition-colors">YouTube</a>
              <a href="#" className="hover:text-accent transition-colors">{t("footer.links.contact")}</a>
              <a href="#" className="hover:text-accent transition-colors">{t("footer.links.terms")}</a>
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
