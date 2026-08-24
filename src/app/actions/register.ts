"use server";

import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import { sendWelcomeEmail } from "~/server/email";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function registerUser(formData: FormData) {
  try {
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const password = formData.get("password") as string;
    const termsAgreed = formData.get("terms") === "on";

    if (!termsAgreed) {
      return { error: "Please agree to the Terms of Service and Privacy Policy to continue." };
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return { error: "Please enter a valid email address (e.g. name@example.com)."};
    }

    if (!password || password.length < 6) {
      return { error: "Password must be at least 6 characters long." };
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists."};
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    try {
      await sendWelcomeEmail(email, name);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Detailed registration error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { error: `Server error: ${errorMessage}` };
  }
}