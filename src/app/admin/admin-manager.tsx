"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Shield, ArrowLeft, Trash2, Edit3, BookOpen, Layers, Sparkles, ChevronRight, Folder, Loader2 } from "lucide-react";
import { LogoutButton } from "~/components/logout-btn";
import { deletePrayerAction, deleteSituationAction, deleteCategoryAction } from "~/app/actions/admin-management";

type Prayer = { id: string; title: string; body: string; createdAt: Date };
type Situation = { id: string; name: string; slug: string; prayers: Prayer[] };
type Category = { id: string; name: string; slug: string; situations: Situation[]; prayers: Prayer[] };

export function AdminManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSituationId, setSelectedSituationId] = useState<string | null>(null);

  const selectedCategory = initialCategories.find((c) => c.id === selectedCategoryId);
  const selectedSituation = selectedCategory?.situations.find((s) => s.id === selectedSituationId);

  const totalSituations = initialCategories.reduce((acc, c) => acc + c.situations.length, 0);
  const totalPrayers = initialCategories.reduce((acc, c) => acc + c.situations.reduce((sAcc, sit) => sAcc + sit.prayers.length, 0) + c.prayers.length, 0);

  const handleDeleteCategory = (catId: string) => {
    if (!confirm("Are you sure you want to delete this category and all its situations and prayers?")) return;
    startTransition(async () => {
      await deleteCategoryAction(catId);
      setSelectedCategoryId(null);
      setSelectedSituationId(null);
      router.refresh();
    });
  };

  const handleDeleteSituation = (sitId: string) => {
    if (!confirm("Are you sure you want to delete this situation and all its prayers?")) return;
    startTransition(async () => {
      await deleteSituationAction(sitId);
      setSelectedSituationId(null);
      router.refresh();
    });
  };

  const handleDeletePrayer = (prayerId: string) => {
    if (!confirm("Are you sure you want to delete this prayer?")) return;
    startTransition(async () => {
      await deletePrayerAction(prayerId);
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-between pb-24">
      <div className="py-8 px-4 sm:px-8 max-w-5xl mx-auto w-full space-y-8">
        
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-xs flex items-center space-x-4">
            <div className="rounded-2xl bg-white p-3.5 text-[#2d5a3d] border border-[#eedad2]">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-[#6b635e] font-semibold uppercase tracking-wider">Categories</p>
              <h3 className="font-serif text-2xl font-bold text-[#1f3a28] mt-0.5">{initialCategories.length}</h3>
            </div>
          </div>

          <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-xs flex items-center space-x-4">
            <div className="rounded-2xl bg-white p-3.5 text-[#d4907a] border border-[#eedad2]">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-[#6b635e] font-semibold uppercase tracking-wider">Total Situations</p>
              <h3 className="font-serif text-2xl font-bold text-[#1f3a28] mt-0.5">{totalSituations}</h3>
            </div>
          </div>

          <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-xs flex items-center space-x-4">
            <div className="rounded-2xl bg-white p-3.5 text-emerald-800 border border-[#eedad2]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-[#6b635e] font-semibold uppercase tracking-wider">Total Prayers</p>
              <h3 className="font-serif text-2xl font-bold text-[#1f3a28] mt-0.5">{totalPrayers}</h3>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#6b635e]">
          <button
            onClick={() => { setSelectedCategoryId(null); setSelectedSituationId(null); }}
            className={`hover:text-[#1f3a28] transition ${!selectedCategoryId ? "text-[#d4907a] font-bold" : ""}`}
          >
            Collections
          </button>
          {selectedCategory && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <button
                onClick={() => setSelectedSituationId(null)}
                className={`hover:text-[#1f3a28] transition ${!selectedSituationId ? "text-[#d4907a] font-bold" : ""}`}
              >
                {selectedCategory.name}
              </button>
            </>
          )}
          {selectedSituation && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-[#d4907a] font-bold">{selectedSituation.name}</span>
            </>
          )}
        </div>

        {/* VIEW 1: CATEGORY CARDS GRID */}
        {!selectedCategoryId && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#1f3a28]">
              Select a Collection to Manage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialCategories.map((category, idx) => {
                const sitCount = category.situations.length;
                const prayCount = category.situations.reduce((acc, s) => acc + s.prayers.length, 0) + category.prayers.length;
                const colNum = String(idx + 1).padStart(2, "0");

                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="group rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-8 transition-all hover:border-[#2d5a3d] hover:shadow-md cursor-pointer flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">
                          Collection {colNum}
                        </span>
                        <span className="text-xs text-[#6b635e] font-medium">
                          {sitCount} Situations • {prayCount} Prayers
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#1f3a28] group-hover:text-[#2d5a3d] transition flex items-center space-x-2">
                        <Folder className="h-5 w-5 text-[#d4907a]" />
                        <span>{category.name}</span>
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-[#eedad2]/60 flex items-center justify-between text-xs font-semibold text-[#2d5a3d]">
                      <span>Manage Collection</span>
                      <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: SITUATION CARDS GRID FOR SELECTED CATEGORY */}
        {selectedCategoryId && !selectedSituationId && selectedCategory && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#eedad2] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">Manage Collection</span>
                <h2 className="font-serif text-2xl font-bold text-[#1f3a28] mt-1">{selectedCategory.name}</h2>
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDeleteCategory(selectedCategory.id)}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition shadow-xs disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                <span>Delete Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCategory.situations.length === 0 ? (
                <p className="text-xs text-[#6b635e] italic col-span-2">No situations in this collection yet.</p>
              ) : (
                selectedCategory.situations.map((situation) => (
                  <div
                    key={situation.id}
                    onClick={() => setSelectedSituationId(situation.id)}
                    className="group rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 transition-all hover:border-[#2d5a3d] hover:shadow-sm cursor-pointer flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-bold text-[#1f3a28] group-hover:text-[#2d5a3d] transition">
                        {situation.name}
                      </h3>
                      <p className="text-xs text-[#6b635e]">
                        {situation.prayers.length} {situation.prayers.length === 1 ? "Prayer" : "Prayers"} available
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#d4907a] transform group-hover:translate-x-1 transition-transform" />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: PRAYERS LIST FOR SELECTED SITUATION */}
        {selectedSituationId && selectedSituation && selectedCategory && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#eedad2] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">{selectedCategory.name}</span>
                <h2 className="font-serif text-2xl font-bold text-[#1f3a28] mt-1">{selectedSituation.name}</h2>
                <p className="text-xs text-[#6b635e] mt-0.5">{selectedSituation.prayers.length} prayers in this situation</p>
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDeleteSituation(selectedSituation.id)}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition shadow-xs disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                <span>Delete Situation</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedSituation.prayers.length === 0 ? (
                <p className="text-xs text-[#6b635e] italic">No prayers in this situation yet.</p>
              ) : (
                selectedSituation.prayers.map((prayer) => (
                  <div key={prayer.id} className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-serif text-base font-bold text-[#1f3a28]">{prayer.title}</h4>
                      <p className="text-xs text-[#6b635e] line-clamp-2 leading-relaxed">{prayer.body}</p>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Link
                        href={`/admin/prayers/${prayer.id}/edit`}
                        className="inline-flex items-center space-x-1 rounded-xl border border-[#eedad2] bg-white px-3.5 py-2 text-xs font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-2xs"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-[#2d5a3d]" />
                        <span>Edit</span>
                      </Link>

                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDeletePrayer(prayer.id)}
                        className="inline-flex items-center space-x-1 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition shadow-2xs disabled:opacity-50"
                        title="Delete prayer"
                      >
                        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin text-red-600" /> : <Trash2 className="h-3.5 w-3.5 text-red-600" />}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}