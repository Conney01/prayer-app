"use client";

import { useState, useTransition } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { toggleFavoriteAction } from "~/app/actions/prayer-interactions";

export function FavoriteButton({
  prayerId,
  initialIsFavorite = false,
}: {
  prayerId: string;
  initialIsFavorite?: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleFavoriteAction(prayerId);
      if (res.success && res.isFavorite !== undefined) {
        setIsFavorite(res.isFavorite);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center space-x-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition shadow-xs ${
        isFavorite
          ? "border-[#2d5a3d] bg-[#2d5a3d] text-white"
          : "border-[#eedad2] bg-white text-[#1f3a28] hover:bg-[#faf3f0]"
      }`}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Bookmark
          className={`h-3.5 w-3.5 ${isFavorite ? "fill-white" : ""}`}
        />
      )}
      <span>{isFavorite ? "Saved" : "Save Prayer"}</span>
    </button>
  );
}

export const FavoriteBtn = FavoriteButton;
export default FavoriteButton;