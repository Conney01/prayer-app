"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Trash2, Sparkles, Loader2, Plus, Calendar } from "lucide-react";
import { saveDailyScriptureAction, deleteDailyScriptureAction } from "~/app/actions/scripture";

interface ScriptureItem {
  id: string;
  reference: string;
  text: string;
  reflection: string | null;
  date: Date;
  prayer: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

interface PrayerOption {
  id: string;
  title: string;
  categoryName: string;
}

export function ScriptureManager({
  scriptures,
  prayers,
}: {
  scriptures: ScriptureItem[];
  prayers: PrayerOption[];
}) {
  const [reference, setReference] = useState("");
  const [text, setText] = useState("");
  const [reflection, setReflection] = useState("");
  const [prayerId, setPrayerId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0] ?? "");
  const [statusMessage, setStatusMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");

    startTransition(async () => {
      const res = await saveDailyScriptureAction({
        reference,
        text,
        reflection,
        prayerId,
        date,
      });

      if (res.success) {
        setStatusMessage("Daily scripture anchor published successfully!");
        setReference("");
        setText("");
        setReflection("");
        setPrayerId("");
      } else {
        setStatusMessage(res.error ?? "Failed to save scripture.");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this Scripture anchor?")) return;
    startTransition(async () => {
      await deleteDailyScriptureAction(id);
    });
  };

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#eedad2] pb-4">
          <Link
            href="/admin"
            className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Admin Hub</span>
          </Link>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4907a] font-bold">
            Daily Scripture Curator
          </span>
        </div>

        {statusMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
            {statusMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleSave}
            className="lg:col-span-6 rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center space-x-2 border-b border-[#eedad2]/60 pb-3">
              <Plus className="h-4 w-4 text-[#2d5a3d]" />
              <h3 className="font-serif text-sm font-bold text-[#1f3a28]">
                Publish Daily Scripture Anchor
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
                  Scripture Reference *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Philippians 4:6-7"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
                  Anchor Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
                Scripture Verse Text *
              </label>
              <textarea
                rows={4}
                placeholder="Paste the verse text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="w-full rounded-xl border border-[#eedad2] bg-white p-3.5 font-serif text-xs leading-relaxed text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
                Contemplative Reflection (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="A gentle one-paragraph devotional guidance for the seeker..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full rounded-xl border border-[#eedad2] bg-white p-3.5 text-xs leading-relaxed text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1f3a28]">
                Link to Related Prayer (Enables &ldquo;Begin Prayer&rdquo; CTA)
              </label>
              <select
                value={prayerId}
                onChange={(e) => setPrayerId(e.target.value)}
                className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
              >
                <option value="">-- No linked prayer (Reading only) --</option>
                {prayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.categoryName}] {p.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-[#2d5a3d] py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-xs hover:bg-[#1f3a28] transition disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Publish Anchor</span>
                </>
              )}
            </button>
          </form>

          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#eedad2]/60 pb-2">
              <h3 className="font-serif text-sm font-bold text-[#1f3a28]">
                Recent Scripture Anchors ({scriptures.length})
              </h3>
            </div>

            {scriptures.length === 0 ? (
              <div className="rounded-2xl border border-[#eedad2] bg-white p-8 text-center text-xs text-[#6b635e]">
                No scripture anchors added yet. Use the form to publish your first one.
              </div>
            ) : (
              <div className="space-y-3">
                {scriptures.map((sc) => (
                  <div
                    key={sc.id}
                    className="rounded-xl border border-[#eedad2] bg-white p-4 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs font-bold text-[#1f3a28]">
                        {sc.reference}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center space-x-1 text-[10px] text-[#6b635e]">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(sc.date).toLocaleDateString()}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(sc.id)}
                          className="rounded-md p-1 text-[#6b635e] hover:text-red-600 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="font-serif italic text-xs text-[#6b635e] line-clamp-2">
                      &ldquo;{sc.text}&rdquo;
                    </p>

                    {sc.prayer && (
                      <div className="flex items-center space-x-1.5 pt-1 text-[10px] text-[#2d5a3d]">
                        <BookOpen className="h-3 w-3" />
                        <span>Connected Prayer: {sc.prayer.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}