"use client";

import { Product, useStore } from "./StoreProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { addToWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
            {product.brand}
          </span>
          <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-md ${product.inStock ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="flex items-center justify-center h-40 bg-slate-50 rounded-xl text-7xl mb-6 group-hover:scale-105 transition-transform duration-300">
          {product.image}
        </div>

        <h3 className="font-semibold text-slate-900 text-lg leading-snug">{product.name}</h3>
        <p className="mt-2 text-xl font-bold text-slate-900">{product.price}</p>
      </div>

      <button
        onClick={() => addToWishlist(product)}
        className={`mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold rounded-xl transition-all duration-200 ${
          wishlisted
            ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
        }`}
      >
        {wishlisted ? "♥ In Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
}