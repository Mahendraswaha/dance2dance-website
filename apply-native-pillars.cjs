const fs = require('fs');

const enPath = 'src/i18n/locales/en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

en.btd_kvinne.impact_section.items[0].desc = "Somatic practices help reduce stress and reclaim autonomy over one's own body. By recognizing their own needs and breaking free from patterns of control, women strengthen their resilience, mental clarity, and the ability to make freer, more conscious choices.";
en.btd_kvinne.impact_section.items[1].desc = "Dance speaks where words cannot. We create a space of belonging and connection, where women from different walks of life can express themselves, share experiences, and build authentic bonds. This strengthens ties and deepens the sense of community.";
en.btd_kvinne.impact_section.items[2].desc = "Women's well-being is a foundation for family and community health. A strengthened woman brings this stability to her relationships, her children, and her surroundings, creating new possibilities for care, autonomy, and transformation that ripple across generations.";

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');

const noPath = 'src/i18n/locales/no.json';
const no = JSON.parse(fs.readFileSync(noPath, 'utf8'));

no.btd_kvinne.impact_section.items[0].desc = "Somatisk praksis bidrar til å redusere stress og ta tilbake autonomien over egen kropp. Ved å anerkjenne egne behov og bryte med kontrollmønstre, styrker kvinnene sin robusthet, mentale klarhet og evne til å ta friere og mer bevisste valg.";
no.btd_kvinne.impact_section.items[1].desc = "Dansen taler der ord ikke strekker til. Vi skaper et rom for tilhørighet og forbindelse, der kvinner med ulik bakgrunn kan uttrykke seg, dele erfaringer og bygge autentiske bånd. Dette styrker relasjoner og fordyper fellesskapsfølelsen.";
no.btd_kvinne.impact_section.items[2].desc = "Kvinners velvære er en grunnmur for familiens og samfunnets helse. En styrket kvinne bringer denne stabiliteten til sine relasjoner, sine barn og sine omgivelser, og skaper nye muligheter for omsorg, autonomi og transformasjon som brer seg videre gjennom generasjoner.";

fs.writeFileSync(noPath, JSON.stringify(no, null, 2), 'utf8');

console.log('JSON files updated with final native translations (no dashes).');
