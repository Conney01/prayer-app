"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(prayerId: string) {
  try {
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

    try {
      revalidatePath("/dashboard/saved");
      revalidatePath("/prayers/[slug]", "page");
    } catch (e) {
      console.warn("Cache revalidation failed:", e);
    }

    return { success: true, isFavorite: !existing };
  } catch (error) {
    console.error("Toggle favorite error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown database failure";
    return { success: false, error: errorMessage };
  }
}

export const toggleFavoritePrayerAction = toggleFavoriteAction;

export async function completePrayerAction(_prayerId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

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
  } catch (error) {
    console.error("Complete prayer error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to mark prayer complete.";
    return { success: false, error: errorMessage };
  }
}