import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';  // Importando a função de login
import { collection, doc, getDoc } from 'firebase/firestore';  // Importando as funções necessárias do Firestore
import { auth, db } from '../firebaseConfig';  // Importando do firebaseConfig.js

// Função de login
export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in: ", error);
  }
};

// Função para obter dados do Firestore
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId)); // Usando a nova API do Firestore
    return userDoc.data();
  } catch (error) {
    console.error("Error fetching user data: ", error);
  }
};
