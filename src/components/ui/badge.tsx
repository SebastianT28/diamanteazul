import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold " +
    "transition-colors duration-fast",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-muted text-muted-foreground",
        outline: "bg-card text-foreground ring-1 ring-inset ring-border",
        pink: "bg-pastel-pink text-pastel-pink-foreground",
        blue: "bg-pastel-blue text-pastel-blue-foreground",
        green: "bg-pastel-green text-pastel-green-foreground",
        yellow: "bg-pastel-yellow text-pastel-yellow-foreground",
        lavender: "bg-pastel-lavender text-pastel-lavender-foreground",
        success: "bg-pastel-green text-pastel-green-foreground",
        warning: "bg-pastel-yellow text-pastel-yellow-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }

