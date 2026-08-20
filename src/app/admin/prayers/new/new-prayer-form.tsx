"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Settings2,
  CheckCircle2,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  createPrayerAction,
  createCategoryAction,
  deleteCategoryAction,
  addSituationAction,
  removeSituationAction,
} from "~/app/actions/admin";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  situations: string[];
}

export function NewPrayerForm({ initialCategories }: { initialCategories: CategoryData[] }) {
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialCategories[0]?.id ?? ""
  );
  const [selectedSituation, setSelectedSituation] = useState<string>("");
  const [prayerText, setPrayerText] = useState<string>("");
  const [scriptureRef, setScriptureRef] = useState<string>("");
  const [scriptureText, setScriptureText] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  const [addedCount, setAddedCount] = useState(0);
  const [lastSavedTitle, setLastSavedTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  // Manager Modal State
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newSitName, setNewSitName] = useState("");
  const [inlineSitInput, setInlineSitInput] = useState("");
  const [showInlineSitAdd, setShowInlineSitAdd] = useState(false);

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const currentSituations = activeCategory?.situations ?? [];

  // Automatically set first situation if none selected
  const activeSituation = selectedSituation || currentSituations[0] || "";

  // Helper: auto-generate title based on situation + count
  const prayerTitle = activeSituation ? `${activeSituation}` : "Sacred Prayer";

  const handleSavePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedCategoryId) {
      setErrorMessage("Please select a category.");
      return;
    }
    if (!activeSituation) {
      setErrorMessage("Please select or add a situation.");
      return;
    }
    if (!prayerText.trim()) {
      setErrorMessage("Prayer text cannot be empty.");
      return;
    }

    startTransition(async () => {
      const titleToSave =
        addedCount > 0 ? `${prayerTitle} — Prayer ${addedCount + 1}` : prayerTitle;

      const res = await createPrayerAction({
        title: titleToSave,
        categoryId: selectedCategoryId,
        situation: activeSituation,
        body: prayerText,
        scriptureReference: scriptureRef,
        scriptureText: scriptureText,
        isFeatured,
      });

      if (res.success) {
        setLastSavedTitle(titleToSave);
        setAddedCount((prev) => prev + 1);
        setPrayerText("");
        setScriptureRef("");
        setScriptureText("");
      } else {
        setErrorMessage(res.error ?? "Failed to save prayer.");
      }
    });
  };

  // Category Actions
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    startTransition(async () => {
      const res = await createCategoryAction(newCatName);
      if (res.success && res.category) {
        const updated = [...categories, { ...res.category, situations: [] }];
        setCategories(updated);
        setSelectedCategoryId(res.category.id);
        setNewCatName("");
      } else {
        setErrorMessage(res.error ?? "Failed to create category");
      }
    });
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    startTransition(async () => {
      const res = await deleteCategoryAction(catId);
      if (res.success) {
        const updated = categories.filter((c) => c.id !== catId);
        setCategories(updated);
        if (selectedCategoryId === catId) {
          setSelectedCategoryId(updated[0]?.id ?? "");
        }
      } else {
        setErrorMessage(res.error ?? "Failed to delete category");
      }
    });
  };

  // Situation Actions
  const handleAddSituation = async (catId: string, nameToAdd: string) => {
    if (!nameToAdd.trim()) return;
    startTransition(async () => {
      const res = await addSituationAction(catId, nameToAdd);
      if (res.success && res.situations) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === catId ? { ...cat, situations: res.situations as string[] } : cat
          )
        );
        setSelectedSituation(nameToAdd.trim());
        setNewSitName("");
        setInlineSitInput("");
        setShowInlineSitAdd(false);
      } else {
        setErrorMessage(res.error ?? "Failed to add situation");
      }
    });
  };

  const handleRemoveSituation = async (catId: string, situationName: string) => {
    startTransition(async () => {
      const res = await removeSituationAction(catId, situationName);
      if (res.success && res.situations) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === catId ? { ...cat, situations: res.situations as string[] } : cat
          )
        );
        if (selectedSituation === situationName) {
          setSelectedSituation(res.situations[0] ?? "");
        }
      } else {
        setErrorMessage(res.error ?? "Failed to remove situation");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eedad2] pb-4">
          <Link
            href="/admin"
            className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Curator</span>
          </Link>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsManagerOpen(true)}
              className="inline-flex items-center space-x-1.5 rounded-lg border border-[#eedad2] bg-[#faf3f0] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#2d5a3d] hover:bg-white shadow-sm transition"
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span>Manage / Clean Duplicates</span>
            </button>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4907a] font-bold">
              Add Prayer Entry
            </span>
          </div>
        </div>

        {/* Success Banner */}
        {lastSavedTitle && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-900 shadow-sm animate-in fade-in">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <p className="text-xs">
                Saved <strong className="font-semibold">&ldquo;{lastSavedTitle}&rdquo;</strong>. Ready for the next prayer!
              </p>
            </div>
            <span className="rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-emerald-800">
              {addedCount} Added this session
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Main Form Card */}
        <form onSubmit={handleSavePrayer} className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Category Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1f3a28]">
                  1. Category *
                </label>
                <button
                  type="button"
                  onClick={() => setIsManagerOpen(true)}
                  className="text-[10px] uppercase tracking-wider text-[#2d5a3d] font-semibold hover:underline"
                >
                  + Add Category
                </button>
              </div>

              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedSituation("");
                }}
                className="w-full rounded-xl border border-[#eedad2] bg-white px-4 py-3 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none shadow-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.situations?.length || 0} situations)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Situation Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1f3a28]">
                  2. Situation *
                </label>
                <button
                  type="button"
                  onClick={() => setShowInlineSitAdd(!showInlineSitAdd)}
                  className="text-[10px] uppercase tracking-wider text-[#2d5a3d] font-semibold hover:underline"
                >
                  {showInlineSitAdd ? "Cancel" : "+ New Situation"}
                </button>
              </div>

              {!showInlineSitAdd ? (
                <div className="flex items-center space-x-2">
                  <select
                    value={activeSituation}
                    onChange={(e) => setSelectedSituation(e.target.value)}
                    className="w-full rounded-xl border border-[#eedad2] bg-white px-4 py-3 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none shadow-sm"
                  >
                    {currentSituations.length === 0 ? (
                      <option value="">No situations yet — click &ldquo;+ New Situation&rdquo;</option>
                    ) : (
                      currentSituations.map((sit, idx) => (
                        <option key={idx} value={sit}>
                          {sit}
                        </option>
                      ))
                    )}
                  </select>

                  {activeSituation && (
                    <button
                      type="button"
                      title="Remove this situation from dropdown"
                      onClick={() => handleRemoveSituation(selectedCategoryId, activeSituation)}
                      className="rounded-xl border border-[#eedad2] bg-white p-3 text-[#6b635e] hover:border-red-300 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type new situation name..."
                    value={inlineSitInput}
                    onChange={(e) => setInlineSitInput(e.target.value)}
                    className="flex-1 rounded-xl border border-[#2d5a3d] bg-white px-4 py-2.5 text-xs text-[#1f3a28] focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSituation(selectedCategoryId, inlineSitInput)}
                    disabled={isPending || !inlineSitInput.trim()}
                    className="rounded-xl bg-[#2d5a3d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1f3a28] transition disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Prayer Text */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1f3a28]">
              3. Prayer Text *
            </label>
            <textarea
              rows={8}
              placeholder="Paste or write the devotional prayer text here..."
              value={prayerText}
              onChange={(e) => setPrayerText(e.target.value)}
              required
              className="w-full rounded-xl border border-[#eedad2] bg-white p-4 font-serif text-sm text-[#1f3a28] placeholder-[#6b635e]/50 focus:border-[#2d5a3d] focus:outline-none leading-relaxed shadow-sm"
            />
          </div>

          {/* 4. Optional Scripture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6b635e]">
                Scripture Reference (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Philippians 4:6-7"
                value={scriptureRef}
                onChange={(e) => setScriptureRef(e.target.value)}
                className="w-full rounded-xl border border-[#eedad2] bg-white px-4 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6b635e]">
                Scripture Verse Text (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Do not be anxious about anything..."
                value={scriptureText}
                onChange={(e) => setScriptureText(e.target.value)}
                className="w-full rounded-xl border border-[#eedad2] bg-white px-4 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none shadow-sm"
              />
            </div>
          </div>

          {/* Featured Toggle & Submit Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-[#eedad2] pt-6">
            <label className="inline-flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-[#eedad2] text-[#2d5a3d] focus:ring-[#2d5a3d]"
              />
              <span className="text-xs font-medium text-[#6b635e]">
                Feature on Today&apos;s Prayer banner
              </span>
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center space-x-2 rounded-xl bg-[#2d5a3d] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md hover:bg-[#1f3a28] transition disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Save Prayer &amp; Next</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Categories & Situations Manager / Duplicates Cleaner Modal */}
        {isManagerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#eedad2] pb-3">
                <div className="flex items-center space-x-2">
                  <Settings2 className="h-5 w-5 text-[#2d5a3d]" />
                  <h3 className="font-serif text-lg font-bold text-[#1f3a28]">
                    Manage Categories &amp; Clean Duplicates
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsManagerOpen(false)}
                  className="rounded-full p-1.5 text-[#6b635e] hover:bg-[#eedad2]/60 hover:text-[#1f3a28] transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Add New Category Form */}
              <div className="rounded-xl border border-[#eedad2] bg-white p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1f3a28]">
                  + Add New Category
                </h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. 17 — Healing & Restoration"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 rounded-lg border border-[#eedad2] px-3.5 py-2 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={isPending || !newCatName.trim()}
                    className="inline-flex items-center space-x-1 rounded-lg bg-[#2d5a3d] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f3a28] transition disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Situations Breakdown per Category */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1f3a28]">
                  Categories &amp; Situations List
                </h4>

                <div className="space-y-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="rounded-xl border border-[#eedad2] bg-white p-4 space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between border-b border-[#eedad2]/60 pb-2">
                        <span className="font-serif text-sm font-semibold text-[#1f3a28]">
                          {cat.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="inline-flex items-center space-x-1 text-[11px] font-medium text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete Category</span>
                        </button>
                      </div>

                      {/* Situations Badges */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {cat.situations && cat.situations.length > 0 ? (
                          cat.situations.map((sit, sitIdx) => (
                            <span
                              key={sitIdx}
                              className="inline-flex items-center space-x-1.5 rounded-full border border-[#eedad2] bg-[#faf3f0] px-3 py-1 text-[11px] text-[#1f3a28]"
                            >
                              <span>{sit}</span>
                              <button
                                type="button"
                                title="Delete situation"
                                onClick={() => handleRemoveSituation(cat.id, sit)}
                                className="text-[#6b635e] hover:text-red-600 transition"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))
                        ) : (
                          <p className="text-[11px] text-[#6b635e] italic">No situations added yet.</p>
                        )}
                      </div>

                      {/* Inline Add Situation to this specific category */}
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="text"
                          placeholder="Add new situation to this category..."
                          value={selectedCategoryId === cat.id ? newSitName : ""}
                          onChange={(e) => {
                            setSelectedCategoryId(cat.id);
                            setNewSitName(e.target.value);
                          }}
                          className="flex-1 rounded-lg border border-[#eedad2] px-3 py-1.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSituation(cat.id, newSitName)}
                          disabled={isPending || !newSitName.trim() || selectedCategoryId !== cat.id}
                          className="rounded-lg bg-[#2d5a3d] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1f3a28] transition disabled:opacity-50"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right border-t border-[#eedad2] pt-4">
                <button
                  type="button"
                  onClick={() => setIsManagerOpen(false)}
                  className="rounded-xl bg-[#2d5a3d] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#1f3a28] transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}