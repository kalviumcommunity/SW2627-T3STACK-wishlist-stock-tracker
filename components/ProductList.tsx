"use client";

import { useState, useMemo } from "react";
import { Store, Search, SlidersHorizontal } from "lucide-react";
import { useStore } from "./StoreProvider";
import ProductCard from "./ProductCard";

const CATEGORIES = ["All", "Electronics", "Footwear", "Audio", "Laptops", "Wearables"];

export default function ProductList() {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Filter products based on search, category, and stock
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesStock = !onlyInStock || product.inStock;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, onlyInStock]);

  return (
    <section className="rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-bold text-slate-800">
            <Store className="h-6 w-6 text-blue-600" />
            Product Catalogue
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* Categories & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* In-stock toggle */}
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          In Stock Only
        </label>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-slate-500 font-medium">No products matched your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setOnlyInStock(false);
            }}
            className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}