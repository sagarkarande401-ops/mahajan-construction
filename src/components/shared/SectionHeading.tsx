import { RevealOnScroll } from "./RevealOnScroll";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  index?: string; // e.g. "01 / 06" — architectural drawing-sheet numbering
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "left", index, className }: SectionHeadingProps) {
  return (
    <RevealOnScroll className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <div className={cn("mb-5 flex items-center gap-4", align === "center" && "justify-center")}>
        <span className="eyebrow">{eyebrow}</span>
        <span className="h-px flex-1 max-w-[60px] bg-gold/60" />
        {index && <span className="coord-tag">{index}</span>}
      </div>
      <h2 className="text-display-3 text-balance font-display font-normal text-ink dark:text-canvas">{title}</h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-concrete md:text-lg">{description}</p>
      )}
    </RevealOnScroll>
  );
}

