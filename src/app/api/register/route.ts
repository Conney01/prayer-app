import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import { sendWelcomeEmail } from "~/server/email";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : undefined;
    const password = typeof body.password === "string" ? body.password : undefined;

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.user.create({
      data: {
        name: name ?? null,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    try {
      if (email) {
        await sendWelcomeEmail(email, name ?? undefined);
      }
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("API registration error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message: `Database error: ${errorMessage}` }, { status: 500 });
  }
}