import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  phone: z.string().trim().min(10, "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email address."),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  location: z.string().optional(),
  message: z.string().trim().min(5, "Please tell us a little about your project."),
  source: z.enum(["CONTACT_PAGE", "SERVICE_PAGE", "PROJECT_PAGE", "BOOK_CONSULTATION"]).default("CONTACT_PAGE"),
  serviceSlug: z.string().optional(),
  projectSlug: z.string().optional(),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

export const projectSchema = z.object({
  slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  name: z.string().trim().min(2),
  category: z.enum(["RESIDENTIAL", "COMMERCIAL", "INTERIOR", "RENOVATION"]),
  projectType: z.string().trim().min(2),
  client: z.string().optional(),
  location: z.string().trim().min(2),
  area: z.string().trim().min(1),
  timeline: z.string().trim().min(1),
  year: z.string().trim().min(4),
  status: z.enum(["COMPLETED", "ONGOING"]),
  description: z.string().trim().min(10),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  materialsUsed: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const serviceSchema = z.object({
  slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  name: z.string().trim().min(2),
  shortDescription: z.string().trim().min(5),
  description: z.string().trim().min(10),
  icon: z.string().default("compass"),
  features: z.array(z.string()).default([]),
  published: z.boolean().default(true),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const testimonialSchema = z.object({
  name: z.string().trim().min(2),
  role: z.string().trim().min(2),
  location: z.string().trim().min(2),
  quote: z.string().trim().min(10),
  rating: z.number().min(1).max(5).default(5),
  projectSlug: z.string().optional(),
  published: z.boolean().default(true),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const faqSchema = z.object({
  category: z.string().trim().min(2),
  question: z.string().trim().min(5),
  answer: z.string().trim().min(5),
  published: z.boolean().default(true),
});
export type FaqInput = z.infer<typeof faqSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

