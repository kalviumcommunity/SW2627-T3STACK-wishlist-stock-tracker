"use client";

import ProductList from "@/components/ProductList";
import Wishlist from "@/components/Wishlist";
import Cart from "@/components/Cart";
import { useStore } from "@/components/StoreProvider";
import { Bell } from "lucide-react";

export default function Home() {
  const { notification } = useStore();

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 md:py-12 text-slate-900">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl animate-bounce">
          <Bell className="h-4 w-4 text-blue-400" />
          {notification}
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Wishlist & Stock Tracker
          </h1>
          <p className="mt-2 text-base text-slate-500 max-w-2xl">
            Browse products, add them to your wishlist, and monitor real-time stock availability with auto-refresh every 30 seconds.
          </p>
        </header>

        {/* 1. Product Catalogue */}
        <ProductList />

        {/* 2. Wishlist & Cart Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7">
            <Wishlist />
          </div>
          <div className="lg:col-span-5">
            <Cart />
          </div>
        </div>
      </div>
    </main>
  );
}