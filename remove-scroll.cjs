const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'pages', 'ImpactPage.jsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\s*<div className="hero-elem flex flex-col items-start gap-3 mt-12 text-slate-400\/40 pointer-events-auto">\s*<ArrowDown size=\{18\} \/>\s*<span className="font-heading text-\[10px\] tracking-\[4px\] uppercase">\{t\('social_page_b2b\.hero\.scroll'\)\}<\/span>\s*<\/div>/,
  ''
);

fs.writeFileSync(file, content, 'utf8');
