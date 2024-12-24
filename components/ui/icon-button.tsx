import React from "react"

import { cn } from "@/lib/utils"

import { ButtonProps } from "./button"

const IconButton = ({
  children,
  className,
  showBase = false,
  ...props
}: ButtonProps & {
  showBase?: boolean
}) => {
  return (
    <button
      onClick={props.onClick}
      className={cn(
        "aspect-square glass-effect size-60 lg:size-70 flex items-center justify-center rounded-2xl active:scale-95 transition-[background] duration-300 hover:bg-white/10 p-2",
        className
      )}
    >
      {showBase ? (
        <span className="flex items-center gap-2 size-full glass-effect  rounded-md  justify-center  p-2">
          {children}
        </span>
      ) : (
        <span className="flex items-center gap-2  size-[90%] rounded-md  justify-center  ">
          {children}
        </span>
      )}
    </button>
  )
}

export default IconButton
