import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "dance2dance-734d1",
  appId: "1:786562848568:web:0dc8eaff3c9d5f1a7cd3cd",
  storageBucket: "dance2dance-734d1.firebasestorage.app",
  apiKey: "AIzaSyA6uLVdspOg9XH2kD54CI8xK50AtjYRTG0",
  authDomain: "dance2dance-734d1.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newTemplates = [
  // Lembrete 1 dia antes
  {
    id: "reminder_1_day_en",
    subject: "Reminder: {{workshopName}} is tomorrow!",
    body_html: `<div class="greeting">Hello {{userName}}.</div><p>This is a quick reminder that your workshop <strong>{{workshopName}}</strong> is happening tomorrow!</p><p style="margin-bottom: 5px;">date: {{workshopDate}}</p><p style="margin-top: 0;">time: {{workshopTime}}</p><p>Please arrive 10 to 15 minutes early.</p><p>Location:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>The Dance2Dance Team</strong></p>`,
    isActive: true
  },
  {
    id: "reminder_1_day_no",
    subject: "PǾminnelse: {{workshopName}} er i morgen!",
    body_html: `<div class="greeting">Hei {{userName}}.</div><p>Dette er en rask pǾminnelse om at din workshop <strong>{{workshopName}}</strong> er i morgen!</p><p style="margin-bottom: 5px;">dato: {{workshopDate}}</p><p style="margin-top: 0;">tid: {{workshopTime}}</p><p>Vennligst mt opp 10-15 minutter fr start.</p><p>Sted:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>Dance2Dance-teamet</strong></p>`,
    isActive: true
  },
  {
    id: "reminder_1_day_pt",
    subject: "Lembrete: {{workshopName}} Ǹ amanhǜ!",
    body_html: `<div class="greeting">Olǭ, {{userName}}.</div><p>Este Ǹ um rǭpido lembrete de que o seu workshop <strong>{{workshopName}}</strong> acontece amanhǜ!</p><p style="margin-bottom: 5px;">dia: {{workshopDate}}</p><p style="margin-top: 0;">hora: {{workshopTime}}</p><p>Por favor, chegue com 10 a 15 minutos de antecedǦncia.</p><p>Local:</p><div style="margin-top: 15px;"><span style="color: #C9A84C; margin-right: 4px;">&#9679;</span><a href="{{locationMapLink}}" target="_blank" style="color: #9A9A9A; text-decoration: underline;">{{locationName}}</a></div><div class="divider"></div><p><strong>Equipe Dance2Dance</strong></p>`,
    isActive: true
  },

  // Feedback pós evento
  {
    id: "post_event_feedback_en",
    subject: "How was {{workshopName}}?",
    body_html: `<div class="greeting">Hello {{userName}}.</div><p>Thank you for participating in <strong>{{workshopName}}</strong> yesterday!</p><p>We would love to hear about your experience. Your feedback helps us improve and continue offering high-quality workshops.</p><p>Please reply to this email and let us know what you thought.</p><div class="divider"></div><p><strong>The Dance2Dance Team</strong></p>`,
    isActive: true
  },
  {
    id: "post_event_feedback_no",
    subject: "Hvordan var {{workshopName}}?",
    body_html: `<div class="greeting">Hei {{userName}}.</div><p>Takk for at du deltok pǾ <strong>{{workshopName}}</strong> i gǾr!</p><p>Vi vil gjerne hre om din opplevelse. Din tilbakemelding hjelper oss Ǿ forbedre oss og fortsette Ǿ tilby workshops av hy kvalitet.</p><p>Vennligst svar pǾ denne e-posten og la oss fǾ vite hva du syntes.</p><div class="divider"></div><p><strong>Dance2Dance-teamet</strong></p>`,
    isActive: true
  },
  {
    id: "post_event_feedback_pt",
    subject: "Como foi o {{workshopName}}?",
    body_html: `<div class="greeting">Olǭ, {{userName}}.</div><p>Obrigado por participar do <strong>{{workshopName}}</strong> ontem!</p><p>Gostaramos muito de saber como foi a sua experiǦncia. O seu feedback nos ajuda a melhorar e a continuar oferecendo workshops de alta qualidade.</p><p>Por favor, responda a este e-mail e conte pra gente o que achou.</p><div class="divider"></div><p><strong>Equipe Dance2Dance</strong></p>`,
    isActive: true
  },

  // Inativo 90 dias
  {
    id: "inactive_90_days_en",
    subject: "We miss you at Dance2Dance",
    body_html: `<div class="greeting">Hello {{userName}}.</div><p>It's been a while since we last saw you at the studio!</p><p>We have new workshops and classes scheduled for the upcoming months. We would love to have you dance with us again.</p><p>Check out our schedule on the website and secure your spot.</p><div class="divider"></div><p><strong>The Dance2Dance Team</strong></p>`,
    isActive: true
  },
  {
    id: "inactive_90_days_no",
    subject: "Vi savner deg pǾ Dance2Dance",
    body_html: `<div class="greeting">Hei {{userName}}.</div><p>Det er en stund siden vi sǾ deg i studioet sist!</p><p>Vi har nye workshops og klasser planlagt for de kommende mǾnedene. Vi vil gjerne ha deg med oss Ǿ danse igjen.</p><p>Sjekk ut timeplanen pǾ nettsiden vǾr og sikre deg en plass.</p><div class="divider"></div><p><strong>Dance2Dance-teamet</strong></p>`,
    isActive: true
  },
  {
    id: "inactive_90_days_pt",
    subject: "Sentimos sua falta no Dance2Dance",
    body_html: `<div class="greeting">Olǭ, {{userName}}.</div><p>Jǭ faz um tempinho que nǜo te vemos no estdio!</p><p>Temos novos workshops e aulas programadas para os prximos meses. Gostaramos muito de danar com vocǦ novamente.</p><p>Confira a agenda no nosso site e garanta a sua vaga.</p><div class="divider"></div><p><strong>Equipe Dance2Dance</strong></p>`,
    isActive: true
  }
];

async function seed() {
  console.log("Seeding CRON templates...");
  for (const t of newTemplates) {
    await setDoc(doc(db, "crm_email_templates", t.id), t);
    console.log(`Saved ${t.id}`);
  }
  console.log("Done!");
  process.exit(0);
}

seed();
