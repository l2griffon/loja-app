// firebaseConfig.js (web)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBrgudRlkc_O3elevloX1G6lPzw0hPL0HU",
  authDomain: "essencial-fa6a9.firebaseapp.com",
  projectId: "essencial-fa6a9",
  storageBucket: "essencial-fa6a9.firebasestorage.app",
  messagingSenderId: "988385275932",
  appId: "1:988385275932:web:4429fb5e327f34eb5f6fd9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
