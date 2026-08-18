import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, BookOpen, CheckCircle, Sparkles, Layers, ExternalLink } from "lucide-react";
import { db } from "~/server/db";
import { auth, signOut } from "~/server/auth";
import { AdminPrayersTable } from "~/components/admin-prayers-table";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [prayers, categories, totalSituations] = await Promise.all([
    db.prayer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        situation: true,
      },
    }),
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, sortOrder: true },
    }),
    db.situation.count(),
  ]);

  const totalPrayers = prayers.length;
  const publishedCount = prayers.filter((p) => p.isPublished).length;
  const featuredCount = prayers.filter((p) => p.isFeatured).length;

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28]">
      {/* Top Header with Logo */}
      <header className="sticky top-0 z-40 border-b border-[#eedad2] bg-[#fdf0ec]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-8">
          <div className="flex items-center space-x-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-[#eedad2] bg-[#faf3f0] shadow-sm">
              <Image
                src="/logo.jpg"
                alt="Sanctuary Logo"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#1f3a28]">
              Prayer Sanctuary &mdash; Curator
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="flex items-center space-x-1.5 text-xs uppercase tracking-[0.15em] text-[#6b635e] hover:text-[#1f3a28] transition font-medium"
            >
              <span>Member View</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/admin/prayers/new"
              className="flex items-center space-x-1.5 bg-[#2d5a3d] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-[#1f3a28] transition shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Prayer</span>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="text-xs uppercase tracking-[0.15em] text-[#6b635e] hover:text-[#1f3a28] transition">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-8 py-12">
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4907a] font-medium">Curator Portal</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1f3a28] mt-1">
            Library Management
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="border border-[#eedad2] bg-[#faf3f0] p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#6b635e] mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em]">Total Prayers</span>
              <BookOpen className="h-4 w-4 text-[#2d5a3d]" />
            </div>
            <p className="font-serif text-3xl text-[#1f3a28]">{totalPrayers}</p>
          </div>

          <div className="border border-[#eedad2] bg-[#faf3f0] p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#6b635e] mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em]">Published</span>
              <CheckCircle className="h-4 w-4 text-[#2d5a3d]" />
            </div>
            <p className="font-serif text-3xl text-[#1f3a28]">{publishedCount}</p>
          </div>

          <div className="border border-[#eedad2] bg-[#faf3f0] p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#6b635e] mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em]">Featured</span>
              <Sparkles className="h-4 w-4 text-[#d4907a]" />
            </div>
            <p className="font-serif text-3xl text-[#1f3a28]">{featuredCount}</p>
          </div>

          <div className="border border-[#eedad2] bg-[#faf3f0] p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#6b635e] mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em]">Situations</span>
              <Layers className="h-4 w-4 text-[#2d5a3d]" />
            </div>
            <p className="font-serif text-3xl text-[#1f3a28]">{totalSituations}</p>
          </div>
        </div>

        {/* Filterable Table */}
        <AdminPrayersTable initialPrayers={prayers} categories={categories} />
      </main>
    </div>
  );
}