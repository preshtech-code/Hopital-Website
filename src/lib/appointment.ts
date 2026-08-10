import { z } from "zod";

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

export const appointmentSchema = z.object({
  fullName: z.string().transform(normalizeText).pipe(z.string().min(2).max(100)),
  phone: z.string().transform(normalizeText).pipe(z.string().min(7).max(30)),
  email: z.union([z.literal(""), z.email().max(160)]).optional().default(""),
  preferredService: z.string().transform(normalizeText).pipe(z.string().min(2).max(100)),
  preferredDoctor: z.string().transform(normalizeText).pipe(z.string().max(100)).optional().default(""),
  preferredDate: z.iso.date().refine((value) => {
    const today = new Date();
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return new Date(`${value}T00:00:00`) >= localToday;
  }, "Choose today or a future date"),
  message: z.string().transform(normalizeText).pipe(z.string().max(500)).optional().default(""),
  consent: z.literal(true),
  turnstileToken: z.string().min(1).max(2048),
  website: z.string().max(200).optional().default(""),
});

export type AppointmentRequest = z.infer<typeof appointmentSchema>;

export type AppointmentApiResponse =
  | { ok: true; reference: string; message: string }
  | { ok: false; code: string; message: string; fields?: Record<string, string> };

export function createRequestReference(now = new Date(), random = crypto.randomUUID()) {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `SPH-${date}-${random.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildAppointmentEmail(request: AppointmentRequest, reference: string) {
  const entries = [
    ["Reference", reference],
    ["Patient name", request.fullName],
    ["Phone", request.phone],
    ["Email", request.email || "Not supplied"],
    ["Preferred service", request.preferredService],
    ["Preferred doctor", request.preferredDoctor || "No preference"],
    ["Preferred date", request.preferredDate],
    ["Note", request.message || "No note supplied"],
  ] as const;

  const text = [
    "New website appointment request",
    "",
    ...entries.map(([label, value]) => `${label}: ${value}`),
    "",
    "This is a request only. Staff must contact the patient to confirm any appointment.",
  ].join("\n");

  const rows = entries
    .map(
      ([label, value]) =>
        `<tr><th style="text-align:left;padding:10px;border-bottom:1px solid #dbe7ef;color:#17324d">${escapeHtml(label)}</th><td style="padding:10px;border-bottom:1px solid #dbe7ef">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const html = `<div style="font-family:Arial,sans-serif;color:#17324d;max-width:680px"><h1 style="font-size:22px">New appointment request</h1><table style="border-collapse:collapse;width:100%">${rows}</table><p style="padding:14px;background:#effaff;border-left:4px solid #00a7c7"><strong>This is not a confirmed booking.</strong> Please contact the patient to arrange care.</p></div>`;

  return { subject: `[Website appointment request] ${reference}`, text, html };
}
