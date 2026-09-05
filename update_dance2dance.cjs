const fs = require('fs');

let content = fs.readFileSync('src/pages/ContactPage.jsx', 'utf8');

const target = `<h3 className="font-drama text-2xl text-accent mb-4">
                Dance 2 Dance
              </h3>`;

const replacement = `<h3 className="font-drama text-2xl text-[#F0EDE8] mb-4">
                Dance<span className="text-accent">2</span>Dance
              </h3>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/ContactPage.jsx', content, 'utf8');
console.log('Successfully updated Dance2Dance typography.');
