const fs = require('fs');
let code = fs.readFileSync('src/pages/ImpactPage.jsx', 'utf8');

const regex = /\{\/\* ─── HERO ────────────────────────────────────────────────────── \*\/\}[\s\S]*?<\/section>/;

const replacement = `{/* ─── HERO ────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[100dvh] flex flex-col pt-32 md:pt-48 lg:pt-56 pb-16 md:pb-24 overflow-hidden bg-primary">
        
        {/* Content Layer: Unified wrapper matches HeroSequence floating alignment exactly */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-auto px-6 lg:px-12 pointer-events-none">
          <div className="flex flex-col md:w-3/4 lg:w-[65%] items-start">
          
          {/* B2B Authority Badge */}
          <div className="hero-elem inline-flex items-center gap-3 px-5 py-3 mb-8 rounded-[24px] border border-slate-700/50 bg-black/40 backdrop-blur-md">
              <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest whitespace-nowrap shrink-0">{t('social_page_b2b.hero.badge')}</span>
              <span className="font-heading font-bold text-[13px] md:text-sm text-accent text-left leading-[1.2]">{t('social_page_b2b.hero.badge_brand')}</span>
            </div>

          <span className="hero-elem font-heading text-[10px] md:text-[11px] tracking-[5px] uppercase text-slate-400 mb-6 block">
            {t('social_page_b2b.hero.kicker')}
          </span>
          <h1 className="flex flex-col gap-0 md:gap-2 mb-8 pointer-events-none">
            {/* Reduced max size from 8xl to 7xl to respect viewport heights */}
            <span className="hero-elem font-drama italic text-5xl md:text-6xl lg:text-7xl text-background leading-none">
              {t('social_page_b2b.hero.title_line1')}
            </span>
            <span className="hero-elem font-drama italic text-5xl md:text-6xl lg:text-7xl text-slate-300/40 leading-none">
              {t('social_page_b2b.hero.title_line2')}
            </span>
          </h1>

          <div className="hero-elem w-full pointer-events-auto">
            <p className="font-heading text-base md:text-lg lg:text-xl text-background/80 leading-relaxed max-w-lg mb-10">
              {t('social_page_b2b.hero.description')}
            </p>
            <button 
              onClick={scrollToInvestment}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-primary rounded-full font-heading font-bold text-sm tracking-widest uppercase overflow-hidden transition-transform hover:scale-105"
            >
              <span className="relative z-10">{t('social_page_b2b.hero.cta')}</span>
              <ArrowDown size={18} className="relative z-10 group-hover:translate-y-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>
          </div>
          </div>
        </div>

        {/* Video Layer - Mobile: Below text. Desktop: Original absolute floating position */}
        <div className="relative lg:absolute lg:top-[60%] left-0 w-full lg:px-12 h-[40vh] lg:h-[70vh] lg:-translate-y-1/2 z-0 pointer-events-none mt-12 lg:mt-0">
          <div className="w-full max-w-5xl mx-auto h-full relative md:translate-x-1">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              poster={heroBlurPlaceholder}
              className="w-full h-full object-contain object-center lg:object-right opacity-60 mix-blend-luminosity"
            >
              <source src="/hero-social-project-small.mp4" type="video/mp4" />
            </video>
          </div>
          {/* Subtle gradient to blend left edge on Desktop */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-primary via-transparent to-transparent" />
          {/* Bottom fade gradient - HIDES THE HARD WRIST CUTOFF FOREVER */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary to-transparent" />
          {/* Top fade gradient for Mobile to blend smoothly with text above */}
          <div className="lg:hidden absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/ImpactPage.jsx', code);
console.log("Patched");
