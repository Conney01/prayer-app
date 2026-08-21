import Link from "next/link";
import { auth } from "~/server/auth";
import { Sparkles, ArrowRight, Heart, ShieldCheck, Mail, MessageCircle, Instagram } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-between selection:bg-[#2d5a3d]/20">
      {/* Navigation Header */}
      <header className="mx-auto max-w-5xl w-full px-6 py-6 flex items-center justify-between border-b border-[#eedad2]">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-[#2d5a3d]" />
          <span className="font-serif text-lg font-bold tracking-tight text-[#1f3a28]">
            Sanctuary
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {session?.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-[#faf3f0] px-3.5 py-2 text-xs font-medium text-[#2d5a3d] hover:bg-white shadow-xs transition"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/support"
                className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-[#faf3f0] px-3.5 py-2 text-xs font-medium text-[#2d5a3d] hover:bg-white shadow-xs transition"
              >
                <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500/20" />
                <span>Support</span>
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl bg-[#2d5a3d] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1f3a28] transition"
              >
                My Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold text-[#1f3a28] hover:text-[#2d5a3d] transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-[#2d5a3d] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1f3a28] transition"
              >
                Begin Praying
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-3xl px-6 py-20 text-center space-y-8 my-auto">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[#eedad2] bg-[#faf3f0] px-4 py-1.5 text-xs text-[#6b635e]">
          <span className="h-2 w-2 rounded-full bg-[#2d5a3d]" />
          <span>Communion • Stillness • Renewal</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1f3a28] tracking-tight leading-[1.15]">
          Drawing near to God, <br />
          <span className="italic font-normal">one day at a time.</span>
        </h1>

        <p className="font-serif text-sm sm:text-base text-[#6b635e] max-w-xl mx-auto leading-relaxed">
          Prayer is not a duty or performance—it is the breath of the soul. Discover quiet spaces to anchor your heart, release anxiety, and walk closely with your Creator every single day.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={session?.user ? "/dashboard" : "/register"}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-[#2d5a3d] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#1f3a28] transition"
          >
            <span>Enter Sanctuary</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/support"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-[#eedad2] bg-[#faf3f0] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#1f3a28] hover:bg-white shadow-xs transition"
          >
            <Heart className="h-4 w-4 text-red-500 fill-red-500/20" />
            <span>Support App</span>
          </Link>
        </div>
      </main>

      {/* Footer with Social Links */}
      <footer className="mx-auto max-w-5xl w-full px-6 py-8 border-t border-[#eedad2] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#6b635e]">
          &copy; {new Date().getFullYear()} Sanctuary. Quiet daily Christian devotionals.
        </p>

        <div className="flex items-center space-x-6">
          <a
            href="mailto:support@conney.me"
            className="inline-flex items-center space-x-1.5 text-xs text-[#6b635e] hover:text-[#2d5a3d] transition"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </a>
          <a
            href="https://wa.me/254700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs text-[#6b635e] hover:text-[#2d5a3d] transition"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
          <a
            href="https://instagram.com/sanctuary"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs text-[#6b635e] hover:text-[#2d5a3d] transition"
          >
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </a>
        </div>
      </footer>
    </div>
  );
}