"use client";

import { Flame, Sparkles } from "lucide-react";

interface WeeklyStreakProps {
  currentStreak: number;
  longestStreak: number;
  completedDates: Date[];
}

export function WeeklyStreak({ currentStreak, longestStreak, completedDates }: WeeklyStreakProps) {
  // Generate the last 7 days (including today)
  const today = new Date();
  const pastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    return d;
  });

  const isDayCompleted = (date: Date) => {
    return completedDates.some((compDate) => {
      const c = new Date(compDate);
      return (
        c.getFullYear() === date.getFullYear() &&
        c.getMonth() === date.getMonth() &&
        c.getDate() === date.getDate()
      );
    });
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eedad2]/60 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#1f3a28]">
              {currentStreak} {currentStreak === 1 ? "Day" : "Days"} in Stillness
            </h3>
            <p className="text-xs text-[#6b635e]">
              Personal best: {longestStreak} {longestStreak === 1 ? "day" : "days"} • Every breath in prayer counts.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center space-x-1.5 self-start sm:self-center rounded-full bg-[#1f3a28]/5 px-3 py-1 text-[11px] font-medium text-[#1f3a28]">
          <Sparkles className="h-3 w-3 text-[#d4907a]" />
          <span>Grace over perfection</span>
        </div>
      </div>

      {/* 7-Day Visual Activity Circles */}
      <div className="grid grid-cols-7 gap-2 pt-5 text-center">
        {pastSevenDays.map((day, idx) => {
          const completed = isDayCompleted(day);
          const isToday =
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear();

          return (
            <div key={idx} className="flex flex-col items-center space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b635e]">
                {dayNames[day.getDay()]}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  completed
                    ? "bg-[#2d5a3d] text-white shadow-sm ring-2 ring-[#2d5a3d]/20"
                    : isToday
                    ? "border-2 border-dashed border-[#d4907a] bg-white text-[#1f3a28]"
                    : "bg-white/60 text-[#6b635e]/60"
                }`}
                title={`${day.toLocaleDateString()} ${completed ? "— Prayed" : ""}`}
              >
                {completed ? "✓" : day.getDate()}
              </div>
              <span className="text-[9px] text-[#6b635e]">
                {isToday ? "Today" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}