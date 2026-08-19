import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('Error parsing cart items', e);
      }
    }
  }, []);

  // Save cart items to localStorage on modification
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex((item) => item.product === product._id);

    let updatedCart = [...cartItems];

    if (existingItemIndex > -1) {
      const newQty = updatedCart[existingItemIndex].quantity + quantity;
      // Cap at product's available stock
      if (newQty <= product.stock) {
        updatedCart[existingItemIndex].quantity = newQty;
      } else {
        updatedCart[existingItemIndex].quantity = product.stock;
      }
    } else {
      updatedCart.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock),
      });
    }

    saveCart(updatedCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    let updatedCart = cartItems.map((item) => {
      if (item.product === productId) {
        const cappedQty = Math.max(1, Math.min(newQuantity, item.stock));
        return { ...item, quantity: cappedQty };
      }
      return item;
    });
    saveCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.product !== productId);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount: getCartCount(),
        cartTotal: getCartTotal(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
