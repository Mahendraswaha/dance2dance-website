import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, runTransaction } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'dance2dance-734d1',
  appId: '1:786562848568:web:0dc8eaff3c9d5f1a7cd3cd',
  apiKey: 'AIzaSyA6uLVdspOg9XH2kD54CI8xK50AtjYRTG0',
  authDomain: 'dance2dance-734d1.firebaseapp.com'
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanGhosts() {
  console.log("Cleaning up ghost enrollments for Mahendrix (yOpE3TFjgiaTHciuS6nQqins4Pe2)...");
  
  const ghostUid = 'yOpE3TFjgiaTHciuS6nQqins4Pe2';
  
  const enrollQ = query(collection(db, 'enrollments'), where('userId', '==', ghostUid));
  const snap = await getDocs(enrollQ);
  
  if (snap.empty) {
    console.log("No ghost enrollments found.");
    process.exit(0);
  }
  
  for (const enrollmentDoc of snap.docs) {
    const data = enrollmentDoc.data();
    console.log(`Found ghost enrollment ${enrollmentDoc.id} in event ${data.eventId}`);
    
    await runTransaction(db, async (transaction) => {
      const eventRef = doc(db, 'events', data.eventId);
      const eventDoc = await transaction.get(eventRef);
      
      if (eventDoc.exists()) {
        const evData = eventDoc.data();
        if (data.status === 'waitlist') {
          transaction.update(eventRef, { waitlistCount: Math.max(0, (evData.waitlistCount || 0) - 1) });
        } else {
          // enrolled
          transaction.update(eventRef, { enrolledCount: Math.max(0, (evData.enrolledCount || 0) - 1) });
          // Note: Not doing waitlist promotion in this script for simplicity, just freeing the spot
        }
      }
      
      transaction.delete(doc(db, 'enrollments', enrollmentDoc.id));
    });
    console.log(`Deleted ghost enrollment ${enrollmentDoc.id} and updated event counts.`);
  }
  
  process.exit(0);
}

cleanGhosts().catch(console.error);
