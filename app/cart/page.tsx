"use client";

import Cart from "@/components/Cart";

export default function CartPage() {
  return (
    <div className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center md:text-left border-b border-slate-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Shopping <span className="bg-gradient-to-r text-black">Cart</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
            Review and manage items you are ready to checkout.
          </p>
        </header>

        <Cart />
      </div>
    </div>
  );
}
