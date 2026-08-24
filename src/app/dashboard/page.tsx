import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { Sparkles, BookOpen, ArrowRight, Heart, Bookmark, Shield, Sun } from "lucide-react";
import { completePrayerAction } from "~/app/actions/prayer-interactions";
import { Footer } from "~/components/footer";
import { LogoutButton } from "~/components/logout-btn";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  if (userId) {
    try {
      await completePrayerAction();
    } catch {
      // Graceful fallback
    }
  }

  const dailyReflections = [
    {
      verse: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
      reference: "1 Thessalonians 5:16-18",
      reflection: "In moments of quiet stillness, God invites us to release our heavy burdens. True prayer is not just about asking, but about resting in His constant presence throughout your day.",
    },
    {
      verse: "Cast all your anxiety on him because he cares for you.",
      reference: "1 Peter 5:7",
      reflection: "Whatever weighs on your mind right now—uncertainties, pressures, or fears—take a deep breath and gently place them in God's capable hands.",
    },
    {
      verse: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
      reference: "Psalm 34:18",
      reflection: "Your vulnerability is never hidden from God. He draws nearest precisely when your heart feels most tender and weary.",
    },
  ];

  const todayIndex = new Date().getDate() % dailyReflections.length;
  const todayAnchor = dailyReflections[todayIndex] ?? dailyReflections[0];

  const categories = await db.category.findMany({
    include: {
      situations: {
        include: {
          prayers: {
            where: { isPublished: true },
          },
        },
      },
      prayers: {
        where: { isPublished: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-between">
      <div className="py-8 px-4 sm:px-8 max-w-5xl mx-auto w-full space-y-10">
        
        {/* Top Header & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#eedad2] pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="Sanctuary Logo" className="w-9 h-9 object-contain rounded-full shadow-2xs border border-emerald-900/10" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">Sanctuary Space</span>
              <h1 className="font-serif text-3xl font-bold text-[#1f3a28] mt-1">
                Welcome back, {session?.user?.name ?? "Friend"}
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-wrap gap-2">
            {userRole === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex items-center space-x-1.5 rounded-xl border border-[#2d5a3d] bg-[#2d5a3d] text-white px-3.5 py-2 text-xs font-semibold hover:bg-[#1f3a28] transition shadow-2xs"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}
            <Link
              href="/dashboard/saved"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-white px-3.5 py-2 text-xs font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-2xs"
            >
              <Bookmark className="h-3.5 w-3.5 text-[#2d5a3d]" />
              <span>Saved</span>
            </Link>

            <Link
              href="/support"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-white px-3.5 py-2 text-xs font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-2xs"
            >
              <Heart className="h-3.5 w-3.5 text-[#d4907a]" />
              <span>Support Hub</span>
            </Link>

            <LogoutButton />
          </div>
        </div>

        {/* Daily Rotating Prayer Message Banner */}
        {(() => {
          const messages = [
            "A quiet moment to pause, pray, and be present with God.",
            "Slow down. Breathe. Make room for God.",
            "Step away from the noise and spend a moment with God.",
            "Whatever you're carrying today, bring it into God's presence.",
            "There is no perfect way to come to God. Just come.",
            "Leave the noise behind and be present with Him.",
            "A prayer for whatever your heart is carrying today."
          ];
          const todayMsg = messages[new Date().getDate() % messages.length];
          return (
            <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-2xs space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1f3a28] italic leading-relaxed">
                  &ldquo;{todayMsg}&rdquo;
                </h3>
                <p className="text-xs text-[#6b635e]">
                  Grace over perfection • Every breath in prayer counts.
                </p>
              </div>
              <div className="rounded-full bg-[#fdf0ec] p-4 border border-[#eedad2] shadow-2xs flex-shrink-0">
                <span className="text-3xl animate-pulse inline-block" title="Walking in Grace">🕊️</span>
              </div>
            </div>
          );
        })()}

        {/* Sacred Anchor & Reflection */}
        <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#eedad2]/60 pb-4">
            <div className="flex items-center space-x-2 text-[#d4907a] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Sacred Anchor & Reflection</span>
            </div>
            <span className="text-xs font-serif italic text-[#6b635e]">
              Daily Meditation
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#eedad2] bg-white p-6 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b635e]">
                Scripture Anchor
              </span>
              <blockquote className="font-serif text-base sm:text-lg text-[#1f3a28] italic leading-relaxed">
                &ldquo;{todayAnchor?.verse}&rdquo;
              </blockquote>
              <p className="text-xs text-[#6b635e] font-serif font-semibold pt-1">— {todayAnchor?.reference}</p>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4907a]">
                Today&apos;s Reflection
              </span>
              <p className="font-serif text-sm sm:text-base text-[#1f3a28] leading-relaxed">
                {todayAnchor?.reflection}
              </p>
            </div>
          </div>
        </div>

        {/* Prayer Collections Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1f3a28]">
                Prayer Collections ({categories.length})
              </h2>
              <p className="text-xs text-[#6b635e] mt-1">
                Explore devotions curated for life&apos;s moments
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, idx) => {
              const situationCount = category.situations.length;
              const prayerCount = category.prayers.length;
              const collectionNum = String(idx + 1).padStart(2, "0");
              const isDailyPrayers = category.name.toLowerCase().includes("daily prayer");

              return (
                <div
                  key={category.id}
                  className={`rounded-3xl p-8 transition space-y-6 flex flex-col justify-between shadow-2xs ${
                    isDailyPrayers
                      ? "border-2 border-[#d4907a] bg-white shadow-sm ring-4 ring-[#d4907a]/10"
                      : "border border-[#eedad2] bg-[#faf3f0] hover:bg-white"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDailyPrayers ? "text-[#d4907a] font-extrabold" : "text-[#d4907a]"}`}>
                        {isDailyPrayers ? "★ Featured Daily Routine" : `Collection ${collectionNum}`}
                      </span>
                      <span className="text-xs text-[#6b635e] font-medium">
                        {situationCount} {situationCount === 1 ? "Situation" : "Situations"} • {prayerCount} {prayerCount === 1 ? "Prayer" : "Prayers"}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#1f3a28] flex items-center space-x-2">
                      {isDailyPrayers && <Sun className="h-5 w-5 text-[#d4907a] inline mr-1" />}
                      <span>{category.name}</span>
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-[#eedad2]/60 flex items-center justify-between">
                    <Link
                      href={`/categories/${category.slug}`}
                      className={`inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider transition group ${
                        isDailyPrayers ? "text-[#d4907a] hover:text-[#1f3a28]" : "text-[#1f3a28] hover:text-[#d4907a]"
                      }`}
                    >
                      <span>{isDailyPrayers ? "Begin Daily Prayer" : "Enter Space"}</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                    {isDailyPrayers ? <Sun className="h-4 w-4 text-[#d4907a]" /> : <BookOpen className="h-4 w-4 text-[#6b635e]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Global Footer */}
      <div className="hidden md:block"><Footer /></div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-emerald-900/10 bg-[#fbf5f2]/98 py-1 backdrop-blur-md md:hidden shadow-2xl touch-manipulation">
        <a href="/dashboard" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-emerald-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Home
        </a>
        <a href="/dashboard/saved" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-emerald-800/80 hover:text-emerald-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          Saved
        </a>
        <a href="/support" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-emerald-800/80 hover:text-emerald-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          Support
        </a>
        <a href="/login" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-red-700/80 hover:text-red-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </a>
      </nav>
    </div>
  );
}