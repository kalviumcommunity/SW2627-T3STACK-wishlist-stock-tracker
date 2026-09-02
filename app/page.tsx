"use client";

import ProductList from "@/components/ProductList";
import Wishlist from "@/components/Wishlist";
import Cart from "@/components/Cart";
import { useStore } from "@/components/StoreProvider";

export default function Home() {
  const { notification } = useStore();

  return (
    <div className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl font-medium animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <span className="text-indigo-400">🔔</span> {notification}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
            Smart Tracking,<br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Zero Friction.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed">
            Browse premium products, curate your wishlist, and let our real-time engine monitor stock availability so you never miss out.
          </p>
        </header>

        {/* 1. Product Catalogue */}
        <ProductList />

        {/* 2. Wishlist & Cart Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-start mt-10">
          <div className="lg:col-span-7">
            <Wishlist />
          </div>
          <div className="lg:col-span-5">
            <Cart />
          </div>
        </div>
      </div>
    </div>
  );
}