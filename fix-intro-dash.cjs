const fs = require('fs');

// Path to the translation files
const ptPath = 'src/i18n/locales/pt.json';
const enPath = 'src/i18n/locales/en.json';
const noPath = 'src/i18n/locales/no.json';

// PT
const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
pt.btd_kvinne.impact_section.intro = "Cada frente do projeto é desenhada para gerar transformação real, no corpo, nos vínculos e na comunidade.";
fs.writeFileSync(ptPath, JSON.stringify(pt, null, 2), 'utf8');

// EN
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
en.btd_kvinne.impact_section.intro = "Each facet of the project is designed to generate real transformation, in the body, in relationships, and in the community.";
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');

// NO
const no = JSON.parse(fs.readFileSync(noPath, 'utf8'));
no.btd_kvinne.impact_section.intro = "Hver del av prosjektet er utformet for å skape reell transformasjon, i kroppen, i relasjonene og i lokalsamfunnet.";
fs.writeFileSync(noPath, JSON.stringify(no, null, 2), 'utf8');

console.log('JSON files updated successfully, dashes removed in intro.');
