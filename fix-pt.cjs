const fs = require('fs');
const path = require('path');

const ptPath = path.join(__dirname, 'src', 'i18n', 'locales', 'pt.json');
let pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

// btd_ung subtitle
if (pt.home && pt.home.social_projects && pt.home.social_projects.btd_ung) {
  pt.home.social_projects.btd_ung.subtitle = "Dança de fácil acesso, superação e inclusão";
  pt.home.social_projects.btd_ung.desc = pt.home.social_projects.btd_ung.desc
    .replace("*lavterskeltilbud* (acesso facilitado)", "espaço de acesso facilitado")
    .replace("*tilhørighet* (pertencimento)", "pertencimento")
    .replace("*mestring* (superação técnica)", "superação técnica");
}

if (pt.home && pt.home.social_projects && pt.home.social_projects.btd_kvinne) {
  pt.home.social_projects.btd_kvinne.subtitle = "Ponto de encontro social, bem-estar e autoconfiança";
}

if (pt.btd_ung && pt.btd_ung.program_section && pt.btd_ung.program_section.items) {
  pt.btd_ung.program_section.items = pt.btd_ung.program_section.items.map(item => {
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

fs.writeFileSync(ptPath, JSON.stringify(pt, null, 2), 'utf8');
