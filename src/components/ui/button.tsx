import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium tracking-wide transition-all duration-500 ease-luxury disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-ink text-canvas hover:bg-ink-soft dark:bg-canvas dark:text-ink dark:hover:bg-beige",
        outline:
          "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-canvas dark:border-canvas/30 dark:text-canvas dark:hover:bg-canvas dark:hover:text-ink",
        ghost: "text-ink hover:text-gold dark:text-canvas dark:hover:text-gold",
        gold: "bg-gold text-ink hover:bg-gold-light",
      },
      size: {
        default: "px-8 py-4",
        sm: "px-5 py-2.5 text-xs",
        lg: "px-10 py-5 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };

