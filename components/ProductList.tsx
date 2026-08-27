"use client";

import { Store } from "lucide-react";
import { useStore } from "./StoreProvider";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { products } = useStore();

  return (
    <section className="rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2.5 text-2xl font-bold text-slate-800">
          <Store className="h-6 w-6 text-indigo-500" />
          Product Catalogue
        </h2>
        <span className="text-sm font-medium text-slate-500">
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