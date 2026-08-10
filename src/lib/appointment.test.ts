import { describe, expect, it } from "vitest";
import { appointmentSchema, buildAppointmentEmail, createRequestReference, escapeHtml } from "./appointment";

const validRequest = {
  fullName: "  Ada   Patient ",
  phone: "+234 800 000 0000",
  email: "ada@example.com",
  preferredService: "Cardiology",
  preferredDoctor: "",
  preferredDate: "2099-08-20",
  message: "  Morning   appointment, please. ",
  consent: true,
  turnstileToken: "valid-token",
  website: "",
};

describe("appointmentSchema", () => {
  it("normalizes and accepts a safe appointment request", () => {
    const result = appointmentSchema.parse(validRequest);
    expect(result.fullName).toBe("Ada Patient");
    expect(result.message).toBe("Morning appointment, please.");
  });

  it("rejects missing consent and invalid email", () => {
    const result = appointmentSchema.safeParse({ ...validRequest, consent: false, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a past preferred date", () => {
    const result = appointmentSchema.safeParse({ ...validRequest, preferredDate: "2020-01-01" });
    expect(result.success).toBe(false);
  });
});

describe("appointment email", () => {
  it("escapes patient-entered HTML", () => {
    const request = appointmentSchema.parse({ ...validRequest, message: "<script>alert('x')</script>" });
    const email = buildAppointmentEmail(request, "SPH-TEST");
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.text).toContain("SPH-TEST");
  });

  it("creates a non-sensitive reference", () => {
    expect(createRequestReference(new Date("2026-08-10T12:00:00Z"), "12345678-abcd")).toBe("SPH-20260810-12345678");
  });

  it("escapes all special HTML characters", () => {
    expect(escapeHtml(`<>&\"'`)).toBe("&lt;&gt;&amp;&quot;&#039;");
  });
});
