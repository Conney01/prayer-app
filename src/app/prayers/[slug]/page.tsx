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

  if (!prayer?.isPublished) {
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

  // Preserve the original text flow
  const paragraphs = prayer.body.split(/\n\n+/);

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] py-10 px-4 sm:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center justify-between border-b border-[#eedad2] pb-4">
          <Link
            href={prayer.category ? `/categories/${prayer.category.slug}` : "/dashboard"}
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{prayer.category?.name ?? "Back"}</span>
          </Link>

          <div className="flex items-center space-x-3">
            <FavoriteButton prayerId={prayer.id} initialIsFavorite={isSaved} />
          </div>
        </div>

        <article className="space-y-10 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-[#d4907a] text-[10px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{prayer.situation?.name ?? prayer.category.name}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f3a28]">
              {prayer.title}
            </h1>
          </div>

          <div className="font-serif text-base sm:text-lg text-[#1f3a28] leading-[1.8] space-y-8">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="max-w-xl mx-auto">
                {para}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}