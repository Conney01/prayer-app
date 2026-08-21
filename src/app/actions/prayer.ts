"use server";

import { revalidatePath } from "next/cache";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function markPrayerCompletedAction(prayerId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Please log in to complete prayers." };
    }

    const userId = session.user.id;

    // Record completion in history
    await db.prayerCompletion.create({
      data: {
        userId,
        prayerId,
      },
    });

    // Calculate streak update
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true, longestStreak: true, lastLoginDate: true },
    });

    const now = new Date();
    const lastDate = user?.lastLoginDate ? new Date(user.lastLoginDate) : null;
    let newStreak = user?.currentStreak ?? 0;

    if (!lastDate) {
      newStreak = 1;
    } else {
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    const longest = Math.max(newStreak, user?.longestStreak ?? 0);

    await db.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: longest,
        lastLoginDate: now,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/prayers/${prayerId}`);
    return { success: true, currentStreak: newStreak };
  } catch (error) {
    console.error("Failed to mark prayer completed:", error);
    return { success: false, error: "Could not record completion." };
  }
}

export async function toggleFavoriteAction(prayerId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Please log in to save favorites." };
    }

    const userId = session.user.id;

    const existing = await db.favorite.findUnique({
      where: {
        userId_prayerId: {
          userId,
          prayerId,
        },
      },
    });

    if (existing) {
      await db.favorite.delete({
        where: { id: existing.id },
      });
      revalidatePath("/dashboard");
      return { success: true, isFavorite: false };
    }

    await db.favorite.create({
      data: {
        userId,
        prayerId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, isFavorite: true };
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    return { success: false, error: "Could not update favorite." };
  }
}