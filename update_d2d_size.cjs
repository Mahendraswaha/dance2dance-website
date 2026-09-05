const fs = require('fs');

let content = fs.readFileSync('src/pages/ContactPage.jsx', 'utf8');

const target = `<h3 className="font-drama text-2xl text-[#F0EDE8] mb-4">
                Dance<span className="text-accent">2</span>Dance
              </h3>`;

const replacement = `<h3 className="font-drama text-2xl text-[#F0EDE8] mb-4">
                Dance<span className="text-accent text-[1.28em] inline-block align-baseline">2</span>Dance
              </h3>`;

if (!content.includes(target)) {
  console.error('Target not found!');
  process.exit(1);
}

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/ContactPage.jsx', content, 'utf8');
console.log('Updated Dance2Dance with larger 2 size');
