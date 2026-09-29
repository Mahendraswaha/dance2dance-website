const fs = require('fs');
const path = require('path');

const locales = ['pt', 'en', 'no'];
const translations = {
  pt: "Falta só um passo! Confirme seu e-mail clicando no link que enviamos para garantir sua vaga.",
  en: "Just one step left! Please confirm your email by clicking the link we sent you to secure your spot.",
  no: "Bare ett trinn igjen! Bekreft e-posten din ved å klikke på lenken vi sendte deg for å sikre plassen din."
};

for (const lang of locales) {
  const filePath = path.join(__dirname, 'src', 'i18n', 'locales', `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.auth) {
    data.auth = {};
  }
  
  data.auth.verifyEmailAlert = translations[lang];
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${lang}.json`);
}
