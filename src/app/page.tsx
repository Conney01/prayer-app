import Link from "next/link";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-between selection:bg-[#eedad2]">
      
      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-serif font-bold text-base tracking-wide text-[#1f3a28]">
            • PRAYER SANCTUARY
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-widest text-[#6b635e]">
          <Link href="#why" className="hover:text-[#1f3a28] transition">Why We Pray</Link>
          <Link href="#practice" className="hover:text-[#1f3a28] transition">The Practice</Link>
          <Link href="#about" className="hover:text-[#1f3a28] transition">About</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href={session ? "/dashboard" : "/login"}
            className="text-xs font-semibold uppercase tracking-widest text-[#1f3a28] hover:text-[#d4907a] transition"
          >
            Sign In
          </Link>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="rounded-xl bg-[#2d5a3d] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1f3a28] transition shadow-2xs"
          >
            Begin Praying
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center space-x-3 rounded-full border border-[#eedad2] bg-white/60 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6b635e] shadow-2xs">
          <span>Communion</span>
          <span>•</span>
          <span>Stillness</span>
          <span>•</span>
          <span>Renewal</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-7xl font-bold text-[#1f3a28] tracking-tight leading-[1.1]">
          Drawing near to God, <br />
          <span className="italic font-normal">one day at a time.</span>
        </h1>

        <p className="font-serif text-base sm:text-lg text-[#6b635e] max-w-2xl leading-relaxed">
          Prayer is not a duty or performance—it is the breath of the soul. Discover quiet spaces to anchor your heart, release anxiety, and walk closely with your Creator every single day.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={session ? "/dashboard" : "/login"}
            className="w-full sm:w-auto rounded-2xl bg-[#2d5a3d] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1f3a28] transition shadow-xs text-center"
          >
            Begin Praying →
          </Link>
          <Link
            href="/support"
            className="w-full sm:w-auto rounded-2xl border border-[#eedad2] bg-white px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-xs text-center"
          >
            Support App
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-[#eedad2]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6b635e] font-serif gap-4">
        <p>© 2026 Sanctuary. Quiet daily Christian devotionals.</p>
        <div className="flex items-center space-x-6 text-[11px] uppercase tracking-wider font-sans">
          <Link href="/privacy" className="hover:text-[#1f3a28] transition">Email</Link>
          <Link href="/support" className="hover:text-[#1f3a28] transition">WhatsApp</Link>
          <Link href="/terms" className="hover:text-[#1f3a28] transition">Socials</Link>
        </div>
      </footer>

    </div>
  );
}