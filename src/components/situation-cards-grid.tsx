"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, BookOpen, Sparkles } from "lucide-react";

interface PrayerItem {
  id: string;
  title: string;
  slug: string;
}

interface SituationItem {
  id: string;
  name: string;
  prayers: PrayerItem[];
}

export function SituationCardsGrid({ situations }: { situations: SituationItem[] }) {
  const [openSituationId, setOpenSituationId] = useState<string | null>(
    situations.find((s) => s.prayers.length > 0)?.id ?? null
  );

  function toggleSituation(id: string) {
    setOpenSituationId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {situations.map((situation) => {
        const isOpen = openSituationId === situation.id;
        const count = situation.prayers.length;

        return (
          <div
            key={situation.id}
            className={`border transition-all duration-300 ${
              isOpen
                ? "border-[#d4907a] bg-[#faf3f0] shadow-[0_8px_30px_rgba(212,144,122,0.18)] ring-1 ring-[#d4907a]/40"
                : "border-[#eedad2] bg-[#faf3f0] hover:border-[#d4907a]/60 hover:shadow-sm"
            }`}
          >
            {/* Card Header */}
            <button
              type="button"
              onClick={() => toggleSituation(situation.id)}
              className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`border p-2.5 transition ${
                    isOpen
                      ? "border-[#2d5a3d] bg-[#2d5a3d] text-white"
                      : "border-[#eedad2] bg-[#fdf0ec] text-[#2d5a3d]"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#1f3a28]">
                    {situation.name}
                  </h3>
                  <p className="text-[11px] uppercase tracking-wider text-[#d4907a] font-medium mt-0.5">
                    {count} {count === 1 ? "Prayer" : "Prayers"}
                  </p>
                </div>
              </div>

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#eedad2] bg-[#fdf0ec] text-[#1f3a28] transition-transform duration-300 ${
                  isOpen ? "rotate-180 bg-[#2d5a3d] text-white border-[#2d5a3d]" : ""
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>

            {/* Clean Prayer Links (Title only, direct to prayer) */}
            {isOpen && (
              <div className="border-t border-[#eedad2] bg-[#fdf0ec]/60 p-5 space-y-2.5 animate-in fade-in duration-200">
                {count === 0 ? (
                  <p className="py-3 text-center font-serif text-xs italic text-[#6b635e]">
                    No prayers added under this situation yet.
                  </p>
                ) : (
                  situation.prayers.map((prayer) => (
                    <Link
                      key={prayer.id}
                      href={`/prayers/${prayer.slug}`}
                      className="group flex items-center justify-between border border-[#eedad2] bg-white px-4 py-3.5 transition-all duration-200 hover:border-[#2d5a3d] hover:shadow-sm"
                    >
                      <div className="flex items-center space-x-2.5 pr-4">
                        <Sparkles className="h-3.5 w-3.5 text-[#d4907a]" />
                        <span className="font-serif text-sm font-medium text-[#1f3a28] group-hover:text-[#2d5a3d] transition">
                          {prayer.title}
                        </span>
                      </div>
                      <div className="flex items-center text-xs uppercase tracking-[0.15em] text-[#2d5a3d] font-medium whitespace-nowrap">
                        <span>Pray</span>
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}