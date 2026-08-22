import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { Sparkles, Heart, ShieldCheck, ArrowRight, Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [categories, userData, dailyPrayer] = await Promise.all([
    db.category.findMany({
      include: {
        situations: true,
        prayers: { where: { isPublished: true } },
      },
      orderBy: { sortOrder: "asc" },
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      include: {
        savedPrayers: {
          include: {
            prayer: {
              include: { category: true },
            },
          },
        },
      },
    }),
    db.prayer.findFirst({
      where: { isPublished: true, isFeatured: true },
      include: { category: true },
    }),
  ]);

  const savedList = userData?.savedPrayers ?? [];

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex items-center justify-between border-b border-[#eedad2] pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">
              Sanctuary Space
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f3a28]">
              Welcome back, {session.user.name?.split(" ")[0] ?? "Seeker"}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-[#faf3f0] px-3.5 py-2 text-xs font-semibold text-[#2d5a3d] hover:bg-white shadow-xs transition"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}
            <Link
              href="/support"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-[#faf3f0] px-3.5 py-2 text-xs font-semibold text-[#2d5a3d] hover:bg-white shadow-xs transition"
            >
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500/20" />
              <span>Support Hub</span>
            </Link>
          </div>
        </header>

        {dailyPrayer && (
          <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-[#2d5a3d]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d5a3d]">
                Today&apos;s Devotional Anchor
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#d4907a]">
                {dailyPrayer.category.name}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1f3a28]">
                {dailyPrayer.title}
              </h2>
              <p className="font-serif text-xs sm:text-sm text-[#6b635e] mt-2 line-clamp-3 leading-relaxed">
                {dailyPrayer.body}
              </p>
            </div>
            <Link
              href={`/prayers/${dailyPrayer.slug}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2d5a3d] hover:underline pt-2"
            >
              <span>Read Full Devotion</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {savedList.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#eedad2]/60 pb-2">
              <Bookmark className="h-4 w-4 text-[#2d5a3d]" />
              <h2 className="font-serif text-lg font-bold text-[#1f3a28]">
                Saved Prayers ({savedList.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedList.map((item) => (
                <Link
                  key={item.id}
                  href={`/prayers/${item.prayer.slug}`}
                  className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-5 shadow-2xs hover:bg-white transition space-y-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4907a]">
                    {item.prayer.category.name}
                  </span>
                  <h3 className="font-serif text-sm font-bold text-[#1f3a28]">
                    {item.prayer.title}
                  </h3>
                  <p className="font-serif text-xs text-[#6b635e] line-clamp-2 leading-relaxed">
                    {item.prayer.body}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#eedad2]/60 pb-2">
            <h2 className="font-serif text-lg font-bold text-[#1f3a28]">
              Prayer Collections ({categories.length})
            </h2>
            <span className="text-xs text-[#6b635e]">
              Explore devotions curated for life&apos;s moments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-2xs hover:bg-white hover:border-[#2d5a3d]/30 transition group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6b635e]">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#d4907a]">
                      Collection {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      {cat.situations.length} Situations • {cat.prayers.length} Prayers
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1f3a28] group-hover:text-[#2d5a3d] transition">
                    {cat.name}
                  </h3>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-semibold text-[#2d5a3d]">
                  <span>Enter Space</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}