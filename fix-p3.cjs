const fs = require('fs');
let content = fs.readFileSync('src/pages/Dance2DanceKvinnePage.jsx', 'utf8');
content = content.replace(
  'className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85]"',
  'className="font-heading font-light text-[#CFCFCF] whitespace-pre-line text-base md:text-lg leading-[1.85]"'
);
fs.writeFileSync('src/pages/Dance2DanceKvinnePage.jsx', content, 'utf8');
console.log('Added whitespace-pre-line to p3');
