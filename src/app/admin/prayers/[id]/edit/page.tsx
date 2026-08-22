import { db } from "~/server/db";
import { PrayerForm } from "../../prayer-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Prayer | Sanctuary Admin" };

export default async function EditPrayerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  const prayers = await db.prayer.findMany({ select: { id: true, title: true, categoryId: true, body: true } });
  const prayer = await db.prayer.findUnique({ where: { id: params.id } });

  if (!prayer) notFound();

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/admin" className="inline-flex items-center space-x-2 text-xs font-semibold text-[#6b635e] hover:text-[#1f3a28] transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Curator Panel</span>
        </Link>
        <h1 className="font-serif text-2xl font-bold">Edit Devotional</h1>
        <PrayerForm categories={categories} prayers={prayers} initialData={prayer} />
      </div>
    </div>
  );
}