import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "~/server/db";
import { CategoryIcon } from "~/components/category-icon";
import { SituationCardsGrid } from "~/components/situation-cards-grid";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await db.category.findUnique({
    where: { slug },
    include: {
      situations: {
        orderBy: { name: "asc" },
        include: {
          prayers: {
            where: { isPublished: true },
            orderBy: { createdAt: "asc" },
          },
        },
      },
      prayers: {
        where: { isPublished: true, situationId: null },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const totalPrayers =
    category.situations.reduce((acc, s) => acc + s.prayers.length, 0) + category.prayers.length;

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#eedad2] bg-[#fdf0ec]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-8">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#6b635e] hover:text-[#1f3a28] transition font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Sanctuary Dashboard</span>
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4907a] font-medium">
            Collection {String(category.sortOrder).padStart(2, "0")}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-16">
        {/* Category Header Banner */}
        <div className="flex items-center space-x-6 border-b border-[#eedad2] pb-10 mb-12">
          <div className="border border-[#eedad2] bg-[#faf3f0] p-4 text-[#2d5a3d] shadow-sm">
            <CategoryIcon name={category.icon} className="h-8 w-8" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4907a] font-medium">
              Prayer Collection
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1f3a28] mt-1">
              {category.name}
            </h1>
            <p className="text-xs text-[#6b635e] mt-1">
              {category.situations.length} Situations &bull; {totalPrayers} Prayers Available
            </p>
          </div>
        </div>

        {/* Interactive Cards Grid */}
        <SituationCardsGrid situations={category.situations} />
      </main>
    </div>
  );
}