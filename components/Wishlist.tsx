"use client";

import { useState, useEffect } from "react";
import { useStore } from "./StoreProvider";

export default function Wishlist() {
  const { wishlist, addToCart, removeFromWishlist, lastChecked } = useStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.id) setUserId(data.user.id);
      })
      .catch(console.error);
  }, []);

  const handleShare = () => {
    if (!userId) return;
    const url = `${window.location.origin}/share/${userId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-24 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Wishlist
          </h2>
          {lastChecked && (
            <p className="text-sm font-medium text-slate-500 mt-1">
              Auto-checking stock every 30s • Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500 bg-slate-50 px-4 py-1.5 rounded-full">
            {wishlist.length} items
          </span>
          {userId && (
            <button
              onClick={handleShare}
              className="px-5 py-2 text-sm font-semibold rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
            >
              {copied ? "Copied Link!" : "Share Wishlist"}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {wishlist.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-300 bg-slate-50">
            <p className="text-slate-900 font-semibold text-lg">Your wishlist is empty.</p>
            <p className="text-slate-500 text-sm mt-2">Add items from the catalogue to track their stock.</p>
          </div>
        ) : (
          wishlist.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-xl border border-slate-100 p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1 w-full">
                <div className="flex flex-col gap-2">
                  {item.brand && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-1 rounded-md self-start">
                      {item.brand}
                    </span>
                  )}
                  <div className="flex items-start gap-5 mt-2">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-4xl group-hover:scale-105 transition-transform">
                      {item.image}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg leading-tight">{item.name}</h3>
                      <div className="mt-2 flex items-center gap-3">
                        <p className="font-bold text-slate-900 text-lg">{item.price}</p>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${item.inStock ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock}
                    className="flex-1 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-50 disabled:bg-slate-300 transition-colors hover:bg-indigo-700 shadow-sm"
                  >
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-rose-600 font-semibold hover:bg-rose-50 transition-colors"
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