import Link from "next/link";
import { db } from "~/server/db";
import { Plus, Shield, ArrowLeft, Trash2, Edit3, BookOpen, Layers, Sparkles } from "lucide-react";
import { LogoutButton } from "~/components/logout-btn";
import { deletePrayerAction, deleteSituationAction, deleteCategoryAction } from "~/app/actions/admin-management";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const categories = await db.category.findMany({
    include: {
      situations: {
        include: {
          prayers: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
      prayers: {
        where: { situationId: null },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-between pb-24">
      <div className="py-8 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-10">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#eedad2] pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-2xl bg-[#2d5a3d] p-3 text-white shadow-xs">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">Curator Command Center</span>
              <h1 className="font-serif text-3xl font-bold text-[#1f3a28] mt-1">
                Sanctuary Administration
              </h1>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-white px-4 py-2.5 text-xs font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#2d5a3d]" />
              <span>Back to App</span>
            </Link>

            <Link
              href="/admin/generator"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[#d4907a] bg-[#faf3f0] px-4 py-2.5 text-xs font-semibold text-[#1f3a28] hover:bg-white transition shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#d4907a]" />
              <span>AI Generator</span>
            </Link>

            <Link
              href="/admin/prayers/new"
              className="inline-flex items-center space-x-1.5 rounded-xl bg-[#2d5a3d] text-white px-4 py-2.5 text-xs font-semibold hover:bg-[#1f3a28] transition shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Devotional</span>
            </Link>

            <LogoutButton />
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-xs flex items-center space-x-4">
            <div className="rounded-2xl bg-white p-3.5 text-[#2d5a3d] border border-[#eedad2]">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-[#6b635e] font-semibold uppercase tracking-wider">Categories</p>
              <h3 className="font-serif text-2xl font-bold text-[#1f3a28] mt-0.5">{categories.length}</h3>
            </div>
          </div>

          <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-xs flex items-center space-x-4">
            <div className="rounded-2xl bg-white p-3.5 text-[#d4907a] border border-[#eedad2]">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-[#6b635e] font-semibold uppercase tracking-wider">Total Situations</p>
              <h3 className="font-serif text-2xl font-bold text-[#1f3a28] mt-0.5">
                {categories.reduce((acc, c) => acc + c.situations.length, 0)}
              </h3>
            </div>
          </div>

          <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-xs flex items-center space-x-4">
            <div className="rounded-2xl bg-white p-3.5 text-emerald-800 border border-[#eedad2]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-[#6b635e] font-semibold uppercase tracking-wider">Total Prayers</p>
              <h3 className="font-serif text-2xl font-bold text-[#1f3a28] mt-0.5">
                {categories.reduce((acc, c) => acc + c.situations.reduce((sAcc, sit) => sAcc + sit.prayers.length, 0) + c.prayers.length, 0)}
              </h3>
            </div>
          </div>
        </div>

        {/* Categories, Situations & Prayers Management Tree */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#1f3a28]">
              Manage Collections & Prayers
            </h2>
            <p className="text-xs text-[#6b635e]">
              Edit or remove devotions, situations, and categories
            </p>
          </div>

          <div className="space-y-6">
            {categories.map((category, catIdx) => (
              <div key={category.id} className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-xs space-y-6">
                
                {/* Category Header & Delete Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#eedad2] pb-4 gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">
                      Collection {String(catIdx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#1f3a28] mt-1">
                      {category.name}
                    </h3>
                  </div>

                  <form action={async () => {
                    "use server";
                    await deleteCategoryAction(category.id);
                  }}>
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition shadow-xs"
                      title="Delete entire category and all its contents"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Category</span>
                    </button>
                  </form>
                </div>

                {/* Situations List */}
                <div className="space-y-4 pl-0 sm:pl-4">
                  {category.situations.length === 0 ? (
                    <p className="text-xs text-[#6b635e] italic">No situations in this category yet.</p>
                  ) : (
                    category.situations.map((situation) => (
                      <div key={situation.id} className="rounded-2xl border border-[#eedad2]/70 bg-white p-5 space-y-4 shadow-2xs">
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#1f3a28]">
                              {situation.name}
                            </h4>
                            <p className="text-[11px] text-[#6b635e]">
                              {situation.prayers.length} {situation.prayers.length === 1 ? "Prayer" : "Prayers"} available
                            </p>
                          </div>

                          <form action={async () => {
                            "use server";
                            await deleteSituationAction(situation.id);
                          }}>
                            <button
                              type="submit"
                              className="inline-flex items-center space-x-1 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100 transition"
                              title="Delete situation and its prayers"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Delete Situation</span>
                            </button>
                          </form>
                        </div>

                        {/* Prayers under Situation */}
                        <div className="space-y-2 pt-2 border-t border-[#eedad2]/40">
                          {situation.prayers.map((prayer) => (
                            <div key={prayer.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[#faf3f0] transition">
                              <div className="truncate pr-4">
                                <span className="text-xs font-semibold text-[#1f3a28]">{prayer.title}</span>
                                <p className="text-[11px] text-[#6b635e] truncate mt-0.5">{prayer.body}</p>
                              </div>

                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <Link
                                  href={`/admin/prayers/${prayer.id}/edit`}
                                  className="inline-flex items-center space-x-1 rounded-lg border border-[#eedad2] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition"
                                >
                                  <Edit3 className="h-3 w-3 text-[#2d5a3d]" />
                                  <span>Edit</span>
                                </Link>

                                <form action={async () => {
                                  "use server";
                                  await deletePrayerAction(prayer.id);
                                }}>
                                  <button
                                    type="submit"
                                    className="p-1.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition"
                                    title="Delete prayer"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </form>
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}