const fs = require('fs');

const langs = ['pt', 'en', 'no'];

langs.forEach(lang => {
  let file = `src/i18n/locales/${lang}.json`;
  let content = fs.readFileSync(file, 'utf8');
  let json = JSON.parse(content);
  
  if (lang === 'pt') {
    if (json.agendaPage) {
      json.agendaPage.waitlist = "Lista de Espera";
      json.agendaPage.fullSpots = "Vagas esgotadas";
    }
  } else if (lang === 'en') {
    if (json.agendaPage) {
      json.agendaPage.fullSpots = "Fully booked";
    }
  } else if (lang === 'no') {
    if (json.agendaPage) {
      json.agendaPage.fullSpots = "Fullbooket";
    }
  }
  
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
});
console.log('Updated translations');
