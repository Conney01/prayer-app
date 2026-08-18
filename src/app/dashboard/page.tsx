import { redirect } from "next/navigation";
import { Flame, Quote, Sparkles } from "lucide-react";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { recordDailyLoginStreak } from "~/lib/streak";
import { FloatingParticles } from "~/components/floating-particles";
import { DashboardHub } from "~/components/dashboard-hub";
import { Navbar } from "~/components/navbar";

interface Motivation {
  day: string;
  theme: string;
  scripture: string;
  message: string;
}

const DAILY_MOTIVATIONS: Motivation[] = [
  {
    day: "Sunday",
    theme: "Rest & Sacred Renewal",
    scripture: "Come to me, all who labor and are heavy laden, and I will give you rest. — Matthew 11:28",
    message: "Today is an invitation to lay down the striving of the past week. Real rest is not just the absence of work; it is entering the quiet assurance that God is in control of your tomorrow.",
  },
  {
    day: "Monday",
    theme: "New Beginnings & Divine Strength",
    scripture: "His mercies never come to an end; they are new every morning. Great is Your faithfulness. — Lamentations 3:22-23",
    message: "Step into this fresh week with confidence. You do not walk into any challenge alone—God goes before you, and His grace is sufficient for every task ahead.",
  },
  {
    day: "Tuesday",
    theme: "Patience & Purposeful Steps",
    scripture: "Be still before the Lord and wait patiently for Him. — Psalm 37:7",
    message: "Trust the quiet work God is doing in your life. Even when progress feels slow, every faithful, honest step you take is seen and guided by His hand.",
  },
  {
    day: "Wednesday",
    theme: "Midweek Anchor & Unshakable Peace",
    scripture: "Do not be anxious about anything, but in everything by prayer present your requests to God. — Philippians 4:6",
    message: "When the demands of the week begin to feel heavy, let prayer be your breathing space. Hand your worries over to God and let His peace guard your heart.",
  },
  {
    day: "Thursday",
    theme: "Perseverance & Renewed Strength",
    scripture: "Those who wait on the Lord shall renew their strength; they shall mount up with wings like eagles. — Isaiah 40:31",
    message: "You have come too far to lose heart now. When your own energy runs low, lean directly on God's infinite strength to carry you through to completion.",
  },
  {
    day: "Friday",
    theme: "Gratitude & Remembering Goodness",
    scripture: "Give thanks to the Lord, for He is good; His steadfast love endures forever. — Psalm 107:1",
    message: "Take a quiet breath today and reflect on the moments of grace throughout this week. Cultivating a grateful heart turns ordinary days into sacred gifts.",
  },
  {
    day: "Saturday",
    theme: "Reflection & Quiet Stillness",
    scripture: "Peace I leave with you; my peace I give you. Let not your hearts be troubled. — John 14:27",
    message: "Pause and look back at how God sustained you through every day. Carry this calm, settled peace into your home, relationships, and rest.",
  },
];

const fallbackMotivation: Motivation = {
  day: "Today",
  theme: "Peace & Sacred Renewal",
  scripture: "Come to me, all who labor and are heavy laden, and I will give you rest. — Matthew 11:28",
  message: "Today is an invitation to lay down your striving and rest in God's peace.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";
  const user = await recordDailyLoginStreak(session.user.id);

  const [categories, allPrayers, userFavorites] = await Promise.all([
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { prayers: { where: { isPublished: true } } },
        },
      },
    }),
    db.prayer.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        situation: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        prayer: {
          include: {
            category: true,
            situation: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const streak = user?.currentStreak ?? 1;
  const longest = user?.longestStreak ?? 1;

  const dayIndex = new Date().getDay();
  const todayMotivation: Motivation = DAILY_MOTIVATIONS[dayIndex] ?? DAILY_MOTIVATIONS[0] ?? fallbackMotivation;

  const dailyCategory = categories.find((c) => c.slug === "daily-prayers") ?? categories[0];
  const otherCategories = categories.filter((c) => c.id !== dailyCategory?.id);
  const savedPrayersList = userFavorites.map((f) => f.prayer);

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28]">
      <Navbar streak={streak} isAdmin={isAdmin} />

      <section className="relative overflow-hidden border-b border-[#eedad2] pt-8 sm:pt-12 pb-12 sm:pb-16 px-4 sm:px-8">
        <FloatingParticles />
        <div className="relative z-20 mx-auto max-w-5xl space-y-8 sm:space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#eedad2] pb-8">
            <div>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#d4907a] font-medium">
                Welcome to your quiet space
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-light italic tracking-tight text-[#1f3a28] mt-1">
                {session.user.name ? `${session.user.name}'s Sanctuary` : "Sanctuary of Peace"}
              </h1>
            </div>

            <div className="relative overflow-hidden border border-orange-300/80 bg-gradient-to-br from-amber-50 via-[#faf3f0] to-orange-50 px-5 sm:px-6 py-3.5 sm:py-4 flex items-center space-x-4 shadow-[0_0_25px_rgba(249,115,22,0.22)]">
              <div className="relative flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-2.5 sm:p-3 text-white shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                <Flame className="h-5 w-5 sm:h-6 sm:w-6 fill-amber-200 text-white animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-orange-800">
                  Daily Prayer Streak
                </p>
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#1f3a28]">
                  {streak} <span className="text-xs font-sans font-medium text-orange-700">Days Glowing</span>
                </p>
                <p className="text-[10px] text-[#6b635e]">Best: {longest} days</p>
              </div>
            </div>
          </div>

          <div className="border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-10 shadow-[0_4px_25px_rgba(212,144,122,0.12)] relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3.5 max-w-3xl">
                <div className="flex items-center space-x-2 text-[#d4907a]">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-medium">
                    {todayMotivation.day}&apos;s Scripture &bull; {todayMotivation.theme}
                  </span>
                </div>

                <h2 className="font-serif text-xl sm:text-3xl font-light italic text-[#1f3a28] leading-snug">
                  &ldquo;{todayMotivation.scripture}&rdquo;
                </h2>

                <p className="text-xs sm:text-sm text-[#6b635e] font-sans leading-relaxed pt-1">
                  {todayMotivation.message}
                </p>
              </div>

              <div className="hidden md:flex flex-col items-center justify-center border-l border-[#eedad2] pl-8 text-center min-w-[130px]">
                <div className="rounded-full bg-[#2d5a3d]/10 p-3 text-[#2d5a3d] mb-1.5">
                  <Quote className="h-5 w-5" />
                </div>
                <p className="font-serif text-lg text-[#1f3a28]">{todayMotivation.day}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#d4907a]">Daily Focus</p>
              </div>
            </div>
          </div>

          <DashboardHub
            dailyCategory={dailyCategory}
            otherCategories={otherCategories}
            searchablePrayers={allPrayers}
            savedPrayers={savedPrayersList}
          />
        </div>
      </section>
    </div>
  );
}