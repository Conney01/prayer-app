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