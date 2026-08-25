"use server";

import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function savePrayerAction(data: {
  id?: string;
  categoryId: string;
  newCategoryName?: string;
  title: string;
  originalTitle?: string;
  body: string;
}) {
  try {
    let categoryId = data.categoryId;

    // Handle inline new category creation
    if (data.newCategoryName) {
      const newCat = await db.category.create({
        data: {
          name: data.newCategoryName,
          slug: data.newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          sortOrder: 0,
        }
      });
      categoryId = newCat.id;
    }

    // Extract base situation name and ensure a Situation record exists
    const baseSituationTitle = data.title.split(/ [—–-] /)[0]?.trim() ?? data.title;
    const situationSlug = baseSituationTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const situation = (await db.situation.findFirst({
      where: {
        categoryId,
        name: baseSituationTitle,
      },
    })) ?? (await db.situation.create({
      data: {
        name: baseSituationTitle,
        slug: situationSlug,
        categoryId,
        sortOrder: 0,
      },
    }));

    if (data.id) {
      // If editing, keep the original title if they didn't change the base situation
      const baseOriginal = data.originalTitle?.split(/ [—–-] /)[0]?.trim();
      const finalUpdateTitle = (baseOriginal === data.title) ? data.originalTitle : data.title;

      await db.prayer.update({
        where: { id: data.id },
        data: {
          title: finalUpdateTitle ?? data.title,
          body: data.body,
          categoryId,
          situationId: situation.id,
        },
      });
    } else {
      // If creating new, auto-append the correct number
      const existingCount = await db.prayer.count({
        where: {
          categoryId,
          situationId: situation.id,
        },
      });

      const finalTitle = `${baseSituationTitle} — Prayer ${existingCount + 1}`;

      const baseSlug = finalTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      await db.prayer.create({
        data: {
          title: finalTitle,
          body: data.body,
          categoryId,
          situationId: situation.id,
          slug: uniqueSlug,
          isPublished: true,
          isFeatured: false,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Save prayer error:", error);
    return { success: false, error: "Failed to save prayer." };
  }
}