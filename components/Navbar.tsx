"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/stocks", label: "Stocks" },
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
    <nav className="flex justify-between items-center px-6 py-4 bg-white border-b-2 border-black sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold text-black hover:underline">
        Tracker
      </Link>
      <div className="flex items-center gap-2">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1 font-bold border border-black ${
                active
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {label}
            </Link>
          );
        })}
        {user ? (
          <div className="flex items-center gap-2 ml-4 pl-4 border-l-2 border-black">
            <div className="px-3 py-1 font-bold text-black border border-black bg-gray-50">
              {user.name}
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 font-bold border border-black bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className={`ml-4 px-4 py-1 font-bold border border-black ${
              pathname === "/login"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
