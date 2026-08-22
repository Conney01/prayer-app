import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";
import { ArrowLeft, Sparkles } from "lucide-react";
import { CategorySituationsClient } from "./category-situations-client";

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
        {/* Navigation Bar */}
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

        {/* Collection Hero Header */}
        <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-8 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">
              Prayer Collection
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f3a28] mt-2">
            {category.name}
          </h1>
          <p className="text-xs text-[#6b635e] mt-2">
            {category.situations.length} Situations • {category.prayers.length} Prayers Available
          </p>
        </div>

        {/* Situations with Collapsible Accordion Dropdowns */}
        <CategorySituationsClient situations={category.situations} />
      </div>
    </div>
  );
}