"use client";

import Link from "next/link";
import { History, BookOpen, ChevronRight } from "lucide-react";

interface CompletionItem {
  id: string;
  completedAt: Date;
  prayer: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    category: {
      name: string;
      slug: string;
    };
  };
}

export function PrayerHistory({ completions }: { completions: CompletionItem[] }) {
  if (completions.length === 0) {
    return (
      <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#6b635e] shadow-xs">
          <BookOpen className="h-5 w-5" />
        </div>
        <h4 className="mt-3 font-serif text-sm font-semibold text-[#1f3a28]">
          No Completed Prayers Yet
        </h4>
        <p className="mt-1 text-xs text-[#6b635e] max-w-sm mx-auto">
          As you pray and mark devotions completed, your sacred history will be quietly preserved here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#eedad2]/60 pb-3">
        <div className="flex items-center space-x-2">
          <History className="h-4 w-4 text-[#2d5a3d]" />
          <h3 className="font-serif text-sm font-bold text-[#1f3a28]">
            Recent Prayer Journey ({completions.length})
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-[#6b635e]">
          Completed
        </span>
      </div>

      <div className="divide-y divide-[#eedad2]/40">
        {completions.map((item) => (
          <Link
            key={item.id}
            href={`/prayers/${item.prayer.slug}`}
            className="group flex items-center justify-between py-3 px-2 rounded-xl transition hover:bg-white"
          >
            <div className="space-y-0.5 pr-4">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#d4907a]">
                  {item.prayer.category.name}
                </span>
                <span className="text-[10px] text-[#6b635e]">
                  • {new Date(item.completedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <h4 className="font-serif text-sm font-semibold text-[#1f3a28] group-hover:text-[#2d5a3d] transition">
                {item.prayer.title}
              </h4>
            </div>

            <ChevronRight className="h-4 w-4 text-[#6b635e]/60 group-hover:text-[#2d5a3d] group-hover:translate-x-0.5 transition flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}