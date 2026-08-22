"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(prayerId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  const existing = await db.savedPrayer.findUnique({
    where: {
      userId_prayerId: {
        userId,
        prayerId,
      },
    },
  });

  if (existing) {
    await db.savedPrayer.delete({
      where: {
        userId_prayerId: {
          userId,
          prayerId,
        },
      },
    });
  } else {
    await db.savedPrayer.create({
      data: {
        userId,
        prayerId,
      },
    });
  }

  revalidatePath("/dashboard");
  return { success: true, isFavorite: !existing };
}

export const toggleFavoritePrayerAction = toggleFavoriteAction;

export async function completePrayerAction(_prayerId?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { streakCount: true, lastPrayedAt: true },
    });

    const now = new Date();
    let newStreak = (user?.streakCount ?? 0) + 1;

    if (user?.lastPrayedAt) {
      const diffHours = (now.getTime() - new Date(user.lastPrayedAt).getTime()) / (1000 * 60 * 60);
      if (diffHours < 24) {
        newStreak = user.streakCount || 1;
      } else if (diffHours > 48) {
        newStreak = 1;
      }
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        streakCount: newStreak,
        lastPrayedAt: now,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, streakCount: newStreak };
  } catch {
    return { success: false, error: "Failed to mark prayer as complete." };
  }
}