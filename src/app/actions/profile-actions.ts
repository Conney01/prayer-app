"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function updateProfileName(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawName = formData.get("name");
  const name = typeof rawName === "string" ? rawName.trim() : "";
  if (!name) return;

  await db.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
}