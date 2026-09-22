"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
    const body = isSignUp
      ? { name: form.name, email: form.email, password: form.password }
      : { email: form.email, password: form.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(data.message || "Success!");
        if (!isSignUp) {
          // Redirect to dashboard on login
          window.location.href = "/dashboard";
        } else {
          // Switch to login after signup
          setTimeout(() => {
            setIsSignUp(false);
            setSuccess("Account created! Please log in.");
            setForm({ name: "", email: form.email, password: "" });
          }, 1000);
        }
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="py-12 md:py-20 min-h-[80vh] flex flex-col justify-center bg-slate-50/50">
      <div className="mx-auto w-full max-w-md px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2">
              {isSignUp
                ? "Sign up to start tracking your wishlist"
                : "Log in to manage your wishlist and cart"}
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700 font-semibold mb-6 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700 font-semibold mb-6 rounded-xl">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  minLength={2}
                  className="w-full border border-slate-200 rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full border border-slate-200 rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full border border-slate-200 rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-medium pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white px-6 py-4 rounded-xl text-lg font-bold hover:bg-zinc-800 disabled:opacity-50 mt-2 shadow-md hover:shadow-lg transition-all"
            >
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Log In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setSuccess("");
              }}
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm font-semibold text-slate-500 mt-8 hover:text-slate-900 transition-colors">
          <Link href="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
