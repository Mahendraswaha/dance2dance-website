const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src', 'pages');

const filesToUpdate = [
  {
    file: 'BeTheDanceUngPage.jsx',
    replacements: [
      {
        search: /className="pt-48 md:pt-56 pb-24 relative"/g,
        replace: 'className="pt-32 md:pt-48 lg:pt-56 pb-24 relative"'
      }
    ]
  },
  {
    file: 'Dance2DanceKvinnePage.jsx',
    replacements: [
      {
        search: /className="pt-48 md:pt-56 pb-24 relative"/g,
        replace: 'className="pt-32 md:pt-48 lg:pt-56 pb-24 relative"'
      }
    ]
  },
  {
    file: 'ImpactPage.jsx',
    replacements: [
      {
        search: /className="relative w-full min-h-\[100dvh\] flex flex-col pt-48 md:pt-56 pb-16 md:pb-24 overflow-hidden bg-primary"/g,
        replace: 'className="relative w-full min-h-[100dvh] flex flex-col pt-32 md:pt-48 lg:pt-56 pb-16 md:pb-24 overflow-hidden bg-primary"'
      },
      {
        search: /<div className="hero-elem inline-flex items-center gap-3 px-4 py-2 mb-8 rounded-full border border-slate-700\/50 bg-black\/40 backdrop-blur-md">\s*<span className="text-xs text-slate-400 uppercase tracking-widest">\{t\('social_page_b2b\.hero\.badge'\)\}<\/span>\s*<span className="font-heading font-bold text-sm text-accent">\{t\('social_page_b2b\.hero\.badge_brand'\)\}<\/span>\s*<\/div>/,
        replace: `<div className="hero-elem inline-flex items-center gap-3 px-5 py-3 mb-8 rounded-[24px] border border-slate-700/50 bg-black/40 backdrop-blur-md">\n              <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest whitespace-nowrap shrink-0">{t('social_page_b2b.hero.badge')}</span>\n              <span className="font-heading font-bold text-[13px] md:text-sm text-accent text-left leading-[1.2]">{t('social_page_b2b.hero.badge_brand')}</span>\n            </div>`
      }
    ]
  }
];

filesToUpdate.forEach(({ file, replacements }) => {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    replacements.forEach(({ search, replace }) => {
      if (search.test(content)) {
        content = content.replace(search, replace);
        changed = true;
      } else {
        console.warn(`WARNING: Could not find match for regex in ${file}`);
      }
    });
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  } else {
    console.warn(`WARNING: File not found: ${filePath}`);
  }
});
