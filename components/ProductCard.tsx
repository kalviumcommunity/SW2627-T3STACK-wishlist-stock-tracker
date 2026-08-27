"use client";

import { Heart, CheckCircle2, XCircle } from "lucide-react";
import { Product, useStore } from "./StoreProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { addToWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-400/40 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {product.brand}
          </span>
          {product.inStock ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <CheckCircle2 className="h-3 w-3" /> In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              <XCircle className="h-3 w-3" /> Out of Stock
            </span>
          )}
        </div>

        <div className="flex items-center justify-center h-28 rounded-xl bg-slate-50 text-5xl mb-4 group-hover:scale-105 transition-transform">
          {product.image}
        </div>

        <h3 className="font-bold text-slate-800 text-base leading-snug">{product.name}</h3>
        <p className="mt-1 text-lg font-extrabold text-slate-900">{product.price}</p>
      </div>

      <button
        onClick={() => addToWishlist(product)}
        className={`mt-4 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold transition-all ${
          wishlisted
            ? "bg-rose-50 text-rose-600 border border-rose-200"
            : "bg-slate-900 text-white hover:bg-blue-600"
        }`}
      >
        <Heart className={`h-4 w-4 ${wishlisted ? "fill-rose-600 text-rose-600" : ""}`} />
        {wishlisted ? "In Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
}