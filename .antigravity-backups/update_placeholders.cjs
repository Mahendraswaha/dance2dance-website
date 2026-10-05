const fs = require('fs');

// 1. Update EN locale
let enFile = 'src/i18n/locales/en.json';
let enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
enData.contactPage.phonePlaceholder = "+47 ...";
enData.contactPage.countryPlaceholder = "Norway...";
fs.writeFileSync(enFile, JSON.stringify(enData, null, 2) + '\n', 'utf8');

// 2. Update NO locale
let noFile = 'src/i18n/locales/no.json';
let noData = JSON.parse(fs.readFileSync(noFile, 'utf8'));
noData.contactPage.phonePlaceholder = "+47 ...";
noData.contactPage.countryPlaceholder = "Norge...";
fs.writeFileSync(noFile, JSON.stringify(noData, null, 2) + '\n', 'utf8');

// 3. Update PT locale just in case to make it explicitly PT first if they wanted
let ptFile = 'src/i18n/locales/pt.json';
let ptData = JSON.parse(fs.readFileSync(ptFile, 'utf8'));
// User said "no telefone só colocar +55 se for PT". We will keep "+55 ... / +47 ..." or just "+55 ..."
ptData.contactPage.phonePlaceholder = "+55 ... / +47 ...";
ptData.contactPage.countryPlaceholder = "Brasil, Noruega...";
fs.writeFileSync(ptFile, JSON.stringify(ptData, null, 2) + '\n', 'utf8');

// 4. Update ContactPage fallbacks just to be neat
let contactContent = fs.readFileSync('src/pages/ContactPage.jsx', 'utf8');
contactContent = contactContent.replace(
  /placeholder=\{t\('contactPage\.phonePlaceholder', '\+47 \.\.\. \/ \+55 \.\.\.'\)\}/,
  `placeholder={t('contactPage.phonePlaceholder', '+47 ...')}`
);
contactContent = contactContent.replace(
  /placeholder=\{t\('contactPage\.countryPlaceholder', 'Brasil, Noruega\.\.\.'\)\}/,
  `placeholder={t('contactPage.countryPlaceholder', 'Norway...')}`
);
fs.writeFileSync('src/pages/ContactPage.jsx', contactContent, 'utf8');

console.log('Placeholders updated successfully');
