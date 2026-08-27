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
        <span className="font-bold text-black text-xl">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-10 border-b-2 border-black pb-4">
          <h1 className="text-4xl font-bold text-black">Dashboard</h1>
          <p className="mt-3 text-lg text-black font-medium">Overview of your wishlist and shopping activity.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-black p-6">
            <p className="text-sm font-bold uppercase mb-2">Wishlist Items</p>
            <p className="text-4xl font-bold text-black">{stats.totalItems}</p>
          </div>
          <div className="bg-white border border-black p-6">
            <p className="text-sm font-bold uppercase mb-2">In Stock</p>
            <p className="text-4xl font-bold text-black">{stats.inStockCount}</p>
          </div>
          <div className="bg-white border border-black p-6">
            <p className="text-sm font-bold uppercase mb-2">Out of Stock</p>
            <p className="text-4xl font-bold text-black">{stats.outOfStockCount}</p>
          </div>
          <div className="bg-white border border-black p-6">
            <p className="text-sm font-bold uppercase mb-2">Cart Items</p>
            <p className="text-4xl font-bold text-black">{cartCount}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link
            href="/wishlist"
            className="block border border-black bg-black p-6 text-white hover:bg-gray-800"
          >
            <h3 className="text-2xl font-bold">Manage Wishlist</h3>
            <p className="text-white mt-2 font-medium">Add, remove, and track your favorite products</p>
          </Link>
          <Link
            href="/stocks"
            className="block border border-black bg-black p-6 text-white hover:bg-gray-800"
          >
            <h3 className="text-2xl font-bold">Stock Tracker</h3>
            <p className="text-white mt-2 font-medium">Monitor which items are in stock or sold out</p>
          </Link>
          <Link
            href="/cart"
            className="block border border-black bg-black p-6 text-white hover:bg-gray-800"
          >
            <h3 className="text-2xl font-bold">Your Cart</h3>
            <p className="text-white mt-2 font-medium">Review your items and proceed to checkout</p>
          </Link>
        </div>

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <div className="bg-white border border-black p-6 md:p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Recent Wishlist Items</h2>
            <div className="flex flex-col gap-4">
              {recentItems.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 border border-black bg-gray-50 p-4">
                  <span className="text-3xl">{item.imageUrl || "📦"}</span>
                  <div className="flex-1">
                    <p className="font-bold text-black text-lg">{item.productName}</p>
                    <p className="text-sm font-bold">{item.brand || "No brand"} · ₹{item.price?.toLocaleString()}</p>
                  </div>
                  <span className="border border-black bg-white px-3 py-1 font-bold text-sm uppercase">
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
