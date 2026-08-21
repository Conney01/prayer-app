"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Sparkles, Loader2 } from "lucide-react";
import { createCategoryAction, deleteCategoryAction, addSituationAction, removeSituationAction, createPrayerAction } from "~/app/actions/admin";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  situations: string[];
}

export function NewPrayerForm({ initialCategories }: { initialCategories: CategoryData[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategories[0]?.id ?? "");
  const [selectedSituation, setSelectedSituation] = useState(initialCategories[0]?.situations[0] ?? "");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSituationName, setNewSituationName] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const currentCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat && cat.situations.length > 0) {
      setSelectedSituation(cat.situations[0]!);
    } else {
      setSelectedSituation("");
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    startTransition(async () => {
      const res = await createCategoryAction(newCategoryName);
      if (res.success && res.category) {
        setCategories((prev) => [...prev, res.category]);
        setSelectedCategoryId(res.category.id);
        setSelectedSituation("");
        setNewCategoryName("");
        setShowCategoryModal(false);
        setStatusMessage("Category created successfully.");
      } else {
        setStatusMessage(res.error ?? "Failed to create category.");
      }
    });
  };

  const handleDeleteCategory = (catId: string) => {
    if (!confirm("Are you sure you want to delete this collection and its situations?")) return;
    startTransition(async () => {
      const res = await deleteCategoryAction(catId);
      if (res.success) {
        const updated = categories.filter((c) => c.id !== catId);
        setCategories(updated);
        if (updated.length > 0) {
          setSelectedCategoryId(updated[0]!.id);
          setSelectedSituation(updated[0]!.situations[0] ?? "");
        }
        setStatusMessage("Category deleted.");
      }
    });
  };

  const handleAddSituation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSituationName.trim() || !selectedCategoryId) return;

    startTransition(async () => {
      const res = await addSituationAction(selectedCategoryId, newSituationName);
      if (res.success && res.situations) {
        setCategories((prev) =>
          prev.map((c) => (c.id === selectedCategoryId ? { ...c, situations: res.situations } : c))
        );
        setSelectedSituation(newSituationName.trim());
        setNewSituationName("");
        setStatusMessage("Situation added.");
      }
    });
  };

  const handleRemoveSituation = (sitName: string) => {
    if (!confirm(`Remove situation "${sitName}"?`)) return;
    startTransition(async () => {
      const res = await removeSituationAction(selectedCategoryId, sitName);
      if (res.success && res.situations) {
        setCategories((prev) =>
          prev.map((c) => (c.id === selectedCategoryId ? { ...c, situations: res.situations } : c))
        );
        setSelectedSituation(res.situations[0] ?? "");
        setStatusMessage("Situation removed.");
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");

    if (!title.trim() || !body.trim() || !selectedCategoryId) {
      setStatusMessage("Please fill in Title, Prayer Text, and Category.");
      return;
    }

    startTransition(async () => {
      const res = await createPrayerAction({
        title,
        categoryId: selectedCategoryId,
        situation: selectedSituation,
        body,
        description,
        isFeatured,
      });

      if (res.success) {
        setStatusMessage("Prayer saved successfully!");
        setTitle("");
        setBody("");
        setDescription("");
        setIsFeatured(false);
        router.refresh();
      } else {
        setStatusMessage(res.error ?? "Failed to save prayer.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between border-b border-[#eedad2] pb-4">
          <Link
            href="/admin"
            className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Admin Hub</span>
          </Link>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4907a] font-bold">
            Sanctuary Curator Suite
          </span>
        </div>

        {statusMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
                  1. Category *
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="text-[10px] font-bold text-[#2d5a3d] hover:underline"
                >
                  + Add Category
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedCategoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.situations.length} situations)
                    </option>
                  ))}
                </select>

                {currentCategory && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(currentCategory.id)}
                    title="Delete Category"
                    className="rounded-xl border border-[#eedad2] bg-white p-2.5 text-[#6b635e] hover:text-red-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
                2. Situation *
              </label>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedSituation}
                  onChange={(e) => setSelectedSituation(e.target.value)}
                  className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                >
                  <option value="">-- General / No Situation --</option>
                  {currentCategory?.situations.map((sit, idx) => (
                    <option key={idx} value={sit}>
                      {sit}
                    </option>
                  ))}
                </select>

                {selectedSituation && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSituation(selectedSituation)}
                    title="Remove Situation"
                    className="rounded-xl border border-[#eedad2] bg-white p-2.5 text-[#6b635e] hover:text-red-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="text"
                  placeholder="New situation name..."
                  value={newSituationName}
                  onChange={(e) => setNewSituationName(e.target.value)}
                  className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSituation}
                  className="rounded-xl bg-[#2d5a3d] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#1f3a28] transition flex-shrink-0"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
                Prayer Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Prayer for Inner Peace"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
                Prayer Text *
              </label>
              <textarea
                rows={6}
                placeholder="Paste or write the devotional prayer text here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                className="w-full rounded-xl border border-[#eedad2] bg-white p-3.5 font-serif text-xs leading-relaxed text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
                Scripture Reference &amp; Reflection (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Philippians 4:6-7 — Do not be anxious about anything..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-[#eedad2] text-[#2d5a3d] focus:ring-[#2d5a3d]"
              />
              <label htmlFor="isFeatured" className="text-xs font-semibold text-[#1f3a28]">
                Feature on Today&apos;s Prayer banner
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center space-x-2 rounded-2xl bg-[#2d5a3d] py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-sm hover:bg-[#1f3a28] transition disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Save Prayer</span>
              </>
            )}
          </button>
        </form>

        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-2xl bg-[#faf3f0] border border-[#eedad2] p-6 space-y-4 shadow-xl">
              <h3 className="font-serif text-lg font-bold text-[#1f3a28]">Create New Category</h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Healing & Comfort)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="rounded-xl border border-[#eedad2] px-4 py-2 text-xs font-semibold text-[#6b635e] hover:bg-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-xl bg-[#2d5a3d] px-4 py-2 text-xs font-bold text-white hover:bg-[#1f3a28] transition"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}