const fs = require('fs');

const heroContent = fs.readFileSync('src/components/HeroSequence.jsx', 'utf-8')
  .replace('const HeroSequence = () => {', 'const HeroSequence = () => {\n  const { t } = useTranslation();')
  .replace('O movimento encontra a', '{t("hero.subtitle1")}')
  .replace('Transformação.', '{t("hero.subtitle2")}')
  .replace('A dança e o movimento como ferramentas de expressão e bem-estar. A arte como caminho para a transformação social.', '{t("hero.desc")}')
  .replace('Explorar Workshops', '{t("hero.cta")}')
  .replace('Há lugares que não existem no mapa.', '{t("hero.seq1.p1")}')
  .replace('Só no corpo.', '{t("hero.seq1.p2")}')
  .replace('é uma organização social que nasceu para construir esses lugares. Espaços onde a dança não é somente performance, mas sobretudo é presença. Onde o movimento é mais que exercício ou alongamento, é escuta e expressão. Onde a arte não é um fim, mas o início de um encontro.', '{t("hero.seq2.p1")}')
  .replace('O encontro consigo mesmo e o encontro que acontece quando pessoas respiram e se movem no mesmo ritmo.', '{t("hero.seq2.p2")}')
  .replace('A mudança começa na pele, quando uma pessoa redescobre sua própria força, sua criatividade, sua própria voz. E, quando isso acontece em grupo, abre-se um caminho para a', '{t("hero.seq2.p3")}')
  .replace('>transformação social<', '>{t("hero.seq2.p4")}<')
  .replace('cria as condições para que as pessoas se encontrem.', '{t("hero.seq2.p6")}')
  .replace('A dança e o movimento fazem o resto.', '{t("hero.seq3")}');

fs.writeFileSync('src/components/HeroSequence.jsx', heroContent);

const actContent = fs.readFileSync('src/components/Activities.jsx', 'utf-8')
  .replace('const Activities = () => {', 'const Activities = () => {\n  const { t } = useTranslation();')
  .replace('O que fazemos', '{t("activities.kicker")}')
  .replace('Nossas Atividades', '{t("activities.title")}')
  .replace('Workshops de dança onde o movimento vira encontro. Ritmos que se cruzam, corpos que se escutam, uma coreografia que nasce do coletivo.', '{t("activities.card1.desc")}')
  .replace('Práticas de movimento consciente que ampliam a percepção, estimulam a reorganização corporal e transformam a maneira como habitamos o corpo.', '{t("activities.card2.desc")}')
  .replace('Projetos comunitários que atravessam ruas e bairros, tecendo laços, criando vínculos e Transformando.', '{t("activities.card3.desc")}')
  .replace('CONHEÇA NOSSA PROGRAMAÇÃO', '{t("activities.cta")}');

fs.writeFileSync('src/components/Activities.jsx', actContent);

const philContent = fs.readFileSync('src/components/Philosophy.jsx', 'utf-8')
  .replace('const Philosophy = () => {', 'const Philosophy = () => {\n  const { t } = useTranslation();')
  .replace('Movemos o corpo para', '{t("phil.line1.p1")}')
  .replace('>aproximar pessoas<', '>{t("phil.line1.p2")}<')
  .replace('Aproximamos pessoas para <br/>', '{t("phil.line2.p1")} <br/>')
  .replace('>transformar comunidades.<', '>{t("phil.line2.p2")}<');

fs.writeFileSync('src/components/Philosophy.jsx', philContent);

const protoContent = fs.readFileSync('src/components/Protocol.jsx', 'utf-8')
  .replace('const Protocol = () => {', 'const Protocol = () => {\n  const { t } = useTranslation();')
  .replace(/O ponto de partida/g, 'O ponto de partida_PLACEHOLDER')
  .replace(/Expressão/g, 'Expressão_PLACEHOLDER')
  .replace(/O corpo guarda o que a palavra não alcança. Nos workshops, o movimento torna-se linguagem — um espaço onde ritmo, presença e improvisação libertam o que estava contido./g, 'proto_desc1_PLACEHOLDER')
  
  .replace(/O que o movimento cura/g, 'O que o movimento cura_PLACEHOLDER')
  .replace(/Bem-estar/g, 'Bem-estar_PLACEHOLDER')
  .replace(/Escutar o corpo é um ato político. As práticas de movimento consciente ampliam a percepção, reorganizam padrões físicos e devolvem às pessoas a autoria sobre si mesmas./g, 'proto_desc2_PLACEHOLDER')
  
  .replace(/O que o corpo inventa/g, 'O que o corpo inventa_PLACEHOLDER')
  .replace(/Criação/g, 'Criação_PLACEHOLDER')
  .replace(/O movimento é matéria-prima. Da dança nasce a coreografia, do silêncio nasce o gesto, do encontro nasce a obra. A arte é o que acontece quando o corpo tem liberdade para se expressar./g, 'proto_desc3_PLACEHOLDER')
  
  .replace(/O que fica na comunidade/g, 'O que fica na comunidade_PLACEHOLDER')
  .replace(/Transformação/g, 'Transformação_PLACEHOLDER')
  .replace(/Quando pessoas se movem juntas, algo muda. A dança atravessa muros, cria vínculos e abre espaço para uma transformação que começa no corpo e reverbera no bairro, na rua, na cidade./g, 'proto_desc4_PLACEHOLDER');

let fixedProto = protoContent
  .replace(/'O ponto de partida_PLACEHOLDER'/g, 't("proto.1.kicker")')
  .replace(/'Expressão_PLACEHOLDER'/g, 't("proto.1.title")')
  .replace(/'proto_desc1_PLACEHOLDER'/g, 't("proto.1.desc")')
  
  .replace(/'O que o movimento cura_PLACEHOLDER'/g, 't("proto.2.kicker")')
  .replace(/'Bem-estar_PLACEHOLDER'/g, 't("proto.2.title")')
  .replace(/'proto_desc2_PLACEHOLDER'/g, 't("proto.2.desc")')
  
  .replace(/'O que o corpo inventa_PLACEHOLDER'/g, 't("proto.3.kicker")')
  .replace(/'Criação_PLACEHOLDER'/g, 't("proto.3.title")')
  .replace(/'proto_desc3_PLACEHOLDER'/g, 't("proto.3.desc")')
  
  .replace(/'O que fica na comunidade_PLACEHOLDER'/g, 't("proto.4.kicker")')
  .replace(/'Transformação_PLACEHOLDER'/g, 't("proto.4.title")')
  .replace(/'proto_desc4_PLACEHOLDER'/g, 't("proto.4.desc")');

fs.writeFileSync('src/components/Protocol.jsx', fixedProto);

const actionContent = fs.readFileSync('src/components/Action.jsx', 'utf-8')
  .replace('const Action = () => {', 'const Action = () => {\n  const { t } = useTranslation();')
  .replace('O próximo passo é simples', '{t("action.kicker")}')
  .replace('Venha se{\\\' \\\'}', '{t("action.title.p1")} {\\\' \\\'}')
  .replace('>mover.<', '>{t("action.title.p2")}<')
  .replace('Encontre um workshop, uma aula, o seu lugar. <br className="hidden sm:block" />O corpo sabe o caminho, basta começar.', '{t("action.desc").split(". ")[0] + "."} <br className="hidden sm:block" />{t("action.desc").split(". ")[1]}')
  .replace('Ver Programação', '{t("action.btn1")}')
  .replace('Quero apoiar o projeto', '{t("action.btn2")}');

fs.writeFileSync('src/components/Action.jsx', actionContent);

const footerContent = fs.readFileSync('src/components/Footer.jsx', 'utf-8')
  .replace('const Footer = () => {', 'const Footer = () => {\n  const { t } = useTranslation();')
  .replace('Transformando vidas através do movimento e da dança. Um projeto focado em expressão e bem-estar social.', '{t("footer.desc")}')
  .replace('>Impacto Social<', '>{t("footer.links.impact")}<')
  .replace('>Contato<', '>{t("footer.links.contact")}<')
  .replace('>Termos<', '>{t("footer.links.terms")}<')
  .replace('Todos os direitos reservados.', '{t("footer.rights")}');

fs.writeFileSync('src/components/Footer.jsx', footerContent);

console.log('Componentes traduzidos!');
