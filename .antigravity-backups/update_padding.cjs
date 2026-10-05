const fs = require('fs');

let signupContent = fs.readFileSync('src/pages/SignupPage.jsx', 'utf8');
signupContent = signupContent.replace(
  /<main className="flex-grow pt-32 pb-24 px-6 relative">/,
  `<main className="flex-grow pt-40 md:pt-48 pb-24 px-6 relative">`
);
fs.writeFileSync('src/pages/SignupPage.jsx', signupContent, 'utf8');

let loginContent = fs.readFileSync('src/pages/LoginPage.jsx', 'utf8');
loginContent = loginContent.replace(
  /<main className="flex-grow pt-32 pb-24 px-6 relative flex flex-col justify-center">/,
  `<main className="flex-grow pt-40 md:pt-48 pb-24 px-6 relative flex flex-col justify-center">`
);
fs.writeFileSync('src/pages/LoginPage.jsx', loginContent, 'utf8');

console.log('Padding increased');
