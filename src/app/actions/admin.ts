"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";

export async function getAdminCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      include: {
        situations: {
          orderBy: { name: "asc" },
        },
      },
    });
    return {
      success: true,
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        situations: cat.situations.map((s) => s.name),
      })),
    };
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
      },
      include: {
        situations: true,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/prayers/new");
    revalidatePath("/dashboard");
    return {
      success: true,
      category: {
        id: newCategory.id,
        name: newCategory.name,
        slug: newCategory.slug,
        situations: [],
      },
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category." };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  try {
    await db.situation.deleteMany({
      where: { categoryId },
    });

    await db.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/prayers/new");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category." };
  }
}

export async function addSituationAction(categoryId: string, situationName: string) {
  try {
    const trimmed = situationName.trim();
    if (!trimmed) return { success: false, error: "Situation name cannot be blank." };

    const slug = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existing = await db.situation.findFirst({
      where: {
        categoryId,
        name: trimmed,
      },
    });

    if (existing) {
      return { success: false, error: "This situation already exists in this category." };
    }

    await db.situation.create({
      data: {
        name: trimmed,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        categoryId,
      },
    });

    const updatedSituations = await db.situation.findMany({
      where: { categoryId },
      orderBy: { name: "asc" },
    });

    revalidatePath("/admin/prayers/new");
    return { success: true, situations: updatedSituations.map((s) => s.name) };
  } catch (error) {
    console.error("Error adding situation:", error);
    return { success: false, error: "Failed to add situation." };
  }
}

export async function removeSituationAction(categoryId: string, situationToRemove: string) {
  try {
    const existing = await db.situation.findFirst({
      where: {
        categoryId,
        name: situationToRemove,
      },
    });

    if (existing) {
      await db.prayer.updateMany({
        where: { situationId: existing.id },
        data: { situationId: null },
      });

      await db.situation.delete({
        where: { id: existing.id },
      });
    }

    const remainingSituations = await db.situation.findMany({
      where: { categoryId },
      orderBy: { name: "asc" },
    });

    revalidatePath("/admin/prayers/new");
    return { success: true, situations: remainingSituations.map((s) => s.name) };
  } catch (error) {
    console.error("Error removing situation:", error);
    return { success: false, error: "Failed to remove situation." };
  }
}

export async function createPrayerAction(
  data:
    | FormData
    | {
        title: string;
        categoryId: string;
        situation: string;
        body: string;
        description?: string;
        isFeatured?: boolean;
      }
) {
  try {
    let title = "";
    let categoryId = "";
    let situation = "";
    let body = "";
    let description = "";
    let isFeatured = false;

    if (data instanceof FormData) {
      title = (data.get("title") as string | null) ?? "";
      categoryId = (data.get("categoryId") as string | null) ?? "";
      situation = (data.get("situation") as string | null) ?? "";
      body = (data.get("body") as string | null) ?? "";
      description = ((data.get("description") as string | null) ?? "").trim();
      isFeatured = data.get("isFeatured") === "on" || data.get("isFeatured") === "true";
    } else {
      title = data.title;
      categoryId = data.categoryId;
      situation = data.situation;
      body = data.body;
      description = (data.description ?? "").trim();
      isFeatured = Boolean(data.isFeatured);
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existing = await db.prayer.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    let situationRecord = null;
    if (situation.trim()) {
      situationRecord = await db.situation.findFirst({
        where: {
          categoryId,
          name: situation.trim(),
        },
      });

      if (!situationRecord) {
        const sitSlug = situation
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        situationRecord = await db.situation.create({
          data: {
            name: situation.trim(),
            slug: `${sitSlug}-${Date.now().toString().slice(-4)}`,
            categoryId,
          },
        });
      }
    }

    const prayer = await db.prayer.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        body: body.trim(),
        isPublished: true,
        isFeatured,
        categoryId,
        situationId: situationRecord?.id ?? null,
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

export async function updatePrayerAction(
  prayerId: string,
  data:
    | FormData
    | {
        title: string;
        categoryId: string;
        situation?: string;
        body: string;
        description?: string;
        isFeatured?: boolean;
        isPublished?: boolean;
      }
) {
  try {
    let title = "";
    let categoryId = "";
    let situation = "";
    let body = "";
    let description = "";
    let isFeatured = false;
    let isPublished = true;

    if (data instanceof FormData) {
      title = (data.get("title") as string | null) ?? "";
      categoryId = (data.get("categoryId") as string | null) ?? "";
      situation = (data.get("situation") as string | null) ?? "";
      body = (data.get("body") as string | null) ?? "";
      description = ((data.get("description") as string | null) ?? "").trim();
      isFeatured = data.get("isFeatured") === "on" || data.get("isFeatured") === "true";
      isPublished = data.get("isPublished") !== "false";
    } else {
      title = data.title;
      categoryId = data.categoryId;
      situation = data.situation ?? "";
      body = data.body;
      description = (data.description ?? "").trim();
      isFeatured = Boolean(data.isFeatured);
      isPublished = data.isPublished !== undefined ? Boolean(data.isPublished) : true;
    }

    let situationRecord = null;
    if (situation.trim()) {
      situationRecord = await db.situation.findFirst({
        where: {
          categoryId,
          name: situation.trim(),
        },
      });

      if (!situationRecord) {
        const sitSlug = situation
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        situationRecord = await db.situation.create({
          data: {
            name: situation.trim(),
            slug: `${sitSlug}-${Date.now().toString().slice(-4)}`,
            categoryId,
          },
        });
      }
    }

    const prayer = await db.prayer.update({
      where: { id: prayerId },
      data: {
        title: title.trim(),
        categoryId,
        situationId: situationRecord?.id ?? null,
        body: body.trim(),
        isFeatured,
        isPublished,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true, prayer };
  } catch (error) {
    console.error("Failed to update prayer:", error);
    return { success: false, error: "Failed to update prayer." };
  }
}

export async function deletePrayerAction(prayerId: string) {
  try {
    await db.prayer.delete({
      where: { id: prayerId },
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete prayer:", error);
    return { success: false, error: "Failed to delete prayer." };
  }
}

export async function togglePrayerPublishAction(prayerId: string, isPublished: boolean) {
  try {
    await db.prayer.update({
      where: { id: prayerId },
      data: { isPublished },
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle publish state:", error);
    return { success: false, error: "Failed to update publish status." };
  }
}