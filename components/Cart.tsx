"use client";

import { useStore } from "./StoreProvider";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
  const formattedSubtotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(subtotal);

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          My Cart
        </h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-50 px-4 py-1.5 rounded-full">
          {totalQuantity} items
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {cart.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-300 bg-slate-50">
            <p className="text-slate-900 font-semibold text-lg">Your cart is empty.</p>
            <p className="text-slate-500 text-sm mt-2">Add items from your wishlist.</p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-xl border border-slate-100 p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-4xl">
                  {item.image}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{item.name}</h3>
                      <p className="text-slate-500 font-medium mt-1">{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-700 font-bold border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                      >
                        -
                      </button>
                      <span className="font-semibold text-slate-900 w-10 text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-700 font-bold border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total</span>
                      <span className="font-bold text-slate-900 text-lg">₹{(item.priceValue * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-slate-100 mt-2">
              <div className="flex items-center justify-between mb-3 text-slate-600">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold text-slate-900">{formattedSubtotal}</span>
              </div>
              <div className="flex items-center justify-between mb-6 text-slate-600">
                <span className="font-medium">Delivery</span>
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-sm">Free</span>
              </div>
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <span className="text-xl font-bold text-slate-900">Total</span>
                <span className="text-2xl font-extrabold text-indigo-600">{formattedSubtotal}</span>
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all mt-6 text-lg tracking-wide">
              Checkout Now
            </button>
          </>
        )}
      </div>
    </section>
  );
}