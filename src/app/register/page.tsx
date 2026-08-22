"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!acceptedTerms) {
      setError("You must accept the Terms & Conditions to register.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = (await res.json()) as { message?: string };
        setError(data.message ?? "Registration failed.");
      }
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-between py-8 px-4 sm:px-8">
      <div className="max-w-md mx-auto w-full space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#1f3a28]">
            Begin Your Journey
          </h1>
          <p className="text-xs text-[#6b635e]">
            Create an account to track your prayer rhythm and streaks
          </p>
        </div>

        <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-2xs">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 text-center font-medium">
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-[#eedad2] bg-white p-3 text-xs text-[#1f3a28] focus:border-[#d4907a] outline-none transition"
            />

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

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-[#eedad2] bg-white p-3 text-xs text-[#1f3a28] focus:border-[#d4907a] outline-none transition"
            />

            {/* Scrollable Terms & Conditions Box */}
            <div className="space-y-2 pt-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b635e]">
                Terms & Conditions
              </label>
              <div className="h-24 overflow-y-auto rounded-xl border border-[#eedad2] bg-white p-3 text-[11px] text-[#6b635e] leading-relaxed space-y-2 shadow-inner">
                <p className="font-bold text-[#1f3a28]">Sanctuary Community Guidelines</p>
                <p>
                  By registering an account with Sanctuary, you agree to uphold a spirit of reverence, prayer, and respect. Your data and devotional history are securely protected.
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="reg-terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="rounded border-[#eedad2] text-[#2d5a3d] focus:ring-[#2d5a3d]"
                />
                <label htmlFor="reg-terms" className="text-[11px] text-[#1f3a28] font-medium cursor-pointer">
                  I agree to the Terms & Conditions
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#2d5a3d] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1f3a28] transition shadow-2xs cursor-pointer"
            >
              Create Account
            </button>

            <p className="text-center text-[11px] text-[#6b635e]">
              Already have an account? <Link href="/login" className="text-[#d4907a] font-semibold underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      <footer className="text-center text-xs text-[#6b635e] font-serif pt-8">
        <p>© 2026 Sanctuary. Grace over perfection.</p>
      </footer>
    </div>
  );
}