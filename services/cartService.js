// services/cartService.js

import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

export const saveCart = async (cartItems) => {
  const user = auth.currentUser;
  if (!user) return;
  const cartRef = doc(db, 'carts', user.uid);
  await setDoc(cartRef, { items: cartItems });
};

export const loadCart = async () => {
  const user = auth.currentUser;
  if (!user) return [];
  const cartRef = doc(db, 'carts', user.uid);
  const cartSnap = await getDoc(cartRef);
  if (cartSnap.exists()) {
    return cartSnap.data().items;
  }
  return [];
};

export const clearCart = async () => {
  const user = auth.currentUser;
  if (!user) return;
  const cartRef = doc(db, 'carts', user.uid);
  await deleteDoc(cartRef);
};
