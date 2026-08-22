import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";
import { ArrowLeft, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const category = await db.category.findUnique({
    where: { slug: params.slug },
    include: {
      situations: {
        include: {
          prayers: {
            where: { isPublished: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
      prayers: {
        where: { isPublished: true },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between border-b border-[#eedad2] pb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Sanctuary Dashboard</span>
          </Link>
          <span className="text-xs font-serif italic text-[#6b635e]">
            {category.name}
          </span>
        </div>

        <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-8 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">
            Prayer Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f3a28] mt-2">
            {category.name}
          </h1>
          <p className="text-xs text-[#6b635e] mt-2">
            {category.situations.length} Situations • {category.prayers.length} Prayers Available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {category.situations.map((situation) => {
            const prayersForSituation = situation.prayers;

            return (
              <div
                key={situation.id}
                className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-2xs hover:bg-white transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-5 w-5 text-[#2d5a3d] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#1f3a28]">
                        {situation.name}
                      </h3>
                      <span className="text-[11px] font-medium text-[#d4907a] uppercase tracking-wider">
                        {prayersForSituation.length} {prayersForSituation.length === 1 ? "Prayer" : "Prayers"}
                      </span>
                    </div>
                  </div>
                </div>

                {prayersForSituation.length > 0 && (
                  <div className="border-t border-[#eedad2]/60 pt-3 space-y-2">
                    {prayersForSituation.map((prayer, idx) => (
                      <Link
                        key={prayer.id}
                        href={`/prayers/${prayer.slug}`}
                        className="block rounded-xl border border-[#eedad2] bg-white p-3 text-xs text-[#1f3a28] hover:border-[#2d5a3d] transition shadow-2xs"
                      >
                        <span className="font-semibold font-serif">
                          Prayer {idx + 1}
                        </span>
                        <p className="line-clamp-2 text-[#6b635e] text-[11px] mt-1 font-serif">
                          {prayer.body}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}