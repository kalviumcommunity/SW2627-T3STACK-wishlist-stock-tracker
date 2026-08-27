"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Product = {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  inStock: boolean;
  image: string;
  brand: string;
  category: string;
};

type StoreContextType = {
  products: Product[];
  wishlist: Product[];
  cart: (Product & { quantity: number })[];
  lastChecked: Date | null;
  notification: string | null;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  isInWishlist: (productId: string) => boolean;
};

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};

// Initial store products
const initialProducts: Product[] = [
  { id: "1", name: "iPhone 15 Pro", price: "₹1,29,900", priceValue: 129900, inStock: true, image: "📱", brand: "Apple", category: "Electronics" },
  { id: "2", name: "Nike Air Max 270", price: "₹11,495", priceValue: 11495, inStock: false, image: "👟", brand: "Nike", category: "Footwear" },
  { id: "3", name: "Sony WH-1000XM5", price: "₹29,990", priceValue: 29990, inStock: true, image: "🎧", brand: "Sony", category: "Audio" },
  { id: "4", name: "MacBook Air M3", price: "₹1,14,900", priceValue: 114900, inStock: true, image: "💻", brand: "Apple", category: "Laptops" },
  { id: "5", name: "Samsung Galaxy S24 Ultra", price: "₹1,29,999", priceValue: 129999, inStock: false, image: "📱", brand: "Samsung", category: "Electronics" },
  { id: "6", name: "Apple Watch Ultra 2", price: "₹89,900", priceValue: 89900, inStock: true, image: "⌚", brand: "Apple", category: "Wearables" }
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [wishlist, setWishlist] = useState<Product[]>([initialProducts[0], initialProducts[1], initialProducts[2]]);
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Auto-check stock status every 30 seconds for wishlisted items only
  useEffect(() => {
    setLastChecked(new Date());

    const interval = setInterval(() => {
      setWishlist((prevWishlist) => {
        if (prevWishlist.length === 0) return prevWishlist;

        return prevWishlist.map((item) => {
          // Simulate 75% chance in stock, 25% out of stock
          const newStockStatus = Math.random() > 0.25;
          return { ...item, inStock: newStockStatus };
        });
      });
      setLastChecked(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const addToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      showNotification(`"${product.name}" is already in your wishlist!`);
      return;
    }
    setWishlist((prev) => [...prev, product]);
    showNotification(`Added "${product.name}" to Wishlist`);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    showNotification("Removed item from Wishlist");
  };

  const addToCart = (product: Product) => {
    if (!product.inStock) {
      showNotification(`Cannot add "${product.name}" to cart: Item is out of stock!`);
      return;
    }

    // Optimistically remove from wishlist
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));

    // Add to cart
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    showNotification(`Moved "${product.name}" to Cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showNotification("Removed item from Cart");
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        wishlist,
        cart,
        lastChecked,
        notification,
        addToWishlist,
        removeFromWishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        isInWishlist
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}