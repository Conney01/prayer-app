"use server";

import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function savePrayerAction(data: {
  id?: string;
  categoryId: string;
  newCategoryName?: string;
  title: string;
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

    if (data.id) {
      await db.prayer.update({
        where: { id: data.id },
        data: {
          title: data.title,
          body: data.body,
          categoryId,
        },
      });
    } else {
      const baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      await db.prayer.create({
        data: {
          title: data.title,
          body: data.body,
          categoryId,
          slug: uniqueSlug,
          isPublished: true,
          isFeatured: false,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Save prayer error:", error);
    return { success: false, error: "Failed to save prayer." };
  }
}