import { ReactNode } from "react"
import { clsx } from "clsx"

interface BoxProps {
  spacing?: number
  xSpacing?: number
  ySpacing?: number
  flex?: boolean
  direction?: "row" | "column"
  justify?: "center" | "space-between" | "stretch"
  align?: "center" | "stretch"
  children?: ReactNode
}

export const Box = ({
  direction,
  justify,
  align,
  spacing,
  xSpacing,
  ySpacing,
  flex = true,
  children,
  gap,
}: BoxProps) => {
  const spacingClass = spacing
    ? `${spacing > 0 ? "" : "-"}m-${Math.abs(spacing)}`
    : ""
  const xSpacingClass = xSpacing
    ? `${xSpacing > 0 ? "" : "-"}mx-${Math.abs(xSpacing)}`
    : ""
  const ySpacingClass = ySpacing
    ? `${ySpacing > 0 ? "" : "-"}my-${Math.abs(ySpacing)}`
    : ""
  const gapClass = gap ? `gap-${gap}` : ""

  const classes = clsx(
    {
      flex: flex,
      "flex-row": direction === "row",
      "flex-col": direction === "column",
      "justify-content-center": justify === "center",
      "justify-content-between": justify === "between",
      "justify-content-stretch": justify === "stretch",
      "items-center": align === "center",
      "items-stretch": align === "stretch",
    },
    spacingClass,
    xSpacingClass,
    ySpacingClass,
    gapClass
  )

  return <div className={classes}>{children}</div>
}
