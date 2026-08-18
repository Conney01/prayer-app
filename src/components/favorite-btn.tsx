"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toggleFavoriteAction } from "~/app/actions/prayer-interactions";

export function FavoriteBtn({
  prayerId,
  initialIsFavorite,
}: {
  prayerId: string;
  initialIsFavorite: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;
    setLoading(true);

    const res = await toggleFavoriteAction(prayerId);
    setLoading(false);

    if (res && typeof res.isFavorite === "boolean") {
      setIsFavorite(res.isFavorite);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center space-x-2 border px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] transition ${
        isFavorite
          ? "border-[#d4907a] bg-[#d4907a]/15 text-[#1f3a28]"
          : "border-[#eedad2] bg-[#faf3f0] text-[#6b635e] hover:border-[#2d5a3d] hover:text-[#1f3a28]"
      }`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-[#d4907a]" />
      ) : (
        <Heart
          className={`h-4 w-4 transition ${
            isFavorite ? "fill-[#d4907a] text-[#d4907a]" : ""
          }`}
        />
      )}
      <span>{isFavorite ? "Saved to Sanctuary" : "Save to Favorites"}</span>
    </button>
  );
}