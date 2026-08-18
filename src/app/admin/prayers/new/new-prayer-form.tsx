"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { createPrayer } from "~/app/actions/admin";

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

export function NewPrayerForm({
  categories,
}: {
  categories: CategoryWithSituations[];
}) {
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id ?? "");
  const [selectedSitId, setSelectedSitId] = useState(
    categories[0]?.situations[0]?.id ?? ""
  );
  const [body, setBody] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState("");
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [addedCount, setAddedCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentCategory = categories.find((c) => c.id === selectedCatId);
  const currentSituations = currentCategory?.situations ?? [];

  function handleCategoryChange(catId: string) {
    setSelectedCatId(catId);
    setLastAdded(null);
    const newCat = categories.find((c) => c.id === catId);
    if (newCat && newCat.situations.length > 0) {
      setSelectedSitId(newCat.situations[0]?.id ?? "");
    } else {
      setSelectedSitId("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) {
      setError("Please write or paste the prayer text.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("categoryId", selectedCatId);
    if (selectedSitId) formData.append("situationId", selectedSitId);
    formData.append("body", body.trim());
    formData.append("isPublished", "on");
    if (isFeatured) formData.append("isFeatured", "on");

    const res = await createPrayer(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success) {
      setLastAdded(res.addedTitle ?? "Prayer");
      setAddedCount((prev) => prev + 1);
      setBody("");
      setIsFeatured(false);
      setLoading(false);
      // Immediately focus textarea for rapid entry of next prayer
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-10 shadow-sm space-y-6"
    >
      {/* Rapid Success Banner */}
      {lastAdded && (
        <div className="flex items-center justify-between border border-[#2d5a3d]/30 bg-[#2d5a3d]/10 p-4 text-xs text-[#1f3a28]">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="h-4 w-4 text-[#2d5a3d]" />
            <p>
              Saved <strong className="font-semibold">&ldquo;{lastAdded}&rdquo;</strong>. Ready for next prayer!
            </p>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#d4907a] font-medium">
            {addedCount} added this session
          </span>
        </div>
      )}

      {error && (
        <div className="border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* 1. Category and Situation Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] font-medium text-[#1f3a28] mb-2">
            1. Category *
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
            2. Situation *
          </label>
          <select
            value={selectedSitId}
            onChange={(e) => {
              setSelectedSitId(e.target.value);
              setLastAdded(null);
            }}
            className="w-full border border-[#eedad2] bg-white px-3.5 py-3 text-xs sm:text-sm text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
          >
            {currentSituations.length === 0 ? (
              <option value="">General Collection Prayer</option>
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

      {/* 2. Prayer Text Area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[11px] uppercase tracking-[0.2em] font-medium text-[#1f3a28]">
            3. Prayer Text *
          </label>
          <span className="text-[10px] uppercase tracking-wider text-[#d4907a] font-medium">
            Auto-numbers (Prayer 1, 2, 3...)
          </span>
        </div>
        <textarea
          ref={textareaRef}
          required
          rows={8}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Paste prayer text here..."
          className="w-full border border-[#eedad2] bg-white p-4 sm:p-5 font-serif text-sm sm:text-base leading-relaxed text-[#1f3a28] placeholder-[#6b635e]/40 focus:border-[#2d5a3d] focus:outline-none"
        />
      </div>

      {/* Feature on Dashboard Toggle */}
      <div className="pt-1">
        <label className="flex items-center space-x-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-[#eedad2] text-[#2d5a3d] focus:ring-[#2d5a3d]"
          />
          <span className="text-xs text-[#6b635e]">
            Feature on Today&apos;s Prayer banner
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-[#eedad2] pt-6 flex items-center justify-between">
        <Link
          href="/admin"
          className="text-xs uppercase tracking-[0.18em] text-[#6b635e] hover:text-[#1f3a28] transition flex items-center gap-1.5"
        >
          <span>Done &bull; View Library</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2d5a3d] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-[#1f3a28] transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "+ Add Prayer"}
        </button>
      </div>
    </form>
  );
}