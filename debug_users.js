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
  const q = query(collection(db, 'users'), where('email', '==', 'mahendra@dance2dance.no'));
  const snap = await getDocs(q);
  console.log(`Found ${snap.docs.length} users for mahendra@dance2dance.no`);
  snap.forEach(doc => {
    console.log("User doc id:", doc.id, doc.data());
  });
  process.exit(0);
}

check().catch(console.error);
