const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'HeroSequence.jsx');
let content = fs.readFileSync(file, 'utf8');

// The block ends around here:
//          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
//            <Brand className="text-background text-2xl md:text-3xl" /> {t("hero.seq2.p6")}
//          </p>
//      </div>

content = content.replace(
  /<p className="font-heading text-lg md:text-xl text-background\/90 leading-relaxed">\s*<Brand className="text-background text-2xl md:text-3xl" \/> \{t\("hero\.seq2\.p6"\)\}\s*<\/p>\s*<\/div>/g,
  '<p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">\n            <Brand className="text-background text-2xl md:text-3xl" /> {t("hero.seq2.p6")}\n          </p>\n        </div>\n      </div>'
);

fs.writeFileSync(file, content, 'utf8');
