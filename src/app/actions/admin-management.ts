"use server";

import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function deletePrayerAction(prayerId: string) {
  try {
    await db.prayer.delete({ where: { id: prayerId } });
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Delete prayer error:", error);
    return { success: false, error: "Failed to delete prayer." };
  }
}

export async function deleteSituationAction(situationId: string) {
  try {
    // Delete associated prayers first or cascade
    await db.prayer.deleteMany({ where: { situationId } });
    await db.situation.delete({ where: { id: situationId } });
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Delete situation error:", error);
    return { success: false, error: "Failed to delete situation." };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  try {
    const situations = await db.situation.findMany({ where: { categoryId } });
    for (const sit of situations) {
      await db.prayer.deleteMany({ where: { situationId: sit.id } });
    }
    await db.situation.deleteMany({ where: { categoryId } });
    await db.category.delete({ where: { id: categoryId } });
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, error: "Failed to delete category." };
  }
}