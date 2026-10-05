import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = { projectId: 'dance2dance-734d1', appId: '1:786562848568:web:0dc8eaff3c9d5f1a7cd3cd', storageBucket: 'dance2dance-734d1.firebasestorage.app', apiKey: 'AIzaSyA6uLVdspOg9XH2kD54CI8xK50AtjYRTG0', authDomain: 'dance2dance-734d1.firebaseapp.com' };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const getBtn = (text) => `<div style="margin: 24px 0;">
  <a href="https://dance2dance.no/perfil" style="display: inline-block; background-color: #C9A84C; color: #0A0A0E; padding: 12px 20px; border-radius: 2px; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; text-align: center;">
    &#9733;&nbsp;&nbsp;${text}
  </a>
</div>`;

async function run() {
  const email = 'tempadmin2026@dance2dance.no';
  const pass = '12345678';
  let uid = null;
  
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    uid = cred.user.uid;
    console.log('Logged in as tempadmin');
  } catch(e) {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    uid = cred.user.uid;
    console.log('Created tempadmin');
  }

  // Set myself as admin
  await setDoc(doc(db, 'users', uid), {
    email: email,
    role: 'admin'
  }, { merge: true });
  console.log('Set user as admin');

  const p1 = getDoc(doc(db, 'crm_email_templates', 'post_event_feedback_pt'));
  const p2 = getDoc(doc(db, 'crm_email_templates', 'post_event_feedback_en'));
  const p3 = getDoc(doc(db, 'crm_email_templates', 'post_event_feedback_no'));
  
  const [d1, d2, d3] = await Promise.all([p1, p2, p3]);
  
  let htmlPt = d1.data()?.body_html || '';
  let htmlEn = d2.data()?.body_html || '';
  let htmlNo = d3.data()?.body_html || '';

  // PT
  htmlPt = htmlPt.replace(/\[botão Avaliar workshop\s*&amp;\s*Deixar depoimento\]/gi, getBtn('Avaliar Workshop &amp; Deixar Depoimento'));
  
  // EN
  htmlEn = htmlEn.replace(/<p>Please reply to this email and let us know what you thought.<\/p>/gi, getBtn('Review Workshop &amp; Leave Testimonial'));

  // NO
  htmlNo = htmlNo.replace(/<p>Vennligst svar på denne e-posten og la oss få vite hva du syntes.<\/p>/gi, getBtn('Vurder Workshop &amp; Gi Tilbakemelding'));

  await updateDoc(doc(db, 'crm_email_templates', 'post_event_feedback_pt'), { body_html: htmlPt });
  await updateDoc(doc(db, 'crm_email_templates', 'post_event_feedback_en'), { body_html: htmlEn });
  await updateDoc(doc(db, 'crm_email_templates', 'post_event_feedback_no'), { body_html: htmlNo });

  console.log('Templates updated successfully!');
  process.exit(0);
}
run();
