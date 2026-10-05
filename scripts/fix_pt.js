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
  await signInWithEmailAndPassword(auth, 'tempadmin2026@dance2dance.no', '12345678');
  const d = await getDoc(doc(db, 'crm_email_templates', 'inactive_90_days_pt'));
  let html = d.data()?.body_html || '';
  
  html = html.replace(/<a[^>]*href=\"https:\/\/dance2dance\.no\/agenda\"[^>]*>.*?<\/a>/gi, getBtn('Quero Voltar a Participar'));
  
  await updateDoc(doc(db, 'crm_email_templates', 'inactive_90_days_pt'), { body_html: html });
  console.log('Fixed PT!');
  process.exit(0);
}
run();
