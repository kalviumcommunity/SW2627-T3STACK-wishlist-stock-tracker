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
        <span className="font-bold text-black text-xl">Loading Stocks...</span>
      </div>
    );
  }

  const stats = data?.stats || { totalItems: 0, inStockCount: 0, outOfStockCount: 0 };
  const items = data?.items || [];

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <header className="mb-10 border-b-2 border-black pb-4">
          <h1 className="text-4xl font-bold text-black">Stock Tracker</h1>
          <p className="mt-3 text-lg font-bold text-black">Monitor stock availability of your wishlist items in real-time.</p>
        </header>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border-2 border-black p-6">
            <p className="text-sm font-bold uppercase mb-2">Total Items</p>
            <p className="text-4xl font-bold text-black">{stats.totalItems}</p>
          </div>
          <div className="bg-white border-2 border-black p-6">
            <p className="text-sm font-bold uppercase mb-2">In Stock</p>
            <p className="text-4xl font-bold text-black">{stats.inStockCount}</p>
          </div>
          <div className="bg-white border-2 border-black p-6">
            <p className="text-sm font-bold uppercase mb-2">Out of Stock</p>
            <p className="text-4xl font-bold text-black">{stats.outOfStockCount}</p>
          </div>
        </div>

        {/* Items list */}
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-black">
            <p className="text-black font-bold text-xl">No items to track yet.</p>
            <p className="text-black font-bold text-sm mt-2">Add items to your wishlist first!</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-black overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black bg-gray-100">
                  <th className="text-left px-6 py-4 text-sm font-bold text-black uppercase">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-black uppercase">Brand</th>
                  <th className="text-right px-6 py-4 text-sm font-bold text-black uppercase">Price</th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-black uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-black hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.imageUrl || "📦"}</span>
                        <span className="font-bold text-black text-lg">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-black">{item.brand || "—"}</td>
                    <td className="px-6 py-4 text-right font-bold text-black text-lg">₹{item.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 text-sm font-bold uppercase border-2 border-black ${
                        item.inStock ? "bg-white" : "bg-gray-200"
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
