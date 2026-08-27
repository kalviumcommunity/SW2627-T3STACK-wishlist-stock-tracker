import Wishlist from "@/components/Wishlist";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  title: "My Wishlist — Tracker",
  description: "Manage your wishlist items and track stock availability",
};

export default async function WishlistPage() {
  const userId = await getSessionUser();
  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">My Wishlist</h1>
          <p className="mt-3 text-lg text-slate-500">Track products you love and move them to cart when ready.</p>
        </header>
        <Wishlist />
      </div>
    </div>
  );
}
