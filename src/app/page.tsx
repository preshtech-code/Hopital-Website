import { HospitalWebsite } from "@/components/hospital-website";

export default function Home() {
  return <HospitalWebsite turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""} />;
}
