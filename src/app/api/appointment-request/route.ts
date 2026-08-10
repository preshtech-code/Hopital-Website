import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  appointmentSchema,
  buildAppointmentEmail,
  createRequestReference,
  type AppointmentApiResponse,
} from "@/lib/appointment";

export const runtime = "nodejs";

const json = (body: AppointmentApiResponse, status: number) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

async function verifyTurnstile(token: string, remoteIp: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return process.env.NODE_ENV !== "production" && token === "development-bypass";
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: remoteIp || undefined }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean; action?: string };
    return result.success === true && (!result.action || result.action === "appointment_request");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 20_000) {
    return json({ ok: false, code: "REQUEST_TOO_LARGE", message: "The request is too large." }, 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "INVALID_JSON", message: "Please check the form and try again." }, 400);
  }

  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] || "form");
      fields[key] ??= issue.message;
    }
    return json({ ok: false, code: "VALIDATION_ERROR", message: "Please correct the highlighted fields.", fields }, 422);
  }

  if (parsed.data.website) {
    return json(
      { ok: true, reference: "SPH-RECEIVED", message: "Your request has been received for review." },
      200,
    );
  }

  const remoteIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const verified = await verifyTurnstile(parsed.data.turnstileToken, remoteIp);
  if (!verified) {
    return json({ ok: false, code: "VERIFICATION_FAILED", message: "Verification expired or failed. Please try again." }, 403);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.APPOINTMENTS_TO_EMAIL;
  const from = process.env.MAIL_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return json(
      { ok: false, code: "FORM_UNAVAILABLE", message: "Online requests are not configured yet. Please call or use WhatsApp." },
      503,
    );
  }

  const reference = createRequestReference();
  const email = buildAppointmentEmail(parsed.data, reference);

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: parsed.data.email || undefined,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    if (result.error) throw new Error("Email delivery rejected");
  } catch {
    return json(
      { ok: false, code: "DELIVERY_FAILED", message: "We could not send the request. Please call or use WhatsApp instead." },
      502,
    );
  }

  return json(
    {
      ok: true,
      reference,
      message: "Your request has been received. A member of staff will contact you to confirm availability.",
    },
    200,
  );
}
