import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBrgudRlkc_O3elevloX1G6lPzw0hPL0HU",
  authDomain: "essencial-fa6a9.firebaseapp.com",
  projectId: "essencial-fa6a9",
  storageBucket: "essencial-fa6a9.firebasestorage.app",
  messagingSenderId: "988385275932",
  appId: "1:988385275932:web:4429fb5e327f34eb5f6fd9",
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize Auth com persistência usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Inicializando Firestore
const db = getFirestore(app);

export { auth, db };
