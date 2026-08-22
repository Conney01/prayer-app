import { db } from "~/server/db";

export async function getUserStreak(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { streakCount: true, lastPrayedAt: true },
  });

  if (!user) return null;

  return {
    streakCount: user.streakCount,
    currentStreak: user.streakCount,
    lastPrayedAt: user.lastPrayedAt,
  };
}