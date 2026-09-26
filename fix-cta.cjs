const fs = require('fs');
let code = fs.readFileSync('src/pages/ImpactPage.jsx', 'utf8');

const regex = /<div className="hero-elem w-full pointer-events-auto">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const replacement = `<div className="hero-elem w-full pointer-events-auto">
            <div className="h-[1px] w-full max-w-md bg-slate-100/10 mb-8 draw-line" />
            <p className="font-heading text-background/70 text-base md:text-lg lg:text-xl leading-[1.6] max-w-lg">
              {t('social_page_b2b.hero.subtitle')}
            </p>
          </div>
          </div>
        </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/ImpactPage.jsx', code);
console.log('Fixed CTA');
