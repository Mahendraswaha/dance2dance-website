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

  const [activePhase, setActivePhase] = useState(0);
  const phaseRefs = useRef([]);

  // Images mapped to the 3 narrative phases:
  // Phase 0: Classical roots (Kiev / Cuba / Ballet)
  // Phase 1: Exploration & Transition (Release / NY / Direction)
  // Phase 2: Meditation, Dance2Dance & Norway-Brazil bridge
  const phaseImages = [
    {
      src: '/images/cv-phase-1.jpeg',
      fallback: '/images/creator-be-the-dance.jpg',
      caption: 'Raízes Clássicas'
    },
    {
      src: '/images/cv-phase-2.jpeg',
      fallback: '/images/creator-biostretch.jpeg',
      caption: 'Transição & Somática'
    },
    {
      src: '/images/cv-phase-3.jpeg',
      fallback: '/images/creator-be-the-dance.jpg',
      caption: 'Dance2Dance & Presença'
    }
  ];

  // Group paragraphs into the 3 phases (2 paragraphs each)
  const phases = [
    {
      id: 0,
      paragraphs: cvData.paragraphs.slice(0, 2)
    },
    {
      id: 1,
      paragraphs: cvData.paragraphs.slice(2, 4)
    },
    {
      id: 2,
      paragraphs: cvData.paragraphs.slice(4, 6)
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.phase);
            if (!isNaN(index)) {
              setActivePhase(index);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.2
      }
    );

    phaseRefs.current.forEach((ref) => {
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
          <div className="md:hidden w-[200px] aspect-[3/4] mx-auto mb-16 rounded-sm overflow-hidden border border-white/10 shadow-2xl relative">
            <img 
              src={phaseImages[activePhase].src}
              alt="Safia"
              className="w-full h-full object-cover grayscale transition-opacity duration-700"
              onError={(e) => {
                e.target.src = phaseImages[activePhase].fallback;
              }}
            />
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 justify-between items-start">
            
            {/* Left Column: Narrative Prose */}
            <div className="flex-1 max-w-[620px] space-y-20">
              {phases.map((phase) => (
                <div 
                  key={phase.id}
                  data-phase={phase.id}
                  ref={(el) => (phaseRefs.current[phase.id] = el)}
                  className="space-y-8 relative"
                >
                  {phase.paragraphs.map((p, pIdx) => (
                    <p 
                      key={pIdx} 
                      className="font-drama text-lg md:text-xl text-[#F0EDE8]/90 leading-loose font-light"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Right Column: Sticky Image Frame (Desktop only, seamless crossfade) */}
            <div className="hidden md:block w-[260px] shrink-0 sticky top-36">
              <div className="w-full aspect-[3/4] rounded-sm overflow-hidden border border-white/10 shadow-2xl relative bg-[#141414]">
                {phaseImages.map((imgObj, idx) => (
                  <div
                    key={idx}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ 
                      opacity: activePhase === idx ? 1 : 0,
                      pointerEvents: activePhase === idx ? 'auto' : 'none'
                    }}
                  >
                    <img 
                      src={imgObj.src} 
                      alt={`Registro ${idx + 1}`}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      onError={(e) => {
                        e.target.src = imgObj.fallback;
                      }}
                    />
                  </div>
                ))}
                
                {/* Subtle dark vignette overlay to unify with background */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
