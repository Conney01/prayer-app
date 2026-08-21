import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { WeeklyStreak } from "~/components/weekly-streak";
import { PrayerHistory } from "~/components/prayer-history";
import { Heart, Sparkles, BookOpen, ArrowRight, ShieldCheck, Quote } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      favorites: {
        include: {
          prayer: {
            include: { category: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      completions: {
        include: {
          prayer: {
            include: { category: true },
          },
        },
        orderBy: { completedAt: "desc" },
        take: 8,
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { prayers: { where: { isPublished: true } } },
      },
    },
  });

  // Automated Daily Scripture & Meditation Selection
  // 1. Prioritize any prayer marked isFeatured
  // 2. Otherwise auto-rotate through prayers with descriptions/scriptures based on the day of the year
  const publishedPrayers = await db.prayer.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );

  const featured = publishedPrayers.find((p) => p.isFeatured);
  const dailyDevotion =
    featured ??
    (publishedPrayers.length > 0
      ? publishedPrayers[dayOfYear % publishedPrayers.length]
      : null);

  const completedDates = (user?.completions ?? []).map((c) => c.completedAt);
  const weekdayName = new Date().toLocaleDateString(undefined, { weekday: "long" });

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eedad2] pb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">
              Welcome to Your Quiet Space
            </span>
            <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#1f3a28]">
              {session.user.name ?? "Seeker"}&apos;s Sanctuary
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-[#faf3f0] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#2d5a3d] hover:bg-white shadow-xs transition"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Curator</span>
              </Link>
            )}
            <Link
              href="/"
              className="rounded-xl border border-[#eedad2] bg-[#faf3f0] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#6b635e] hover:bg-white shadow-xs transition"
            >
              Home
            </Link>
          </div>
        </header>

        {/* Weekly Habit & Streak Engine */}
        <WeeklyStreak
          currentStreak={user?.currentStreak ?? 0}
          longestStreak={user?.longestStreak ?? 0}
          completedDates={completedDates}
        />

        {/* Automated Scripture & Contemplation Anchor */}
        {dailyDevotion && (
          <div className="relative overflow-hidden rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#eedad2]/60 pb-3">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{weekdayName}&apos;s Scripture Anchor</span>
              </div>
              <span className="font-serif text-xs font-bold text-[#1f3a28]">
                {dailyDevotion.category.name}
              </span>
            </div>

            {dailyDevotion.description ? (
              <p className="mt-4 font-serif text-base sm:text-lg italic leading-relaxed text-[#1f3a28]">
                &ldquo;{dailyDevotion.description}&rdquo;
              </p>
            ) : null}

            <div className="mt-3">
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#1f3a28]">
                {dailyDevotion.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#1f3a28]/80 font-serif">
                {dailyDevotion.body}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-3 border-t border-[#eedad2]/40">
              <span className="text-[11px] text-[#6b635e]">
                Daily Meditation &amp; Stillness
              </span>
              <Link
                href={`/prayers/${dailyDevotion.slug}`}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-[#2d5a3d] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#1f3a28] transition"
              >
                <span>Enter Prayer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Categories Grid & Recent Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-[#eedad2]/60 pb-2">
              <h3 className="font-serif text-base font-bold text-[#1f3a28]">
                Prayer Collections
              </h3>
              <span className="text-[11px] text-[#6b635e]">
                {categories.length} Collections
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-5 shadow-xs transition hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-[#1f3a28] group-hover:text-[#2d5a3d] transition">
                      {cat.name}
                    </span>
                    <BookOpen className="h-4 w-4 text-[#6b635e]/60 group-hover:text-[#2d5a3d] transition" />
                  </div>
                  <p className="mt-2 text-[11px] text-[#6b635e]">
                    {cat._count.prayers} {cat._count.prayers === 1 ? "prayer" : "prayers"} available
                  </p>
                </Link>
              ))}
            </div>

            {user?.favorites && user.favorites.length > 0 && (
              <div className="pt-4 space-y-3">
                <div className="flex items-center space-x-2 border-b border-[#eedad2]/60 pb-2">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  <h3 className="font-serif text-base font-bold text-[#1f3a28]">
                    Saved Prayers ({user.favorites.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.favorites.map((fav) => (
                    <Link
                      key={fav.id}
                      href={`/prayers/${fav.prayer.slug}`}
                      className="rounded-xl border border-[#eedad2] bg-white p-3.5 transition hover:border-[#2d5a3d] shadow-2xs"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#d4907a]">
                        {fav.prayer.category.name}
                      </span>
                      <h4 className="font-serif text-xs font-semibold text-[#1f3a28] line-clamp-1 mt-0.5">
                        {fav.prayer.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <PrayerHistory completions={user?.completions ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}