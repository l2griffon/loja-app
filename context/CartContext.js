import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  saveCart,
  loadCart as loadCartFromFirestore,
  clearCart as clearCartFromFirestore
} from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const firestoreCart = await loadCartFromFirestore();
        setCart(firestoreCart);
      } else {
        setCart([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const save = async (updatedCart) => {
    setCart(updatedCart);
    await saveCart(updatedCart);
  };

  const addToCart = async (item) => {
    const existingItem = cart.find(prod => prod.id === item.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(prod =>
        prod.id === item.id
          ? { ...prod, quantidade: prod.quantidade + 1 }
          : prod
      );
    } else {
      updatedCart = [...cart, { ...item, quantidade: 1 }];
    }

    await save(updatedCart);
  };

  const increaseQuantity = async (item) => {
    const updatedCart = cart.map(prod =>
      prod.id === item.id
        ? { ...prod, quantidade: prod.quantidade + 1 }
        : prod
    );
    await save(updatedCart);
  };

  const decreaseQuantity = async (id) => {
    const item = cart.find(prod => prod.id === id);
    if (!item) return;

    let updatedCart;
    if (item.quantidade === 1) {
      updatedCart = cart.filter(prod => prod.id !== id);
    } else {
      updatedCart = cart.map(prod =>
        prod.id === id
          ? { ...prod, quantidade: prod.quantidade - 1 }
          : prod
      );
    }

    await save(updatedCart);
  };

  const removeFromCart = async (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    await save(updatedCart);
  };

  const clearCart = async () => {
    setCart([]);
    await clearCartFromFirestore();
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
