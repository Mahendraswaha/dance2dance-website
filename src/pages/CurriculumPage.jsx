import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CurriculumPage() {
  const { t } = useTranslation();
  const cvData = t('cv', { returnObjects: true });
  
  if (!cvData || !cvData.paragraphs) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef([]);

  // Images to cycle through as we scroll
  // Users can replace these in public/images/
  const images = [
    '/images/cv-phase-1.jpeg',
    '/images/cv-phase-2.jpeg',
    '/images/cv-phase-3.jpeg'
  ];

  // Group paragraphs into 3 sections for the images
  const sections = [
    cvData.paragraphs.slice(0, 2),
    cvData.paragraphs.slice(2, 4),
    cvData.paragraphs.slice(4, 6)
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveIndex(index);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' } // Trigger when element hits middle of screen
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans text-text selection:bg-accent/30">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 relative">
        <div className="max-w-[1200px] mx-auto px-8">
          
          {/* Header */}
          <div className="mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-batang text-5xl md:text-7xl font-normal text-accent mb-4"
            >
              {cvData.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-heading tracking-[4px] uppercase text-[#9A9A9A] text-sm"
            >
              {cvData.subtitle}
            </motion.p>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-[1px] bg-accent/40 mt-8"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
            
            {/* Left Column: Text Content */}
            <div className="flex-1 lg:max-w-2xl">
              
              {/* Highlights */}
              <div className="mb-20 p-8 border border-white/5 bg-[#141414]/50 rounded-sm">
                <h3 className="font-heading text-xs tracking-[3px] uppercase text-accent mb-8">
                  {cvData.highlights_title}
                </h3>
                <ul className="space-y-4">
                  {cvData.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 shrink-0"></span>
                      <p className="font-heading font-light text-[15px] text-[#D0D0D0] leading-relaxed">
                        {highlight}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Biography Sections */}
              <div className="space-y-24">
                {sections.map((paragraphs, sectionIndex) => (
                  <div 
                    key={sectionIndex} 
                    data-index={sectionIndex}
                    ref={(el) => (sectionRefs.current[sectionIndex] = el)}
                    className="space-y-8"
                  >
                    {paragraphs.map((p, idx) => (
                      <p key={idx} className="font-drama text-lg md:text-xl text-[#F0EDE8]/90 leading-loose font-light">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Sticky Image Gallery */}
            <div className="hidden lg:block w-[360px] shrink-0">
              <div className="sticky top-32 w-full aspect-[3/4] rounded-sm overflow-hidden border border-white/5 shadow-2xl">
                
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: activeIndex === idx ? 1 : 0 }}
                  >
                    <img 
                      src={img} 
                      alt={`Fase ${idx + 1}`}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      onError={(e) => {
                        // Fallback to the main creator photo if specific phase photos aren't uploaded yet
                        e.target.src = '/images/creator-be-the-dance.jpeg';
                      }}
                    />
                  </div>
                ))}

                {/* Subtle overlay to blend it slightly */}
                <div className="absolute inset-0 bg-primary/10 pointer-events-none mix-blend-multiply"></div>
              </div>
            </div>

            {/* Mobile Fallback Image (shows only once at bottom on small screens) */}
            <div className="lg:hidden w-full aspect-[4/5] max-w-[320px] mx-auto mt-12 rounded-sm overflow-hidden border border-white/5 shadow-2xl">
              <img 
                src="/images/creator-be-the-dance.jpeg" 
                alt="Safia"
                className="w-full h-full object-cover grayscale"
              />
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
