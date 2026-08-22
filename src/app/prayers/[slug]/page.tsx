import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { ArrowLeft, Sparkles } from "lucide-react";
import { FavoriteButton } from "~/components/favorite-btn";

export const dynamic = "force-dynamic";

export default async function PrayerPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const session = await auth();

  const prayer = await db.prayer.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      situation: true,
    },
  });

  if (!prayer || !prayer.isPublished) {
    notFound();
  }

  let isSaved = false;
  if (session?.user?.id) {
    const saved = await db.savedPrayer.findUnique({
      where: {
        userId_prayerId: {
          userId: session.user.id,
          prayerId: prayer.id,
        },
      },
    });
    isSaved = !!saved;
  }

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center justify-between border-b border-[#eedad2] pb-4">
          <Link
            href={prayer.category ? `/categories/${prayer.category.slug}` : "/dashboard"}
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{prayer.category?.name ?? "Back to Dashboard"}</span>
          </Link>

          <div className="flex items-center space-x-3">
            <FavoriteButton prayerId={prayer.id} initialIsFavorite={isSaved} />
          </div>
        </div>

        <article className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-8 sm:p-12 shadow-sm space-y-8">
          <div className="space-y-2 border-b border-[#eedad2]/60 pb-6">
            <div className="flex items-center space-x-2 text-[#d4907a] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>{prayer.situation?.name ?? prayer.category.name}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1f3a28] leading-tight">
              {prayer.title}
            </h1>
          </div>

          <div className="prose prose-stone font-serif text-base sm:text-lg text-[#1f3a28] leading-relaxed whitespace-pre-wrap">
            {prayer.body}
          </div>
        </article>
      </div>
    </div>
  );
}