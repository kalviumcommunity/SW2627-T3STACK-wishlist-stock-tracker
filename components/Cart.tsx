"use client";

import { useStore } from "./StoreProvider";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
  const formattedSubtotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(subtotal);

  return (
    <section className="bg-white p-6 border border-black sticky top-8">
      <div className="flex items-center justify-between mb-8 border-b border-black pb-4">
        <h2 className="text-xl font-bold text-black">
          My Cart
        </h2>
        <span className="font-bold text-black">
          {totalQuantity} items
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {cart.length === 0 ? (
          <div className="text-center py-8 border border-black">
            <p className="text-black font-bold">Your cart is empty.</p>
            <p className="text-black text-sm mt-2">Add items from your wishlist.</p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-black p-4 bg-gray-50">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-black bg-white text-3xl">
                  {item.image}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-black text-lg">{item.name}</h3>
                      <p className="text-sm font-bold mt-1">{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-white bg-red-600 px-3 py-1 font-bold text-sm border border-black hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 bg-black text-white font-bold border border-black"
                    >
                      -
                    </button>
                    <span className="font-bold border border-black px-4 py-1 text-center min-w-[3rem] bg-white">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-black text-white font-bold border border-black"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-4 pt-2 border-t border-black flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">₹{(item.priceValue * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t-2 border-black mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">Subtotal</span>
                <span className="font-bold">{formattedSubtotal}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold">Delivery</span>
                <span className="font-bold">Free</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-black">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold">{formattedSubtotal}</span>
              </div>
            </div>

            <button className="w-full bg-black text-white font-bold py-4 border border-black hover:bg-gray-800 mt-4 text-lg">
              Checkout Now
            </button>
          </>
        )}
      </div>
    </section>
  );
}