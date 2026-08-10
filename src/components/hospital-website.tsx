"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Ambulance,
  ArrowRight,
  Baby,
  BadgeCheck,
  Bone,
  Brain,
  Camera,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  ExternalLink,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Microscope,
  Phone,
  ScanLine,
  ShieldCheck,
  Stethoscope,
  Syringe,
  X,
} from "lucide-react";
import { AppointmentForm } from "@/components/appointment-form";
import { hospitalConfig, type Doctor, type GalleryImage, whatsappUrl } from "@/lib/hospital-config";

const navItems = [
  ["About us", "about"],
  ["Services", "services"],
  ["Doctors", "doctors"],
  ["Gallery", "gallery"],
  ["Appointment", "appointment"],
  ["Contact", "contact"],
] as const;

const serviceIcons = {
  heart: HeartPulse,
  brain: Brain,
  bone: Bone,
  scan: ScanLine,
  children: Baby,
  surgery: Syringe,
};

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="St. Peter’s Hospital home">
      <span className="brand-mark" aria-hidden="true"><span /></span>
      <span><strong>St. Peter’s</strong><small>Hospital</small></span>
    </a>
  );
}

function DoctorDialog({ doctor }: { doctor: Doctor }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button className="text-link" type="button" onClick={() => dialogRef.current?.showModal()}>
        View profile <ChevronRight aria-hidden="true" />
      </button>
      <dialog className="profile-dialog" ref={dialogRef} onClick={(event) => {
        if (event.currentTarget === event.target) dialogRef.current?.close();
      }}>
        <button className="dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close doctor profile"><X aria-hidden="true" /></button>
        <Image src={doctor.image} width={460} height={520} alt={doctor.imageAlt} />
        <div>
          <span className="sample-label">Sample profile</span>
          <h3>{doctor.name}</h3>
          <p className="dialog-specialty">{doctor.specialty}</p>
          <p>{doctor.credentials}</p>
          <p>{doctor.bio}</p>
          <a className="button button-primary" href="#appointment" onClick={() => dialogRef.current?.close()}>
            Request an appointment <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </dialog>
    </>
  );
}

function GalleryDialog({ item, index }: { item: GalleryImage; index: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button className="gallery-card" type="button" onClick={() => dialogRef.current?.showModal()} aria-label={`Open image: ${item.label}`}>
        <Image src={item.src} fill sizes="(max-width: 700px) 100vw, 33vw" alt={item.alt} />
        <span><Camera aria-hidden="true" /> {item.label}</span>
      </button>
      <dialog className="lightbox" ref={dialogRef} onClick={(event) => {
        if (event.currentTarget === event.target) dialogRef.current?.close();
      }}>
        <button className="dialog-close lightbox-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close image"><X aria-hidden="true" /></button>
        <Image src={item.src} width={1400} height={900} alt={item.alt} priority={index < 2} />
        <p>{item.label} <small>Temporary stock image</small></p>
      </dialog>
    </>
  );
}

export function HospitalWebsite({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="preview-bar">{hospitalConfig.previewNotice}</div>
      <div className="emergency-bar">
        <div className="shell emergency-inner">
          <span><Ambulance aria-hidden="true" /> 24/7 Emergency Department</span>
          <a href={`tel:${hospitalConfig.emergencyPhoneHref}`}><Phone aria-hidden="true" /> Emergency: {hospitalConfig.emergencyPhoneDisplay}</a>
        </div>
      </div>
      <header className="site-header" id="top">
        <div className="shell header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>
          <a className="button button-header" href="#appointment">Request appointment</a>
          <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <nav id="mobile-navigation" className={`mobile-nav ${menuOpen ? "is-open" : ""}`} aria-label="Mobile navigation">
          {navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}<ChevronRight aria-hidden="true" /></a>)}
          <a className="button button-primary" href="#appointment" onClick={() => setMenuOpen(false)}>Request appointment</a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero section" aria-labelledby="hero-title">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><Activity aria-hidden="true" /> Multi-specialty care</span>
              <h1 id="hero-title">Specialist care,<br /><span>thoughtfully delivered.</span></h1>
              <p>{hospitalConfig.description}</p>
              <div className="hero-actions">
                <a className="button button-primary button-large" href="#appointment">Request an appointment <ArrowRight aria-hidden="true" /></a>
                <a className="button button-secondary button-large" href={`tel:${hospitalConfig.emergencyPhoneHref}`}><Phone aria-hidden="true" /> Call emergency</a>
              </div>
              <ul className="hero-assurances" aria-label="Care highlights">
                <li><Check aria-hidden="true" /> Consultant-led care</li>
                <li><Check aria-hidden="true" /> Advanced diagnostics</li>
                <li><Check aria-hidden="true" /> Open 24/7</li>
              </ul>
            </div>
            <div className="hero-visual">
              <div className="hero-image-frame">
                <Image src="/images/hero-care.jpg" fill sizes="(max-width: 900px) 100vw, 48vw" priority alt="Sample image of a doctor providing attentive specialist care" />
              </div>
              <div className="hero-float-card">
                <span><ShieldCheck aria-hidden="true" /></span>
                <div><strong>Care that starts with listening</strong><small>Responsive, respectful, coordinated</small></div>
              </div>
              <div className="hero-dot-pattern" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="quick-contact" aria-label="Quick contact options">
          <div className="shell quick-contact-grid">
            <a href={`tel:${hospitalConfig.generalPhoneHref}`}><span><Phone aria-hidden="true" /></span><div><small>Call reception</small><strong>{hospitalConfig.generalPhoneDisplay}</strong></div><ChevronRight aria-hidden="true" /></a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer"><span><MessageCircle aria-hidden="true" /></span><div><small>General enquiries</small><strong>Chat on WhatsApp</strong></div><ChevronRight aria-hidden="true" /></a>
            <a href="#contact"><span><MapPin aria-hidden="true" /></span><div><small>Find the hospital</small><strong>Map & directions</strong></div><ChevronRight aria-hidden="true" /></a>
          </div>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <div className="shell about-grid">
            <div className="about-media">
              <Image src="/images/about-hospital.jpg" fill sizes="(max-width: 800px) 100vw, 44vw" alt="Sample modern hospital interior" />
              <div className="about-badge"><Stethoscope aria-hidden="true" /><strong>Many specialties.<br />One coordinated team.</strong></div>
            </div>
            <div className="about-copy">
              <span className="eyebrow">About St. Peter’s</span>
              <h2 id="about-title">Built around the needs of every patient.</h2>
              <p className="lead">Our sample mission is to make specialist care easier to understand, easier to access, and more connected from consultation through recovery.</p>
              <p>This preview intentionally avoids unverified awards, statistics, and clinical claims. Approved hospital history, accreditation, and leadership information will replace this copy before launch.</p>
              <div className="values-list">
                <div><span><HeartPulse aria-hidden="true" /></span><div><strong>Compassionate care</strong><p>People are treated with dignity, patience, and clear communication.</p></div></div>
                <div><span><Microscope aria-hidden="true" /></span><div><strong>Clinical clarity</strong><p>Specialists and diagnostics work together to guide informed care.</p></div></div>
                <div><span><ShieldCheck aria-hidden="true" /></span><div><strong>Responsible practice</strong><p>Safety, privacy, and professional standards shape every interaction.</p></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section services-section" id="services" aria-labelledby="services-title">
          <div className="shell">
            <div className="section-heading centered-heading">
              <span className="eyebrow">Our services</span>
              <h2 id="services-title">Specialist expertise, connected around you.</h2>
              <p>Sample departments demonstrate the intended layout. The final service list and descriptions require clinical approval.</p>
            </div>
            <div className="services-grid">
              {hospitalConfig.services.map((service, index) => {
                const Icon = serviceIcons[service.icon];
                return (
                  <article className="service-card" key={service.name}>
                    <div className="service-icon"><Icon aria-hidden="true" /></div>
                    <small>0{index + 1}</small>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <a href="#appointment">Request this service <ArrowRight aria-hidden="true" /></a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section doctors-section" id="doctors" aria-labelledby="doctors-title">
          <div className="shell">
            <div className="section-heading split-heading">
              <div><span className="eyebrow">Meet the doctors</span><h2 id="doctors-title">Specialists who make care personal.</h2></div>
              <p>Sample profiles show the final presentation. Every name, image, qualification, and biography must be replaced and verified before launch.</p>
            </div>
            <div className="doctors-grid">
              {hospitalConfig.doctors.map((doctor) => (
                <article className="doctor-card" key={doctor.name}>
                  <div className="doctor-photo"><Image src={doctor.image} fill sizes="(max-width: 700px) 90vw, 25vw" alt={doctor.imageAlt} /><span className="sample-label">Sample profile</span></div>
                  <div className="doctor-card-body"><h3>{doctor.name}</h3><p>{doctor.specialty}</p><small>{doctor.credentials}</small><DoctorDialog doctor={doctor} /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="care-band" aria-label="Emergency care">
          <div className="shell care-band-inner">
            <div className="care-band-icon"><Ambulance aria-hidden="true" /></div>
            <div><span>24/7 emergency department</span><h2>Urgent care should never have to wait.</h2><p>For a medical emergency, call the verified emergency line. Do not use the website form or WhatsApp.</p></div>
            <a className="button button-light button-large" href={`tel:${hospitalConfig.emergencyPhoneHref}`}><Phone aria-hidden="true" /> {hospitalConfig.emergencyPhoneDisplay}</a>
          </div>
        </section>

        <section className="section gallery-section" id="gallery" aria-labelledby="gallery-title">
          <div className="shell">
            <div className="section-heading centered-heading"><span className="eyebrow">Inside St. Peter’s</span><h2 id="gallery-title">Designed for calm, capable care.</h2><p>Temporary stock photography will be replaced with approved images of the real hospital, team, and facilities.</p></div>
            <div className="gallery-grid">
              {hospitalConfig.gallery.map((item, index) => <GalleryDialog item={item} index={index} key={item.src} />)}
            </div>
          </div>
        </section>

        <section className="section appointment-section" id="appointment" aria-labelledby="appointment-title">
          <div className="shell"><AppointmentForm turnstileSiteKey={turnstileSiteKey} /></div>
        </section>

        <section className="section contact-section" id="contact" aria-labelledby="contact-title">
          <div className="shell">
            <div className="section-heading split-heading contact-heading">
              <div><span className="eyebrow">Contact & directions</span><h2 id="contact-title">We’re here when you need us.</h2></div>
              <p>Contact details and the map are placeholders until the hospital verifies its public address, numbers, and business email.</p>
            </div>
            <div className="contact-grid">
              <div className="map-panel">
                <iframe title="Placeholder Google Map for St. Peter’s Hospital" src={hospitalConfig.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                {!hospitalConfig.locationVerified ? <span className="map-placeholder-label"><CircleHelp aria-hidden="true" /> Demonstration map — location not verified</span> : null}
              </div>
              <div className="contact-details">
                <article><span><MapPin aria-hidden="true" /></span><div><small>Visit us</small><h3>{hospitalConfig.address}</h3><a href={hospitalConfig.directionsUrl} target="_blank" rel="noreferrer">Open in Google Maps <ExternalLink aria-hidden="true" /></a></div></article>
                <article><span><Phone aria-hidden="true" /></span><div><small>Call us</small><h3>{hospitalConfig.generalPhoneDisplay}</h3><a href={`tel:${hospitalConfig.generalPhoneHref}`}>Call reception</a></div></article>
                <article><span><Mail aria-hidden="true" /></span><div><small>Business email</small><h3>{hospitalConfig.businessEmail}</h3><a href={`mailto:${hospitalConfig.businessEmail}`}>Send an email</a></div></article>
                <article><span><Clock3 aria-hidden="true" /></span><div><small>Hospital hours</small><h3>{hospitalConfig.hours}</h3><p>Emergency department open 24/7</p></div></article>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand"><Brand /><p>Modern specialist care designed around people, families, and better-coordinated outcomes.</p><span className="footer-preview"><BadgeCheck aria-hidden="true" /> Preview content requires hospital approval</span></div>
          <div><h2>Explore</h2>{navItems.slice(0, 4).map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div>
          <div><h2>Patient links</h2><a href="#appointment">Request appointment</a><a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp enquiry</a><a href="#contact">Map & directions</a><a href="mailto:privacy@example-hospital.com">Privacy enquiries</a></div>
          <div><h2>Emergency</h2><p>Emergency Department<br />Open 24 hours, every day</p><a className="footer-emergency" href={`tel:${hospitalConfig.emergencyPhoneHref}`}>{hospitalConfig.emergencyPhoneDisplay}</a></div>
        </div>
        <div className="shell footer-bottom"><p>© {new Date().getFullYear()} St. Peter’s Hospital. Preview website.</p><p>Temporary photography sourced for design review and must be replaced before launch.</p></div>
      </footer>

      <a className="whatsapp-float" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Open WhatsApp for a general enquiry"><MessageCircle aria-hidden="true" /><span>Chat with us</span></a>
    </>
  );
}
