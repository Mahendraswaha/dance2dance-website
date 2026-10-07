const fs = require('fs');

const ptPath = 'src/i18n/locales/pt.json';
const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

pt.btd_kvinne.impact_section.intro = "Cada frente do projeto é desenhada para gerar transformação real — no corpo, nos vínculos e na comunidade.";
pt.btd_kvinne.program_section.items[2].list[2].desc = pt.btd_kvinne.program_section.items[2].list[2].desc.replace("criando um ecossistema", "e cria um espaço vivo");
pt.btd_kvinne.body.p3 = pt.btd_kvinne.body.p3.replace("tornando-se potenciais agentes multiplicadoras de bem-estar e saúde integrativa em suas famílias, redes e comunidades.", "para suas famílias, redes e comunidades.");
pt.btd_kvinne.body.p3 = pt.btd_kvinne.body.p3.replace("levam consigo novas ferramentas", "levam novas ferramentas");
pt.btd_kvinne.impact_section.items[1].desc = "A dança fala onde as palavras não alcançam. Criamos um espaço de pertencimento onde mulheres de diferentes trajetórias constroem laços autênticos.";

fs.writeFileSync(ptPath, JSON.stringify(pt, null, 2), 'utf8');

const enPath = 'src/i18n/locales/en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

en.btd_kvinne.impact_section.intro = "Each facet of the project is designed to generate real transformation—in the body, in relationships, and in the community.";
en.btd_kvinne.program_section.items[2].list[2].desc = en.btd_kvinne.program_section.items[2].list[2].desc.replace("creating an ecosystem", "creating a living space");
en.btd_kvinne.body.p2 = en.btd_kvinne.body.p2.replace("sensitization", "heightened awareness");
en.btd_kvinne.body.p3 = en.btd_kvinne.body.p3.replace("becoming potential multiplier agents of well-being and integrative health in their families, networks, and communities.", "to their families, networks, and communities.");
en.btd_kvinne.body.p3 = en.btd_kvinne.body.p3.replace("carry with them new tools", "carry new tools");
en.btd_kvinne.impact_section.items[1].desc = "Dance speaks where words cannot. We create a space of belonging where women from different walks of life build authentic bonds.";
en.btd_kvinne.mentorText = "A safe space where each woman is encouraged to find her own movement and rediscover the pleasure of being present in her own body.";

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');

const noPath = 'src/i18n/locales/no.json';
const no = JSON.parse(fs.readFileSync(noPath, 'utf8'));

no.btd_kvinne.impact_section.intro = "Hver del av prosjektet er utformet for å skape reell transformasjon – i kroppen, i relasjonene og i lokalsamfunnet.";
no.btd_kvinne.program_section.items[2].list[2].desc = no.btd_kvinne.program_section.items[2].list[2].desc.replace("skaper et økosystem", "skaper et levende rom");
no.btd_kvinne.body.p3 = no.btd_kvinne.body.p3.replace("og blir potensielle multiplikatorer for velvære og integrativ helse i sine familier, nettverk og lokalsamfunn.", "tilbake til sine familier, nettverk og lokalsamfunn.");
no.btd_kvinne.impact_section.items[1].desc = "Dansen taler der ord ikke strekker til. Vi skaper et rom for tilhørighet der kvinner med ulik bakgrunn bygger autentiske bånd.";

fs.writeFileSync(noPath, JSON.stringify(no, null, 2), 'utf8');

console.log('JSON files updated with editorial fixes.');
