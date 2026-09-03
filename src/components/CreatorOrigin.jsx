import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  return (
    <section className="py-24 px-6 md:px-12 border-t border-white/5 relative z-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          
          {/* Foto da Criadora */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-accent/40 shadow-2xl relative">
              <img 
                src={originData.photo_url || "/images/creator.jpg"} 
                alt="Criadora" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback se a imagem no for encontrada
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-accent/10');
                }}
              />
            </div>
          </div>

          <h2 className="font-heading text-sm tracking-[4px] uppercase text-accent mb-4">
            {originData.title || "A Origem"}
          </h2>
          <div className="w-12 h-[1px] bg-accent/30 mx-auto"></div>
        </div>

        <div className="space-y-6">
          {teaserParagraphs.map((p, idx) => (
            <p key={idx} className="font-drama text-lg md:text-xl text-[#F0EDE8]/90 leading-relaxed font-light">
              {p}
            </p>
          ))}
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
              <div className="pt-6 space-y-6">
                {remainingParagraphs.map((p, idx) => {
                  const isQuote = p.startsWith('"') || p.startsWith('�') || p.startsWith('�');
                  if (isQuote) {
                    return (
                      <div key={idx} className="py-6 text-center">
                        <p className="font-batang italic text-2xl md:text-3xl text-accent leading-snug">
                          {p}
                        </p>
                      </div>
                    );
                  }
                  
                  return (
                    <p key={idx} className="font-drama text-lg md:text-xl text-[#F0EDE8]/90 leading-relaxed font-light">
                      {p}
                    </p>
                  );
                })}

                {/* CV Link */}
                <div className="pt-16 pb-8 flex justify-center">
                  <Link 
                    to={originData.cv_url || "#"} 
                    className="group flex flex-col items-center gap-3"
                  >
                    <span className="font-heading text-sm tracking-[3px] uppercase text-accent/80 group-hover:text-accent transition-colors">
                      {originData.cv_link_text || "Ver curr�culo completo"}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-accent/40 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-background transition-all duration-300">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && (
          <div className="mt-12 flex justify-center relative">
            {/* O degrad agora usa from-primary para casar com o fundo escuro da pgina */}
            <div className="absolute bottom-full left-0 w-full h-32 bg-gradient-to-t from-primary to-transparent pointer-events-none"></div>
            
            <button
              onClick={() => setIsExpanded(true)}
              className="group flex flex-col items-center gap-3 focus:outline-none"
            >
              <span className="font-heading text-[10px] tracking-[3px] uppercase text-[#9A9A9A] group-hover:text-accent transition-colors">
                {originData.read_more || "Ler hist�ria completa"}
              </span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-accent/50 group-hover:text-accent"
              >
                <ChevronDown size={20} strokeWidth={1} />
              </motion.div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
