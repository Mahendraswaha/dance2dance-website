import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'dance2dance-734d1',
  appId: '1:786562848568:web:0dc8eaff3c9d5f1a7cd3cd',
  apiKey: 'AIzaSyA6uLVdspOg9XH2kD54CI8xK50AtjYRTG0',
  authDomain: 'dance2dance-734d1.firebaseapp.com'
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const q = query(collection(db, 'events'), where('targetPath', '==', '/biostretch/aprendendo-a-relaxar'));
  const snap = await getDocs(q);
  console.log(`Found ${snap.docs.length} events for /biostretch/aprendendo-a-relaxar`);
  snap.forEach(doc => {
    console.log(doc.id, doc.data().title_pt, doc.data().startDate);
  });
  
  process.exit(0);
}

check().catch(console.error);
