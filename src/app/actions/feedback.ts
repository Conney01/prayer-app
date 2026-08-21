"use server";

import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function submitFeedbackAction(data: { email?: string; message: string; userId?: string }) {
  try {
    await db.feedback.create({
      data: {
        email: data.email ?? null,
        message: data.message,
        userId: data.userId ?? null,
      },
    });
    revalidatePath("/admin");
    return { success: true, message: "Thank you! Your feedback has been sent to the Sanctuary team." };
  } catch (_error) {
    return { success: false, error: "Failed to submit feedback. Please try again." };
  }
}