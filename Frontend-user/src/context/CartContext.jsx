import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('casehaven_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const exchangeRate = 4100; // 1 USD = 4,100 KHR

  useEffect(() => {
    localStorage.setItem('casehaven_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    const color = selectedColor || (product.colorOptions ? product.colorOptions.split(',')[0].trim() : 'Standard');
    const defaultSize = product.category === 'SHOES' ? 'EU 42' : (product.category === 'CLOTHES' ? 'L' : null);
    const size = selectedSize || product.selectedSize || defaultSize;

    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => 
        item.productId === product.id && 
        item.selectedColor === color && 
        item.selectedSize === size
      );
      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + quantity;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: Math.min(newQty, product.stock || 99)
        };
        return next;
      } else {
        return [...prev, {
          productId: product.id,
          product,
          quantity: Math.min(quantity, product.stock || 99),
          selectedColor: color,
          selectedSize: size,
          price: product.price
        }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, selectedColor, selectedSize = null) => {
    setCartItems(prev => prev.filter(item => {
      if (selectedSize) {
        return !(item.productId === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize);
      }
      return !(item.productId === productId && item.selectedColor === selectedColor);
    }));
  };

  const updateQuantity = (productId, selectedColor, quantity, selectedSize = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }
    setCartItems(prev => prev.map(item => {
      const match = selectedSize
        ? (item.productId === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
        : (item.productId === productId && item.selectedColor === selectedColor);
      if (match) {
        return {
          ...item,
          quantity: Math.min(quantity, item.product.stock || 99)
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscountCode('');
    setDiscountPercent(0);
  };

  const applyDiscount = (code) => {
    const normalized = (code || '').trim().toUpperCase();
    if (normalized === 'KHMER2026' || normalized === 'SAVE10') {
      setDiscountCode(normalized);
      setDiscountPercent(10);
      return { success: true, message: '10% discount applied!' };
    } else if (normalized === 'VIP20') {
      setDiscountCode(normalized);
      setDiscountPercent(20);
      return { success: true, message: '20% VIP discount applied!' };
    }
    return { success: false, message: 'Invalid promo code' };
  };

  const removeDiscount = () => {
    setDiscountCode('');
    setDiscountPercent(0);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartRawSubtotal = cartItems.reduce((sum, item) => {
    return sum + (Number(item.price) * item.quantity);
  }, 0);

  const discountAmount = (cartRawSubtotal * discountPercent) / 100;
  const cartSubtotal = Math.max(0, cartRawSubtotal - discountAmount);

  const formatPrice = (usdAmount) => {
    const amount = Number(usdAmount || 0);
    if (currency === 'KHR') {
      const khr = Math.round(amount * exchangeRate);
      return `៛${khr.toLocaleString('en-US')}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartRawSubtotal,
      cartSubtotal,
      discountAmount,
      discountPercent,
      discountCode,
      applyDiscount,
      removeDiscount,
      isCartOpen,
      setIsCartOpen,
      currency,
      setCurrency,
      exchangeRate,
      formatPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
