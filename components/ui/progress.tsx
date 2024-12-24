"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <div className="h-2 overflow-hidden w-full flex items-center">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-px w-full  rounded-full bg-[#ABABAB42] ",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-1 w-full flex-1 bg-[#EA66FF] transition-all rounded-full"
        style={{
          transform: `
          translateX(-${100 - (value || 0)}%)
          translateY(-1px)
          `,
        }}
      />
    </ProgressPrimitive.Root>
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
