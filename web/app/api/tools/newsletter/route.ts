import { NextResponse } from "next/server";
import { systemeAddContactWithTag } from "@/lib/systemeTag";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; consent?: boolean };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!body.consent) {
      return NextResponse.json({ error: "Please confirm you want to receive updates." }, { status: 400 });
    }

    const tagRaw = process.env.SYSTEME_NEWSLETTER_TAG_ID;
    const tagId = tagRaw ? Number(tagRaw) : NaN;
    if (process.env.SYSTEME_API_KEY && tagRaw && !Number.isNaN(tagId)) {
      await systemeAddContactWithTag(email, tagId);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Try again later." }, { status: 500 });
  }
}
