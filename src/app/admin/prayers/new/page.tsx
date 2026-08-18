import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { NewPrayerForm } from "./new-prayer-form";

export default async function NewPrayerPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      situations: {
        orderBy: { name: "asc" },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28]">
      {/* Header */}
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
            Add Prayer Entry
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-3xl px-6 sm:px-8 py-12">
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4907a] font-medium">
            Sanctuary Curator
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1f3a28] mt-1">
            Add Prayer
          </h1>
          <p className="text-xs text-[#6b635e] mt-2">
            Select the category and situation, then paste your prayer text below.
          </p>
        </div>

        <NewPrayerForm categories={categories} />
      </main>
    </div>
  );
}