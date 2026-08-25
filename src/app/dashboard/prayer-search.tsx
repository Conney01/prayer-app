"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Sun, BookOpen, ArrowRight, FolderSearch } from "lucide-react";

type Prayer = { id: string; title: string; body: string };
type Situation = { id: string; name: string; prayers: Prayer[] };
type Category = { id: string; name: string; slug: string; situations: Situation[]; prayers: Prayer[] };

export function PrayerSearch({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.toLowerCase().trim();

  // Filter categories, situations, or prayers
  const filteredCategories = categories.map((cat) => {
    const catMatches = cat.name.toLowerCase().includes(trimmedQuery);
    const matchingSituations = cat.situations.filter((sit) => {
      const sitMatches = sit.name.toLowerCase().includes(trimmedQuery);
      const prayerMatches = sit.prayers.some((p) => p.title.toLowerCase().includes(trimmedQuery) || p.body.toLowerCase().includes(trimmedQuery));
      return sitMatches || prayerMatches;
    });

    if (trimmedQuery === "" || catMatches || matchingSituations.length > 0) {
      return cat;
    }
    return null;
  }).filter(Boolean) as Category[];

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative max-w-xl mx-auto">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-4 w-4 text-[#6b635e]" />
        </div>
        <input
          type="text"
          placeholder="Search prayers, situations, or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-[#eedad2] bg-[#faf3f0] py-3.5 pl-11 pr-4 text-xs sm:text-sm text-[#1f3a28] placeholder-[#6b635e] focus:border-[#2d5a3d] focus:bg-white focus:outline-none transition shadow-2xs"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-semibold text-[#6b635e] hover:text-[#1f3a28]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filtered Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 rounded-3xl border border-[#eedad2] bg-[#faf3f0] space-y-3">
          <FolderSearch className="h-8 w-8 text-[#d4907a] mx-auto opacity-60" />
          <h3 className="font-serif text-lg font-bold text-[#1f3a28]">No matching collections found</h3>
          <p className="text-xs text-[#6b635e]">Try searching for another keyword or topic.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((category, idx) => {
            const situationCount = category.situations.length;
            const prayerCount = category.prayers.length + category.situations.reduce((acc, s) => acc + s.prayers.length, 0);
            const collectionNum = String(idx + 1).padStart(2, "0");
            const isDailyPrayers = category.name.toLowerCase().includes("daily prayer");

            return (
              <div
                key={category.id}
                className={`rounded-3xl p-8 transition space-y-6 flex flex-col justify-between shadow-2xs ${
                  isDailyPrayers
                    ? "border-2 border-[#d4907a] bg-white shadow-sm ring-4 ring-[#d4907a]/10"
                    : "border border-[#eedad2] bg-[#faf3f0] hover:bg-white"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDailyPrayers ? "text-[#d4907a] font-extrabold" : "text-[#d4907a]"}`}>
                      {isDailyPrayers ? "★ Featured Daily Routine" : `Collection ${collectionNum}`}
                    </span>
                    <span className="text-xs text-[#6b635e] font-medium">
                      {situationCount} {situationCount === 1 ? "Situation" : "Situations"} • {prayerCount} {prayerCount === 1 ? "Prayer" : "Prayers"}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1f3a28] flex items-center space-x-2">
                    {isDailyPrayers && <Sun className="h-5 w-5 text-[#d4907a] inline mr-1" />}
                    <span>{category.name}</span>
                  </h3>
                </div>

                <div className="pt-2 border-t border-[#eedad2]/60 flex items-center justify-between">
                  <Link
                    href={`/categories/${category.slug}`}
                    className={`inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider transition group ${
                      isDailyPrayers ? "text-[#d4907a] hover:text-[#1f3a28]" : "text-[#1f3a28] hover:text-[#d4907a]"
                    }`}
                  >
                    <span>{isDailyPrayers ? "Begin Daily Prayer" : "Enter Space"}</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {isDailyPrayers ? <Sun className="h-4 w-4 text-[#d4907a]" /> : <BookOpen className="h-4 w-4 text-[#6b635e]" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}