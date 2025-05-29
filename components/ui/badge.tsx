import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        legendary:
          "bg-pink-600 text-white leading-[1.25] hover:bg-pink-700 transition-all duration-200 font-light",
        eyes: "bg-purple-600 text-white leading-[1.25] hover:bg-purple-700 transition-all duration-200 font-light",
        hair: "bg-blue-600 text-white leading-[1.25] hover:bg-blue-700 transition-all duration-200 font-light",
        mouth:
          "bg-gray-600 text-white leading-[1.25] hover:bg-gray-700 transition-all duration-200 font-light",
        background:
          "bg-green-600 text-white leading-[1.25] hover:bg-green-700 transition-all duration-200 font-light",
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

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
