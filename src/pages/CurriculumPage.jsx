import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CurriculumPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cvData = t('cv', { returnObjects: true });
  
  if (!cvData || !cvData.paragraphs) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const paragraphRefs = useRef([]);

  // Now we map each of the 6 paragraphs directly to one of the 6 new photos!
  const phaseImages = [
    { src: '/images/cv-1.jpg' },
    { src: '/images/cv-2.jpg' },
    { src: '/images/cv-3.jpg' },
    { src: '/images/cv-4.jpg' },
    { src: '/images/cv-5.jpg' },
    { src: '/images/cv-6.jpg' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        // Adjust rootMargin so the trigger happens closer to the center of the screen
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
      }
    );

    paragraphRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-[#F0EDE8] selection:bg-accent/30">
      <Navbar />
      
      <main className="flex-grow pt-36 md:pt-44 pb-32 relative">
        <div className="max-w-[1000px] mx-auto px-8">
          
          {/* Back button */}
          <button 
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 font-heading text-xs tracking-[3px] uppercase text-[#9A9A9A] hover:text-accent transition-colors mb-12 focus:outline-none"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>{t('actions.back', 'Voltar')}</span>
          </button>

          {/* Header */}
          <div className="mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-batang text-5xl md:text-7xl font-normal text-accent mb-4 tracking-tight"
            >
              {cvData.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-heading tracking-[4px] uppercase text-[#9A9A9A] text-xs md:text-sm font-light"
            >
              {cvData.subtitle}
            </motion.p>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[1px] bg-accent/40 mt-8"
            />
          </div>

          {/* Mobile Image (discreet portrait at the top) */}
          <div className="md:hidden w-full max-w-[280px] mx-auto mb-16 rounded-sm overflow-hidden border border-white/10 shadow-2xl relative aspect-[3/4]">
            <img 
              src={phaseImages[activeIndex]?.src || phaseImages[0].src}
              alt="Safia"
              className="w-full h-full object-cover grayscale transition-opacity duration-700"
            />
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 justify-between items-start relative">
            
            {/* Left Column: Narrative Prose */}
            <div className="flex-1 max-w-[580px] pb-32">
              {cvData.paragraphs.map((p, pIdx) => (
                <div 
                  key={pIdx}
                  data-index={pIdx}
                  ref={(el) => (paragraphRefs.current[pIdx] = el)}
                  // The minimum height ensures that short paragraphs still allow scrolling nicely
                  className="min-h-[35vh] flex items-center" 
                >
                  <p className={`font-drama text-lg md:text-xl leading-loose font-light transition-colors duration-700 ${activeIndex === pIdx ? 'text-[#F0EDE8]' : 'text-[#F0EDE8]/40'}`}>
                    {p}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column: Sticky Image Frame (Desktop only, seamless crossfade) */}
            <div className="hidden md:block w-[280px] shrink-0 sticky top-36">
              <div className="w-full aspect-[3/4] rounded-sm overflow-hidden border border-white/10 shadow-2xl relative bg-[#141414]">
                {phaseImages.map((imgObj, idx) => (
                  <div
                    key={idx}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ 
                      opacity: activeIndex === idx ? 1 : 0,
                      pointerEvents: activeIndex === idx ? 'auto' : 'none'
                    }}
                  >
                    <img 
                      src={imgObj.src} 
                      alt={`Registro ${idx + 1}`}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                ))}
                
                {/* Subtle dark vignette overlay to unify with background */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent pointer-events-none" />
              </div>
              
              {/* Optional: Indicator Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {phaseImages.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-[2px] transition-all duration-500 ${activeIndex === idx ? 'w-6 bg-accent' : 'w-2 bg-white/20'}`}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
