"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePrayerAction } from "~/app/actions/prayer";
import { Loader2, Plus, CheckCircle2 } from "lucide-react";

type Situation = { id: string; name: string };
type Category = { id: string; name: string; slug?: string; situations?: Situation[] };
type Prayer = { id: string; title: string; categoryId: string; body: string; situationId?: string | null };

export function PrayerForm({
  categories: initialCategories,
  prayers,
  initialData,
}: {
  categories: Category[];
  prayers: Prayer[];
  initialData?: Prayer | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [newCategoryName, setNewCategoryName] = useState("");

  const initialCleanTitle = initialData?.title?.split(/ [—–-] /)[0]?.trim() ?? "";
  const [title, setTitle] = useState(initialCleanTitle);
  const [newSituationName, setNewSituationName] = useState("");
  const [customSituationsList, setCustomSituationsList] = useState<string[]>([]);

  const [body, setBody] = useState(initialData?.body ?? "");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const selectedCategory = categoriesList.find((c) => c.id === categoryId);
  const dbSituationsList = selectedCategory?.situations?.map((s) => s.name) ?? [];

  const existingDbSituations = prayers
    .filter((p) => p.categoryId === categoryId)
    .map((p) => p.title.split(/ [—–-] /)[0]?.trim())
    .filter(Boolean) as string[];

  const allSituations = Array.from(new Set([...dbSituationsList, ...existingDbSituations, ...customSituationsList]));

  const handleAddCustomCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    const tempId = `temp-${Date.now()}`;
    const newCat: Category = { id: tempId, name: trimmed, slug: trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-"), situations: [] };
    setCategoriesList([...categoriesList, newCat]);
    setCategoryId(tempId);
    setNewCategoryName("");
  };

  const handleAddCustomSituation = () => {
    const trimmed = newSituationName.trim();
    if (!trimmed) return;
    if (!allSituations.includes(trimmed)) {
      setCustomSituationsList([...customSituationsList, trimmed]);
    }
    setTitle(trimmed);
    setNewSituationName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const activeCat = categoriesList.find((c) => c.id === categoryId);
    const resolvedCategoryId = (activeCat?.id && !activeCat.id.startsWith("temp-")) ? activeCat.id : "";
    const resolvedNewCatName = activeCat?.id?.startsWith("temp-") ? activeCat.name : (newCategoryName.trim() || undefined);
    const resolvedTitle = title.trim();

    if (!resolvedCategoryId && !resolvedNewCatName) {
      setError("Please select or add a category.");
      return;
    }

    if (!resolvedTitle) {
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
        categoryId: resolvedCategoryId,
        newCategoryName: resolvedNewCatName,
        title: resolvedTitle,
        body,
        originalTitle: initialData?.title,
      });

      if (res.success) {
        setSuccessMsg(initialData ? "Changes saved successfully!" : "Devotional published successfully! You can add another or return to admin.");
        setBody("");
        setTitle("");
        setNewSituationName("");
        if (initialData) {
          router.push("/admin");
        }
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

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#eedad2]/60 pb-8">
        {/* 1. CATEGORY */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
            1. Category *
          </label>

          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setNewCategoryName("");
              setTitle("");
            }}
            className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
          >
            <option value="">Select an existing category...</option>
            {categoriesList.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="text"
              placeholder="Or enter new custom category..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustomCategory}
              disabled={!newCategoryName.trim()}
              className="inline-flex items-center space-x-1 rounded-xl bg-[#2d5a3d] text-white px-4 py-2.5 text-xs font-semibold hover:bg-[#1f3a28] transition disabled:opacity-50 flex-shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
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
            disabled={!categoryId}
            className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none disabled:opacity-50"
          >
            <option value="">
              {categoryId
                ? `Select a situation (${allSituations.length} available)...`
                : "Select a category first..."}
            </option>
            {allSituations.map((sit) => {
              const count = prayers.filter((p) => {
                if (p.categoryId !== categoryId) return false;
                const base = p.title.split(/ [—–-] /)[0]?.trim();
                return base === sit;
              }).length;

              return (
                <option key={sit} value={sit}>
                  {sit} ({count} {count === 1 ? "prayer" : "prayers"})
                </option>
              );
            })}
          </select>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="text"
              placeholder="Or enter new custom situation..."
              value={newSituationName}
              onChange={(e) => setNewSituationName(e.target.value)}
              disabled={!categoryId}
              className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleAddCustomSituation}
              disabled={!newSituationName.trim() || !categoryId}
              className="inline-flex items-center space-x-1 rounded-xl bg-[#2d5a3d] text-white px-4 py-2.5 text-xs font-semibold hover:bg-[#1f3a28] transition disabled:opacity-50 flex-shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
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