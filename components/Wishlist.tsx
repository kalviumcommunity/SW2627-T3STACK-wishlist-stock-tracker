"use client";

import { useStore } from "./StoreProvider";

export default function Wishlist() {
  const { wishlist, addToCart, removeFromWishlist, lastChecked } = useStore();

  return (
    <section className="bg-white p-6 border border-black sticky top-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-black pb-4">
        <div>
          <h2 className="text-xl font-bold text-black">
            My Wishlist
          </h2>
          {lastChecked && (
            <p className="text-sm font-bold text-black mt-1">
              Auto-checking stock every 30s • Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
        <span className="font-bold text-black">
          {wishlist.length} items
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {wishlist.length === 0 ? (
          <div className="text-center py-8 border border-black">
            <p className="text-black font-bold">Your wishlist is empty.</p>
            <p className="text-black text-sm mt-2">Add items from the catalogue above to track their stock.</p>
          </div>
        ) : (
          wishlist.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-black p-4 bg-gray-50"
            >
              <div className="flex-1 w-full">
                <div className="flex flex-col gap-1">
                  {item.brand && (
                    <p className="text-xs font-bold uppercase border border-black px-1 self-start">{item.brand}</p>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-black bg-white text-3xl">
                      {item.image}
                    </div>
                    <div>
                      <h3 className="font-bold text-black text-lg leading-tight">{item.name}</h3>
                      <div className="mt-1 flex items-center gap-3">
                        <p className="font-bold text-black">{item.price}</p>
                        <span className="px-2 py-0.5 border border-black text-xs font-bold uppercase bg-white">
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock}
                    className="flex-1 px-4 py-2 border border-black bg-black text-white font-bold disabled:opacity-50 disabled:bg-gray-400 disabled:border-gray-400"
                  >
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
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