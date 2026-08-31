"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag, LayoutDashboard, Store } from "lucide-react";
import { useStore } from "./StoreProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { wishlist, cart } = useStore();

  const totalCartQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const links = [
    { href: "/", label: "Store", icon: Store },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">
            ⚡
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Flip<span className="text-blue-600">Track</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Badges */}
        <div className="flex items-center gap-3">
          {/* Wishlist Pill */}
          <div className="flex items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-1.5 text-xs font-bold text-rose-600">
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
            <span>Wishlist</span>
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[11px] text-white">
              {wishlist.length}
            </span>
          </div>

          {/* Cart Pill */}
          <div className="flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-1.5 text-xs font-bold text-blue-600">
            <ShoppingBag className="h-4 w-4 text-blue-600" />
            <span>Cart</span>
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white">
              {totalCartQty}
            </span>
          </div>
        </div>
      </div>
    </header>
  );

}