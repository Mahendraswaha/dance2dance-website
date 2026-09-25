const fs = require('fs');
const path = require('path');

function processFile(filename, isPt) {
  const filepath = path.join(__dirname, 'src', 'i18n', 'locales', filename);
  let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));

  if (data.social_page_b2b && data.social_page_b2b.projects) {
    if (data.social_page_b2b.projects.youth) {
      data.social_page_b2b.projects.youth.subtitle = isPt 
        ? "Dança de fácil acesso, superação e inclusão" 
        : "Low-threshold dance, mastery, and inclusion";
      
      data.social_page_b2b.projects.youth.desc = data.social_page_b2b.projects.youth.desc
        .replace("*lavterskeltilbud* (acesso facilitado)", "espaço de acesso facilitado")
        .replace("*tilhørighet* (pertencimento)", "pertencimento")
        .replace("*mestring* (superação técnica)", "superação técnica")
        .replace("*lavterskeltilbud* (low-threshold access)", "low-threshold access space")
        .replace("*tilhørighet* (belonging)", "belonging")
        .replace("*mestring* (technical mastery)", "technical mastery");
    }
    
    if (data.social_page_b2b.projects.women) {
      data.social_page_b2b.projects.women.subtitle = isPt
        ? "Ponto de encontro social, bem-estar e autoconfiança"
        : "Social meeting place, wellbeing, and confidence";
    }
  }

  if (data.btd_ung && data.btd_ung.impact_section && data.btd_ung.impact_section.items) {
    data.btd_ung.impact_section.items = data.btd_ung.impact_section.items.map(item => {
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

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

processFile('pt.json', true);
processFile('en.json', false);

console.log("Updated JSON files successfully.");
