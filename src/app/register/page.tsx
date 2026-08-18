"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  function handleGoogleSignIn() {
    void signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex items-center space-x-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[#eedad2] bg-[#faf3f0] shadow-sm">
            <Image src="/logo.jpg" alt="Logo" fill sizes="40px" className="object-cover" priority />
          </div>
          <span className="font-serif text-lg font-semibold uppercase tracking-[0.25em] text-[#1f3a28]">
            Sanctuary
          </span>
        </Link>
        <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-light italic text-[#1f3a28]">
          Begin Your Journey
        </h2>
        <p className="mt-1 text-xs text-[#6b635e]">Create a sacred space for your daily prayers</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="border border-[#eedad2] bg-[#faf3f0] px-6 py-8 sm:p-10 shadow-sm space-y-6">
          {error && (
            <div className="border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-3 border border-[#eedad2] bg-white py-3 px-4 text-xs uppercase tracking-[0.18em] font-medium text-[#1f3a28] hover:bg-[#fdf0ec] transition cursor-pointer"
          >
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#eedad2]" />
            <span className="bg-[#faf3f0] px-3 text-[10px] uppercase tracking-[0.2em] text-[#6b635e] absolute">
              Or register with email
            </span>
          </div>

          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            className="space-y-4 pt-2"
          >
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-[#1f3a28] mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-[#1f3a28] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-[#1f3a28] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2d5a3d] py-3 text-xs font-medium uppercase tracking-[0.2em] text-white hover:bg-[#1f3a28] transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#eedad2]/60">
            <p className="text-xs text-[#6b635e]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#2d5a3d] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}