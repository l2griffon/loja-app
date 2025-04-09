import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { saveCart, loadCart as loadCartFromFirestore, clearCart as clearCartFromFirestore } from '../services/cartService';

// Criação do contexto
export const CartContext = createContext();

// Provider que envolve a aplicação
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const auth = getAuth();

  // Carrega carrinho do Firestore quando o usuário loga
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const firestoreCart = await loadCartFromFirestore();
        setCart(firestoreCart);
      } else {
        setCart([]); // limpa o carrinho ao deslogar
      }
    });

    return () => unsubscribe();
  }, []);

  const addToCart = async (item) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
    await saveCart(updatedCart); // salva no Firestore
  };

  const removeFromCart = async (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    await saveCart(updatedCart); // atualiza no Firestore
  };

  const clearCart = async () => {
    setCart([]);
    await clearCartFromFirestore(); // limpa no Firestore
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
