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
  { id: "1", name: "iPhone 15 Pro", price: "₹1,29,900", priceValue: 129900, inStock: true, image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=256&hei=256&fmt=webp", brand: "Apple", category: "Electronics" },
  { id: "2", name: "Nike Air Max 270", price: "₹11,495", priceValue: 11495, inStock: false, image: "https://static.nike.com/a/images/t_default/1d670f4a-25c2-4ebc-a808-1f582f3cde08/air-max-270-mens-shoes-KkLcGR.png", brand: "Nike", category: "Footwear" },
  { id: "3", name: "Sony WH-1000XM5", price: "₹29,990", priceValue: 29990, inStock: true, image: "https://media.croma.com/image/dispatch/id/EQB_165977/size/256/w/256", brand: "Sony", category: "Audio" },
  { id: "4", name: "MacBook Air M3", price: "₹1,14,900", priceValue: 114900, inStock: true, image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-m3-spacegray-select-202402?wid=256&hei=256&fmt=webp", brand: "Apple", category: "Laptops" },
  { id: "5", name: "Samsung Galaxy S24 Ultra", price: "₹1,29,999", priceValue: 129999, inStock: false, image: "https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-s928-sm-s928bztqins-thumb-539573351", brand: "Samsung", category: "Electronics" },
  { id: "6", name: "Apple Watch Ultra 2", price: "₹89,900", priceValue: 89900, inStock: true, image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-ultra2-titanium-ocean-blue-cell-202309?wid=256&hei=256&fmt=webp", brand: "Apple", category: "Wearables" }
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Map backend item to Product type
  const mapApiItemToProduct = (apiItem: any): Product => ({
    id: apiItem.productId || apiItem.id, // Support new Prisma schema where productId is used
    name: apiItem.productName,
    price: `₹${apiItem.price.toLocaleString()}`,
    priceValue: apiItem.price,
    inStock: apiItem.inStock ?? true,
    image: apiItem.imageUrl || "📦",
    brand: apiItem.brand || "Unknown",
    category: "General",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wishlistRes, cartRes] = await Promise.all([
          fetch("/api/wishlist"),
          fetch("/api/cart"),
        ]);
        if (wishlistRes.ok) {
          const wData = await wishlistRes.json();
          setWishlist(wData.map(mapApiItemToProduct));
        }
        if (cartRes.ok) {
          const cData = await cartRes.json();
          setCart(cData.map((item: any) => ({ ...mapApiItemToProduct(item), quantity: item.quantity, id: item.id, productId: item.productId })));
        }
      } catch (err) {
        console.error("Failed to fetch store data:", err);
      }
    };
    fetchData();
  }, []);

  // Auto-check stock status every 30 seconds for wishlisted items only
  useEffect(() => {
    setLastChecked(new Date());

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/stock");
        if (res.ok) {
          const data = await res.json();
          if (data.items && Array.isArray(data.items)) {
            setWishlist((prevWishlist) => {
              if (prevWishlist.length === 0) return prevWishlist;
              return prevWishlist.map((item) => {
                const stockData = data.items.find((i: any) => i.productId === item.id || i.productId === (item as any).productId);
                return stockData ? { ...item, inStock: stockData.inStock } : item;
              });
            });
          }
          setLastChecked(new Date());
        }
      } catch (err) {
        console.error("Stock check failed:", err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId || (item as any).productId === productId);
  };

  const addToWishlist = async (product: Product) => {
    if (isInWishlist(product.id)) {
      showNotification(`"${product.name}" is already in your wishlist!`);
      return;
    }
    
    // Optimistic UI update
    setWishlist((prev) => [...prev, product]);
    showNotification(`Added "${product.name}" to Wishlist`);
    
    // API Call
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          productId: product.id,
          productName: product.name,
          price: product.priceValue,
          imageUrl: product.image,
          brand: product.brand,
        }),
      });
    } catch (err) {
      console.error("Failed to add to wishlist", err);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId && (item as any).productId !== productId));
    showNotification("Removed item from Wishlist");
    
    try {
      await fetch(`/api/wishlist?id=${productId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  const addToCart = async (product: Product) => {
    if (!product.inStock) {
      showNotification(`Cannot add "${product.name}" to cart: Item is out of stock!`);
      return;
    }

    // Optimistically update UI
    setWishlist((prev) => prev.filter((item) => item.id !== product.id && (item as any).productId !== product.id));
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id || (item as any).productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id || (item as any).productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, productId: product.id } as any];
    });
    showNotification(`Moved "${product.name}" to Cart`);

    // API Calls
    try {
      // Add to cart DB
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          productId: product.id,
          productName: product.name,
          price: product.priceValue,
          imageUrl: product.image,
          brand: product.brand,
          quantity: 1,
        }),
      });
      // Remove from wishlist DB
      await fetch(`/api/wishlist?id=${product.id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to move to cart", err);
    }
  };

  const removeFromCart = async (itemIdOrProductId: string) => {
    // Find the cart item id if this is a product id
    const cartItem = cart.find(item => item.id === itemIdOrProductId || (item as any).productId === itemIdOrProductId);
    const cartItemId = cartItem ? cartItem.id : itemIdOrProductId;

    setCart((prev) => prev.filter((item) => item.id !== cartItemId && (item as any).productId !== itemIdOrProductId));
    showNotification("Removed item from Cart");
    
    try {
      await fetch(`/api/cart?id=${cartItemId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  };

  const updateQuantity = async (itemIdOrProductId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    // Find the cart item id if this is a product id
    const cartItem = cart.find(item => item.id === itemIdOrProductId || (item as any).productId === itemIdOrProductId);
    const cartItemId = cartItem ? cartItem.id : itemIdOrProductId;

    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId || (item as any).productId === itemIdOrProductId ? { ...item, quantity: newQuantity } : item))
    );
    
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cartItemId, quantity: newQuantity }),
      });
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
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