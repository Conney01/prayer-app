import { db } from "~/server/db";

export async function recordDailyLoginStreak(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true, longestStreak: true, lastLoginDate: true },
  });

  if (!user) return null;

  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  let newCurrentStreak = user.currentStreak;
  let shouldUpdate = false;

  if (!user.lastLoginDate || user.currentStreak === 0) {
    newCurrentStreak = 1;
    shouldUpdate = true;
  } else {
    const lastDate = new Date(user.lastLoginDate);
    const lastUtc = Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth(), lastDate.getUTCDate());
    const diffDays = Math.round((todayUtc - lastUtc) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newCurrentStreak += 1;
      shouldUpdate = true;
    } else if (diffDays > 1) {
      newCurrentStreak = 1;
      shouldUpdate = true;
    }
  }

  if (shouldUpdate) {
    const newLongestStreak = Math.max(user.longestStreak, newCurrentStreak);
    return await db.user.update({
      where: { id: userId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastLoginDate: now,
      },
    });
  }

  return user;
}