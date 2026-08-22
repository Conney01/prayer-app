"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full rounded-xl border border-[#eedad2] bg-white py-3 text-xs font-bold uppercase tracking-wider text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-2xs"
      >
        Continue with Google
      </button>
      <div className="text-center text-[10px] text-[#6b635e] uppercase tracking-widest">Or with email</div>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border border-[#eedad2] bg-white p-3 text-xs text-[#1f3a28] focus:border-[#d4907a] outline-none transition"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-xl border border-[#eedad2] bg-white p-3 text-xs text-[#1f3a28] focus:border-[#d4907a] outline-none transition"
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-[#2d5a3d] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1f3a28] transition shadow-2xs"
      >
        Sign In
      </button>
      <p className="text-center text-[11px] text-[#6b635e]">
        Don&apos;t have an account? <Link href="/register" className="text-[#d4907a] font-semibold">Create one</Link>
      </p>
    </form>
  );
}