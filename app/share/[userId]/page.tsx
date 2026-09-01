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
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-10 text-center md:text-left border-b-2 border-black pb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
            {user.name}'s Wishlist
          </h1>
          <p className="mt-4 text-lg md:text-xl font-bold text-black max-w-2xl">
            Check out what {user.name} is hoping to get!
          </p>
        </header>

        {items.length === 0 ? (
          <div className="text-center py-16 border-2 border-black bg-gray-50">
            <p className="text-xl font-bold text-black mb-4">This wishlist is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-200"
              >
                <div className="flex h-48 items-center justify-center border-b-2 border-black bg-gray-50 group-hover:bg-gray-800 transition-colors duration-200">
                  <span className="text-6xl">{item.image_url || "📦"}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl">{item.product_name}</h3>
                      <p className="font-medium opacity-80 mt-1">{item.brand || "Unknown Brand"}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t-2 border-current flex items-center justify-between">
                    <span className="text-xl font-bold">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className="font-bold uppercase text-sm border-2 border-current px-2 py-1">
                      {item.in_stock ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to action for visitors */}
        <div className="mt-16 text-center border-2 border-black bg-gray-50 p-8">
          <h2 className="text-2xl font-bold text-black mb-4">Want your own wishlist?</h2>
          <p className="text-black font-medium mb-6">
            Create an account to track your favorite products and monitor their stock status automatically.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 text-lg font-bold border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors"
          >
            Create Your Wishlist
          </Link>
        </div>
      </div>
    </div>
  );
}
