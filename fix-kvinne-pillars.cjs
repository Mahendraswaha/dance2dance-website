const fs = require('fs');

const ptPath = 'src/i18n/locales/pt.json';
const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

pt.btd_kvinne.impact_section.items[0].desc = "A integração de práticas somáticas contribui para reduzir o estresse e recuperar a autonomia sobre o próprio corpo. Ao reconhecer suas próprias necessidades e romper com padrões de controle, as mulheres fortalecem a resiliência, a clareza mental e a capacidade de fazer escolhas mais livres e conscientes.";
pt.btd_kvinne.impact_section.items[1].desc = "A dança fala onde as palavras não alcançam. Criamos um espaço de pertencimento e conexão, onde mulheres de diferentes trajetórias podem se expressar, compartilhar experiências e construir laços autênticos, fortalecendo vínculos e ampliando o sentido de comunidade.";
pt.btd_kvinne.impact_section.items[2].desc = "O bem-estar feminino é um alicerce para a saúde familiar e comunitária. Uma mulher fortalecida leva essa estabilidade para suas relações, seus filhos e seu entorno, criando novas possibilidades de cuidado, autonomia e transformação que podem se multiplicar ao longo das gerações.";

fs.writeFileSync(ptPath, JSON.stringify(pt, null, 2), 'utf8');

const enPath = 'src/i18n/locales/en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

en.btd_kvinne.impact_section.items[0].desc = "The integration of somatic practices helps reduce stress and reclaim autonomy over the body. By recognizing their own needs and breaking free from patterns of control, women strengthen their resilience, mental clarity, and the capacity to make freer, more conscious choices.";
en.btd_kvinne.impact_section.items[1].desc = "Dance speaks where words cannot. We create a space of belonging and connection, where women from different walks of life can express themselves, share experiences, and build authentic bonds, strengthening ties and expanding the sense of community.";
en.btd_kvinne.impact_section.items[2].desc = "Women's well-being is a foundation for family and community health. A strengthened woman brings this stability to her relationships, her children, and her surroundings, creating new possibilities for care, autonomy, and transformation that can multiply across generations.";

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');

const noPath = 'src/i18n/locales/no.json';
const no = JSON.parse(fs.readFileSync(noPath, 'utf8'));

no.btd_kvinne.impact_section.items[0].desc = "Integreringen av somatisk praksis bidrar til å redusere stress og ta tilbake autonomien over egen kropp. Ved å anerkjenne egne behov og bryte med kontrollmønstre, styrker kvinnene sin robusthet, mentale klarhet og evne til å ta friere og mer bevisste valg.";
no.btd_kvinne.impact_section.items[1].desc = "Dansen taler der ord ikke strekker til. Vi skaper et rom for tilhørighet og forbindelse, der kvinner med ulik bakgrunn kan uttrykke seg, dele erfaringer og bygge autentiske bånd, noe som styrker relasjoner og utvider fellesskapsfølelsen.";
no.btd_kvinne.impact_section.items[2].desc = "Kvinners velvære er en grunnmur for familiens og samfunnets helse. En styrket kvinne bringer denne stabiliteten til sine relasjoner, sine barn og sine omgivelser, og skaper nye muligheter for omsorg, autonomi og transformasjon som kan formere seg gjennom generasjoner.";

fs.writeFileSync(noPath, JSON.stringify(no, null, 2), 'utf8');

console.log('JSON files updated with new pillars.');
