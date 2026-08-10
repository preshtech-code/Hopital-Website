// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { POST } from "./route";

const payload = {
  fullName: "Ada Patient",
  phone: "+234 800 000 0000",
  email: "ada@example.com",
  preferredService: "Cardiology",
  preferredDoctor: "",
  preferredDate: "2099-08-20",
  message: "Morning appointment, please.",
  consent: true,
  turnstileToken: "valid-token",
  website: "",
};

const request = (body: unknown) =>
  new Request("http://localhost/api/appointment-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/appointment-request", () => {
  beforeEach(() => {
    sendMock.mockReset();
    process.env.TURNSTILE_SECRET_KEY = "turnstile-secret";
    process.env.RESEND_API_KEY = "resend-key";
    process.env.APPOINTMENTS_TO_EMAIL = "appointments@example.com";
    process.env.MAIL_FROM_EMAIL = "Hospital <website@example.com>";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, action: "appointment_request" }) }));
    sendMock.mockResolvedValue({ data: { id: "email-id" }, error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("sends a validated request and returns a reference", async () => {
    const response = await POST(request(payload));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.reference).toMatch(/^SPH-/);
    expect(sendMock).toHaveBeenCalledOnce();
  });

  it("rejects an invalid or expired Turnstile token", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false, "error-codes": ["timeout-or-duplicate"] }) }));
    const response = await POST(request(payload));
    expect(response.status).toBe(403);
    expect((await response.json()).code).toBe("VERIFICATION_FAILED");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("fails safely when the Turnstile service is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network unavailable")));
    const response = await POST(request(payload));
    expect(response.status).toBe(403);
    expect((await response.json()).code).toBe("VERIFICATION_FAILED");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns field errors without sending email", async () => {
    const response = await POST(request({ ...payload, email: "invalid", consent: false }));
    const body = await response.json();
    expect(response.status).toBe(422);
    expect(body.code).toBe("VALIDATION_ERROR");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns a safe failure when mail delivery fails", async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: "rejected" } });
    const response = await POST(request(payload));
    expect(response.status).toBe(502);
    expect((await response.json()).code).toBe("DELIVERY_FAILED");
  });

  it("returns a safe failure when mail delivery times out", async () => {
    sendMock.mockRejectedValue(new Error("timeout"));
    const response = await POST(request(payload));
    expect(response.status).toBe(502);
    expect((await response.json()).code).toBe("DELIVERY_FAILED");
  });

  it("reports unavailable configuration without exposing a secret", async () => {
    delete process.env.RESEND_API_KEY;
    const response = await POST(request(payload));
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body.code).toBe("FORM_UNAVAILABLE");
    expect(JSON.stringify(body)).not.toContain("turnstile-secret");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("silently absorbs honeypot submissions without sending", async () => {
    const response = await POST(request({ ...payload, website: "spam.example" }));
    expect(response.status).toBe(200);
    expect((await response.json()).reference).toBe("SPH-RECEIVED");
    expect(sendMock).not.toHaveBeenCalled();
  });
});
