"use server";

import { revalidatePath } from "next/cache";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function saveDailyScriptureAction(formData: {
  id?: string;
  reference: string;
  text: string;
  reflection?: string;
  prayerId?: string;
  date?: string;
}) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized curator access." };
    }

    const ref = formData.reference.trim();
    const text = formData.text.trim();
    const reflection = formData.reflection?.trim() ? formData.reflection.trim() : null;
    const prayerId = formData.prayerId?.trim() ? formData.prayerId.trim() : null;
    const scriptureDate = formData.date ? new Date(formData.date) : new Date();

    if (!ref || !text) {
      return { success: false, error: "Scripture reference and verse text are required." };
    }

    if (formData.id) {
      await db.dailyScripture.update({
        where: { id: formData.id },
        data: {
          reference: ref,
          text,
          reflection,
          prayerId,
          date: scriptureDate,
        },
      });
    } else {
      await db.dailyScripture.create({
        data: {
          reference: ref,
          text,
          reflection,
          prayerId,
          date: scriptureDate,
        },
      });
    }

    revalidatePath("/admin/scriptures");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to save daily scripture:", error);
    return { success: false, error: "Database error while saving scripture." };
  }
}

export async function deleteDailyScriptureAction(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized curator access." };
    }

    await db.dailyScripture.delete({
      where: { id },
    });

    revalidatePath("/admin/scriptures");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete daily scripture:", error);
    return { success: false, error: "Failed to remove scripture." };
  }
}