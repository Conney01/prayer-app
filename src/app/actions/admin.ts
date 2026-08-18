"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { requireAdmin } from "~/server/auth/guard";
import { PrayerInputSchema } from "~/lib/validations";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createPrayer(formData: FormData) {
  await requireAdmin();

  const rawTitle = (formData.get("title") as string)?.trim();
  const raw = {
    title: rawTitle && rawTitle.length > 0 ? rawTitle : undefined,
    categoryId: formData.get("categoryId") as string,
    situationId: (formData.get("situationId") as string) || null,
    body: (formData.get("body") as string)?.trim(),
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  };

  const parsed = PrayerInputSchema.partial({ title: true }).safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input parameters." };
  }

  const { categoryId, situationId, body, isPublished, isFeatured } = parsed.data;

  const category = await db.category.findUnique({ where: { id: categoryId } });
  if (!category) return { error: "Selected category does not exist." };

  let finalTitle = parsed.data.title;
  let baseSlug = "";

  if (situationId) {
    const situation = await db.situation.findFirst({
      where: { id: situationId, categoryId },
      include: { _count: { select: { prayers: true } } },
    });
    if (!situation) return { error: "Situation does not belong to the selected category." };

    const nextNum = situation._count.prayers + 1;
    finalTitle = finalTitle ?? `${situation.name} — Prayer ${nextNum}`;
    baseSlug = slugify(`${situation.name}-prayer-${nextNum}`);
  } else {
    const count = await db.prayer.count({ where: { categoryId } });
    const nextNum = count + 1;
    finalTitle = finalTitle ?? `${category.name} — Prayer ${nextNum}`;
    baseSlug = slugify(`${category.name}-prayer-${nextNum}`);
  }

  let slug = baseSlug;
  const existing = await db.prayer.findUnique({ where: { slug } });
  if (existing) {
    slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }

  const newPrayer = await db.prayer.create({
    data: {
      title: finalTitle,
      slug,
      body,
      description: body.slice(0, 120) + (body.length > 120 ? "..." : ""),
      categoryId,
      situationId: situationId ?? null,
      isPublished,
      isFeatured,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath(`/categories/${category.slug}`);

  return { success: true, addedTitle: newPrayer.title };
}
export const createPrayerAction = createPrayer;

export async function updatePrayerAction(prayerId: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    title: (formData.get("title") as string)?.trim(),
    categoryId: formData.get("categoryId") as string,
    situationId: (formData.get("situationId") as string) || null,
    body: (formData.get("body") as string)?.trim(),
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  };

  const parsed = PrayerInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form input." };
  }

  const { title, categoryId, situationId, body, isPublished, isFeatured } = parsed.data;

  if (situationId) {
    const sit = await db.situation.findFirst({ where: { id: situationId, categoryId } });
    if (!sit) return { error: "Situation does not match the category." };
  }

  await db.prayer.update({
    where: { id: prayerId },
    data: {
      title,
      categoryId,
      situationId: situationId ?? null,
      body,
      description: body.slice(0, 120) + (body.length > 120 ? "..." : ""),
      isPublished,
      isFeatured,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect("/admin");
}
export const updatePrayer = updatePrayerAction;

export async function deletePrayerAction(prayerId: string) {
  await requireAdmin();
  await db.prayer.delete({ where: { id: prayerId } });
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}
export const deletePrayer = deletePrayerAction;

export async function togglePrayerPublishAction(prayerId: string, isPublished: boolean) {
  await requireAdmin();
  await db.prayer.update({
    where: { id: prayerId },
    data: { isPublished },
  });
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}
export const togglePrayerPublish = togglePrayerPublishAction;