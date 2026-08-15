import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

export default function ProgramTemplate({ program }) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const workshopsRef = useRef(null);
  const [isFading, setIsFading] = useState(false);
  const [logoVisible, setLogoVisible] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!workshopsRef.current) return;
      const rect = workshopsRef.current.getBoundingClientRect();
      // Quando a seção de workshops estiver a menos de 300px do topo (perto do logo), esconde
      if (rect.top < 300) {
        setLogoVisible(false);
      } else {
        setLogoVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
      
      const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video || !video.duration) return;
        
        const { currentTime, duration } = video;
        const fadeTime = 1.0; // 1 second crossfade
        
        if (duration - currentTime <= fadeTime) {
          setIsFading(true); // Show poster at the end of the loop
        } else if (currentTime > 0.1 && currentTime < fadeTime) {
          setIsFading(false); // Hide poster after loop restarts
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
        
        {/* Poster / Fallback Background - mostra instantaneamente, e some suavemente quando o vídeo inicia */}
        {(program.heroPoster || program.heroImage) && (
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ 
              backgroundImage: `url(${program.heroPoster || program.heroImage})${program.heroBlurPlaceholder ? `, url(data:image/jpeg;base64,${program.heroBlurPlaceholder})` : ''}`,
              opacity: (!isVideoPlaying) ? 0.6 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          ></div>
        )}

        {/* Video Player */}
        {program.heroVideo && (
          <video 
            ref={videoRef}
            src={program.heroVideo}
            autoPlay 
            loop 
            muted 
            playsInline
            onLoadedData={() => {
              setTimeout(() => setIsVideoPlaying(true), 100);
            }}
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity ease-in-out ${(isFading || !isVideoPlaying) ? 'opacity-0 duration-1000' : 'opacity-60 duration-[3000ms]'}`}
          ></video>
        )}

        {!program.heroPoster && !program.heroImage && !program.heroVideo && (
          <div className="absolute inset-0 bg-primary z-0 opacity-20"></div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-primary from-10% via-primary/30 via-50% to-transparent z-[5]"></div>
        
        {/* Watermark Logo */}
        {program.logo && (
          <div className={`fixed top-24 md:top-36 left-0 w-full px-6 lg:px-12 pointer-events-none z-40 transition-opacity duration-700 ease-in-out ${logoVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-7xl mx-auto flex">
              <img 
                src={program.logo} 
                alt="Program Watermark" 
                className={`${program.logoClassName || 'h-12 md:h-24 ml-4 md:ml-10'} object-contain opacity-60`}
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
          {program.subtitle && (
            <p className="font-heading text-lg mt-8 text-background/80 max-w-2xl mx-auto font-light tracking-wide">
              {program.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Concept / Philosophy Section */}
      <section className="py-24 px-8 max-w-3xl mx-auto">
        {program.philosophy ? (
          <div className="space-y-12">
            {program.philosophy.map((section, index) => (
              <div key={index} className="flex flex-col items-start gap-4">
                {section.title && (
                  <h3 className="font-heading text-[10px] tracking-[4px] uppercase text-accent mb-2 mt-4">
                    {section.title}
                  </h3>
                )}
                {section.content.map((paragraph, pIndex) => {
                  const isBullet = paragraph.trim().startsWith('•');
                  const text = isBullet ? paragraph.replace('•', '').trim() : paragraph;
                  return (
                    <div key={pIndex} className="flex items-start gap-4">
                      {isBullet && (
                        <div className="w-4 h-[1px] bg-accent/60 mt-3.5 shrink-0"></div>
                      )}
                      <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed text-left">
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed text-left">
            {program.description}
          </p>
        )}
      </section>

      {/* Workshops Grid */}
      {program.workshops && program.workshops.length > 0 && (
        <section ref={workshopsRef} className="py-16 px-8 max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
              <h2 className="font-batang text-[38px] font-normal text-[#F0EDE8] mb-4 tracking-tight">
              Workshops
              </h2>
              <div className="w-12 h-[1px] bg-accent/70 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
            {program.workshops.map((workshop) => (
              <Link to={`/${program.id}/${workshop.slug}`} key={workshop.id} className="contents">
                <motion.div 
                  className="group relative bg-[#141414] px-8 pt-10 pb-12 overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#222222] rounded-[2px] hover:-translate-y-[10px] hover:border-accent/35 flex flex-col items-center text-center"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(201,168,76,0.4)_0%,transparent_70%)]"></div>
                  
                  {workshop.logo ? (
                    <div className="w-full h-32 flex items-center justify-center mb-10 relative z-10">
                      <img src={workshop.logo} alt={workshop.title} className="max-h-[80%] max-w-[65%] object-contain opacity-85 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <div 
                      className="w-full h-48 bg-[#0C0C0C] bg-cover bg-center mb-8 relative z-10 rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundImage: `url(${workshop.image})` }}
                    ></div>
                  )}
                  
                  <h3 className="text-[22px] font-normal text-[#F0EDE8] mb-3.5 tracking-wide relative z-10 font-batang">{workshop.title}</h3>
                  <div className="w-7 h-[1px] bg-accent/40 group-hover:bg-accent/80 mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10"></div>
                  
                  <p className="font-heading text-[14px] leading-[1.75] text-[#9A9A9A] font-light relative z-10 mb-8 flex-grow">
                    {workshop.shortDescription}
                  </p>

                  <div className="mt-auto relative z-10 w-full">
                    <div className="inline-flex items-center gap-2 font-heading text-[11px] font-semibold text-accent uppercase tracking-[2px] transition-all duration-300 group-hover:text-white">
                      Saiba mais <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Additional Sections */}
      {(program.corporate || program.individualSessions) ? (
        <section className="py-24 bg-[#08080C] border-t border-[#1a1a1a]">
          <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            {program.corporate && (
              <div className="p-12 bg-[#141414] border border-[#222222] rounded-[2px] hover:border-accent/20 transition-colors">
                {program.corporate.logo && (
                  <img src={program.corporate.logo} alt={program.corporate.title} className="h-20 object-contain mb-8" />
                )}
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
      ) : (
        <div className="w-full h-16 bg-gradient-to-b from-primary to-[#0C0C0C] relative z-0"></div>
      )}
    </div>
  );
}
