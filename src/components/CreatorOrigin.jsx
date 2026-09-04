import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedFrame from './AnimatedFrame';

export default function CreatorOrigin({ programId }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const originData = t(`programs.${programId}.origin`, { returnObjects: true });
  
  if (!originData || !originData.paragraphs || !Array.isArray(originData.paragraphs) || originData.paragraphs.length === 0) {
    return null;
  }

  const paragraphs = originData.paragraphs;
  const teaserParagraphs = paragraphs.slice(0, 2);
  const remainingParagraphs = paragraphs.slice(2);

  const renderParagraph = (p, idx) => {
    if (p.startsWith('[SILVER]')) {
      return (
        <p key={idx} className="font-drama italic text-xl md:text-2xl text-[#8A8A8A] leading-loose font-light whitespace-pre-line">
          {p.replace('[SILVER]', '')}
        </p>
      );
    }
    
    if (p.startsWith('[GOLD]')) {
      return (
        <div key={idx} className="py-12 my-12 border-t border-b border-accent/20 text-center relative px-4">
          <p className="font-batang italic text-2xl md:text-[28px] text-accent leading-relaxed whitespace-pre-line">
            {p.replace('[GOLD]', '')}
          </p>
        </div>
      );
    }

    if (p.startsWith('[SIGNATURE]')) {
      return (
        <p key={idx} className="font-batang italic text-xl md:text-2xl text-[#F0EDE8]/90 mt-12 text-right">
          {p.replace('[SIGNATURE]', '')}
        </p>
      );
    }

    const isQuote = p.startsWith('"') || p.startsWith('“') || p.startsWith('«');
    if (isQuote) {
      return (
        <div key={idx} className="py-12 my-12 border-t border-b border-accent/20 text-center relative px-4">
          <p className="font-batang italic text-2xl md:text-[28px] text-accent leading-relaxed">
            {p}
          </p>
        </div>
      );
    }
    
    return (
      <p key={idx} className="font-drama text-lg md:text-xl text-[#F0EDE8]/90 leading-loose font-light whitespace-pre-line">
        {p}
      </p>
    );
  };

  return (
    <section className="py-24 border-t border-white/5 relative z-10">
      <div className="max-w-[1000px] mx-auto px-8">
        
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 justify-between items-start">
          
          {/* Coluna de Texto (Esquerda) */}
          <div className="flex-1">
            
            <div className="text-left mb-12">
              <h2 className="font-heading text-sm tracking-[4px] uppercase text-accent mb-4">
                {originData.title || "A Origem"}
              </h2>
              <div className="w-12 h-[1px] bg-accent/30"></div>
            </div>

            <div className="space-y-8">
              {teaserParagraphs.map(renderParagraph)}
            </div>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-8 space-y-8">
                    {remainingParagraphs.map(renderParagraph)}

                    {/* CV Link */}
                    <div className="pt-16 pb-8 flex flex-col items-center justify-center gap-12">
                      
                      <Link 
                        to={originData.cv_url || "#"} 
                        className="group flex flex-col items-center gap-3"
                      >
                        <span className="font-heading text-sm tracking-[3px] uppercase text-accent/80 group-hover:text-accent transition-colors">
                          {originData.cv_link_text || "Ver currículo completo"}
                        </span>
                        <div className="w-10 h-10 rounded-full border border-accent/40 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-background transition-all duration-300">
                          <ArrowRight size={16} />
                        </div>
                      </Link>

                      {/* Botão Recolher */}
                      <button
                        onClick={() => {
                          setIsExpanded(false);
                        }}
                        className="group flex items-center gap-3 text-accent/60 hover:text-accent transition-colors focus:outline-none"
                      >
                        <ChevronUp size={16} strokeWidth={1} />
                        <span className="font-heading text-[10px] tracking-[3px] uppercase">
                          {originData.read_less || "Recolher"}
                        </span>
                      </button>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isExpanded && (
              <div className="mt-8 flex relative">
                <div className="absolute bottom-full left-0 w-full h-40 bg-gradient-to-t from-primary to-transparent pointer-events-none"></div>
                
                <button
                  onClick={() => setIsExpanded(true)}
                  className="group flex flex-col items-start gap-3 focus:outline-none relative z-10"
                >
                  <span className="font-heading text-[10px] tracking-[3px] uppercase text-[#9A9A9A] group-hover:text-accent transition-colors">
                    {originData.read_more || "Ler história completa"}
                  </span>
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-accent/50 group-hover:text-accent pl-4"
                  >
                    <ChevronDown size={20} strokeWidth={1} />
                  </motion.div>
                </button>
              </div>
            )}

          </div>

          {/* Coluna da Imagem (Direita) - Agora com AnimatedFrame */}
          <div className="w-[180px] sm:w-[220px] mx-auto md:mx-0 shrink-0 relative md:sticky md:top-32 order-first md:order-last mb-10 md:mb-0">
            <AnimatedFrame className="w-full aspect-[3/4]">
              <img 
                src={originData.photo_url || "/images/creator-be-the-dance.jpg"} 
                alt="Criadora" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-accent/10');
                }}
              />
            </AnimatedFrame>
          </div>

        </div>
      </div>
    </section>
  );
}
