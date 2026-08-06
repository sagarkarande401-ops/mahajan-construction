import type {
  Project, ProjectImage, ProjectVideo, ProjectTimelineStep, ProjectBeforeAfter,
  Service, ServiceProcessStep, ServiceFaq, ServiceImage,
  Testimonial, Faq, GalleryItem, Enquiry,
} from "@prisma/client";

// These extend Prisma's auto-generated model types with their relations included —
// the single source of truth for shapes is prisma/schema.prisma. If the schema
// changes, run `npx prisma generate` and these types update automatically.

export type ProjectWithRelations = Project & {
  images: ProjectImage[];
  videos: ProjectVideo[];
  timelineSteps: ProjectTimelineStep[];
  beforeAfterPairs: ProjectBeforeAfter[];
};

export type ServiceWithRelations = Service & {
  processSteps: ServiceProcessStep[];
  faqs: ServiceFaq[];
  images: ServiceImage[];
};

export type {
  Project, ProjectImage, ProjectVideo, ProjectTimelineStep, ProjectBeforeAfter,
  Service, ServiceProcessStep, ServiceFaq, ServiceImage,
  Testimonial, Faq, GalleryItem, Enquiry,
};
