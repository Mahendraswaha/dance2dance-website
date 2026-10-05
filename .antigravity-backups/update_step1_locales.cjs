const fs = require('fs');

// Load locales
const ptPath = 'src/i18n/locales/pt.json';
const enPath = 'src/i18n/locales/en.json';
const noPath = 'src/i18n/locales/no.json';

const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const no = JSON.parse(fs.readFileSync(noPath, 'utf8'));

// 1. Curriculum Paragraph 4 update
pt.cv.paragraphs[3] = "Essa investigação expandiu-se em diversas direções. Atuei nos bastidores como assistente de coreografia no Teatro Castro Alves, na Bahia. Formei-me em Letras pela UFRGS, aprofundando o diálogo com a literatura. Tornei-me instrutora de Gyrotonic e educadora pelo Teatro Escola Brincante. Trabalhei em diferentes projetos sociais. Em 2007, cofundei a Porto Alegre Cia de Dança, assumindo a direção artística.";

en.cv.paragraphs[3] = "This exploration broadened across several fields. I worked backstage as an assistant choreographer at Teatro Castro Alves in Bahia. I earned a degree in Literature from UFRGS, deepening my connection with language. I became a certified Gyrotonic trainer and an educator through Teatro Escola Brincante. I worked on various social projects. In 2007, I co-founded Porto Alegre Cia de Dança, taking on its artistic direction.";

no.cv.paragraphs[3] = "Denne utforskningen utvidet seg på flere felt. Jeg arbeidet bak scenen som assistentkoreograf ved Teatro Castro Alves i Bahia. Jeg tok en grad i litteratur ved UFRGS og fordypet dialogen med språket. Jeg ble sertifisert Gyrotonic-instruktør og pedagog ved Teatro Escola Brincante. Jeg arbeidet med ulike sosiale prosjekter. I 2007 var jeg med på å grunnlegge Porto Alegre Cia de Dança, og overtok den kunstneriske ledelsen.";

// 2. Curriculum Paragraph 6 (translation of revised Portuguese version to EN and NO)
const formattedBrand = 'Dance<span class="text-accent text-[1.28em] font-normal">2</span>Dance';

pt.cv.paragraphs[5] = `Atualmente na Noruega, busco atuar como uma ponte artística com o Brasil. Dessa travessia nasce ${formattedBrand}, projeto central que sintetiza décadas de pesquisa corporal, experiência pedagógica e investigação sobre a relação entre técnica, presença e expressão. Sediada na Noruega, a iniciativa é um espaço de encontro e transformação, voltada tanto para bailarinos e artistas quanto para pessoas que desejam aprofundar a relação com o próprio corpo.`;

en.cv.paragraphs[5] = `Currently living in Norway, I act as an artistic bridge with Brazil. From this crossing, ${formattedBrand} was born, a central project that synthesizes decades of bodily research, pedagogical experience, and investigation into the relationship between technique, presence, and expression. Based in Norway, the initiative is a space for meeting and transformation, dedicated both to dancers and artists as well as anyone seeking to deepen their relationship with their own body.`;

no.cv.paragraphs[5] = `Nå med base i Norge jobber jeg som en kunstnerisk bro til Brasil. Fra denne kryssingen oppsto ${formattedBrand}, et sentralt prosjekt som samler tiår med kroppsforskning, pedagogisk erfaring og undersøkelser av forholdet mellom teknikk, tilstedeværelse og uttrykk. Med base i Norge er initiativet en møteplass og en arena for transformasjon, rettet både mot dansere og kunstnere, så vel som alle som ønsker å fordype forholdet til sin egen kropp.`;

// 3. Update auth in locales
// PT
pt.auth.birthDateLabel = "Data de Nascimento *";
pt.auth.birthDatePlaceholder = "DD/MM/AAAA";
pt.auth.experienceLabel = "Experiência prévia com dança ou trabalho corporal?";
pt.auth.profileTitle = "Meu Perfil";
pt.auth.profileSubtitle = "Mantenha seus dados cadastrais atualizados.";
pt.auth.saveProfile = "Salvar Alterações";
pt.auth.savingProfile = "Salvando...";
pt.auth.profileSuccess = "Cadastro atualizado com sucesso!";
pt.auth.profileError = "Erro ao atualizar cadastro. Tente novamente.";
pt.auth.readOnlyEmail = "O e-mail não pode ser alterado diretamente.";

// EN
en.auth.birthDateLabel = "Date of Birth *";
en.auth.birthDatePlaceholder = "YYYY-MM-DD";
en.auth.experienceLabel = "Previous experience with dance or bodywork?";
en.auth.profileTitle = "My Profile";
en.auth.profileSubtitle = "Keep your registration details up to date.";
en.auth.saveProfile = "Save Changes";
en.auth.savingProfile = "Saving...";
en.auth.profileSuccess = "Profile updated successfully!";
en.auth.profileError = "Failed to update profile. Please try again.";
en.auth.readOnlyEmail = "Email address cannot be changed directly.";

// NO
no.auth.birthDateLabel = "Fødselsdato *";
no.auth.birthDatePlaceholder = "ÅÅÅÅ-MM-DD";
no.auth.experienceLabel = "Tidligere erfaring med dans eller kroppsarbeid?";
no.auth.profileTitle = "Min Profil";
no.auth.profileSubtitle = "Hold registreringsopplysningene dine oppdatert.";
no.auth.saveProfile = "Lagre Endringer";
no.auth.savingProfile = "Lagrer...";
no.auth.profileSuccess = "Profilen ble oppdatert!";
no.auth.profileError = "Kunne ikke oppdatere profilen. Vennligst prøv igjen.";
no.auth.readOnlyEmail = "E-postadressen kan ikke endres direkte.";

// 4. Update nav in locales
pt.nav.editProfile = "Editar Cadastro";
pt.nav.myProfile = "Meu Perfil";

en.nav.editProfile = "Edit Profile";
en.nav.myProfile = "My Profile";

no.nav.editProfile = "Rediger Profil";
no.nav.myProfile = "Min Profil";

// 5. Update adminPage.studentsModal in locales
if (!pt.adminPage.studentsModal) pt.adminPage.studentsModal = {};
if (!en.adminPage.studentsModal) en.adminPage.studentsModal = {};
if (!no.adminPage.studentsModal) no.adminPage.studentsModal = {};

pt.adminPage.studentsModal.simpleView = "Simplificada";
pt.adminPage.studentsModal.completeView = "Completa";
pt.adminPage.studentsModal.birthDateAndAge = "Nascimento / Idade";
pt.adminPage.studentsModal.yearsOld = "anos";
pt.adminPage.studentsModal.address = "Endereço";
pt.adminPage.studentsModal.experience = "Experiência";
pt.adminPage.studentsModal.restrictions = "Restrições";
pt.adminPage.studentsModal.notInformed = "Não informado";
pt.adminPage.studentsModal.none = "Nenhuma";
pt.adminPage.studentsModal.exportCompleteCsv = "Exportar Completo (CSV)";

en.adminPage.studentsModal.simpleView = "Simplified";
en.adminPage.studentsModal.completeView = "Complete";
en.adminPage.studentsModal.birthDateAndAge = "Birth / Age";
en.adminPage.studentsModal.yearsOld = "years old";
en.adminPage.studentsModal.address = "Address";
en.adminPage.studentsModal.experience = "Experience";
en.adminPage.studentsModal.restrictions = "Restrictions";
en.adminPage.studentsModal.notInformed = "Not specified";
en.adminPage.studentsModal.none = "None";
en.adminPage.studentsModal.exportCompleteCsv = "Export Full CSV";

no.adminPage.studentsModal.simpleView = "Forenklet";
no.adminPage.studentsModal.completeView = "Fullstendig";
no.adminPage.studentsModal.birthDateAndAge = "Fødsel / Alder";
no.adminPage.studentsModal.yearsOld = "år";
no.adminPage.studentsModal.address = "Adresse";
no.adminPage.studentsModal.experience = "Erfaring";
no.adminPage.studentsModal.restrictions = "Begrensninger";
no.adminPage.studentsModal.notInformed = "Ikke oppgitt";
no.adminPage.studentsModal.none = "Ingen";
no.adminPage.studentsModal.exportCompleteCsv = "Eksporter Fullstendig (CSV)";

// Save files
fs.writeFileSync(ptPath, JSON.stringify(pt, null, 2) + '\n', 'utf8');
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf8');
fs.writeFileSync(noPath, JSON.stringify(no, null, 2) + '\n', 'utf8');

console.log('Locales updated successfully');
