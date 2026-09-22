"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalItems: 0, inStockCount: 0, outOfStockCount: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check auth first
    fetch("/api/auth/me").then(res => {
      if (!res.ok) {
        router.push("/login");
        return;
      }
      return Promise.all([
        fetch("/api/stock").then((r) => r.json()),
        fetch("/api/cart").then((r) => r.json()),
      ])
      .then(([stockData, cartData]) => {
        setStats(stockData.stats || { totalItems: 0, inStockCount: 0, outOfStockCount: 0 });
        setRecentItems((stockData.items || []).slice(0, 5));
        setCartCount(Array.isArray(cartData) ? cartData.length : 0);
        setLoading(false);
      });
    }).catch(() => {
      router.push("/login");
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="font-semibold text-slate-600 text-lg">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center md:text-left border-b border-slate-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Welcome to your{" "}
            <span className="text-black">Dashboard</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
            Overview of your curated wishlist and shopping activity.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Wishlist Items</p>
            <p className="text-4xl font-extrabold text-slate-900">{stats.totalItems}</p>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
            <p className="text-sm font-medium text-zinc-900 uppercase tracking-wider mb-2">In Stock</p>
            <p className="text-4xl font-extrabold text-slate-900">{stats.inStockCount}</p>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
            <p className="text-sm font-medium text-rose-500 uppercase tracking-wider mb-2">Out of Stock</p>
            <p className="text-4xl font-extrabold text-slate-900">{stats.outOfStockCount}</p>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Cart Items</p>
            <p className="text-4xl font-extrabold text-slate-900">{cartCount}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/wishlist"
            className="block group bg-slate-900 rounded-2xl p-8 text-white transition-all hover:bg-slate-800 hover:scale-[1.02] hover:shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="bg-white/20 p-2 rounded-lg">✨</span> Manage Wishlist
            </h3>
            <p className="text-slate-300 font-medium leading-relaxed">Add, remove, and track your favorite products seamlessly.</p>
          </Link>
          <Link
            href="/stocks"
            className="block group bg-black rounded-2xl p-8 text-white transition-all hover:bg-zinc-800 hover:scale-[1.02] hover:shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="bg-white/20 p-2 rounded-lg">📈</span> Stock Tracker
            </h3>
            <p className="text-zinc-200 font-medium leading-relaxed">Monitor exactly which items are in stock or sold out.</p>
          </Link>
          <Link
            href="/cart"
            className="block group bg-black rounded-2xl p-8 text-white transition-all hover:bg-zinc-800 hover:scale-[1.02] hover:shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="bg-white/20 p-2 rounded-lg">🛒</span> Your Cart
            </h3>
            <p className="text-zinc-200 font-medium leading-relaxed">Review your prepared items and proceed to checkout.</p>
          </Link>
        </div>

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 mt-12">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Recent Wishlist Items</h2>
            <div className="flex flex-col gap-4">
              {recentItems.map((item: any) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-5 border border-slate-100 bg-slate-50/50 p-5 rounded-xl transition hover:border-zinc-200">
                  <div className="h-16 w-16 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-3xl">
                    {item.imageUrl?.startsWith("http") ? <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-contain p-1" /> : item.imageUrl || "📦"}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-lg">{item.productName}</p>
                    <p className="text-slate-500 font-medium mt-1">{item.brand || "No brand"} • <span className="text-black">₹{item.price?.toLocaleString()}</span></p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <span className={`px-4 py-1.5 rounded-full font-bold text-sm tracking-wide ${item.inStock ? "bg-zinc-200 text-zinc-800" : "bg-rose-100 text-rose-700"}`}>
                      {item.inStock ? "IN STOCK" : "OUT OF STOCK"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
