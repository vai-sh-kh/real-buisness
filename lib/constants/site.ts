/**
 * Site-wide constants: social links, contact, and legal URLs.
 * Use these everywhere (footer, contact page, forms, etc.) for a single source of truth.
 */

export const SITE_NAME = "The Real Business";

export const CONTACT = {
  email: "contact@therealbusiness.com",
  supportEmail: "support@therealbusiness.com",
  phone: "+1 (555) 123-4567",
  phoneSecondary: "+1 (555) 987-6543",
  address: {
    line1: "123 Luxury Avenue, Suite 500",
    city: "New York, NY 10022",
  },
  workingHours: {
    weekdays: "Monday - Friday: 9:00 AM - 6:00 PM",
    saturday: "Saturday: 10:00 AM - 4:00 PM",
  },
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
