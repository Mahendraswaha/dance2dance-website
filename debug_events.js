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
  const snap = await getDocs(collection(db, 'events'));
  snap.forEach(doc => {
    const data = doc.data();
    if (data.workshopSlug?.includes('relaxar') || data.title_pt?.toLowerCase().includes('relaxar')) {
      console.log(doc.id, data.title_pt, data.targetPath, data.workshopSlug);
    }
  });
  process.exit(0);
}

check().catch(console.error);
