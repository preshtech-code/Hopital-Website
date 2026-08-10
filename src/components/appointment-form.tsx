"use client";

import Script from "next/script";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CalendarCheck2, CheckCircle2, LoaderCircle, LockKeyhole, PhoneCall } from "lucide-react";
import { hospitalConfig, whatsappUrl } from "@/lib/hospital-config";
import type { AppointmentApiResponse } from "@/lib/appointment";

declare global {
  interface Window {
    appointmentTurnstileSuccess?: (token: string) => void;
    appointmentTurnstileExpired?: () => void;
    turnstile?: { reset: () => void };
  }
}

type SubmitState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; reference: string; message: string }
  | { type: "error"; message: string; fields?: Record<string, string> };

export function AppointmentForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const isProductionUnconfigured = !turnstileSiteKey && process.env.NODE_ENV === "production";

  useEffect(() => {
    window.appointmentTurnstileSuccess = (token: string) => setTurnstileToken(token);
    window.appointmentTurnstileExpired = () => setTurnstileToken("");
    return () => {
      delete window.appointmentTurnstileSuccess;
      delete window.appointmentTurnstileExpired;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const token = turnstileSiteKey ? turnstileToken : "development-bypass";
    if (!token) {
      setSubmitState({ type: "error", message: "Please complete the verification check." });
      return;
    }

    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      preferredService: String(formData.get("preferredService") || ""),
      preferredDoctor: String(formData.get("preferredDoctor") || ""),
      preferredDate: String(formData.get("preferredDate") || ""),
      message: String(formData.get("message") || ""),
      consent: formData.get("consent") === "on",
      website: String(formData.get("website") || ""),
      turnstileToken: token,
    };

    setSubmitState({ type: "loading" });
    try {
      const response = await fetch("/api/appointment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as AppointmentApiResponse;
      if (!result.ok) {
        setSubmitState({ type: "error", message: result.message, fields: result.fields });
        window.turnstile?.reset();
        setTurnstileToken("");
        return;
      }

      setSubmitState({ type: "success", reference: result.reference, message: result.message });
      formRef.current?.reset();
      window.turnstile?.reset();
      setTurnstileToken("");
    } catch {
      setSubmitState({
        type: "error",
        message: "The request could not be sent. Please call or use WhatsApp instead.",
      });
      window.turnstile?.reset();
      setTurnstileToken("");
    }
  }

  const fieldError = (name: string) => (submitState.type === "error" ? submitState.fields?.[name] : undefined);

  return (
    <div className="appointment-panel">
      {turnstileSiteKey ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      ) : null}

      <div className="appointment-intro">
        <span className="eyebrow eyebrow-light"><CalendarCheck2 aria-hidden="true" /> Appointment request</span>
        <h2 id="appointment-title">Start your care journey</h2>
        <p>
          Tell us who you would like to see and your preferred date. Our team will contact you to confirm availability.
        </p>
        <div className="request-notice">
          <AlertCircle aria-hidden="true" />
          <p><strong>This is not a confirmed booking.</strong> Please do not include symptoms, diagnoses, or private medical history.</p>
        </div>
        <div className="appointment-alternatives">
          <a href={`tel:${hospitalConfig.generalPhoneHref}`}><PhoneCall aria-hidden="true" /> Call reception</a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">General enquiry on WhatsApp</a>
        </div>
      </div>

      <form ref={formRef} className="appointment-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label>
            <span>Full name <em>*</em></span>
            <input name="fullName" autoComplete="name" required minLength={2} maxLength={100} aria-invalid={!!fieldError("fullName")} />
            {fieldError("fullName") ? <small className="field-error">{fieldError("fullName")}</small> : null}
          </label>
          <label>
            <span>Phone number <em>*</em></span>
            <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} aria-invalid={!!fieldError("phone")} />
            {fieldError("phone") ? <small className="field-error">{fieldError("phone")}</small> : null}
          </label>
          <label>
            <span>Email <small>(optional)</small></span>
            <input name="email" type="email" autoComplete="email" maxLength={160} aria-invalid={!!fieldError("email")} />
            {fieldError("email") ? <small className="field-error">{fieldError("email")}</small> : null}
          </label>
          <label>
            <span>Preferred date <em>*</em></span>
            <input name="preferredDate" type="date" min={today} required aria-invalid={!!fieldError("preferredDate")} />
            {fieldError("preferredDate") ? <small className="field-error">{fieldError("preferredDate")}</small> : null}
          </label>
          <label>
            <span>Service <em>*</em></span>
            <select name="preferredService" required defaultValue="" aria-invalid={!!fieldError("preferredService")}>
              <option value="" disabled>Select a service</option>
              {hospitalConfig.services.map((service) => <option key={service.name}>{service.name}</option>)}
            </select>
            {fieldError("preferredService") ? <small className="field-error">{fieldError("preferredService")}</small> : null}
          </label>
          <label>
            <span>Preferred doctor <small>(optional)</small></span>
            <select name="preferredDoctor" defaultValue="">
              <option value="">No preference</option>
              {hospitalConfig.doctors.map((doctor) => <option key={doctor.name}>{doctor.name}</option>)}
            </select>
          </label>
          <label className="full-field">
            <span>Short note <small>(optional, no medical history)</small></span>
            <textarea name="message" rows={4} maxLength={500} placeholder="For example: I prefer a morning appointment." aria-invalid={!!fieldError("message")} />
            {fieldError("message") ? <small className="field-error">{fieldError("message")}</small> : null}
          </label>
        </div>

        <label className="honeypot" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>

        <label className="consent-row">
          <input name="consent" type="checkbox" required />
          <span>I consent to St. Peter’s Hospital using these details to respond to this appointment request. <em>*</em></span>
        </label>

        {turnstileSiteKey ? (
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-action="appointment_request"
            data-callback="appointmentTurnstileSuccess"
            data-expired-callback="appointmentTurnstileExpired"
          />
        ) : (
          <div className="configuration-note" role="note">
            <LockKeyhole aria-hidden="true" />
            {isProductionUnconfigured
              ? "Online requests will open after secure form credentials are configured."
              : "Development mode: Turnstile is bypassed locally."}
          </div>
        )}

        {submitState.type === "success" ? (
          <div className="form-message success-message" role="status" tabIndex={-1}>
            <CheckCircle2 aria-hidden="true" />
            <div><strong>Request received</strong><p>{submitState.message}</p><small>Reference: {submitState.reference}</small></div>
          </div>
        ) : null}
        {submitState.type === "error" ? (
          <div className="form-message error-message" role="alert">
            <AlertCircle aria-hidden="true" /><p>{submitState.message}</p>
          </div>
        ) : null}

        <button className="button button-primary submit-button" type="submit" disabled={submitState.type === "loading" || isProductionUnconfigured}>
          {submitState.type === "loading" ? <><LoaderCircle className="spin" aria-hidden="true" /> Sending request…</> : <>Request an appointment <CalendarCheck2 aria-hidden="true" /></>}
        </button>
        <p className="form-footnote">We will contact you to confirm. For urgent help, call the 24/7 emergency department.</p>
      </form>
    </div>
  );
}
