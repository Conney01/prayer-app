"use client";

import { useState } from "react";
import { Check, CheckCircle2, Loader2 } from "lucide-react";
import { completePrayerAction } from "~/app/actions/prayer-interactions";

export function PrayerCompleteBtn({ prayerId }: { prayerId: string }) {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    if (completed || loading) return;
    setLoading(true);

    const res = await completePrayerAction(prayerId);
    setLoading(false);

    if (res?.success) {
      setCompleted(true);
    }
  }

  if (completed) {
    return (
      <div className="flex items-center space-x-2 border border-[#2d5a3d]/30 bg-[#2d5a3d]/10 px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#2d5a3d]">
        <CheckCircle2 className="h-4 w-4" />
        <span>Amen &bull; Prayer Completed</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="flex items-center space-x-2 bg-[#2d5a3d] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#1f3a28] disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Check className="h-4 w-4" />
      )}
      <span>I Have Prayed</span>
    </button>
  );
}