"use client";

import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  productName: string;
  price: number;
  imageUrl: string | null;
  brand: string | null;
  quantity: number;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setItems(data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
    // Listen for cart updates from Wishlist
    const handler = () => fetchCart();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  // Re-fetch every 2 seconds to catch adds from Wishlist component
  useEffect(() => {
    const interval = setInterval(fetchCart, 2000);
    return () => clearInterval(interval);
  }, []);

  const removeItem = async (id: string) => {
    await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQuantity }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i))
        );
      }
    } catch { /* ignore */ }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="bg-white p-6 border border-black sticky top-8">
      <div className="flex items-center justify-between mb-8 border-b border-black pb-4">
        <h2 className="text-xl font-bold text-black">
          My Cart
        </h2>
        <span className="font-bold text-black">
          {items.length} items
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="text-black">Loading...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 border border-black">
            <p className="text-black font-bold">Your cart is empty.</p>
            <p className="text-black text-sm mt-2">Add items from your wishlist.</p>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-black p-4 bg-gray-50">
                <div className="flex-1 w-full">
                  <div className="flex items-start justify-between">
                    <div>
                      {item.brand && <p className="text-xs font-bold uppercase border border-black px-1 inline-block mb-1">{item.brand}</p>}
                      <h3 className="font-bold text-black text-lg">{item.productName}</h3>
                      <p className="text-sm font-bold mt-1">₹{item.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-white bg-red-600 px-3 py-1 font-bold text-sm border border-black hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 bg-black text-white font-bold border border-black"
                    >
                      -
                    </button>
                    <span className="font-bold border border-black px-4 py-1 text-center min-w-[3rem] bg-white">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-black text-white font-bold border border-black"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-4 pt-2 border-t border-black flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t-2 border-black mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">Subtotal</span>
                <span className="font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold">Delivery</span>
                <span className="font-bold">Free</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-black">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full bg-black text-white font-bold py-4 border border-black hover:bg-gray-800 mt-4 text-lg">
              Checkout Now
            </button>
          </>
        )}
      </div>
    </section>
  );
}
