"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown } from "lucide-react";

type Prayer = {
  id: string;
  title: string;
  slug: string;
};

type Situation = {
  id: string;
  name: string;
  prayers: Prayer[];
};

export function CategorySituationsClient({ situations }: { situations: Situation[] }) {
  const [openSituations, setOpenSituations] = useState<Record<string, boolean>>({});

  const toggleSituation = (id: string) => {
    setOpenSituations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {situations.map((situation) => {
        const isOpen = !!openSituations[situation.id];
        const prayerCount = situation.prayers.length;

        return (
          <div
            key={situation.id}
            className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-2xs hover:bg-white transition space-y-4 self-start"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <BookOpen className="h-5 w-5 text-[#2d5a3d] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1f3a28]">
                    {situation.name}
                  </h3>
                  <span className="text-[11px] font-medium text-[#d4907a] uppercase tracking-wider">
                    {prayerCount} {prayerCount === 1 ? "Prayer" : "Prayers"}
                  </span>
                </div>
              </div>

              {prayerCount > 0 && (
                <button
                  type="button"
                  onClick={() => toggleSituation(situation.id)}
                  aria-label={isOpen ? "Collapse prayers" : "Expand prayers"}
                  className="rounded-full p-2 text-[#6b635e] hover:bg-[#faf3f0] hover:text-[#1f3a28] transition"
                >
                  <ChevronDown
                    className={`h-4 w-4 transform transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Collapsible Prayer List - Only showing titles */}
            {isOpen && prayerCount > 0 && (
              <div className="border-t border-[#eedad2]/60 pt-3 space-y-2">
                {situation.prayers.map((prayer, idx) => (
                  <Link
                    key={prayer.id}
                    href={`/prayers/${prayer.slug}`}
                    className="block rounded-lg border border-[#eedad2] bg-white p-3 text-xs text-[#1f3a28] hover:border-[#2d5a3d] transition shadow-2xs group flex items-center justify-between"
                  >
                    <span className="font-semibold font-serif text-[#1f3a28] group-hover:text-[#2d5a3d] transition">
                      Prayer {idx + 1}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}