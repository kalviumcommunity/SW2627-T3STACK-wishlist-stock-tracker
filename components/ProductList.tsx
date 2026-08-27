"use client";

import { useStore } from "./StoreProvider";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { products } = useStore();

  return (
    <section className="bg-white p-6 border border-black mb-8">
      <div className="flex items-center justify-between mb-6 border-b border-black pb-4">
        <h2 className="text-xl font-bold text-black">
          Product Catalogue
        </h2>
        <span className="font-bold text-black">
          {products.length} Products Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}