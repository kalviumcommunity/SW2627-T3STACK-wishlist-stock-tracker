"use client";

import { Product, useStore } from "./StoreProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { addToWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="flex flex-col justify-between border border-black bg-white p-5">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-black border border-black px-1">
            {product.brand}
          </span>
          <span className="text-xs font-bold uppercase text-black border border-black px-1">
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="flex items-center justify-center h-28 border border-black bg-white text-5xl mb-4">
          {product.image}
        </div>

        <h3 className="font-bold text-black text-base leading-snug">{product.name}</h3>
        <p className="mt-1 text-lg font-bold text-black">{product.price}</p>
      </div>

      <button
        onClick={() => addToWishlist(product)}
        className={`mt-4 flex items-center justify-center gap-2 border border-black py-2.5 px-4 font-bold ${
          wishlisted
            ? "bg-white text-black"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {wishlisted ? "♥ In Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
}