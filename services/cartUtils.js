// cartUtils.js
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig'; // ajuste o caminho se necessário

export const addToCart = async (product) => {
  const user = auth.currentUser;
  if (!user) {
    console.warn('Usuário não autenticado');
    return;
  }

  const cartRef = doc(db, 'carts', user.uid);
  const cartSnap = await getDoc(cartRef);

  let items = [];

  if (cartSnap.exists()) {
    items = cartSnap.data().items || [];

    const index = items.findIndex((item) => item.productId === product.id);
    if (index >= 0) {
      items[index].quantity += 1;
    } else {
      items.push({ ...product, productId: product.id, quantity: 1 });
    }
  } else {
    items.push({ ...product, productId: product.id, quantity: 1 });
  }

  await setDoc(cartRef, { items });

  console.log('Produto adicionado ao carrinho com sucesso!');
};
