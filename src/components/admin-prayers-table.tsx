"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Edit3, Trash2, Eye, EyeOff, Sparkles } from "lucide-react";
import { deletePrayerAction, togglePrayerPublishAction } from "~/app/actions/admin";

interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

interface Situation {
  id: string;
  name: string;
}

interface PrayerItem {
  id: string;
  title: string;
  slug: string;
  body: string;
  isPublished: boolean;
  isFeatured: boolean;
  categoryId: string;
  situationId: string | null;
  category: Category;
  situation: Situation | null;
}

export function AdminPrayersTable({
  initialPrayers,
  categories,
}: {
  initialPrayers: PrayerItem[];
  categories: Category[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "LIVE" | "DRAFT">("ALL");

  const filtered = initialPrayers.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(query) ||
      p.body.toLowerCase().includes(query) ||
      Boolean(p.situation?.name.toLowerCase().includes(query));

    const matchesCategory =
      selectedCategory === "ALL" || p.categoryId === selectedCategory;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "LIVE" && p.isPublished) ||
      (statusFilter === "DRAFT" && !p.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="border border-[#eedad2] bg-[#faf3f0] shadow-sm">
      <div className="p-6 border-b border-[#eedad2] space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl text-[#1f3a28]">Curated Prayers</h2>
            <p className="text-xs text-[#6b635e] mt-0.5">
              Showing {filtered.length} of {initialPrayers.length} prayers in the library
            </p>
          </div>

          <Link
            href="/admin/prayers/new"
            className="bg-[#2d5a3d] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-[#1f3a28] transition"
          >
            + Add Prayer
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-[#6b635e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, text, situation..."
              className="w-full border border-[#eedad2] bg-white py-2.5 pl-9 pr-4 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-[#eedad2] bg-white py-2.5 px-3 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {String(c.sortOrder).padStart(2, "0")} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "ALL" | "LIVE" | "DRAFT")}
              className="w-full border border-[#eedad2] bg-white py-2.5 px-3 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="LIVE">Live Published Only</option>
              <option value="DRAFT">Drafts Only</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center">
          <p className="font-serif text-sm italic text-[#6b635e]">No prayers match your current filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#eedad2] bg-[#fdf0ec] text-[10px] uppercase tracking-[0.2em] text-[#6b635e]">
                <th className="py-4 px-6 font-medium">Prayer Title</th>
                <th className="py-4 px-6 font-medium">Category</th>
                <th className="py-4 px-6 font-medium">Situation</th>
                <th className="py-4 px-6 font-medium text-center">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eedad2]">
              {filtered.map((prayer) => (
                <tr key={prayer.id} className="hover:bg-[#fdf0ec]/60 transition">
                  <td className="py-4 px-6 font-serif text-sm font-medium text-[#1f3a28]">
                    <div className="flex items-center space-x-2">
                      <Link href={`/prayers/${prayer.slug}`} className="hover:text-[#2d5a3d] transition">
                        {prayer.title}
                      </Link>
                      {prayer.isFeatured && (
                        <span title="Featured on dashboard">
                          <Sparkles className="h-3 w-3 text-[#d4907a]" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#6b635e]">{prayer.category.name}</td>
                  <td className="py-4 px-6 text-[#6b635e]">{prayer.situation?.name ?? "—"}</td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium ${
                        prayer.isPublished
                          ? "bg-[#2d5a3d]/10 text-[#2d5a3d]"
                          : "bg-[#6b635e]/10 text-[#6b635e]"
                      }`}
                    >
                      {prayer.isPublished ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-4">
                      <Link
                        href={`/admin/prayers/${prayer.id}/edit`}
                        title="Edit Prayer"
                        className="text-[#6b635e] hover:text-[#2d5a3d] transition"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>

                      <form
                        action={async () => {
                          await togglePrayerPublishAction(prayer.id, !prayer.isPublished);
                        }}
                      >
                        <button
                          type="submit"
                          title={prayer.isPublished ? "Unpublish" : "Publish"}
                          className="text-[#6b635e] hover:text-[#1f3a28] transition cursor-pointer"
                        >
                          {prayer.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </form>

                      <form
                        action={async () => {
                          if (confirm(`Delete "${prayer.title}"?`)) {
                            await deletePrayerAction(prayer.id);
                          }
                        }}
                      >
                        <button
                          type="submit"
                          title="Delete Prayer"
                          className="text-rose-600 hover:text-rose-800 transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}