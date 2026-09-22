"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface StockItem {
  id: string;
  productName: string;
  price: number;
  imageUrl: string | null;
  brand: string | null;
  inStock: boolean;
}

interface StockData {
  items: StockItem[];
  stats: { totalItems: number; inStockCount: number; outOfStockCount: number };
}

export default function StocksPage() {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then(res => {
      if (!res.ok) {
        router.push("/login");
        return;
      }
      fetch("/api/stock")
        .then((res) => res.json())
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    }).catch(() => {
      router.push("/login");
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="font-semibold text-slate-600 text-lg">Loading Stocks...</span>
      </div>
    );
  }

  const stats = data?.stats || { totalItems: 0, inStockCount: 0, outOfStockCount: 0 };
  const items = data?.items || [];

  return (
    <div className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center md:text-left border-b border-slate-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Stock <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Tracker</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
            Monitor stock availability of your curated wishlist items in real-time.
          </p>
        </header>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Items</p>
            <p className="text-4xl font-extrabold text-slate-900">{stats.totalItems}</p>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
            <p className="text-sm font-medium text-indigo-500 uppercase tracking-wider mb-2">In Stock</p>
            <p className="text-4xl font-extrabold text-slate-900">{stats.inStockCount}</p>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
            <p className="text-sm font-medium text-rose-500 uppercase tracking-wider mb-2">Out of Stock</p>
            <p className="text-4xl font-extrabold text-slate-900">{stats.outOfStockCount}</p>
          </div>
        </div>

        {/* Items list */}
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 shadow-sm rounded-2xl">
            <p className="text-slate-900 font-bold text-xl">No items to track yet.</p>
            <p className="text-slate-500 font-medium text-sm mt-2">Add items to your wishlist first!</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Brand</th>
                  <th className="text-right px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl bg-white border border-slate-100 p-2 rounded-xl shadow-sm">{item.imageUrl || "📦"}</span>
                        <span className="font-bold text-slate-900 text-lg">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-600 hidden sm:table-cell">{item.brand || "—"}</td>
                    <td className="px-6 py-5 text-right font-bold text-slate-900 text-lg">₹{item.price.toLocaleString()}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                        item.inStock ? "bg-indigo-100 text-indigo-700" : "bg-rose-100 text-rose-700"
                      }`}>
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
