import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProgramTemplate({ program }) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [isFading, setIsFading] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
      
      const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video || !video.duration) return;
        
        const { currentTime, duration } = video;
        const fadeTime = 2.5; // Start fading 2.5s before end
        
        if (duration - currentTime < fadeTime) {
          setIsFading(true); // Fade out at the end
        } else if (currentTime > 0.1 && currentTime < fadeTime) {
          setIsFading(false); // Fade in at the start
        }
      };

      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [program]);
  
  if (!program) return <div>Program not found</div>;

  return (
    <div className="bg-primary min-h-screen font-sans text-background pb-16">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary pt-24">
        {program.heroVideo ? (
          <video 
            ref={videoRef}
            src={program.heroVideo}
            autoPlay 
            loop 
            muted 
            playsInline
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-[2500ms] ease-in-out ${isFading ? 'opacity-0' : 'opacity-60'}`}
          ></video>
        ) : program.heroImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-60" 
            style={{ backgroundImage: `url(${program.heroImage})` }}
          ></div>
        ) : (
          <div className="absolute inset-0 bg-primary z-0 opacity-20"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent z-[5]"></div>
        
        {/* Watermark Logo */}
        {program.logo && (
          <div className="absolute top-24 md:top-36 left-0 w-full px-6 lg:px-12 pointer-events-none z-10">
            <div className="max-w-7xl mx-auto flex">
              <img 
                src={program.logo} 
                alt="Program Watermark" 
                className="h-10 md:h-20 object-contain opacity-20"
              />
            </div>
          </div>
        )}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto drop-shadow-md mt-16">
          <p className="font-heading text-[10px] tracking-[5px] uppercase text-accent mb-5">Programa</p>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-batang text-5xl md:text-7xl font-normal mb-6 tracking-wide text-background"
          >
            {program.title}
          </motion.h1>
          <div className="w-12 h-[1px] bg-accent/70 mx-auto"></div>
        </div>
      </section>

      {/* Concept / Philosophy Section */}
      <section className="py-24 px-8 max-w-4xl mx-auto text-center">
        <h2 className="font-drama italic text-3xl md:text-5xl font-light mb-8 text-background/90">A Filosofia</h2>
        <p className="font-heading text-lg md:text-xl leading-[1.8] text-[#9A9A9A] font-light">
          {program.description}
        </p>
      </section>

      {/* Workshops Grid */}
      <section className="py-16 px-8 max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
            <h2 className="font-batang text-[38px] font-normal text-[#F0EDE8] mb-4 tracking-tight">
            Workshops
            </h2>
            <div className="w-12 h-[1px] bg-accent/70 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
          {program.workshops && program.workshops.map((workshop) => (
            <motion.div 
              key={workshop.id} 
              className="group relative bg-[#141414] px-8 pt-10 pb-12 overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#222222] rounded-[2px] hover:-translate-y-[10px] hover:border-accent/35 flex flex-col items-center text-center"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(201,168,76,0.4)_0%,transparent_70%)]"></div>
              
              <div 
                className="w-full h-48 bg-[#0C0C0C] bg-cover bg-center mb-8 relative z-10 rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ backgroundImage: `url(${workshop.image})` }}
              ></div>
              
              <h3 className="text-[22px] font-normal text-[#F0EDE8] mb-3.5 tracking-wide relative z-10 font-batang">{workshop.title}</h3>
              <div className="w-7 h-[1px] bg-accent/40 group-hover:bg-accent/80 mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10"></div>
              
              <p className="font-heading text-[14px] leading-[1.75] text-[#9A9A9A] font-light relative z-10 mb-8 flex-grow">
                {workshop.shortDescription}
              </p>

              <Link 
                to={`/${program.id}/${workshop.slug}`}
                className="relative z-10 inline-block font-heading text-[10px] tracking-[4px] uppercase text-accent decoration-transparent border-b border-accent/30 pb-2 transition-all duration-400 hover:border-accent/80 hover:text-background hover:pb-2.5 mt-auto"
              >
                Saber Mais
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Additional Sections */}
      <section className="py-24 bg-[#08080C] border-t border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {program.corporate && (
            <div className="p-12 bg-[#141414] border border-[#222222] rounded-[2px] hover:border-accent/20 transition-colors">
              <h3 className="font-batang text-2xl font-normal mb-4 text-[#F0EDE8]">{program.corporate.title}</h3>
              <div className="w-7 h-[1px] bg-accent/40 mb-6"></div>
              <p className="font-heading text-[#9A9A9A] mb-8 font-light leading-relaxed">{program.corporate.description}</p>
              <button className="font-heading text-[10px] tracking-[4px] uppercase text-accent border-b border-accent/30 pb-2 hover:text-background hover:border-accent/80 transition-all">
                Fale Conosco
              </button>
            </div>
          )}
          {program.individualSessions && (
            <div className="p-12 bg-[#141414] border border-[#222222] rounded-[2px] hover:border-accent/20 transition-colors">
              <h3 className="font-batang text-2xl font-normal mb-4 text-[#F0EDE8]">{program.individualSessions.title}</h3>
              <div className="w-7 h-[1px] bg-accent/40 mb-6"></div>
              <p className="font-heading text-[#9A9A9A] mb-8 font-light leading-relaxed">{program.individualSessions.description}</p>
              <button className="font-heading text-[10px] tracking-[4px] uppercase text-accent border-b border-accent/30 pb-2 hover:text-background hover:border-accent/80 transition-all">
                Agendar
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
