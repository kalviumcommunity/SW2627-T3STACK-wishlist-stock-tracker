"use client";

import { Heart, ShoppingCart, CheckCircle2, XCircle, Trash2, Clock } from "lucide-react";
import { useStore } from "./StoreProvider";

export default function Wishlist() {
  const { wishlist, addToCart, removeFromWishlist, lastChecked } = useStore();

  return (
    <section className="rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-bold text-slate-800">
            <Heart className="h-6 w-6 text-rose-500 fill-rose-500/20" />
            My Wishlist
          </h2>
          {lastChecked && (
            <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <Clock className="h-3.5 w-3.5 text-blue-500 animate-spin" />
              Auto-checking stock every 30s • Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
          {wishlist.length}
        </span>
      </div>

      <div className="space-y-4">
        {wishlist.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
            <Heart className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium">Your wishlist is empty.</p>
            <p className="text-xs text-slate-400 mt-1">Add items from the catalogue above to track their stock.</p>
          </div>
        ) : (
          wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col md:flex-row md:items-center gap-5 rounded-2xl border border-slate-200/60 bg-white p-5 hover:border-blue-500/30 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-1 items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-3xl">
                  {item.image}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{item.brand}</p>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{item.name}</h3>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-lg font-extrabold text-slate-900">{item.price}</p>
                    <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                    {item.inStock ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100/50">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-100/50">
                        <XCircle className="h-3.5 w-3.5" />
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.inStock}
                  className={`flex-1 md:flex-none relative flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                    item.inStock
                      ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className={`h-4 w-4 ${item.inStock ? "text-white/90" : "text-slate-400"}`} />
                  {item.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="flex items-center justify-center rounded-xl p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}