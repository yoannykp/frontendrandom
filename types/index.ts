import { SVGProps } from "react"

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type AuthUserData = {
  name?: string
  code?: string
  country?: string
  twitterId?: string
  image?: string
  element?: string
  strengthPoints?: number
  hair?: string
  face?: string
}

export type Profile = {
  walletAddress: string
  name: string
  country: string
  twitterId: string
  image: string
  level: number
  experience: number
  reputation: number
  stars: number
}
