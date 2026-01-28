import { ReactNode } from "react"
import { clsx } from "clsx"

interface BoxProps {
  spacing?: number
  xSpacing?: number
  ySpacing?: number
  flex?: boolean
  direction?: "row" | "column"
  justify?: "center" | "between" | "stretch" | "end"
  align?: "center" | "stretch" | "end"
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
      "justify-center": justify === "center",
      "justify-between": justify === "between",
      "justify-stretch": justify === "stretch",
      "justify-end": justify === "end",
      "items-center": align === "center",
      "items-stretch": align === "stretch",
      "items-end": align === "end",
    },
    spacingClass,
    xSpacingClass,
    ySpacingClass,
    gapClass
  )

  return <div className={classes}>{children}</div>
}
