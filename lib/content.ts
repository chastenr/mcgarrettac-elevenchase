export const business = {
  name: "McGarrett A/C & Heating",
  phone: "346-946-7577",
  tel: "tel:+13469467577",
  email: "mcgarrettac@gmail.com",
  mailto: "mailto:mcgarrettac@gmail.com",
  license: "TACLB 27809E",
  hours: "Monday–Friday, 8 AM–4 PM",
  onCall: "Saturday & Sunday on call",
  area: "Tomball, Greater Houston & Northwest Harris County",
} as const;

export const services = [
  {
    id: "cooling",
    title: "Air conditioning",
    short: "Cooling",
    description:
      "A/C repairs, routine maintenance, and new system installation for your home or property.",
    image: "/images/ac-repair.jpg",
    alt: "Air conditioning equipment featured on McGarrett’s website",
  },
  {
    id: "heating",
    title: "Heating",
    short: "Heating",
    description:
      "Furnace repairs, maintenance, and installation to help you prepare for cooler days.",
    image: "/images/furnace-repair.jpg",
    alt: "Heating equipment featured on McGarrett’s website",
  },
  {
    id: "commercial",
    title: "Commercial HVAC",
    short: "Commercial",
    description:
      "Air conditioning, heating, and air duct services for commercial properties.",
    image: "/images/commercial-heating.jpg",
    alt: "Commercial air conditioning equipment",
  },
  {
    id: "air-quality",
    title: "Indoor air quality",
    short: "Air quality",
    description:
      "Talk with McGarrett about indoor air quality services and the needs of your space.",
    image: "/images/indoor-air.jpg",
    alt: "Indoor air quality and HVAC service equipment",
  },
  {
    id: "maintenance",
    title: "Annual maintenance",
    short: "Maintenance",
    description:
      "Ask about annual service contracts and plan routine care for your heating and cooling equipment.",
    image: "/images/ac-maintenance.jpg",
    alt: "Air conditioning service and maintenance",
  },
] as const;
export type ServiceId = (typeof services)[number]["id"];
export type PropertyType = "Residential" | "Commercial" | "Multifamily";
export const propertyTypes: PropertyType[] = [
  "Residential",
  "Commercial",
  "Multifamily",
];
export const faqs = [
  {
    question: "What heating and cooling services do you offer?",
    answer:
      "McGarrett provides air conditioning and furnace repairs, maintenance, and installation, along with commercial HVAC and air duct services, indoor air quality services, and annual service contracts.",
  },
  {
    question: "Do you work with business and multifamily properties?",
    answer:
      "Yes. McGarrett works with residential, commercial, and multifamily HVAC systems. Share your property type when you call or request service.",
  },
  {
    question: "Which areas do you serve?",
    answer:
      "McGarrett serves Tomball, the Greater Houston area, and Northwest Harris County. Call 346-946-7577 to ask about your specific location.",
  },
  {
    question: "Can I ask about annual maintenance?",
    answer:
      "Yes. Annual service contracts are available. Contact McGarrett to discuss your equipment, the available service, and current terms.",
  },
  {
    question: "When can I contact McGarrett?",
    answer:
      "Published office hours are Monday–Friday, 8 AM–4 PM, with Saturday and Sunday on call. After-hours availability is also mentioned on the company website. Call to ask about availability; submitting a request does not confirm an appointment.",
  },
] as const;
