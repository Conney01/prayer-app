import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28]">
      <header className="sticky top-0 z-40 border-b border-[#eedad2] bg-[#fdf0ec]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-4xl items-center justify-between px-8">
          <Link href="/" className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#6b635e] hover:text-[#1f3a28]">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return</span>
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4907a] font-medium">Terms of Service</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-8 py-16">
        <h1 className="font-serif text-4xl font-light text-[#1f3a28]">Terms of Service</h1>
        <p className="text-xs text-[#6b635e] mt-2">Last updated: August 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#6b635e]">
          <p>
            Welcome to Prayer Sanctuary. By creating an account or utilizing this service, you agree to engage with the platform in a respectful, peaceful manner.
          </p>
          <h2 className="font-serif text-xl text-[#1f3a28] pt-4">Purpose of the Sanctuary</h2>
          <p>
            Prayer Sanctuary provides written prayers, reflections, and habit-tracking tools for personal spiritual grounding. Content is offered for encouragement and spiritual practice only and does not constitute medical, legal, or psychological counseling.
          </p>
          <h2 className="font-serif text-xl text-[#1f3a28] pt-4">Account Integrity</h2>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
          </p>
        </div>
      </main>
    </div>
  );
}