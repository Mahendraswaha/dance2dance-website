const fs = require('fs');

let content = fs.readFileSync('src/pages/ContactPage.jsx', 'utf8');

content = content.replace(
  `Dance<span className="text-accent text-[1.28em] inline-block align-baseline">2</span>Dance`,
  `Dance<span className="text-accent text-[1.28em]">2</span>Dance`
);

fs.writeFileSync('src/pages/ContactPage.jsx', content, 'utf8');
console.log('Cleaned span classes to text-accent text-[1.28em]');
