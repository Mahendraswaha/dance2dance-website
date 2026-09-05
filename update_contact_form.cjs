const fs = require('fs');

// 1. Update ContactPage.jsx
let contactPage = fs.readFileSync('src/pages/ContactPage.jsx', 'utf8');

// Change default subject
contactPage = contactPage.replace(
  /subject: isExecutiveMeeting \? 'reuniao-executiva' : '',/,
  `subject: isExecutiveMeeting ? 'reuniao-executiva' : 'geral',`
);

// Update general option value
contactPage = contactPage.replace(
  /<option value="">\{t\('contactPage\.subjectGeneral', 'D.*?'\)\}<\/option>/,
  `<option value="geral">{t('contactPage.subjectGeneral', 'Dúvidas Gerais / Informações')}</option>`
);

// Make message required
contactPage = contactPage.replace(
  /\{t\('contactPage\.messageLabel', 'Mensagem \(Opcional\)'\)\}/,
  `{t('contactPage.messageLabel', 'Mensagem *')}`
);

// Add required attribute to textarea
contactPage = contactPage.replace(
  /<textarea\s+name="message"/,
  `<textarea\n                    required\n                    name="message"`
);

fs.writeFileSync('src/pages/ContactPage.jsx', contactPage, 'utf8');

// 2. Update locales
const locales = ['pt', 'en', 'no'];
locales.forEach(lang => {
  const filePath = `src/i18n/locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (lang === 'pt') {
    data.contactPage.messageLabel = "Mensagem *";
  } else if (lang === 'en') {
    data.contactPage.messageLabel = "Message *";
  } else if (lang === 'no') {
    data.contactPage.messageLabel = "Melding *";
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
});

console.log('ContactPage updated');
