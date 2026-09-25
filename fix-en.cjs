const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'i18n', 'locales', 'en.json');
let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// btd_ung subtitle
if (en.home && en.home.social_projects && en.home.social_projects.btd_ung) {
  en.home.social_projects.btd_ung.subtitle = "Low-threshold dance, mastery, and inclusion";
  en.home.social_projects.btd_ung.desc = en.home.social_projects.btd_ung.desc
    .replace("*lavterskeltilbud* (low-threshold access)", "low-threshold access space")
    .replace("*tilhørighet* (belonging)", "belonging")
    .replace("*mestring* (technical mastery)", "technical mastery");
}

if (en.home && en.home.social_projects && en.home.social_projects.btd_kvinne) {
  en.home.social_projects.btd_kvinne.subtitle = "Social meeting place, wellbeing, and confidence";
}

if (en.btd_ung && en.btd_ung.program_section && en.btd_ung.program_section.items) {
  en.btd_ung.program_section.items = en.btd_ung.program_section.items.map(item => {
    if (item.title) {
      item.title = item.title
        .replace(" (Lavterskeltilbud)", "")
        .replace(" (Mestring)", "")
        .replace(" (Tilhørighet)", "");
    }
    if (item.desc) {
      item.desc = item.desc
        .replace(" (lavterskeltilbud)", "")
        .replace(" (inkludering)", "")
        .replace(" (mestring)", "")
        .replace(" (tilhørighet)", "");
    }
    return item;
  });
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
