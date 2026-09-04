import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'dance2dance-734d1',
  appId: '1:786562848568:web:0dc8eaff3c9d5f1a7cd3cd',
  storageBucket: 'dance2dance-734d1.firebasestorage.app',
  apiKey: 'AIzaSyA6uLVdspOg9XH2kD54CI8xK50AtjYRTG0',
  authDomain: 'dance2dance-734d1.firebaseapp.com',
  messagingSenderId: '786562848568'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
