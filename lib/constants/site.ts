/**
 * Site-wide constants: social links, contact, and legal URLs.
 * Use these everywhere (footer, contact page, forms, etc.) for a single source of truth.
 */

export const SITE_NAME = "The Real Business";

/** About page and company story — single source of truth for mission, vision, stats, etc. */
export const ABOUT = {
  tagline: "Your trusted partner in premium real estate.",
  shortStory:
    "Founded on integrity and a passion for exceptional properties, we have been the cornerstone of premium real estate consulting for over two decades. We specialize in curating experiences that go beyond simple transactions.",
  storyParagraphs: [
    "Our journey began with a single vision: to redefine what it means to live well. Today we stand as a trusted leader, connecting discerning clients with exceptional homes and investments.",
    "We combine local market expertise with the highest standards of service—whether you are buying, selling, renting, or investing. Your goals and peace of mind are at the centre of everything we do.",
  ],
  mission:
    "To provide unparalleled real estate services that empower our clients to achieve their lifestyle and investment goals through expertise, transparency, and personalized care.",
  vision:
    "To be the benchmark for excellence in real estate in our markets, continuously innovating and building long-term relationships built on trust and results.",
  yearsExperience: 25,
  stats: [
    { value: "$2.4B+", label: "Total Sales" },
    { value: "1.5k+", label: "Properties Sold" },
    { value: "120+", label: "Expert Agents" },
    { value: "99%", label: "Client Satisfaction" },
  ],
  values: [
    {
      title: "Integrity",
      description:
        "Honesty and transparency are the foundations of every relationship we build.",
    },
    {
      title: "Excellence",
      description:
        "We aim for the highest quality in service, presentation, and outcomes.",
    },
    {
      title: "Innovation",
      description:
        "We use the best tools and practices to stay ahead in a dynamic market.",
    },
    {
      title: "Client First",
      description:
        "Your goals are our priority. We are committed to your long-term success.",
    },
  ],
} as const;

export const CONTACT = {
  email: "contact@therealbusiness.com",
  supportEmail: "support@therealbusiness.com",
  phone: "+1 (555) 123-4567",
  phoneSecondary: "+1 (555) 987-6543",
  /** WhatsApp link for quick contact (wa.me with country code + number, no + or spaces) */
  whatsappUrl: "https://wa.me/15551234567",
  whatsappLabel: "Chat on WhatsApp",
  /** Primary contact CTA label (e.g. contact form, contact page link) */
  contactUsLabel: "Contact us",
  address: {
    line1: "123 Luxury Avenue, Suite 500",
    city: "New York, NY 10022",
  },
  workingHours: {
    weekdays: "Monday - Friday: 9:00 AM - 6:00 PM",
    saturday: "Saturday: 10:00 AM - 4:00 PM",
  },
} as const;

/** Ask Leon — expert Q&A / quick-help section (home page). */
export const ASK_LEON = {
  title: "Ask Leon",
  tagline: "Got a question?",
  description:
    "Leon is our lead real estate advisor. Get quick answers about neighborhoods, pricing, or your next move—no obligation.",
  ctaLabel: "Chat with Leon",
  /** Use WhatsApp as primary; fallback to contact page. */
  useWhatsApp: true,
} as const;

export const LEGAL_LINKS = {
  privacy: "/privacy",
  terms: "/terms",
} as const;

export type SocialPlatform = "facebook" | "instagram" | "x" | "linkedin" | "youtube";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
  ariaLabel: string;
}

/** Social media links — update hrefs to your real profiles. Used in footer, contact, etc. */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/therealbusiness",
    ariaLabel: "Facebook",
  },
  {
    platform: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/therealbusiness",
    ariaLabel: "Instagram",
  },
  {
    platform: "x",
    label: "X",
    href: "https://x.com/therealbusiness",
    ariaLabel: "X (Twitter)",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/therealbusiness",
    ariaLabel: "LinkedIn",
  },
  {
    platform: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@therealbusiness",
    ariaLabel: "YouTube",
  },
];
