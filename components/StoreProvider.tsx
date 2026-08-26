"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Item = {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  inStock: boolean;
  image: string;
  brand: string;
};

type StoreContextType = {
  wishlist: Item[];
  cart: (Item & { quantity: number })[];
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: string) => void;
  removeFromWishlist: (itemId: string) => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};

const initialWishlist: Item[] = [
  { id: "1", name: "iPhone 15", price: "₹70,000", priceValue: 70000, inStock: true, image: "📱", brand: "Apple" },
  { id: "2", name: "Nike Shoes", price: "₹4,000", priceValue: 4000, inStock: false, image: "👟", brand: "Nike" },
  { id: "3", name: "Sony WH-1000XM5", price: "₹29,990", priceValue: 29990, inStock: true, image: "🎧", brand: "Sony" }
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Item[]>(initialWishlist);
  const [cart, setCart] = useState<(Item & { quantity: number })[]>([]);

  useEffect(() => {
    // Auto-check stock status every 30 seconds for wishlisted items
    const interval = setInterval(() => {
      setWishlist(prev => prev.map(item => ({
        ...item,
        // Mock stock status flipping randomly for demonstration
        inStock: Math.random() > 0.3
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addToCart = (item: Item) => {
    if (!item.inStock) return;
    
    // Optimistically remove from wishlist
    setWishlist(prev => prev.filter(w => w.id !== item.id));
    
    // Add to cart
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.id !== itemId));
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlist(prev => prev.filter(w => w.id !== itemId));
  };

  return (
    <StoreContext.Provider value={{ wishlist, cart, addToCart, removeFromCart, removeFromWishlist }}>
      {children}
    </StoreContext.Provider>
  );
}