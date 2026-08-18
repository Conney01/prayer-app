"use client";

import { useState } from "react";
import Link from "next/link";
import { updatePrayerAction } from "~/app/actions/admin";

interface Situation {
  id: string;
  name: string;
}

interface CategoryWithSituations {
  id: string;
  name: string;
  sortOrder: number;
  situations: Situation[];
}

interface ExistingPrayer {
  id: string;
  title: string;
  body: string;
  categoryId: string;
  situationId: string | null;
  isPublished: boolean;
  isFeatured: boolean;
}

export function EditPrayerForm({
  prayer,
  categories,
}: {
  prayer: ExistingPrayer;
  categories: CategoryWithSituations[];
}) {
  const [title, setTitle] = useState(prayer.title);
  const [selectedCatId, setSelectedCatId] = useState(prayer.categoryId);
  const [selectedSitId, setSelectedSitId] = useState(prayer.situationId ?? "");
  const [body, setBody] = useState(prayer.body);
  const [isPublished, setIsPublished] = useState(prayer.isPublished);
  const [isFeatured, setIsFeatured] = useState(prayer.isFeatured);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentCategory = categories.find((c) => c.id === selectedCatId);
  const currentSituations = currentCategory?.situations ?? [];

  function handleCategoryChange(catId: string) {
    setSelectedCatId(catId);
    const newCat = categories.find((c) => c.id === catId);
    if (newCat && newCat.situations.length > 0) {
      setSelectedSitId(newCat.situations[0]?.id ?? "");
    } else {
      setSelectedSitId("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !title.trim()) {
      setError("Title and prayer text cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("categoryId", selectedCatId);
    if (selectedSitId) formData.append("situationId", selectedSitId);
    formData.append("body", body.trim());
    if (isPublished) formData.append("isPublished", "on");
    if (isFeatured) formData.append("isFeatured", "on");

    const res = await updatePrayerAction(prayer.id, formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-10 shadow-sm space-y-6">
      {error && (
        <div className="border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-[11px] uppercase tracking-[0.2em] font-medium text-[#1f3a28] mb-2">
          Prayer Title *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-[#eedad2] bg-white px-4 py-3 text-sm text-[#1f3a28] font-serif focus:border-[#2d5a3d] focus:outline-none"
        />
      </div>

      {/* Category & Situation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] font-medium text-[#1f3a28] mb-2">
            Category *
          </label>
          <select
            value={selectedCatId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full border border-[#eedad2] bg-white px-3.5 py-3 text-xs sm:text-sm text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {String(c.sortOrder).padStart(2, "0")} — {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] font-medium text-[#1f3a28] mb-2">
            Situation *
          </label>
          <select
            value={selectedSitId}
            onChange={(e) => setSelectedSitId(e.target.value)}
            className="w-full border border-[#eedad2] bg-white px-3.5 py-3 text-xs sm:text-sm text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
          >
            {currentSituations.length === 0 ? (
              <option value="">General Category Prayer</option>
            ) : (
              currentSituations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Prayer Text */}
      <div>
        <label className="block text-[11px] uppercase tracking-[0.2em] font-medium text-[#1f3a28] mb-2">
          Prayer Body *
        </label>
        <textarea
          required
          rows={9}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border border-[#eedad2] bg-white p-4 sm:p-5 font-serif text-sm sm:text-base leading-relaxed text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
        <label className="flex items-center space-x-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded border-[#eedad2] text-[#2d5a3d] focus:ring-[#2d5a3d]"
          />
          <span className="text-xs text-[#1f3a28] font-medium">Published (Live)</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-[#eedad2] text-[#2d5a3d] focus:ring-[#2d5a3d]"
          />
          <span className="text-xs text-[#6b635e]">Feature on member dashboard</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-[#eedad2] pt-6 flex items-center justify-between">
        <Link
          href="/admin"
          className="text-xs uppercase tracking-[0.18em] text-[#6b635e] hover:text-[#1f3a28] transition"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2d5a3d] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-[#1f3a28] transition disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}