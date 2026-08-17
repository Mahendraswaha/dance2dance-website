import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const SocialPillars = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef(null);

  const pillarsData = [
    { key: 'pillar1', number: '01' },
    { key: 'pillar2', number: '02' },
    { key: 'pillar3', number: '03' },
    { key: 'pillar4', number: '04' },
  ];

  // Particle Canvas logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Using accent color #C9A84C (RGB: 201, 168, 76)
        ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 2500);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 168, 76, ${0.1 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="relative w-full bg-primary overflow-hidden font-heading text-[#e8e4dc]">
      <style dangerouslySetInnerHTML={{__html: `
        .pillar-card {
            background: linear-gradient(145deg, #141414 0%, #0f0f0f 100%);
            border: 1px solid #1f1f1f;
            border-radius: 4px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pillar-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #C9A84C, transparent);
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        .pillar-card:hover::before,
        .pillar-card.active::before {
            opacity: 1;
        }
        .pillar-card:hover,
        .pillar-card.active {
            border-color: rgba(201, 168, 76, 0.25);
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(201, 168, 76, 0.08);
        }
        
        @keyframes customFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-1 { animation: customFadeIn 0.4s ease forwards; opacity: 0; }
        .animate-fade-in-2 { animation: customFadeIn 0.5s ease forwards; opacity: 0; }
        .animate-fade-in-3 { animation: customFadeIn 0.6s ease forwards; opacity: 0; }
        .animate-fade-in-4 { animation: customFadeIn 0.7s ease forwards; opacity: 0; }
      `}} />

      {/* ─── TOP SECTION ─── */}
      <div className="flex flex-col items-center justify-center pt-24 pb-12 px-6 lg:px-12 relative max-w-7xl mx-auto">
        <div className="font-heading text-[10px] tracking-[5px] uppercase text-slate-400 block mb-6 text-center">
          {t('social_page.model.kicker')}
        </div>
        <h2 className="font-drama italic text-4xl md:text-5xl lg:text-6xl text-background leading-tight mb-12 text-center">
          {t('social_page.model.title')}
        </h2>

        <div className="flex gap-4 md:gap-6 justify-center flex-wrap w-full">
          {pillarsData.map((p, index) => {
            const isActive = activeIndex === index;
            return (
              <div 
                key={p.key}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`pillar-card w-full sm:w-[220px] md:w-[240px] h-[220px] md:h-[300px] flex flex-col items-center py-8 px-5 cursor-pointer relative overflow-hidden ${isActive ? 'active' : ''}`}
              >
                <div className="flex flex-col items-center h-[120px] w-full">
                  <div className="font-drama text-3xl text-accent mb-2 font-normal">{p.number}</div>
                  <div className="w-[30px] h-[1px] bg-accent mb-4 opacity-60" />
                  <div className="text-xs md:text-[13px] tracking-[2px] uppercase text-[#d4cfc7] text-center font-medium leading-[1.4] w-full flex-1 flex items-center justify-center">
                    {t(`social_page.model.${p.key}.title`)}
                  </div>
                </div>
                
                <div className="flex items-center justify-center mt-auto mb-auto shrink-0">
                  {index === 0 && (
                    <svg className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-accent" viewBox="0 0 70 70" fill="none">
                        <circle cx="35" cy="22" r="10" stroke="currentColor" strokeWidth="1"/>
                        <path d="M20 52 C20 40 28 35 35 35 C42 35 50 40 50 52" stroke="currentColor" strokeWidth="1" fill="none"/>
                        <circle cx="35" cy="35" r="22" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                        <circle cx="35" cy="35" r="28" stroke="currentColor" strokeWidth="0.3" opacity="0.2"/>
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-accent" viewBox="0 0 70 70" fill="none">
                        <rect x="20" y="25" width="30" height="30" stroke="currentColor" strokeWidth="1"/>
                        <line x1="28" y1="25" x2="28" y2="55" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="35" y1="25" x2="35" y2="55" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="42" y1="25" x2="42" y2="55" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="20" y1="35" x2="50" y2="35" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="20" y1="45" x2="50" y2="45" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
                        <circle cx="35" cy="15" r="3" stroke="currentColor" strokeWidth="1"/>
                        <line x1="35" y1="18" x2="35" y2="25" stroke="currentColor" strokeWidth="0.5"/>
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-accent" viewBox="0 0 70 70" fill="none">
                        <circle cx="35" cy="35" r="15" stroke="currentColor" strokeWidth="1"/>
                        <circle cx="35" cy="35" r="8" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
                        <path d="M35 20 L35 12 M35 50 L35 58 M20 35 L12 35 M50 35 L58 35" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
                        <path d="M25 25 L19 19 M45 45 L51 51 M45 25 L51 19 M25 45 L19 51" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                    </svg>
                  )}
                  {index === 3 && (
                    <svg className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-accent" viewBox="0 0 70 70" fill="none">
                        <path d="M20 50 Q35 20 50 50" stroke="currentColor" strokeWidth="1" fill="none"/>
                        <path d="M25 45 Q35 28 45 45" stroke="currentColor" strokeWidth="0.5" opacity="0.5" fill="none"/>
                        <circle cx="35" cy="18" r="4" stroke="currentColor" strokeWidth="1"/>
                        <circle cx="20" cy="52" r="3" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
                        <circle cx="50" cy="52" r="3" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] w-full max-w-7xl mx-auto opacity-70" style={{ background: 'linear-gradient(90deg, transparent, #2a2a2a, transparent)' }} />

      {/* ─── BOTTOM SECTION ─── */}
      <div className="min-h-[400px] py-14 px-6 lg:px-12 flex flex-col md:flex-row gap-12 lg:gap-16 relative max-w-7xl mx-auto overflow-hidden">
        
        {/* Background Grid Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 400 400">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C9A84C" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>

        {/* Side Nav */}
        <nav className="flex flex-row md:flex-col gap-4 lg:gap-5 min-w-auto md:min-w-[200px] pt-2 flex-wrap">
          {pillarsData.map((p, index) => {
            const isActive = activeIndex === index;
            return (
              <div 
                key={p.key}
                onClick={() => setActiveIndex(index)}
                className={`flex items-center gap-4 cursor-pointer py-1.5 md:py-2 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full bg-accent transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-accent font-medium leading-none">{p.number}</span>
                  <span className="text-[10px] md:text-xs lg:text-[13px] tracking-[1px] uppercase text-[#d4cfc7] font-medium leading-[1.3] max-w-[150px]">
                    {t(`social_page.model.${p.key}.title`)}
                  </span>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start relative z-10">
          
          {/* Key forces re-render of this block to trigger CSS animations on change */}
          <div className="flex-1 max-w-lg lg:pt-2 min-h-[200px]" key={activeIndex}> 
            <div className="font-drama text-4xl md:text-5xl lg:text-6xl text-accent font-normal leading-none mb-3 lg:mb-4 animate-fade-in-1">
              {pillarsData[activeIndex].number}
            </div>
            <h2 className="font-drama text-2xl md:text-3xl lg:text-4xl text-[#f5f0e8] font-normal leading-[1.2] mb-4 lg:mb-5 animate-fade-in-2">
              {t(`social_page.model.${pillarsData[activeIndex].key}.title`)}
            </h2>
            <div className="w-[40px] h-[2px] bg-accent mb-5 lg:mb-6 animate-fade-in-3" />
            <p className="text-sm md:text-[15px] lg:text-base leading-[1.75] text-[#a8a39b] font-light animate-fade-in-4">
              {t(`social_page.model.${pillarsData[activeIndex].key}.desc`)}
            </p>
          </div>

          <div className="w-full lg:w-[380px] h-[200px] md:h-[250px] lg:h-[320px] relative flex items-center justify-center shrink-0">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          </div>

        </div>

      </div>
    </section>
  );
};

export default SocialPillars;
