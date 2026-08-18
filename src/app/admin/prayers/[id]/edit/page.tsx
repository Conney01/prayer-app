import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { EditPrayerForm } from "./edit-prayer-form";

export default async function EditPrayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [prayer, categories] = await Promise.all([
    db.prayer.findUnique({
      where: { id },
    }),
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        situations: {
          orderBy: { name: "asc" },
        },
      },
    }),
  ]);

  if (!prayer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28]">
      <header className="sticky top-0 z-40 border-b border-[#eedad2] bg-[#fdf0ec]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-3xl items-center justify-between px-6 sm:px-8">
          <Link
            href="/admin"
            className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#6b635e] hover:text-[#1f3a28] transition font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Curator</span>
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4907a] font-medium">
            Edit Prayer
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 sm:px-8 py-12">
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4907a] font-medium">Curator Portal</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1f3a28] mt-1">
            Edit Prayer
          </h1>
          <p className="text-xs text-[#6b635e] mt-2">
            Modify text, update category assignment, or toggle publication status.
          </p>
        </div>

        <EditPrayerForm prayer={prayer} categories={categories} />
      </main>
    </div>
  );
}