import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'dance2dance-734d1',
  appId: '1:786562848568:web:0dc8eaff3c9d5f1a7cd3cd',
  storageBucket: 'dance2dance-734d1.firebasestorage.app',
  apiKey: 'AIzaSyA6uLVdspOg9XH2kD54CI8xK50AtjYRTG0',
  authDomain: 'dance2dance-734d1.firebaseapp.com'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkEnrollments() {
  const q = query(collection(db, 'enrollments'), orderBy('createdAt', 'desc'), limit(1));
  const snap = await getDocs(q);
  snap.forEach(doc => {
    console.log("LAST ENROLLMENT:");
    console.log("Name:", doc.data().userName);
    console.log("emailSent:", doc.data().emailSent);
  });
  process.exit(0);
}

checkEnrollments();
