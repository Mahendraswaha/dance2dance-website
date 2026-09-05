const fs = require('fs');

let signupContent = fs.readFileSync('src/pages/SignupPage.jsx', 'utf8');
signupContent = signupContent.replace(
  /pt-40 md:pt-48/,
  `pt-44 md:pt-52`
);
fs.writeFileSync('src/pages/SignupPage.jsx', signupContent, 'utf8');

let loginContent = fs.readFileSync('src/pages/LoginPage.jsx', 'utf8');
loginContent = loginContent.replace(
  /pt-40 md:pt-48/,
  `pt-44 md:pt-52`
);
fs.writeFileSync('src/pages/LoginPage.jsx', loginContent, 'utf8');

console.log('Padding increased to pt-44');
