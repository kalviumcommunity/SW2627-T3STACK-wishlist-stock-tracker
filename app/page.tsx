import Wishlist from "@/components/Wishlist";
import Cart from "@/components/Cart";

export default function Home() {
  return (
    <div className="py-12 md:py-20 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Wishlist Stock Tracker
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl">
            Track your favorite items in real-time. Never miss a restock with our automated stock tracking system.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
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
