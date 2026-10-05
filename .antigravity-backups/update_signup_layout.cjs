const fs = require('fs');

let content = fs.readFileSync('src/pages/SignupPage.jsx', 'utf8');

content = content.replace(
  /<main className="flex-grow flex items-center justify-center pt-32 pb-24 px-6 relative">/,
  `<main className="flex-grow pt-32 pb-24 px-6 relative">`
);

content = content.replace(
  /className="w-full max-w-2xl bg-\[#0a0a0a\]/,
  `className="w-full max-w-2xl mx-auto bg-[#0a0a0a]`
);

fs.writeFileSync('src/pages/SignupPage.jsx', content, 'utf8');
console.log('SignupPage layout updated');
