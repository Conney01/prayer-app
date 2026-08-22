import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { Sparkles, Calendar, BookOpen, ArrowRight, Heart } from "lucide-react";
import { getUserStreak } from "~/lib/streak";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const userName = session?.user?.name ?? "Friend";

  const streak = userId ? await getUserStreak(userId) : { streakCount: 0 };
  const streakCount = streak?.streakCount ?? 0;

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
        
        {/* Top Header & Support Hub */}
        <div className="flex items-center justify-between border-b border-[#eedad2] pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">
              Sanctuary Space
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#1f3a28] mt-1">
              Welcome back, {userName}
            </h1>
          </div>
          <Link
            href="/support"
            className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-white px-4 py-2 text-xs font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-2xs"
          >
            <Heart className="h-3.5 w-3.5 text-[#d4907a]" />
            <span>Support Hub</span>
          </Link>
        </div>

        {/* Streak Tracker & Daily Verse Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Streak Card */}
          <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6b635e]">
                Prayer Streak
              </span>
              <Calendar className="h-4 w-4 text-[#d4907a]" />
            </div>
            <div className="space-y-1">
              <div className="font-serif text-3xl font-bold text-[#1f3a28]">
                {streakCount} {streakCount === 1 ? "Day" : "Days"}
              </div>
              <p className="text-[11px] text-[#6b635e]">
                Keep your daily communion strong.
              </p>
            </div>
          </div>

          {/* Daily Verse & Reflection */}
          <div className="md:col-span-2 rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 text-[#d4907a] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Daily Verse & Reflection</span>
            </div>
            <blockquote className="font-serif text-base text-[#1f3a28] italic leading-relaxed">
              &ldquo;Rejoice always, pray continually, give thanks in all circumstances; for this is God&apos;s will for you in Christ Jesus.&rdquo;
            </blockquote>
            <p className="text-xs text-[#6b635e] font-serif">— 1 Thessalonians 5:16-18</p>
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