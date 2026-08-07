import * as React from "react";
import { cn } from "@/lib/utils";

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("eyebrow mb-2 block", className)} {...props} />
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full border-0 border-b border-line bg-transparent py-3 text-base text-ink placeholder:text-concrete focus:border-gold focus:outline-none focus:ring-0 dark:border-line-dark dark:text-canvas",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full border-0 border-b border-line bg-transparent py-3 text-base text-ink placeholder:text-concrete focus:border-gold focus:outline-none focus:ring-0 dark:border-line-dark dark:text-canvas",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

