import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = { projectId: 'dance2dance-734d1', appId: '1:786562848568:web:0dc8eaff3c9d5f1a7cd3cd', storageBucket: 'dance2dance-734d1.firebasestorage.app', apiKey: 'AIzaSyA6uLVdspOg9XH2kD54CI8xK50AtjYRTG0', authDomain: 'dance2dance-734d1.firebaseapp.com' };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const translations = {
  "enrollment_confirmed": {
    en: {
      subject: "Registration confirmed: {{workshopName}}",
      body_html: "<p>Hello {{userName}}.</p><p>We are thrilled to have you with us!<br>We confirm your registration for the workshop:</p><p>workshop: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{workshopLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><strong><u>{{workshopName}}</u></strong></a></p><p>date: {{workshopDate}}</p><p>time: {{workshopTime}}</p><p>Location: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{locationMapLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><u>{{locationName}}</u></a></p><p>We look forward to sharing this moment with you and hope it will be an inspiring experience full of great connections.</p><p>If your plans change and you cannot attend, we kindly ask you to cancel your registration on the schedule as soon as possible. This allows us to offer the spot to someone else.</p><p>Please arrive 10 minutes early to have time to prepare.</p><p>See you soon!</p><p></p><p><strong>The Dance2Dance Team</strong></p>"
    },
    no: {
      subject: "Påmelding bekreftet: {{workshopName}}",
      body_html: "<p>Hei {{userName}}.</p><p>Vi er veldig glade for å ha deg med oss!<br>Vi bekrefter din påmelding til workshop:</p><p>workshop: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{workshopLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><strong><u>{{workshopName}}</u></strong></a></p><p>dato: {{workshopDate}}</p><p>tid: {{workshopTime}}</p><p>Sted: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{locationMapLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><u>{{locationName}}</u></a></p><p>Vi gleder oss til å dele dette øyeblikket med deg og håper det blir en inspirerende opplevelse full av gode forbindelser.</p><p>Hvis planene dine endres og du ikke kan delta, ber vi deg vennligst om å avbestille påmeldingen din i timeplanen så snart som mulig. På denne måten kan vi frigjøre plassen til en annen.</p><p>Vennligst møt opp 10 minutter før for å få tid til å forberede deg.</p><p>Vi sees snart!</p><p></p><p><strong>Dance2Dance-teamet</strong></p>"
    }
  },
  "waitlist_joined": {
    en: {
      subject: "Waitlist confirmation: {{workshopName}}",
      body_html: "<p>Hello {{userName}}.</p><p>You are on the waitlist:</p><p>workshop: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{workshopLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><strong><u>{{workshopName}}</u></strong></a></p><p>date: {{workshopDate}}</p><p>time: {{workshopTime}}</p><p>Location: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{locationMapLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><u>{{locationName}}</u></a></p><p>We are monitoring cancellations. <strong>As soon as a spot opens up, we will contact you by email.</strong> We hope to see you soon.</p><p></p><p><strong>The Dance2Dance Team</strong></p>"
    },
    no: {
      subject: "Venteliste bekreftelse: {{workshopName}}",
      body_html: "<p>Hei {{userName}}.</p><p>Du er satt på ventelisten:</p><p>workshop: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{workshopLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><strong><u>{{workshopName}}</u></strong></a></p><p>dato: {{workshopDate}}</p><p>tid: {{workshopTime}}</p><p>Sted: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{locationMapLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><u>{{locationName}}</u></a></p><p>Vi følger med på avbestillinger. <strong>Så snart en plass blir ledig, kontakter vi deg via e-post.</strong> Vi håper å se deg snart.</p><p></p><p><strong>Dance2Dance-teamet</strong></p>"
    }
  },
  "waitlist_promoted": {
    en: {
      subject: "A spot has opened up for you: {{workshopName}}",
      body_html: "<p>Hello {{userName}}.</p><p>The waitlist moved and your spot is confirmed:</p><p>workshop: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{workshopLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><strong><u>{{workshopName}}</u></strong></a></p><p>date: {{workshopDate}}</p><p>time: {{workshopTime}}</p><p>Location: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{locationMapLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><u>{{locationName}}</u></a></p><p>We look forward to sharing this moment with you and hope it will be an inspiring experience full of great connections.</p><p>If your plans change and you cannot attend, we kindly ask you to cancel your registration on the schedule as soon as possible. This allows us to offer the spot to someone else.</p><p>Please arrive 10 minutes early to have time to prepare.</p><p>See you soon!</p><p></p><p><strong>The Dance2Dance Team</strong></p>"
    },
    no: {
      subject: "En plass er ledig for deg: {{workshopName}}",
      body_html: "<p>Hei {{userName}}.</p><p>Ventelisten har flyttet seg og din plass er bekreftet:</p><p>workshop: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{workshopLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><strong><u>{{workshopName}}</u></strong></a></p><p>dato: {{workshopDate}}</p><p>tid: {{workshopTime}}</p><p>Sted: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{locationMapLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><u>{{locationName}}</u></a></p><p>Vi gleder oss til å dele dette øyeblikket med deg og håper det blir en inspirerende opplevelse full av gode forbindelser.</p><p>Hvis planene dine endres og du ikke kan delta, ber vi deg vennligst om å avbestille påmeldingen din i timeplanen så snart som mulig. På denne måten kan vi frigjøre plassen til en annen.</p><p>Vennligst møt opp 10 minutter før for å få tid til å forberede deg.</p><p>Vi sees snart!</p><p></p><p><strong>Dance2Dance-teamet</strong></p>"
    }
  },
  "contact_received": {
    en: {
      subject: "Dance2Dance - We received your message",
      body_html: "<p>Hello {{userName}}.</p><p>Thank you for contacting Dance2Dance.</p><p>We have successfully received your message regarding <strong>{{subject}}</strong> and our team will reply as soon as possible.</p><p><strong>The Dance2Dance Team</strong></p>"
    },
    no: {
      subject: "Dance2Dance - Vi har mottatt meldingen din",
      body_html: "<p>Hei {{userName}}.</p><p>Takk for at du kontakter Dance2Dance.</p><p>Vi har mottatt din melding angående <strong>{{subject}}</strong> og teamet vårt vil svare så snart som mulig.</p><p><strong>Dance2Dance-teamet</strong></p>"
    }
  },
  "reminder_1_day": {
    en: {
      subject: "Reminder: {{workshopName}} is tomorrow",
      body_html: "<p>Hello {{userName}}.</p><p>This is a quick reminder that your workshop <strong>{{workshopName}}</strong> starts tomorrow.</p><p>date: {{workshopDate}}</p><p>time: {{workshopTime}}</p><p>Location: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{locationMapLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><u>{{locationName}}</u></a></p><p>Please arrive 10 minutes early.</p><p>See you tomorrow.</p><p></p><p><strong>The Dance2Dance Team</strong></p>"
    },
    no: {
      subject: "Påminnelse: {{workshopName}} er i morgen",
      body_html: "<p>Hei {{userName}}.</p><p>Dette er en rask påminnelse om at din workshop <strong>{{workshopName}}</strong> starter i morgen.</p><p>dato: {{workshopDate}}</p><p>tid: {{workshopTime}}</p><p>Sted: <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"{{locationMapLink}}\" style=\"color: rgb(201, 168, 76); text-decoration: underline;\"><u>{{locationName}}</u></a></p><p>Vennligst møt opp 10 minutter før.</p><p>Vi sees i morgen.</p><p></p><p><strong>Dance2Dance-teamet</strong></p>"
    }
  },
  "post_event_feedback": {
    en: {
      subject: "How was your experience at {{workshopName}}?",
      body_html: "<p>Hello {{userName}}.</p><p>Thank you for attending the <strong>{{workshopName}}</strong>.</p><p>We would love to know how it was for you. Your feedback is highly important to us; it helps us create increasingly better experiences and perhaps inspire others to join.</p><p></p><p><div style=\"margin: 24px 0;\">\n  <a href=\"https://dance2dance.no/perfil?review={{eventId}}\" style=\"display: inline-block; background-color: #C9A84C; color: #0A0A0E; padding: 12px 20px; border-radius: 2px; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; text-align: center;\">\n    &#9733;&nbsp;&nbsp;Rate Workshop &amp; Leave a Review\n  </a>\n</div></p><p></p><p>We hope to see you soon.</p><p><strong>The Dance2Dance Team</strong></p>"
    },
    no: {
      subject: "Hvordan var din opplevelse på {{workshopName}}?",
      body_html: "<p>Hei {{userName}}.</p><p>Takk for at du deltok på <strong>{{workshopName}}</strong>.</p><p>Vi vil gjerne vite hvordan det var for deg. Din tilbakemelding er veldig viktig for oss; den hjelper oss med å skape stadig bedre opplevelser og kanskje også inspirere andre til å delta.</p><p></p><p><div style=\"margin: 24px 0;\">\n  <a href=\"https://dance2dance.no/perfil?review={{eventId}}\" style=\"display: inline-block; background-color: #C9A84C; color: #0A0A0E; padding: 12px 20px; border-radius: 2px; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; text-align: center;\">\n    &#9733;&nbsp;&nbsp;Vurder workshop og legg igjen en anmeldelse\n  </a>\n</div></p><p></p><p>Vi håper å se deg snart.</p><p><strong>Dance2Dance-teamet</strong></p>"
    }
  },
  "inactive_90_days": {
    en: {
      subject: "We miss you - Dance2Dance",
      body_html: "<p>Hello {{userName}}.</p><p>It has been a while since we last saw you, and we miss you.</p><p>Sometimes the daily rush pulls us away from the things we enjoy, or perhaps you just lost the rhythm. Whatever the reason, we want you to know one thing: our community is not the same without your energy and presence.<br>Many great things have happened in these past months, and we would love to share them with you.</p><p>It does not matter how long you have been away. The best time to restart is now.<br>How about taking a look at what we have prepared for the upcoming weeks? No pressure, just an invitation to reconnect.</p><p><div style=\"margin: 24px 0;\">\n  <a href=\"https://dance2dance.no/agenda\" style=\"display: inline-block; background-color: #C9A84C; color: #0A0A0E; padding: 12px 20px; border-radius: 2px; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; text-align: center;\">\n    I want to join again\n  </a>\n</div></p><p><strong>The Dance2Dance Team</strong></p>"
    },
    no: {
      subject: "Vi savner deg - Dance2Dance",
      body_html: "<p>Hei {{userName}}.</p><p>Det er en stund siden sist vi så deg, og vi savner deg.</p><p>Noen ganger trekker hverdagens travelhet oss bort fra tingene vi liker, eller kanskje du bare mistet rytmen. Uansett årsak, vil vi at du skal vite én ting: fellesskapet vårt er ikke det samme uten din energi og tilstedeværelse.<br>Mange gode ting har skjedd de siste månedene, og vi vil gjerne dele dem med deg.</p><p>Det spiller ingen rolle hvor lenge du har vært borte. Den beste tiden å begynne igjen er nå. Våre programmer er utviklet for å fremme <em>personlig velvære</em> og <em>selvtillit</em>.<br>Hva med å ta en titt på hva vi har forberedt for de kommende ukene? Ingen press, bare en invitasjon til fornyet kontakt.</p><p><div style=\"margin: 24px 0;\">\n  <a href=\"https://dance2dance.no/agenda\" style=\"display: inline-block; background-color: #C9A84C; color: #0A0A0E; padding: 12px 20px; border-radius: 2px; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; text-align: center;\">\n    Jeg vil delta igjen\n  </a>\n</div></p><p><strong>Dance2Dance-teamet</strong></p>"
    }
  }
};

async function run() {
  try {
    await signInWithEmailAndPassword(auth, 'tempadmin2026@dance2dance.no', '12345678');
    for (const [id, langs] of Object.entries(translations)) {
      await updateDoc(doc(db, 'crm_email_templates', `${id}_en`), langs.en);
      await updateDoc(doc(db, 'crm_email_templates', `${id}_no`), langs.no);
    }
    console.log('All English and Norwegian translations applied successfully!');
  } catch (error) {
    console.error('Error applying translations:', error);
  }
  process.exit(0);
}
run();
