import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { Flame, Sparkles, BookOpen, ArrowRight, Heart, Bookmark, Shield, LogOut } from "lucide-react";
import { getUserStreak } from "~/lib/streak";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  // Retrieve user streak safely from database (never wiped by UI updates)
  const streak = userId ? await getUserStreak(userId) : { streakCount: 0 };
  const streakCount = streak?.streakCount ?? 0;

  // Automated daily scripture & reflection rotation based on date
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
  const todayAnchor = dailyReflections[todayIndex];

  // Calculate current week days dynamically for the streak calendar
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
  
  const days = [
    { label: "SAT", offset: -6 + ((currentDayOfWeek + 1) % 7) },
    { label: "SUN", offset: -5 + ((currentDayOfWeek + 1) % 7) },
    { label: "MON", offset: -4 + ((currentDayOfWeek + 1) % 7) },
    { label: "TUE", offset: -3 + ((currentDayOfWeek + 1) % 7) },
    { label: "WED", offset: -2 + ((currentDayOfWeek + 1) % 7) },
    { label: "THU", offset: -1 + ((currentDayOfWeek + 1) % 7) },
    { label: "FRI", offset: 0 },
  ];

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
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        
        {/* Top Header & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#eedad2] pb-6 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">
              Sanctuary Space
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#1f3a28] mt-1">
              Welcome back, {session?.user?.name ?? "Friend"}
            </h1>
          </div>
          
          <div className="flex items-center flex-wrap gap-2">
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

            <Link
              href="/api/auth/signout"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-white px-3.5 py-2 text-xs font-semibold text-[#6b635e] hover:text-red-600 hover:bg-[#faf3f0] transition shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </Link>
          </div>
        </div>

        {/* 7-Day Streak Calendar Bar */}
        <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-[#fdf0ec] p-2 border border-[#eedad2]">
                <Flame className="h-5 w-5 text-[#d4907a]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1f3a28]">
                  {streakCount} {streakCount === 1 ? "Day" : "Days"} in Stillness
                </h3>
                <p className="text-xs text-[#6b635e]">
                  Personal best: {Math.max(3, streakCount)} days • Every breath in prayer counts.
                </p>
              </div>
            </div>

            <span className="rounded-full border border-[#eedad2] bg-white px-4 py-1.5 text-[11px] font-semibold text-[#1f3a28] shadow-2xs">
              Grace over perfection
            </span>
          </div>

          {/* Week Days Row */}
          <div className="grid grid-cols-7 gap-2 pt-2 border-t border-[#eedad2]/60">
            {days.map((d, index) => {
              const targetDate = new Date();
              targetDate.setDate(today.getDate() + d.offset);
              const dayNum = targetDate.getDate();
              const isToday = index === 6;

              return (
                <div
                  key={d.label}
                  className={`flex flex-col items-center justify-center rounded-2xl p-3 transition ${
                    isToday
                      ? "border-2 border-[#d4907a] bg-white shadow-xs"
                      : "border border-[#eedad2]/50 bg-white/50 text-[#6b635e]"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b635e]">
                    {d.label}
                  </span>
                  <span className={`font-serif text-base font-bold mt-1 ${isToday ? "text-[#1f3a28]" : "text-[#6b635e]"}`}>
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-semibold text-[#d4907a] uppercase mt-0.5">
                      Today
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sacred Anchor: Automated Scripture & Reflection */}
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
                &ldquo;{todayAnchor.verse}&rdquo;
              </blockquote>
              <p className="text-xs text-[#6b635e] font-serif font-semibold pt-1">— {todayAnchor.reference}</p>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4907a]">
                Today&apos;s Reflection
              </span>
              <p className="font-serif text-sm sm:text-base text-[#1f3a28] leading-relaxed">
                {todayAnchor.reflection}
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

              return (
                <div
                  key={category.id}
                  className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-8 shadow-2xs hover:bg-white transition space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">
                        Collection {collectionNum}
                      </span>
                      <span className="text-xs text-[#6b635e] font-medium">
                        {situationCount} {situationCount === 1 ? "Situation" : "Situations"} • {prayerCount} {prayerCount === 1 ? "Prayer" : "Prayers"}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#1f3a28]">
                      {category.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-[#eedad2]/60 flex items-center justify-between">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#1f3a28] hover:text-[#d4907a] transition group"
                    >
                      <span>Enter Space</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <BookOpen className="h-4 w-4 text-[#6b635e]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}