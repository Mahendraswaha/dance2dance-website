import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const SocialPage = () => {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const impactRef = useRef(null);
  const partnerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero reveal
      gsap.from('.hero-elem', {
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.2
      });

      // Background subtle zoom
      gsap.to('.hero-bg', {
        scale: 1.1,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Story sections reveal
      gsap.utils.toArray('.story-elem').forEach((elem) => {
        gsap.from(elem, {
          scrollTrigger: {
            trigger: elem,
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });
      
      // Numbers counter
      gsap.utils.toArray('.impact-number').forEach((elem) => {
        const finalValue = parseInt(elem.getAttribute('data-value'));
        gsap.to(elem, {
          scrollTrigger: {
            trigger: elem,
            start: 'top 80%'
          },
          innerHTML: finalValue,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: 'power2.out',
          onUpdate: function() {
            elem.innerHTML = Math.round(this.targets()[0].innerHTML) + '+';
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-primary text-background min-h-[100dvh] overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
        {/* Abstract Background Effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="hero-bg absolute top-[-20%] left-[-10%] w-[140%] h-[140%] opacity-20 pointer-events-none"
               style={{
                 background: 'radial-gradient(circle at center, rgba(201,168,76,0.15) 0%, rgba(8,8,12,1) 60%)'
               }}
          />
          <img src="/logo-D2D-dancer.png" className="hero-bg absolute right-[-10%] bottom-[-10%] h-[120%] opacity-10 object-contain pointer-events-none rotate-12" alt="" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
          <h1 className="hero-elem font-drama italic text-5xl md:text-7xl lg:text-8xl leading-tight text-background mb-8">
            {t('social_page.hero.title')}
          </h1>
          <p className="hero-elem font-heading text-background/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-16 font-light">
            {t('social_page.hero.subtitle')}
          </p>
          
          <div className="hero-elem flex flex-col items-center gap-4 text-accent/50 animate-pulse mt-12">
            <span className="font-heading text-xs tracking-[4px] uppercase">{t('social_page.hero.scroll')}</span>
            <ArrowDown size={20} />
          </div>
        </div>
      </section>

      {/* Story / Manifesto Section */}
      <section ref={storyRef} className="py-24 md:py-40 px-6 lg:px-12 bg-[#0C0C0C] relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center">
            
            <div className="md:col-span-5 story-elem order-2 md:order-1">
              <div className="aspect-[4/5] bg-primary relative overflow-hidden rounded-[2px] group">
                <div className="absolute inset-0 bg-[url('/gallery/grid/photo3.jpg')] bg-cover bg-center opacity-70 group-hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
              </div>
            </div>
            
            <div className="md:col-span-7 story-elem order-1 md:order-2 flex flex-col justify-center">
              <h2 className="font-batang text-[2rem] md:text-[3rem] text-[#F0EDE8] mb-8 leading-tight">
                {t('social_page.story.title')}
              </h2>
              <div className="w-12 h-[1px] bg-accent/50 mb-10"></div>
              
              <div className="font-heading text-background/60 text-base md:text-lg leading-[1.8] space-y-6 font-light">
                <p>{t('social_page.story.p1')}</p>
                <p>{t('social_page.story.p2')}</p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section ref={impactRef} className="py-32 px-6 lg:px-12 bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center relative z-10">
          
          <div className="story-elem flex flex-col items-center gap-4">
            <div className="font-drama italic text-6xl md:text-8xl text-accent impact-number" data-value="150">0</div>
            <div className="w-8 h-[1px] bg-accent/30"></div>
            <p className="font-heading text-sm md:text-base text-background/60 tracking-widest uppercase">{t('social_page.impact.label1')}</p>
          </div>
          
          <div className="story-elem flex flex-col items-center gap-4">
            <div className="font-drama italic text-6xl md:text-8xl text-accent impact-number" data-value="12">0</div>
            <div className="w-8 h-[1px] bg-accent/30"></div>
            <p className="font-heading text-sm md:text-base text-background/60 tracking-widest uppercase">{t('social_page.impact.label2')}</p>
          </div>

          <div className="story-elem flex flex-col items-center gap-4">
            <div className="font-drama italic text-6xl md:text-8xl text-accent impact-number" data-value="5">0</div>
            <div className="w-8 h-[1px] bg-accent/30"></div>
            <p className="font-heading text-sm md:text-base text-background/60 tracking-widest uppercase">{t('social_page.impact.label3')}</p>
          </div>
          
        </div>
      </section>

      {/* Partners Section */}
      <section ref={partnerRef} className="py-32 px-6 lg:px-12 bg-[#0C0C0C] relative">
        <div className="max-w-5xl mx-auto text-center story-elem">
          <h3 className="font-heading text-[11px] tracking-[4px] uppercase text-accent mb-16">{t('social_page.partners.kicker')}</h3>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32">
            <a href="https://toyenunlimited.no/" target="_blank" rel="noopener noreferrer" className="group">
              <img src="/logo-toyen-unlimited.png" alt="Toyen Unlimited" className="h-12 md:h-16 object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <div className="hidden md:block w-[1px] h-16 bg-white/10"></div>
            <a href="https://poaciadanca.com.br/en/" target="_blank" rel="noopener noreferrer" className="group">
              <img src="/logo-poaciadanca.png" alt="Cia de Dança" className="h-16 md:h-24 object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>
          
          <p className="mt-16 font-heading text-background/50 font-light max-w-2xl mx-auto">
            {t('social_page.partners.desc')}
          </p>
        </div>
      </section>

      {/* Support / CTA Section */}
      <section id="apoie" className="py-40 px-6 lg:px-12 bg-primary relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[url('/gallery/sequence/frame-120.jpg')] bg-cover bg-center opacity-10 grayscale mix-blend-screen"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center story-elem flex flex-col items-center">
          <h2 className="font-drama italic text-5xl md:text-7xl text-[#F0EDE8] mb-8">
            {t('social_page.cta.title')}
          </h2>
          <p className="font-heading text-background/70 text-lg mb-12 font-light">
            {t('social_page.cta.desc')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button className="btn-magnetic bg-accent text-primary px-10 py-5 rounded-full font-heading font-bold text-sm tracking-wide">
              {t('social_page.cta.btn1')}
            </button>
            <button className="px-10 py-5 rounded-full font-heading font-normal text-sm border border-background/20 text-background/80 hover:border-accent hover:text-accent transition-all duration-300">
              {t('social_page.cta.btn2')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SocialPage;
