import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBZUtzdIfWOatGMI2CiwIdgpd_YCoUJaT4",
  authDomain: "datavisu-5a819.firebaseapp.com",
  projectId: "datavisu-5a819",
  storageBucket: "datavisu-5a819.appspot.com",
  messagingSenderId: "994573748209",
  appId: "1:994573748209:web:edfc88932570d2053b6650"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 