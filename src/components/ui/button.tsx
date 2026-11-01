import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { amieGrainStyle } from "./_shared"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-semibold leading-none",
    "rounded-full cursor-pointer select-none",
    "transition-[background-color,box-shadow,transform] duration-fast",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:translate-y-px active:[box-shadow:var(--shadow-inset)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground " +
          "[box-shadow:var(--shadow-primary)] " +
          "hover:[box-shadow:var(--shadow-primary-hover)]",
        primary:
          "bg-primary text-primary-foreground " +
          "[box-shadow:var(--shadow-primary)] " +
          "hover:[box-shadow:var(--shadow-primary-hover)]",
        pink:
          "bg-pastel-pink text-pastel-pink-foreground " +
          "[box-shadow:var(--shadow-button)] " +
          "hover:[box-shadow:var(--shadow-button-hover)]",
        lavender:
          "bg-pastel-lavender text-pastel-lavender-foreground " +
          "[box-shadow:var(--shadow-button)] " +
          "hover:[box-shadow:var(--shadow-button-hover)]",
        secondary:
          "bg-secondary text-secondary-foreground " +
          "[box-shadow:var(--shadow-button)] " +
          "hover:bg-accent hover:text-accent-foreground hover:[box-shadow:var(--shadow-button-hover)]",
        outline:
          "bg-card text-foreground border border-border " +
          "hover:bg-accent hover:border-ring/40 hover:text-accent-foreground",
        ghost:
          "bg-transparent text-muted-foreground " +
          "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const SHEEN_VARIANTS = new Set([
  undefined,
  "default",
  "primary",
  "pink",
  "lavender",
  "secondary",
])

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, style, ...props }, ref) => {
    const sheened = SHEEN_VARIANTS.has(variant ?? undefined)
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={sheened ? { ...amieGrainStyle, ...style } : style}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
