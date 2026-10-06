const fs = require('fs');

function modifyJson(filePath, modifier) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  modifier(data);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// 1. PT Modifications
modifyJson('src/i18n/locales/pt.json', (data) => {
  const btd = data.btd_ung;
  btd.hook = 'Formar um indivíduo exige muito mais do que ocupar seu tempo. É preciso oferecer acesso a experiências que desenvolvam não só o domínio do corpo, mas também o equilíbrio emocional.';
  btd.body.p1 = btd.body.p1.replace('permitindo que cada indivíduo descubra e desenvolva o seu próprio potencial', 'permitindo que cada jovem encontre e expanda aquilo que é genuinamente seu');
  btd.cta.text = 'O Be the Dance Ung procura parcerias continuadas. Agende uma conversa e veja como nossa metodologia pode se tornar parte do propósito da sua instituição.';
});

// 2. EN Modifications
modifyJson('src/i18n/locales/en.json', (data) => {
  const btd = data.btd_ung;
  btd.hook = 'Shaping an individual requires far more than just occupying their time. It means providing access to experiences that develop not only bodily mastery, but also emotional balance.';
  btd.body.p1 = btd.body.p1.replace('allowing each individual to discover and develop their own potential', 'allowing each young person to find and expand what is genuinely theirs');
  btd.body.p2 = btd.body.p2.replace('embrace their uniqueness and express themselves without restraints', 'embrace who they are and move with complete freedom');
  btd.mentorText = "A sensitive and rigorous mentoring, deeply committed to awakening each student's autonomy and sense of agency.";
  btd.cta.text = "Be the Dance Ung seeks continuous partnerships. Schedule a conversation and discover how our methodology can become part of your institution's core purpose.";
});

// 3. NO Modifications
modifyJson('src/i18n/locales/no.json', (data) => {
  const btd = data.btd_ung;
  btd.hook = 'Å forme et individ krever mye mer enn å bare fylle tiden deres. Det handler om å gi tilgang til opplevelser som utvikler både kroppslig mestring og emosjonell balanse.';
  btd.body.p1 = btd.body.p1.replace('slik at hvert individ kan oppdage og utvikle sitt eget potensial', 'og lar hver enkelt ungdom finne og utvide det som genuint er deres eget');
  btd.impact_section.items[1].desc = btd.impact_section.items[1].desc.replace('oversettes til motstandskraft for å møte utfordringene og motgangene i samfunnets utvikling', 'bygger en indre motstandskraft som følger dem videre i møte med samfunnets utfordringer');
  btd.cta.text = 'Be the Dance Ung søker langsiktige partnerskap. Avtal en samtale og se hvordan vår metodikk kan bli en del av institusjonens formål.';
});

console.log('Successfully updated JSON files with editorial improvements.');
