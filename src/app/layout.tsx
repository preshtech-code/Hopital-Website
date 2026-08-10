import type { Metadata, Viewport } from "next";
import "./globals.css";
import { hospitalConfig } from "@/lib/hospital-config";

export const metadata: Metadata = {
  metadataBase: new URL("https://st-peters-hospital.example"),
  title: { default: `${hospitalConfig.name} | Specialist Care`, template: `%s | ${hospitalConfig.name}` },
  description: hospitalConfig.description,
  applicationName: hospitalConfig.name,
  keywords: ["specialist hospital", "hospital", "doctor consultation", "emergency care", "diagnostics"],
  openGraph: {
    title: hospitalConfig.name,
    description: hospitalConfig.description,
    type: "website",
    locale: "en_NG",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#082b4c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
