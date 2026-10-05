import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';

const firebaseConfig = { projectId: 'dance2dance-734d1', appId: '1:786562848568:web:0dc8eaff3c9d5f1a7cd3cd', storageBucket: 'dance2dance-734d1.firebasestorage.app', apiKey: 'AIzaSyA6uLVdspOg9XH2kD54CI8xK50AtjYRTG0', authDomain: 'dance2dance-734d1.firebaseapp.com' };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const TEMPLATES_LIST = [
  'enrollment_confirmed',
  'waitlist_joined',
  'waitlist_promoted',
  'contact_received',
  'reminder_1_day',
  'post_event_feedback',
  'inactive_90_days'
];

async function run() {
  await signInWithEmailAndPassword(auth, 'tempadmin2026@dance2dance.no', '12345678');
  const results = {};
  for (const id of TEMPLATES_LIST) {
    const d = await getDoc(doc(db, 'crm_email_templates', `${id}_pt`));
    results[id] = d.data();
  }
  fs.writeFileSync('scripts/pt_templates.json', JSON.stringify(results, null, 2));
  console.log('Dumped to scripts/pt_templates.json');
  process.exit(0);
}
run();
