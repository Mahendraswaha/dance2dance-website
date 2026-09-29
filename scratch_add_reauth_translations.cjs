const fs = require('fs');
const path = require('path');

const locales = ['pt', 'en', 'no'];
const translations = {
  pt: {
    confirmPasswordPrompt: "Por segurança, digite sua senha para confirmar a exclusão:",
    wrongPassword: "Senha incorreta. A exclusão foi cancelada.",
    reauthNeeded: "Por segurança, você precisa fazer logout e entrar novamente antes de excluir sua conta."
  },
  en: {
    confirmPasswordPrompt: "For security, please enter your password to confirm deletion:",
    wrongPassword: "Incorrect password. Deletion cancelled.",
    reauthNeeded: "For security, you must log out and log back in before deleting your account."
  },
  no: {
    confirmPasswordPrompt: "Av sikkerhetsgrunner, vennligst skriv inn passordet ditt for å bekrefte sletting:",
    wrongPassword: "Feil passord. Sletting avbrutt.",
    reauthNeeded: "Av sikkerhetsgrunner må du logge ut og logge inn på nytt før du kan slette kontoen din."
  }
};

for (const lang of locales) {
  const filePath = path.join(__dirname, 'src', 'i18n', 'locales', `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.profile) data.profile = {};
  
  for (const [key, val] of Object.entries(translations[lang])) {
    data.profile[key] = val;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${lang}.json`);
}
