import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

import Brand from './Brand';

const Activities = () => {
  return (
    <section id="workshops" className="py-24 px-8 bg-[#0C0C0C] min-h-screen flex items-center">
      <div className="max-w-[1200px] w-full mx-auto text-center">
        
        <p className="font-heading text-[10px] tracking-[5px] uppercase text-[#8A8A8A] mb-5">O que fazemos</p>
        
        <h2 className="font-batang text-[38px] font-normal text-[#F0EDE8] mb-4 leading-tight tracking-tight">Nossas Atividades</h2>
        
        <div className="w-12 h-[1px] bg-[#C4B49A]/70 mx-auto mb-16"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
          
          {/* Card 1 - Be The Dance */}
          <a href="/be-the-dance" className="group relative bg-[#141414] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#222222] rounded-[2px] hover:-translate-y-[10px] hover:border-[#8BBCD8]/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(139,188,216,0.15)] flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(139,188,216,0.4)_0%,transparent_70%)]"></div>
            
            <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
              <img src="/logo-bethedance.png" alt="Be the Dance" className="max-h-full max-w-[150px] object-contain" />
            </div>
            
            <h3 className="text-[22px] font-normal text-[#F0EDE8] mb-3.5 tracking-wide relative z-10 font-batang">Be the Dance</h3>
            
            <div className="w-7 h-[1px] bg-[#C4B49A]/40 group-hover:bg-[#8BBCD8]/60 mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10"></div>
            
            <p className="font-heading text-[14px] leading-[1.75] text-[#9A9A9A] font-light relative z-10">
              Workshops de dança onde o movimento vira encontro. Ritmos que se cruzam, corpos que se escutam, uma coreografia que nasce do coletivo.
            </p>
          </a>
          
          {/* Card 2 - BioStretch */}
          <a href="/biostretch" className="group relative bg-[#141414] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#222222] rounded-[2px] hover:-translate-y-[10px] hover:border-[#5AA87A]/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(90,168,122,0.15)] flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(90,168,122,0.4)_0%,transparent_70%)]"></div>
            
            <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
              <img src="/logo-biostretch.png" alt="BioStretch" className="max-h-full max-w-[180px] scale-110 object-contain" />
            </div>
            
            <h3 className="text-[22px] font-normal text-[#F0EDE8] mb-3.5 tracking-wide relative z-10 font-batang">BioStretch</h3>
            
            <div className="w-7 h-[1px] bg-[#C4B49A]/40 group-hover:bg-[#5AA87A]/60 mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10"></div>
            
            <p className="font-heading text-[14px] leading-[1.75] text-[#9A9A9A] font-light relative z-10">
              Práticas de movimento consciente que ampliam a percepção, estimulam a reorganização corporal e transformam a maneira como habitamos o corpo.
            </p>
          </a>
          
          {/* Card 3 - Kroppsskole */}
          <a href="/kroppsskole" className="group relative bg-[#141414] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#222222] rounded-[2px] hover:-translate-y-[10px] hover:border-[#4A9B8E]/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(74,155,142,0.15)] flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(74,155,142,0.4)_0%,transparent_70%)]"></div>
            
            <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
              <img src="/logo-kroppsskole.png" alt="Kroppsskole" className="max-h-full max-w-[150px] object-contain" />
            </div>
            
            <h3 className="text-[22px] font-normal text-[#F0EDE8] mb-3.5 tracking-wide relative z-10 font-batang">Kroppsskole</h3>
            
            <div className="w-7 h-[1px] bg-[#C4B49A]/40 group-hover:bg-[#4A9B8E]/60 mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10"></div>
            
            <p className="font-heading text-[14px] leading-[1.75] text-[#9A9A9A] font-light relative z-10">
              Projetos comunitários que atravessam ruas e bairros, tecendo laços, criando vínculos e Transformando.
            </p>
          </a>

        </div>
        
        <div className="mt-16">
          <a href="/programacao" className="inline-block font-heading text-[10px] tracking-[4px] uppercase text-[#C4B49A] decoration-transparent border-b border-[#C4B49A]/30 pb-2 transition-all duration-400 hover:border-[#C4B49A]/80 hover:text-[#F0EDE8] hover:pb-2.5">
            CONHEÇA NOSSA PROGRAMAÇÃO
          </a>
        </div>
        
      </div>
    </section>
  );
};

export default Activities;
