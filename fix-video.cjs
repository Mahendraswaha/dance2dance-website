const fs = require('fs');
let code = fs.readFileSync('src/pages/ImpactPage.jsx', 'utf8');

const regex = /\{\/\* Background Layer - Video aligned perfectly to the right \*\/\}[\s\S]*?\{\/\* Content Layer: Unified wrapper matches HeroSequence floating alignment exactly \*\/\}[\s\S]*?<div className="relative z-10 w-full max-w-5xl mx-auto mt-auto px-6 lg:px-12 pointer-events-none">/s;

const replacement = `{/* Content Layer: Unified wrapper matches HeroSequence floating alignment exactly */}
          <div className="relative z-10 w-full max-w-5xl mx-auto mt-auto px-6 lg:px-12 pointer-events-none">
            
            {/* Background Layer - Video aligned exactly at the top of the content block (Powered By tag) */}
            <div className="absolute top-0 right-6 lg:right-12 w-full md:w-[60%] lg:w-[50%] h-[75vh] z-0 pointer-events-none">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                poster={heroBlurPlaceholder}
                className="w-full h-full object-contain object-right-top opacity-50 mix-blend-luminosity md:translate-x-4"
              >
                <source src="/hero-social-project-small.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-transparent" />
            </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/ImpactPage.jsx', code);
console.log("Patched");
