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
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-md px-6">
        <div className="bg-white border-2 border-black p-8 md:p-10">
          <div className="text-center mb-8 border-b-2 border-black pb-4">
            <h1 className="text-3xl font-bold text-black">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-sm font-bold text-black mt-2">
              {isSignUp
                ? "Sign up to start tracking your wishlist"
                : "Log in to manage your wishlist and cart"}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-black px-4 py-3 text-sm text-red-700 font-bold mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-black px-4 py-3 text-sm text-green-700 font-bold mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-bold text-black mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  minLength={2}
                  className="w-full border-2 border-black bg-white px-4 py-3 text-sm font-medium"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-black mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full border-2 border-black bg-white px-4 py-3 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1.5">Password</label>
              <div className="flex gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full border-2 border-black bg-white px-4 py-3 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 py-3 border-2 border-black bg-gray-100 font-bold text-sm hover:bg-gray-200"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white px-6 py-4 text-lg font-bold border-2 border-black hover:bg-gray-800 disabled:opacity-50 mt-4"
            >
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center border-t-2 border-black pt-4">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setSuccess("");
              }}
              className="text-sm font-bold text-black underline hover:text-gray-600"
            >
              {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm font-bold text-black mt-6 underline">
          <Link href="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
