"use client";

import { useStore } from "./StoreProvider";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { products } = useStore();

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-12">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Trending Products
        </h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-50 px-4 py-1.5 rounded-full">
          {products.length} items available
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