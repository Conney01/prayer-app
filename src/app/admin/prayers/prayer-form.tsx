"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePrayerAction } from "~/app/actions/prayer";
import { getSituationsForCategory } from "~/lib/situations";
import { Loader2, Plus, Trash2 } from "lucide-react";

type Category = { id: string; name: string; slug?: string };
type Prayer = { id: string; title: string; categoryId: string; body: string };

export function PrayerForm({
  categories,
  prayers,
  initialData,
}: {
  categories: Category[];
  prayers: Prayer[];
  initialData?: Prayer | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const initialCleanTitle = initialData?.title?.split(/ [-—] /)[0]?.trim() ?? "";
  const [title, setTitle] = useState(initialCleanTitle);
  const [newSituationName, setNewSituationName] = useState("");

  const [body, setBody] = useState(initialData?.body ?? "");
  const [error, setError] = useState("");

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const defaultList = selectedCategory ? getSituationsForCategory(selectedCategory) : [];

  const existingDbSituations = prayers
    .filter((p) => p.categoryId === categoryId)
    .map((p) => p.title.split(/ [-—] /)[0]?.trim())
    .filter(Boolean) as string[];

  // Keep the exact dashboard order
  const allSituations = Array.from(new Set([...defaultList, ...existingDbSituations]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const finalCategoryId = isAddingCategory ? "NEW" : categoryId;
    const finalTitle = newSituationName.trim() ? newSituationName.trim() : title;

    if (!finalCategoryId || (finalCategoryId === "NEW" && !newCategoryName.trim())) {
      setError("Please select or add a category.");
      return;
    }

    if (!finalTitle) {
      setError("Please select or add a situation.");
      return;
    }

    if (!body.trim()) {
      setError("Prayer text cannot be empty.");
      return;
    }

    startTransition(async () => {
      const res = await savePrayerAction({
        id: initialData?.id,
        categoryId: finalCategoryId === "NEW" ? "" : finalCategoryId,
        newCategoryName: finalCategoryId === "NEW" ? newCategoryName.trim() : undefined,
        title: finalTitle,
        body,
        originalTitle: initialData?.title,
      });

      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error ?? "Failed to save prayer.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#faf3f0] p-6 sm:p-8 rounded-2xl border border-[#eedad2] shadow-sm">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#eedad2]/60 pb-8">
        {/* 1. CATEGORY */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
              1. Category *
            </label>
            {!isAddingCategory && (
              <button
                type="button"
                onClick={() => setIsAddingCategory(true)}
                className="text-[10px] font-bold text-[#2d5a3d] hover:underline flex items-center space-x-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add Category</span>
              </button>
            )}
          </div>

          {isAddingCategory ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="New category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryName("");
                }}
                className="p-2.5 rounded-xl border border-[#eedad2] bg-white text-[#6b635e] hover:text-red-500 transition shadow-xs"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setTitle("");
              }}
              className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
            >
              <option value="">Select a category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* 2. SITUATION */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
            2. Situation *
          </label>
          
          <select
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setNewSituationName("");
            }}
            disabled={!categoryId && !isAddingCategory}
            className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none disabled:opacity-50"
          >
            <option value="">
              {categoryId
                ? `Select a situation (${allSituations.length} available)...`
                : "Select a category first..."}
            </option>
            {allSituations.map((sit) => {
              // Exact string equality match prevents "Prayer for Forgiveness" from capturing "Prayer for Forgiveness of Sins"
              const count = prayers.filter((p) => {
                if (p.categoryId !== categoryId) return false;
                const base = p.title.split(/ [-—] /)[0]?.trim();
                return base === sit;
              }).length;

              return (
                <option key={sit} value={sit}>
                  {sit} ({count} {count === 1 ? "prayer" : "prayers"})
                </option>
              );
            })}
          </select>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Or enter new custom situation..."
              value={newSituationName}
              onChange={(e) => {
                setNewSituationName(e.target.value);
                setTitle("");
              }}
              disabled={!categoryId && !isAddingCategory}
              className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setNewSituationName("")}
              disabled={!newSituationName}
              className="p-2.5 rounded-xl border border-[#eedad2] bg-white text-[#6b635e] hover:text-red-500 transition shadow-xs disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PRAYER TEXT */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
          Prayer Text *
        </label>
        <textarea
          rows={12}
          placeholder="Paste or write the devotional prayer text here..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          className="w-full rounded-xl border border-[#eedad2] bg-white p-4 text-sm text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none leading-relaxed font-serif"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-[#2d5a3d] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-white shadow-xs hover:bg-[#1f3a28] transition disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{initialData ? "Save Changes" : "Publish Devotional"}</span>
        </button>
      </div>
    </form>
  );
}