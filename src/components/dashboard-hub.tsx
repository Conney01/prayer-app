"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, Sun, ArrowRight } from "lucide-react";
import { CategoryIcon } from "~/components/category-icon";

interface PrayerItem {
  id: string;
  title: string;
  slug: string;
  body: string;
  category: { name: string; slug: string };
  situation: { name: string } | null;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
  _count: { prayers: number };
}

export function DashboardHub({
  dailyCategory,
  otherCategories,
  searchablePrayers,
  savedPrayers,
}: {
  dailyCategory: CategoryItem | undefined;
  otherCategories: CategoryItem[];
  searchablePrayers: PrayerItem[];
  savedPrayers: PrayerItem[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"COLLECTIONS" | "SAVED">("COLLECTIONS");

  const isSearching = searchQuery.trim().length > 0;

  const searchResults = isSearching
    ? searchablePrayers.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q) ||
          (p.situation?.name.toLowerCase().includes(q) ?? false)
        );
      })
    : [];

  return (
    <div className="pt-2">
      <div className="max-w-xl">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-[#6b635e]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prayers, emotions, or situations (e.g. peace, exams, morning)..."
            className="w-full border border-[#eedad2] bg-[#faf3f0] py-3.5 pl-11 pr-4 text-sm text-[#1f3a28] transition placeholder-[#6b635e]/50 focus:border-[#2d5a3d] focus:bg-white focus:outline-none"
          />
          {isSearching && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 text-xs uppercase tracking-wider text-[#d4907a] hover:text-[#1f3a28]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="pt-10">
        {isSearching ? (
          <div>
            <div className="mb-8 flex items-baseline justify-between border-b border-[#eedad2] pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#d4907a] font-medium">Search Results</p>
                <h2 className="font-serif text-2xl text-[#1f3a28] mt-1">
                  Found {searchResults.length} {searchResults.length === 1 ? "Prayer" : "Prayers"}
                </h2>
              </div>
            </div>

            {searchResults.length === 0 ? (
              <div className="border border-[#eedad2] bg-[#faf3f0] p-12 text-center">
                <p className="font-serif text-base italic text-[#6b635e]">
                  No prayers found matching &ldquo;{searchQuery}&rdquo;.
                </p>
                <p className="text-xs text-[#6b635e] mt-2">Try searching by general topics (e.g., peace, evening, work).</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((prayer) => (
                  <Link
                    key={prayer.id}
                    href={`/prayers/${prayer.slug}`}
                    className="group flex items-center justify-between border border-[#eedad2] bg-[#faf3f0] p-5 transition hover:border-[#2d5a3d] hover:shadow-sm"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#d4907a]">
                        {prayer.category.name} {prayer.situation ? `• ${prayer.situation.name}` : ""}
                      </span>
                      <h3 className="font-serif text-base text-[#1f3a28] group-hover:text-[#2d5a3d] transition mt-1">
                        {prayer.title}
                      </h3>
                    </div>
                    <div className="flex items-center text-xs uppercase tracking-[0.15em] text-[#2d5a3d] font-medium whitespace-nowrap ml-4">
                      <span>Pray</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-10 flex items-center justify-between border-b border-[#eedad2] pb-4">
              <div className="flex items-center space-x-8 text-xs uppercase tracking-[0.2em] font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab("COLLECTIONS")}
                  className={`pb-4 -mb-4 transition border-b-2 ${
                    activeTab === "COLLECTIONS"
                      ? "border-[#2d5a3d] text-[#1f3a28]"
                      : "border-transparent text-[#6b635e] hover:text-[#1f3a28]"
                  }`}
                >
                  All Collections (16)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("SAVED")}
                  className={`pb-4 -mb-4 transition border-b-2 flex items-center space-x-2 ${
                    activeTab === "SAVED"
                      ? "border-[#2d5a3d] text-[#1f3a28]"
                      : "border-transparent text-[#6b635e] hover:text-[#1f3a28]"
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${savedPrayers.length > 0 ? "fill-[#d4907a] text-[#d4907a]" : ""}`} />
                  <span>My Saved Sanctuary ({savedPrayers.length})</span>
                </button>
              </div>
            </div>

            {activeTab === "COLLECTIONS" && (
              <div>
                {dailyCategory && (
                  <Link
                    href={`/categories/${dailyCategory.slug}`}
                    className="group mb-10 block border border-[#eedad2] bg-[#faf3f0] p-8 sm:p-10 transition-all duration-300 hover:border-[#d4907a] hover:shadow-[0_12px_40px_rgba(212,144,122,0.2)]"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start sm:items-center space-x-6">
                        <div className="border border-[#eedad2] bg-[#2d5a3d] p-5 text-white shadow-sm transition group-hover:bg-[#1f3a28]">
                          <Sun className="h-8 w-8" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-[#d4907a]">
                              Primary Rhythm &bull; Collection 01
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl sm:text-4xl text-[#1f3a28] transition group-hover:text-[#2d5a3d] mt-1">
                            {dailyCategory.name}
                          </h3>
                          <p className="mt-1 text-xs sm:text-sm text-[#6b635e] max-w-xl leading-relaxed">
                            Begin and close your day in peace. Prayers for waking up, morning gratitude, meals, evening stillness, and peaceful sleep.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-[#eedad2]">
                        <span className="font-serif text-xs sm:text-sm text-[#d4907a]">
                          {dailyCategory._count.prayers} {dailyCategory._count.prayers === 1 ? "Prayer" : "Prayers"} Available
                        </span>
                        <div className="flex items-center text-xs uppercase tracking-[0.2em] text-[#2d5a3d] font-medium group-hover:translate-x-1 transition">
                          <span>Enter Daily Prayers</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {otherCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="group flex flex-col justify-between border border-[#eedad2] bg-[#faf3f0] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#d4907a]/60 hover:shadow-[0_8px_25px_rgba(212,144,122,0.2)]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="border border-[#eedad2] bg-[#fdf0ec] p-3 text-[#2d5a3d] transition group-hover:bg-[#2d5a3d] group-hover:text-white">
                          <CategoryIcon name={cat.icon} className="h-5 w-5" />
                        </div>
                        <span className="font-serif text-xs text-[#d4907a]/80 group-hover:text-[#d4907a]">
                          {String(cat.sortOrder).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="mt-6">
                        <h3 className="font-serif text-lg text-[#1f3a28] transition group-hover:text-[#2d5a3d]">
                          {cat.name}
                        </h3>
                        <p className="mt-1 text-[11px] text-[#6b635e]">
                          {cat._count.prayers} {cat._count.prayers === 1 ? "Prayer" : "Prayers"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "SAVED" && (
              <div>
                {savedPrayers.length === 0 ? (
                  <div className="border border-[#eedad2] bg-[#faf3f0] p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d4907a]/15 text-[#d4907a] mb-4">
                      <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-xl text-[#1f3a28]">Your Sanctuary is Empty</h3>
                    <p className="mt-2 text-xs text-[#6b635e] max-w-sm mx-auto">
                      Click the &ldquo;Save to Favorites&rdquo; button on any prayer to keep it readily accessible here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedPrayers.map((prayer) => (
                      <Link
                        key={prayer.id}
                        href={`/prayers/${prayer.slug}`}
                        className="group flex items-center justify-between border border-[#eedad2] bg-[#faf3f0] p-5 transition hover:border-[#2d5a3d] hover:shadow-sm"
                      >
                        <div className="pr-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#d4907a]">
                              {prayer.category.name} {prayer.situation ? `• ${prayer.situation.name}` : ""}
                            </span>
                          </div>
                          <h3 className="font-serif text-base text-[#1f3a28] group-hover:text-[#2d5a3d] transition">
                            {prayer.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Heart className="h-4 w-4 fill-[#d4907a] text-[#d4907a]" />
                          <div className="flex items-center text-xs uppercase tracking-[0.15em] text-[#2d5a3d] font-medium whitespace-nowrap">
                            <span>Pray</span>
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}