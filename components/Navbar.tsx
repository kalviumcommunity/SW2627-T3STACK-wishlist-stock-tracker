import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b border-slate-100">
      <Link href="/" className="text-xl font-bold">Tracker</Link>
      <div className="flex gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/wishlist">Wishlist</Link>
        <Link href="/stocks">Stocks</Link>
        <Link href="/login" className="text-blue-600 font-semibold">Login</Link>
      </div>
    </nav>
  );
}
