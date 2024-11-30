"use client"

import { cn } from "@/lib/utils"

const Sliders = ({ current, moveToNextStep }: any) => {
  return (
    <div className="z-20 flex gap-4 bottom-20 py-5 items-center">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 w-12 bg-gray-dark rounded-normal transition-all duration-500 cursor-pointer",
            current === i + 1 ? "bg-white" : "hover:bg-white/20 hover:h-1.5"
          )}
          onClick={() => moveToNextStep(i + 1)}
        ></div>
      ))}
    </div>
  )
}

export default Sliders
