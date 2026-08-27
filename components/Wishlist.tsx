"use client";

import { useEffect, useState } from "react";

interface WishlistItem {
  id: string;
  productName: string;
  price: number;
  imageUrl: string | null;
  brand: string | null;
  inStock: boolean;
}

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ productName: "", price: "", brand: "", imageUrl: "" });
  const [adding, setAdding] = useState(false);
  const [cartingIds, setCartingIds] = useState<Set<string>>(new Set());

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setItems(data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const removeItem = async (id: string) => {
    await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addToCart = async (item: WishlistItem) => {
    setCartingIds((prev) => new Set(prev).add(item.id));
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: item.productName,
          price: item.price,
          imageUrl: item.imageUrl,
          brand: item.brand,
          quantity: 1,
        }),
      });
      // Emit an event so cart updates
      window.dispatchEvent(new Event("cart-updated"));
      // Remove from wishlist after adding to cart
      await removeItem(item.id);
    } catch { /* ignore */ }
    setCartingIds((prev) => {
      const next = new Set(prev);
      next.delete(item.id);
      return next;
    });
  };

  const addItem = async () => {
    if (!form.productName || !form.price) return;
    setAdding(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.productName,
          price: parseFloat(form.price),
          brand: form.brand || null,
          imageUrl: form.imageUrl || null,
        }),
      });
      if (res.ok) {
        const newItem = await res.json();
        setItems((prev) => [{ ...newItem, inStock: true }, ...prev]);
        setForm({ productName: "", price: "", brand: "", imageUrl: "" });
        setShowAdd(false);
      }
    } catch { /* ignore */ }
    setAdding(false);
  };

  return (
    <section className="bg-white p-6 border border-black sticky top-8">
      <div className="flex items-center justify-between mb-8 border-b border-black pb-4">
        <h2 className="text-xl font-bold text-black">
          My Wishlist
        </h2>
        <div className="flex items-center gap-3">
          <span className="font-bold text-black">
            {items.length} items
          </span>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2 border border-black bg-black text-white font-bold hover:bg-gray-800"
          >
            {showAdd ? "Close" : "Add Item"}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-6 border border-black p-4 bg-gray-50 space-y-3">
          <div className="flex flex-col gap-3">
            <input
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              placeholder="Product Name *"
              className="border border-black px-4 py-2 bg-white font-medium"
            />
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price (₹) *"
              type="number"
              className="border border-black px-4 py-2 bg-white font-medium"
            />
            <input
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder="Brand (optional)"
              className="border border-black px-4 py-2 bg-white font-medium"
            />
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="Emoji or Image URL (optional)"
              className="border border-black px-4 py-2 bg-white font-medium"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={addItem}
              disabled={adding || !form.productName || !form.price}
              className="px-4 py-2 border border-black bg-black text-white font-bold disabled:opacity-50"
            >
              {adding ? "Adding..." : "Add to Wishlist"}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 border border-black bg-white text-black font-bold hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="text-black">Loading...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 border border-black">
            <p className="text-black font-bold">Your wishlist is empty.</p>
            <p className="text-black text-sm mt-2">Click &quot;Add Item&quot; to start tracking products!</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-black p-4 bg-gray-50">
              <div className="flex-1 w-full">
                <div className="flex flex-col gap-1">
                  {item.brand && (
                    <p className="text-xs font-bold uppercase border border-black px-1 self-start">{item.brand}</p>
                  )}
                  <h3 className="font-bold text-black text-lg leading-tight">{item.productName}</h3>
                  <div className="mt-1 flex items-center gap-3">
                    <p className="font-bold text-black">₹{item.price.toLocaleString()}</p>
                    <span className="px-2 py-0.5 border border-black text-xs font-bold uppercase bg-white">
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock || cartingIds.has(item.id)}
                    className="flex-1 px-4 py-2 border border-black bg-black text-white font-bold disabled:opacity-50 disabled:bg-gray-400 disabled:border-gray-400"
                  >
                    {cartingIds.has(item.id) ? "Adding..." : item.inStock ? "Add to Cart" : "Unavailable"}
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-4 py-2 border border-black bg-red-600 text-white font-bold hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
