"use client";

import Cart from "@/components/Cart";

export default function CartPage() {
  return (
    <div className="py-12 md:py-20 px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 text-center md:text-left border-b-2 border-black pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            Shopping Cart
          </h1>
          <p className="mt-2 text-base font-bold text-black max-w-2xl">
            Review and manage items you are ready to checkout.
          </p>
        </header>

        <Cart />
      </div>
    </div>
  );
}
