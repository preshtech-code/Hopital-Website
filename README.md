# St. Peter’s Hospital Website

A mobile-first single-page specialist hospital website built with Next.js, TypeScript, Tailwind CSS, Resend, and Cloudflare Turnstile.

## Local development

1. Copy `.env.example` to `.env.local` and supply development credentials when testing the live form.
2. Run `npm install`.
3. Run `npm run dev`.

Without a Turnstile site key, local development uses a server-only development bypass. Production builds disable form submission until Turnstile is configured.

## Content handoff

All public content is centralized in `src/lib/hospital-config.ts`. Before a public launch, replace and verify:

- Logo and brand assets
- About copy, services, doctors, credentials, and biographies
- Hospital photography and associated usage rights
- Address, Google Maps URL, phone numbers, emergency line, WhatsApp number, hours, and email addresses
- Domain, Resend sending domain, Turnstile keys, and recipient inbox

Placeholder metadata blocks indexing until the content is approved. Update `src/app/layout.tsx`, `robots.ts`, and `sitemap.ts` when the final domain and verified content are ready.

## Checks

- `npm run lint`
- `npm run test:run`
- `npm run build`

Appointment requests are emailed only. They are never stored, never treated as confirmed bookings, and intentionally do not collect symptoms or medical history.
