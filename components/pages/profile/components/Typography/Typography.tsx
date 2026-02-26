import { ReactNode } from "react"
import { clsx } from "clsx"

const textSizes = {
  "3xs": "text-2xs",
  "2xs": "text-12",
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg-low",
  xl: "text-xl",
  "2xl": "text-18",
  "3xl": "text-30",
}

const fonts = {
  primary: "font-volkhov",
  secondary: "font-inter",
}

const colors = {
  primary: "text-white",
  caption: "text-white opacity-50",
  positive: "text-positive",
  negative: "text-negative",
}

const weights = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
}

interface TypographyBaseProps {
  children: ReactNode
  color?: keyof typeof colors
  size?: keyof typeof textSizes
  font?: keyof typeof fonts
  weight?: keyof typeof weights
}

type CaptionProps = Pick<TypographyBaseProps, "children">
type TextProps = TypographyBaseProps

const Caption = ({ children }: CaptionProps) => {
  const classes = clsx(
    colors["caption"],
    fonts["secondary"],
    textSizes["sm"],
    weights["normal"]
  )

  return <span className={classes}>{children}</span>
}

const Text = ({
  children,
  font = "primary",
  size = "base",
  color = "primary",
  weight = "normal",
}: TextProps) => {
  const classes = clsx(
    fonts[font],
    textSizes[size],
    colors[color],
    weights[weight]
  )

  return <p className={classes}>{children}</p>
}

export const Typography = {
  Caption,
  Text,
}
