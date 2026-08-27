"use client";

import ProductList from "@/components/ProductList";
import Wishlist from "@/components/Wishlist";
import Cart from "@/components/Cart";
import { useStore } from "@/components/StoreProvider";

export default function Home() {
  const { notification } = useStore();

  return (
    <div className="py-12 md:py-20 px-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 border-2 border-black bg-white px-5 py-3 font-bold text-black animate-bounce">
          🔔 {notification}
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center md:text-left border-b-2 border-black pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            Wishlist & Stock Tracker
          </h1>
          <p className="mt-2 text-base font-bold text-black max-w-2xl">
            Browse products, add them to your wishlist, and monitor real-time stock availability with auto-refresh every 30 seconds.
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