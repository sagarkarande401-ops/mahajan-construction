import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteConfig = {
  name: "Mahajan Construction",
  owner: "Saish Mahajan",
  tagline: "Architecture, built with intent.",
  description:
    "Mahajan Construction designs and builds premium residential and commercial projects in Ashta, Sangli, and across Maharashtra — architecture, construction, interiors, and turnkey delivery under one accountable team.",
  url: "https://mahajanconstruction.in",
  email: "saismahajan5555@gmail.com",
  phone: "+91 7028187271",
  phoneDisplay: "+91 70281 87271",
  whatsapp: "917028187271",
  address: "Ashta, Sangli District, Maharashtra, India",
  coordinates: { lat: 16.9167, lng: 74.4167 }, // Ashta, Maharashtra
  experience: "3+ Years",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  },
};

export function formatCoordinates(lat: number, lng: number) {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir} / ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

// Prisma enums are stored SCREAMING_SNAKE_CASE (e.g. "RESIDENTIAL"); this
// converts them to readable display text (e.g. "Residential").
export function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Shown when a project/service/gallery item has no image yet — expected until
// real photos are uploaded via the admin panel.
export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";
