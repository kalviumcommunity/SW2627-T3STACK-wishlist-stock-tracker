import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SharedWishlistPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const db = getDb();

  // Fetch the user's name
  const user = db.prepare("SELECT name FROM users WHERE id = ?").get(userId) as any;

  if (!user) {
    notFound();
  }

  // Fetch their wishlist items
  const items = db
    .prepare("SELECT * FROM wishlist_items WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as any[];

  return (
    <div className="py-12 md:py-20 min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{user.name}'s</span> Wishlist
          </h1>
          <p className="text-lg md:text-xl font-medium text-slate-500 max-w-2xl">
            Check out what {user.name} is hoping to get!
          </p>
        </header>

        {items.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300 bg-white shadow-sm">
            <p className="text-xl font-semibold text-slate-900 mb-2">This wishlist is empty.</p>
            <p className="text-slate-500">Looks like {user.name} hasn't added anything yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="flex h-56 items-center justify-center bg-slate-50 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-7xl">{item.image_url || "📦"}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col bg-white z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-xl leading-snug">{item.product_name}</h3>
                      <p className="font-medium text-slate-500 text-sm mt-1 uppercase tracking-wider">{item.brand || "Unknown Brand"}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-md ${item.in_stock ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                      {item.in_stock ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to action for visitors */}
        <div className="mt-20 text-center rounded-2xl border border-indigo-100 bg-indigo-50/50 p-10 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Want your own wishlist?</h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Create an account to track your favorite products and monitor their stock status automatically in real-time.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3.5 text-lg font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Create Your Free Wishlist
          </Link>
        </div>
      </div>
    </div>
  );
}
