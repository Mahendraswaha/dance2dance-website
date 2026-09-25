const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'HeroSequence.jsx');
let content = fs.readFileSync(file, 'utf8');

// We need to find:
/*
        <div className="hero-elem mt-10 pointer-events-auto">
          <button onClick={() => { const el = document.getElementById('workshops'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-magnetic bg-accent text-primary px-8 py-4 rounded-full font-heading font-bold text-lg flex items-center gap-2 inline-flex cursor-pointer">
            <span className="relative z-10 flex items-center gap-2">{t("hero.cta")} <ArrowRight size={20}/></span>
          </button>
        </div>
      </div>
*/
// And replace `</div>` with `</div> </div>`.

content = content.replace(
  /<span className="relative z-10 flex items-center gap-2">\{t\("hero\.cta"\)\} <ArrowRight size=\{20\}\/><\/span>\s*<\/button>\s*<\/div>\s*<\/div>/g,
  '<span className="relative z-10 flex items-center gap-2">{t("hero.cta")} <ArrowRight size={20}/></span>\n          </button>\n        </div>\n      </div>\n      </div>'
);

fs.writeFileSync(file, content, 'utf8');
