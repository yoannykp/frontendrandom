"use client"

import React, { ButtonHTMLAttributes, FC, ReactNode } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

interface BrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  blurColor?: string
  isLink?: boolean
  href?: string
  target?: string
  rel?: string
}

const BrandButton: FC<BrandButtonProps> = ({
  children,
  className = "",
  blurColor = "bg-[#5FFF9580]",
  isLink = false,
  href = "#",
  target = "_self",
  rel,
  ...props
}) => {
  const sharedClasses = cn(
    "relative flex items-center justify-center gap-2.5 p-[15px] px-[30px] border border-gray-light backdrop-blur-[20px] rounded-normal isolation-isolate overflow-hidden text-lg group",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    className
  )

  const blurSpan = (
    <span
      className={cn(
        "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
        "group-disabled:group-hover:h-[30px]",
        blurColor
      )}
    />
  )

  return isLink ? (
    <Link href={href} target={target} rel={rel} className={sharedClasses}>
      {children}
      {blurSpan}
    </Link>
  ) : (
    <button className={sharedClasses} {...props}>
      {children}
      {blurSpan}
    </button>
  )
}

export default BrandButton
