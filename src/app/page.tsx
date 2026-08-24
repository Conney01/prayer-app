import Link from "next/link";
import { auth } from "~/server/auth";
import { PwaInstallPrompt } from "~/components/pwa-install-prompt";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-between relative">
      <div className="py-12 px-4 sm:px-8 max-w-4xl mx-auto w-full space-y-10 my-auto">
        
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white border border-[#eedad2] shadow-2xs">
            <span className="text-3xl">🕊️</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4907a] block">
            Sanctuary Space
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1f3a28] tracking-tight">
            Find Your Quiet Stillness
          </h1>
          <p className="text-xs sm:text-sm text-[#6b635e] max-w-lg mx-auto leading-relaxed">
            A peaceful digital sanctuary for daily devotions, guided prayers, and quiet reflection in God&apos;s constant presence.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {session?.user ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto rounded-2xl bg-[#2d5a3d] px-8 py-3.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1f3a28] transition text-center"
            >
              Enter Sanctuary
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-2xl bg-[#2d5a3d] px-8 py-3.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1f3a28] transition text-center"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto rounded-2xl border border-[#eedad2] bg-white px-8 py-3.5 text-xs font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition text-center shadow-2xs"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#6b635e] border-t border-[#eedad2]/60">
        <p>&copy; {new Date().getFullYear()} Sanctuary Space • Quiet stillness in God&apos;s constant presence.</p>
      </footer>

      {/* Floating App Install Prompt */}
      <PwaInstallPrompt />
    </div>
  );
}