"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("Please read and accept the Terms & Conditions to sign in.");
      return;
    }
    setError("");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("An unexpected error occurred during sign in.");
    }
  };

  const handleGoogleSignIn = async () => {
    if (!acceptedTerms) {
      setError("Please read and accept the Terms & Conditions to continue with Google.");
      return;
    }
    setError("");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error("Google Sign-In Exception:", err);
      setError("Failed to connect to Google. Please check environment variables.");
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 text-center font-medium">
          {error}
        </div>
      )}

      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full rounded-xl border border-[#eedad2] bg-white py-3 text-xs font-bold uppercase tracking-wider text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-2xs cursor-pointer"
      >
        Continue with Google
      </button>

      <div className="text-center text-[10px] text-[#6b635e] uppercase tracking-widest">Or with email</div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-[#eedad2] bg-white p-3 text-xs text-[#1f3a28] focus:border-[#d4907a] outline-none transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-xl border border-[#eedad2] bg-white p-3 text-xs text-[#1f3a28] focus:border-[#d4907a] outline-none transition"
        />

        {/* Scrollable Terms & Conditions Box */}
        <div className="space-y-2 pt-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b635e]">
            Terms & Conditions (Please review to proceed)
          </label>
          <div 
            className="h-24 overflow-y-auto rounded-xl border border-[#eedad2] bg-white p-3 text-[11px] text-[#6b635e] leading-relaxed space-y-2 shadow-inner"
          >
            <p className="font-bold text-[#1f3a28]">Sanctuary Space Agreement</p>
            <p>
              Welcome to Sanctuary. By accessing our platform, you agree to engage in reverence, respect, and peaceful reflection. Your personal prayer data, streaks, and saved devotions are securely maintained in accordance with our privacy practices.
            </p>
            <p>
              Grace over perfection guides our community. Please maintain confidentiality, respect fellow believers, and use this space strictly for personal and communal spiritual edification.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="rounded border-[#eedad2] text-[#2d5a3d] focus:ring-[#2d5a3d]"
            />
            <label htmlFor="terms" className="text-[11px] text-[#1f3a28] font-medium cursor-pointer">
              I have read and accept the Terms & Conditions
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#2d5a3d] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1f3a28] transition shadow-2xs cursor-pointer"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-[11px] text-[#6b635e]">
        Don&apos;t have an account? <Link href="/register" className="text-[#d4907a] font-semibold underline">Create one</Link>
      </p>
    </div>
  );
}