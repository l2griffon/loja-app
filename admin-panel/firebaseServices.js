import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export const addProduct = async (product) => {
  try {
    const docRef = await addDoc(collection(db, "products"), product);
    console.log("Produto adicionado com ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar produto:", error.message);
    throw new Error("Erro ao adicionar o produto: " + error.message);
  }
};
