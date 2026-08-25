export default function Footer() {
  return (
    <footer className="p-4 text-center text-sm text-slate-500 border-t border-slate-100 mt-auto">
      &copy; {new Date().getFullYear()} Tracker. All rights reserved.
    </footer>
  );
}
