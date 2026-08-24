import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "~/server/email";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") ?? "aroncornelius38@gmail.com";
  const name = searchParams.get("name") ?? "Aron Cornellious";

  try {
    const result = await sendWelcomeEmail(email, name);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}