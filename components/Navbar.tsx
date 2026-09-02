"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/stocks", label: "Stocks" },
  { href: "/cart", label: "Cart" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not logged in");
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname]); // Re-fetch on route change to keep it somewhat fresh

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
        Tracker
      </Link>
      <div className="flex items-center gap-3">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                active
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {label}
            </Link>
          );
        })}
        {user ? (
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
            <div className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-full">
              {user.name}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className={`ml-2 px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
              pathname === "/login"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
