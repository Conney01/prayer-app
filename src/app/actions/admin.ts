"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";

export async function getAdminCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        situations: true,
      },
    });
    return { success: true, categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { success: false, categories: [] };
  }
}

export async function createCategoryAction(name: string) {
  try {
    const trimmed = name.trim();
    if (!trimmed) return { success: false, error: "Category name is required." };

    const slug = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existing = await db.category.findFirst({
      where: {
        OR: [{ name: trimmed }, { slug }],
      },
    });

    if (existing) {
      return { success: false, error: "A category with this name already exists." };
    }

    const newCategory = await db.category.create({
      data: {
        name: trimmed,
        slug,
        description: `Curated prayers for ${trimmed}`,
        situations: [],
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/prayers/new");
    revalidatePath("/dashboard");
    return { success: true, category: newCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category." };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  try {
    await db.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/prayers/new");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category (ensure no prayers depend on it)." };
  }
}

export async function addSituationAction(categoryId: string, situationName: string) {
  try {
    const trimmed = situationName.trim();
    if (!trimmed) return { success: false, error: "Situation name cannot be blank." };

    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) return { success: false, error: "Category not found." };

    const currentSituations = Array.isArray(category.situations) ? category.situations : [];
    if (currentSituations.includes(trimmed)) {
      return { success: false, error: "This situation already exists in this category." };
    }

    const updated = await db.category.update({
      where: { id: categoryId },
      data: {
        situations: [...currentSituations, trimmed],
      },
    });

    revalidatePath("/admin/prayers/new");
    return { success: true, situations: updated.situations };
  } catch (error) {
    console.error("Error adding situation:", error);
    return { success: false, error: "Failed to add situation." };
  }
}

export async function removeSituationAction(categoryId: string, situationToRemove: string) {
  try {
    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) return { success: false, error: "Category not found." };

    const currentSituations = Array.isArray(category.situations) ? category.situations : [];
    const updatedSituations = currentSituations.filter((s) => s !== situationToRemove);

    const updated = await db.category.update({
      where: { id: categoryId },
      data: {
        situations: updatedSituations,
      },
    });

    revalidatePath("/admin/prayers/new");
    return { success: true, situations: updated.situations };
  } catch (error) {
    console.error("Error removing situation:", error);
    return { success: false, error: "Failed to remove situation." };
  }
}

export async function createPrayerAction(formData: {
  title: string;
  categoryId: string;
  situation: string;
  body: string;
  scriptureReference?: string;
  scriptureText?: string;
  isFeatured?: boolean;
}) {
  try {
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existing = await db.prayer.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const prayer = await db.prayer.create({
      data: {
        title: formData.title.trim(),
        slug: finalSlug,
        body: formData.body.trim(),
        scriptureReference: formData.scriptureReference?.trim() || null,
        scriptureText: formData.scriptureText?.trim() || null,
        situation: formData.situation.trim(),
        isPublished: true,
        isFeatured: Boolean(formData.isFeatured),
        categoryId: formData.categoryId,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true, prayer };
  } catch (error) {
    console.error("Failed to create prayer:", error);
    return { success: false, error: "Database write error. Check inputs." };
  }
}