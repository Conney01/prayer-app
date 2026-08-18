import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { FavoriteBtn } from "~/components/favorite-btn";

export default async function PrayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const prayer = await db.prayer.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
      situation: true,
      favorites: session?.user?.id
        ? { where: { userId: session.user.id } }
        : false,
    },
  });

  if (!prayer) {
    notFound();
  }

  const isFavorite = Boolean(prayer.favorites && prayer.favorites.length > 0);

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28]">
      <header className="sticky top-0 z-40 border-b border-[#eedad2] bg-[#fdf0ec]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-4xl items-center justify-between px-8">
          <Link
            href={`/categories/${prayer.category.slug}`}
            className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{prayer.category.name}</span>
          </Link>
          <Link href="/dashboard" className="text-xs uppercase tracking-[0.25em] text-[#1f3a28] font-medium">
            Sanctuary
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-8 py-20">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4907a] font-medium">
            {prayer.category.name} {prayer.situation ? `• ${prayer.situation.name}` : ""}
          </p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-light italic tracking-tight text-[#1f3a28]">
            {prayer.title}
          </h1>
        </div>

        <div className="my-10 flex justify-center">
          <div className="h-px w-16 bg-[#d4907a]/40" />
        </div>

        <div className="border border-[#eedad2] bg-[#faf3f0] p-10 sm:p-14 shadow-sm">
          <div className="whitespace-pre-line text-center font-serif text-lg sm:text-xl font-normal leading-[2] text-[#1f3a28]">
            {prayer.body}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center">
          <FavoriteBtn prayerId={prayer.id} initialIsFavorite={isFavorite} />
        </div>
      </main>
    </div>
  );
}