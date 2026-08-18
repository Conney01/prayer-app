"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

export async function toggleFavoriteAction(prayerId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in to save prayers to your favorites." };
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
    return { isFavorite: false };
  } else {
    await db.favorite.create({
      data: {
        userId,
        prayerId,
      },
    });
    revalidatePath("/dashboard");
    return { isFavorite: true };
  }
}

export async function completePrayerAction(prayerId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in to record your prayer completion." };
  }

  const userId = session.user.id;

  await db.prayerCompletion.create({
    data: {
      userId,
      prayerId,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}