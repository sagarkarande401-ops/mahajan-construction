// The 6-stage process is presentational, fixed content — not part of the admin panel's
// manageable content types per the current spec (unlike Projects/Services/Testimonials/FAQ).
// If you want this editable from /admin later, it's a small addition — ask.

export interface ProcessStep { number: string; title: string; description: string; }

export const processSteps: ProcessStep[] = [
  { number: "01", title: "Consultation & Site Study", description: "We walk the plot with you, understand your brief, budget, and timeline, and give an honest feasibility read before anything is signed." },
  { number: "02", title: "Design & Approvals", description: "Concept design, structural coordination, and 3D visualization for your sign-off, followed by municipal plan sanction and statutory approvals." },
  { number: "03", title: "Planning & Estimation", description: "A detailed material specification and stage-wise cost estimate, so pricing is transparent before construction begins." },
  { number: "04", title: "Construction", description: "Site execution against approved drawings, with daily supervision and weekly, photo-documented progress reporting." },
  { number: "05", title: "Interiors & Finishing", description: "Joinery, lighting, and finishes executed as a coordinated scope that continues the architectural intent through to the last detail." },
  { number: "06", title: "Handover & Support", description: "A documented handover walkthrough, snag-list closure, and continued support after you've moved in." },
];

export const getProcessSteps = () => processSteps;
