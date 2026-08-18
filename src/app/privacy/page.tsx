import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28]">
      <header className="sticky top-0 z-40 border-b border-[#eedad2] bg-[#fdf0ec]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-4xl items-center justify-between px-8">
          <Link href="/" className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#6b635e] hover:text-[#1f3a28]">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return</span>
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4907a] font-medium">Privacy Policy</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-8 py-16">
        <h1 className="font-serif text-4xl font-light text-[#1f3a28]">Privacy Policy</h1>
        <p className="text-xs text-[#6b635e] mt-2">Last updated: August 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#6b635e]">
          <p>
            Your spiritual journey and prayer life are deeply personal. We are committed to protecting your privacy with the highest degree of respect.
          </p>
          <h2 className="font-serif text-xl text-[#1f3a28] pt-4">Information We Collect</h2>
          <p>
            We collect only the basic account details necessary to maintain your account and daily login streak: your name (optional), your email address, and encrypted passwords (or OAuth profile tokens).
          </p>
          <h2 className="font-serif text-xl text-[#1f3a28] pt-4">No Advertising or Data Selling</h2>
          <p>
            We never sell your data, track you across external sites, or place third-party ads within the sanctuary.
          </p>
        </div>
      </main>
    </div>
  );
}