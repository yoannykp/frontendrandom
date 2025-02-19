"use client"

import { cn } from "@/lib/utils"

const Sliders = ({ current }: any) => {
  return (
    <div className="z-20 flex gap-4 bottom-20 py-5 items-center">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 w-12 bg-glass rounded-normal transition-all duration-500 ",
            current === i + 1 ? "bg-white" : ""
          )}
        ></div>
      ))}
    </div>
  )
}

export default Sliders
