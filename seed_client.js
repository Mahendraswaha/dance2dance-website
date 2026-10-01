import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'dance2dance-734d1',
  appId: '1:786562848568:web:0dc8eaff3c9d5f1a7cd3cd',
  storageBucket: 'dance2dance-734d1.firebasestorage.app',
  apiKey: 'AIzaSyA6uLVdspOg9XH2kD54CI8xK50AtjYRTG0',
  authDomain: 'dance2dance-734d1.firebaseapp.com'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const templates = [
  // 1. ENROLLMENT CONFIRMED
  {
    id: "enrollment_confirmed_en",
    subject: "Registration confirmed: {{workshopName}}",
    body_html: `<div class="greeting">Hello {{userName}}.</div><p>Your registration is confirmed:</p><p style="margin-bottom: 5px;">workshop: <a href="{{workshopLink}}" style="color: #C9A84C; text-decoration: none;"><strong>{{workshopName}}</strong></a></p><p style="margin-top: 0; margin-bottom: 5px;">date: {{workshopDate}}</p><p style="margin-top: 0;">time: {{workshopTime}}</p><p>Since our spots are limited and based on a solidarity model, we rely on everyone's support to keep access open.</p><p>If your plans have changed and you can no longer attend, please cancel your registration directly on the scheduling page as soon as possible. This ensures the next participant in line gets a chance to join.</p><p>Please arrive 10 to 15 minutes early.</p><p>Location:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>The Dance2Dance Team</strong></p>`,
    isActive: true
  },
  {
    id: "enrollment_confirmed_no",
    subject: "Bekreftet påmelding: {{workshopName}}",
    body_html: `<div class="greeting">Hei {{userName}}.</div><p>Din påmelding er bekreftet:</p><p style="margin-bottom: 5px;">workshop: <a href="{{workshopLink}}" style="color: #C9A84C; text-decoration: none;"><strong>{{workshopName}}</strong></a></p><p style="margin-top: 0; margin-bottom: 5px;">dato: {{workshopDate}}</p><p style="margin-top: 0;">tid: {{workshopTime}}</p><p>Ettersom plassene våre er begrensede og er basert på en solidaritetsmodell, er vi avhengige av alles støtte for å holde tilgangen åpen.</p><p>Hvis planene dine har endret seg og du ikke lenger kan delta, ber vi deg avbestille påmeldingen direkte i kalenderen så snart som mulig. Slik får neste deltaker på listen muligheten til å bli med.</p><p>Vennligst møt opp 10-15 minutter før start.</p><p>Sted:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>Dance2Dance-teamet</strong></p>`,
    isActive: true
  },
  {
    id: "enrollment_confirmed_pt",
    subject: "Inscrição confirmada: {{workshopName}}",
    body_html: `<div class="greeting">Olá {{userName}}.</div><p>Sua inscrição está confirmada:</p><p style="margin-bottom: 5px;">workshop: <a href="{{workshopLink}}" style="color: #C9A84C; text-decoration: none;"><strong>{{workshopName}}</strong></a></p><p style="margin-top: 0; margin-bottom: 5px;">dia: {{workshopDate}}</p><p style="margin-top: 0;">hora: {{workshopTime}}</p><p>Como nossas vagas são limitadas e baseadas em um modelo de solidariedade, contamos com o apoio de todos para manter o acesso aberto.</p><p>Se os seus planos mudaram e você não puder mais participar, pedimos que cancele sua inscrição diretamente na nossa agenda o quanto antes. Assim, o próximo participante da lista de espera terá a chance de entrar.</p><p>Por favor, chegue com 10 a 15 minutos de antecedência.</p><p>Local:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>Equipe Dance2Dance</strong></p>`,
    isActive: true
  },

  // 2. WAITLIST JOINED
  {
    id: "waitlist_joined_en",
    subject: "Waitlist Confirmation: {{workshopName}}",
    body_html: `<div class="greeting">Hello {{userName}}.</div><p>You are now on the waitlist:</p><p style="margin-bottom: 5px;">workshop: <a href="{{workshopLink}}" style="color: #C9A84C; text-decoration: none;"><strong>{{workshopName}}</strong></a></p><p style="margin-top: 0; margin-bottom: 5px;">date: {{workshopDate}}</p><p style="margin-top: 0;">time: {{workshopTime}}</p><p>Since our spots are limited and based on a solidarity model, the waitlist is constantly moving.</p><p>As soon as a spot opens up for you, we will let you know immediately via this email!</p><p>Location:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>The Dance2Dance Team</strong></p>`,
    isActive: true
  },
  {
    id: "waitlist_joined_no",
    subject: "Ventelistebekreftelse: {{workshopName}}",
    body_html: `<div class="greeting">Hei {{userName}}.</div><p>Du står nå på ventelisten:</p><p style="margin-bottom: 5px;">workshop: <a href="{{workshopLink}}" style="color: #C9A84C; text-decoration: none;"><strong>{{workshopName}}</strong></a></p><p style="margin-top: 0; margin-bottom: 5px;">dato: {{workshopDate}}</p><p style="margin-top: 0;">tid: {{workshopTime}}</p><p>Siden plassene våre er begrensede og basert på en solidaritetsmodell, er ventelisten i stadig bevegelse.</p><p>Så snart en plass åpner seg for deg, vil vi gi deg beskjed umiddelbart via e-post!</p><p>Sted:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>Team Dance2Dance</strong></p>`,
    isActive: true
  },
  {
    id: "waitlist_joined_pt",
    subject: "Confirmação de Lista de Espera: {{workshopName}}",
    body_html: `<div class="greeting">Olá, {{userName}}.</div><p>Você entrou na lista de espera:</p><p style="margin-bottom: 5px;">workshop: <a href="{{workshopLink}}" style="color: #C9A84C; text-decoration: none;"><strong>{{workshopName}}</strong></a></p><p style="margin-top: 0; margin-bottom: 5px;">dia: {{workshopDate}}</p><p style="margin-top: 0;">hora: {{workshopTime}}</p><p>Como nossas vagas são limitadas e baseadas em um modelo de solidariedade, a lista de espera é constante.</p><p>Assim que houver uma desistência e uma vaga for liberada para você, nós te avisaremos imediatamente por este e-mail!</p><p>Local:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>Equipe Dance2Dance</strong></p>`,
    isActive: true
  },

  // 3. WAITLIST PROMOTED
  {
    id: "waitlist_promoted_en",
    subject: "A spot has opened up for you: {{workshopName}}",
    body_html: `<div class="greeting">Hello {{userName}}.</div><p>The waitlist has moved and your spot has been confirmed:</p><p style="margin-bottom: 5px;">workshop: <a href="{{workshopLink}}" style="color: #C9A84C; text-decoration: none;"><strong>{{workshopName}}</strong></a></p><p style="margin-top: 0; margin-bottom: 5px;">date: {{workshopDate}}</p><p style="margin-top: 0;">time: {{workshopTime}}</p><p>Since our spots are limited and based on a solidarity model, we rely on everyone's support to keep access open.</p><p>If your plans have changed and you can no longer attend, please cancel your registration directly on the scheduling page as soon as possible. This ensures the next participant in line gets a chance to join.</p><p>Please arrive 10 to 15 minutes early.</p><p>Location:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>The Dance2Dance Team</strong></p>`,
    isActive: true
  },
  {
    id: "waitlist_promoted_no",
    subject: "En plass har blitt ledig for deg: {{workshopName}}",
    body_html: `<div class="greeting">Hei {{userName}}.</div><p>Ventelisten har flyttet seg, og din plass er bekreftet:</p><p style="margin-bottom: 5px;">workshop: <a href="{{workshopLink}}" style="color: #C9A84C; text-decoration: none;"><strong>{{workshopName}}</strong></a></p><p style="margin-top: 0; margin-bottom: 5px;">dato: {{workshopDate}}</p><p style="margin-top: 0;">tid: {{workshopTime}}</p><p>Ettersom plassene våre er begrensede og er basert på en solidaritetsmodell, er vi avhengige av alles støtte for å holde tilgangen åpen.</p><p>Hvis planene dine har endret seg og du ikke lenger kan delta, ber vi deg avbestille påmeldingen direkte i kalenderen så snart som mulig. Slik får neste deltaker på listen muligheten til å bli med.</p><p>Vennligst møt opp 10-15 minutter før start.</p><p>Sted:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>Dance2Dance-teamet</strong></p>`,
    isActive: true
  },
  {
    id: "waitlist_promoted_pt",
    subject: "Uma vaga foi liberada para você: {{workshopName}}",
    body_html: `<div class="greeting">Olá, {{userName}}.</div><p>A lista de espera girou e sua vaga foi confirmada:</p><p style="margin-bottom: 5px;">workshop: <a href="{{workshopLink}}" style="color: #C9A84C; text-decoration: none;"><strong>{{workshopName}}</strong></a></p><p style="margin-top: 0; margin-bottom: 5px;">dia: {{workshopDate}}</p><p style="margin-top: 0;">hora: {{workshopTime}}</p><p>Como nossas vagas são limitadas e baseadas em um modelo de solidariedade, contamos com o apoio de todos para manter o acesso aberto.</p><p>Se os seus planos mudaram e você não puder mais participar, pedimos que cancele sua inscrição diretamente na nossa agenda o quanto antes. Assim, o próximo participante da lista também terá a chance de ser chamado.</p><p>Por favor, chegue com 10 a 15 minutos de antecedência.</p><p>Local:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>Equipe Dance2Dance</strong></p>`,
    isActive: true
  },

  // 4. CONTACT RECEIVED
  {
    id: "contact_received_en",
    subject: "Dance2Dance - We've received your message!",
    body_html: `<div class="greeting">Hello, {{userName}}!</div><p>Thank you for reaching out to Dance2Dance!</p><p>We have received your inquiry regarding <strong>{{subject}}</strong> and our team will get back to you shortly.</p><div class="divider"></div><p><strong>The Dance2Dance Team</strong></p>`,
    isActive: true
  },
  {
    id: "contact_received_no",
    subject: "Dance2Dance - Vi har mottatt din henvendelse!",
    body_html: `<div class="greeting">Hei, {{userName}}!</div><p>Takk for at du kontakter Dance2Dance!</p><p>Vi har mottatt din henvendelse angående <strong>{{subject}}</strong>, og vårt team vil svare deg så snart som mulig.</p><div class="divider"></div><p><strong>Dance2Dance-teamet</strong></p>`,
    isActive: true
  },
  {
    id: "contact_received_pt",
    subject: "Dance2Dance - Recebemos sua mensagem!",
    body_html: `<div class="greeting">Olá, {{userName}}!</div><p>Obrigado por entrar em contato com o Dance2Dance!</p><p>Recebemos com sucesso sua mensagem sobre <strong>{{subject}}</strong> e nossa equipe responderá em breve.</p><div class="divider"></div><p><strong>Equipe Dance2Dance</strong></p>`,
    isActive: true
  }
];

async function seed() {
  console.log("Seeding using Client SDK...");
  const batch = writeBatch(db);

  for (const t of templates) {
    const docRef = doc(db, 'crm_email_templates', t.id);
    batch.set(docRef, t);
  }

  await batch.commit();
  console.log("✅ All templates seeded successfully!");
  process.exit(0);
}

seed().catch(console.error);
