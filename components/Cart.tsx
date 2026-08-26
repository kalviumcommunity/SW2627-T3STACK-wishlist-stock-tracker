"use client";

import { ShoppingBag, ArrowRight, ShieldCheck, Trash2 } from "lucide-react";
import { useStore } from "./StoreProvider";

export default function Cart() {
  const { cart, removeFromCart } = useStore();

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
  const formattedSubtotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(subtotal);

  return (
    <section className="rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 sticky top-8 transition-all">
      <div className="flex items-center justify-between mb-8">
        <h2 className="flex items-center gap-2.5 text-2xl font-bold text-slate-800">
          <ShoppingBag className="h-6 w-6 text-blue-500 fill-blue-500/20" />
          My Cart
        </h2>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
          {totalQuantity}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {cart.length === 0 ? (
          <p className="text-center text-slate-500 py-4">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all">
               <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-100 text-3xl shadow-sm">
                {item.image}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-sm font-medium text-emerald-600 mt-1">Ready to checkout</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                   <span className="text-sm text-slate-500">Qty: {item.quantity}</span>
                   <p className="text-lg font-extrabold text-slate-900">{item.price}</p>
                </div>
              </div>
            </div>
          ))
        )}
        
        {cart.length > 0 && (
          <>
            <div className="pt-4 border-t border-slate-100 border-dashed">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-800">{formattedSubtotal}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500">Delivery</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-lg font-bold text-slate-800">Total</span>
                <span className="text-2xl font-extrabold text-slate-900">{formattedSubtotal}</span>
              </div>
            </div>

            <button className="group mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-[0.98] transition-all">
              Checkout Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}

        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 mt-2">
          <ShieldCheck className="h-4 w-4" />
          Secure Encrypted Checkout
        </div>
      </div>
    </section>
  );
}