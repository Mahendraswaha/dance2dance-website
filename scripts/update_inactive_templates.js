import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = { projectId: 'dance2dance-734d1', appId: '1:786562848568:web:0dc8eaff3c9d5f1a7cd3cd', storageBucket: 'dance2dance-734d1.firebasestorage.app', apiKey: 'AIzaSyA6uLVdspOg9XH2kD54CI8xK50AtjYRTG0', authDomain: 'dance2dance-734d1.firebaseapp.com' };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const getBtn = (text) => `<div style="margin: 24px 0;">
  <a href="https://dance2dance.no/agenda" style="display: inline-block; background-color: #C9A84C; color: #0A0A0E; padding: 12px 20px; border-radius: 2px; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; text-align: center;">
    ${text}
  </a>
</div>`;

async function run() {
  const email = 'tempadmin2026@dance2dance.no';
  const pass = '12345678';
  
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    console.log('Logged in as tempadmin');
  } catch(e) {
    console.log('Login failed', e.message);
  }

  const p1 = getDoc(doc(db, 'crm_email_templates', 'inactive_90_days_pt'));
  const p2 = getDoc(doc(db, 'crm_email_templates', 'inactive_90_days_en'));
  const p3 = getDoc(doc(db, 'crm_email_templates', 'inactive_90_days_no'));
  
  const [d1, d2, d3] = await Promise.all([p1, p2, p3]);
  
  let htmlPt = d1.data()?.body_html || '';
  let htmlEn = d2.data()?.body_html || '';
  let htmlNo = d3.data()?.body_html || '';

  // PT
  htmlPt = htmlPt.replace(/\[Botão:\s*Quero voltar a participar\]|<br>\[Botão:\s*Quero voltar a participar\]/gi, getBtn('Quero Voltar a Participar'));
  
  // EN
  if (!htmlEn.includes('dance2dance.no/agenda')) {
    htmlEn = htmlEn.replace(/<p>Check out our schedule on the website and secure your spot\.<\/p>/gi, '<p>Check out our schedule on the website and secure your spot.</p>' + getBtn('I want to join again'));
  }

  // NO
  if (!htmlNo.includes('dance2dance.no/agenda')) {
    htmlNo = htmlNo.replace(/<p>Sjekk ut timeplanen på nettsiden vår og sikre deg en plass\.<\/p>/gi, '<p>Sjekk ut timeplanen på nettsiden vår og sikre deg en plass.</p>' + getBtn('Jeg vil delta igjen'));
  }

  await updateDoc(doc(db, 'crm_email_templates', 'inactive_90_days_pt'), { body_html: htmlPt });
  await updateDoc(doc(db, 'crm_email_templates', 'inactive_90_days_en'), { body_html: htmlEn });
  await updateDoc(doc(db, 'crm_email_templates', 'inactive_90_days_no'), { body_html: htmlNo });

  console.log('Templates updated successfully!');
  process.exit(0);
}
run();
