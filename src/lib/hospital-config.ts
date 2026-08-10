export type Service = {
  name: string;
  description: string;
  icon: "heart" | "brain" | "bone" | "scan" | "children" | "surgery";
};

export type Doctor = {
  name: string;
  specialty: string;
  credentials: string;
  bio: string;
  image: string;
  imageAlt: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
  label: string;
};

export const hospitalConfig = {
  name: "St. Peter’s Hospital",
  shortName: "St. Peter’s",
  previewNotice: "Preview website — sample content awaits hospital verification.",
  tagline: "Specialist care, thoughtfully delivered.",
  description:
    "A modern multi-specialty hospital bringing consultant-led care, advanced diagnostics, and attentive support together in one place.",
  address: "Hospital address to be confirmed before public launch",
  generalPhoneDisplay: "+234 000 000 0000",
  generalPhoneHref: "+2340000000000",
  emergencyPhoneDisplay: "+234 000 000 0001",
  emergencyPhoneHref: "+2340000000001",
  whatsappNumber: "2340000000000",
  whatsappMessage:
    "Hello St. Peter’s Hospital, I would like to make a general enquiry.",
  businessEmail: "contact@example-hospital.com",
  appointmentsEmail: "appointments@example-hospital.com",
  hours: "Open 24 hours, every day",
  directionsUrl: "https://maps.google.com/?q=Hospital",
  mapEmbedUrl: "https://www.google.com/maps?q=Hospital&output=embed",
  locationVerified: false,
  services: [
    {
      name: "Cardiology",
      description: "Placeholder copy for heart health consultations, diagnostics, and ongoing specialist support.",
      icon: "heart",
    },
    {
      name: "Neurology",
      description: "Placeholder copy for neurological assessment, investigation, and coordinated care pathways.",
      icon: "brain",
    },
    {
      name: "Orthopaedics",
      description: "Placeholder copy for bone, joint, mobility, trauma, and rehabilitation services.",
      icon: "bone",
    },
    {
      name: "Advanced Diagnostics",
      description: "Placeholder copy for imaging, laboratory testing, screening, and clinical interpretation.",
      icon: "scan",
    },
    {
      name: "Paediatrics",
      description: "Placeholder copy for compassionate specialist care supporting infants, children, and families.",
      icon: "children",
    },
    {
      name: "Specialist Surgery",
      description: "Placeholder copy for surgical consultation, theatre care, recovery, and follow-up.",
      icon: "surgery",
    },
  ] satisfies Service[],
  doctors: [
    {
      name: "Dr. Ada Okafor",
      specialty: "Consultant Cardiologist",
      credentials: "MBBS, FWACP — sample credentials",
      bio: "Sample profile copy. Replace with an approved biography, verified qualifications, and current scope of practice before launch.",
      image: "/images/doctor-ada.jpg",
      imageAlt: "Sample portrait representing a hospital doctor",
    },
    {
      name: "Dr. Michael Adeyemi",
      specialty: "Consultant Neurologist",
      credentials: "MBBS, FMCP — sample credentials",
      bio: "Sample profile copy. Replace with an approved biography, verified qualifications, and current scope of practice before launch.",
      image: "/images/doctor-michael.jpg",
      imageAlt: "Sample portrait representing a hospital doctor",
    },
    {
      name: "Dr. Zainab Bello",
      specialty: "Consultant Paediatrician",
      credentials: "MBBS, FWACP — sample credentials",
      bio: "Sample profile copy. Replace with an approved biography, verified qualifications, and current scope of practice before launch.",
      image: "/images/doctor-zainab.jpg",
      imageAlt: "Sample portrait representing a hospital doctor",
    },
    {
      name: "Dr. David Eze",
      specialty: "Consultant Orthopaedic Surgeon",
      credentials: "MBBS, FWACS — sample credentials",
      bio: "Sample profile copy. Replace with an approved biography, verified qualifications, and current scope of practice before launch.",
      image: "/images/doctor-david.jpg",
      imageAlt: "Sample portrait representing a hospital doctor",
    },
  ] satisfies Doctor[],
  gallery: [
    { src: "/images/gallery-1.jpg", alt: "Sample modern hospital reception", label: "Welcoming spaces" },
    { src: "/images/gallery-2.jpg", alt: "Sample clinical consultation room", label: "Consultation rooms" },
    { src: "/images/gallery-3.jpg", alt: "Sample hospital diagnostic equipment", label: "Diagnostics" },
    { src: "/images/gallery-4.jpg", alt: "Sample specialist medical team", label: "Specialist teams" },
    { src: "/images/gallery-5.jpg", alt: "Sample patient care environment", label: "Patient care" },
    { src: "/images/gallery-6.jpg", alt: "Sample surgical environment", label: "Surgical care" },
    { src: "/images/gallery-7.jpg", alt: "Sample hospital corridor", label: "Modern facilities" },
    { src: "/images/gallery-8.jpg", alt: "Sample clinician at work", label: "Clinical expertise" },
  ] satisfies GalleryImage[],
} as const;

export const whatsappUrl = `https://wa.me/${hospitalConfig.whatsappNumber}?text=${encodeURIComponent(
  hospitalConfig.whatsappMessage,
)}`;
