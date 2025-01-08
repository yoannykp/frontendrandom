import { SVGProps } from "react"

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type AuthUserData = {
  name: string
  code: string
  country: string
  twitterId: string
  image?: string
}

export interface CreateAlienData {
  name: string
  element: string
  image: string
  strengthPoints: number
  hair: string
  face: string
}

export interface Profile {
  id: number
  walletAddress: string
  name: string
  country: string
  twitterId: string
  enterprise: string
  image: string
  level: number
  experience: number
  reputation: number
  stars: number
}

export interface RaidReward {
  id: number
  type: "STARS" | "XP" | "REP"
  amount: number
  raidId: number
}

export interface Raid {
  id: number
  title: string
  description: string
  duration: number
  rewards: RaidReward[]
  createdAt: string
  updatedAt: string
}

export interface RaidResponse extends Raid {
  rewards: RaidReward[]
}

export interface RaidsState {
  data: Raid[] | null
  loading: boolean
  error: string | null
  history: {
    data: RaidHistoryResponse[] | null
    loading: boolean
    error: string | null
  }
}

export interface RaidHistory {
  id: number
  raidId: number
  userId: number
  aliens: Alien[]
  characters: undefined
  inProgress: boolean
  createdAt: string
  updatedAt: string
}

export interface RaidHistoryResponse extends RaidHistory {
  aliens: Alien[]
}

export interface Alien {
  id: number
  name: string
  element: string
  image: string
  strengthPoints: number
  userId: number
  inRaid: boolean
  createdAt: string
  updatedAt: string
}

export interface AliensState {
  data: Alien[] | null
  loading: boolean
  error: string | null
  createStatus: {
    loading: boolean
    error: string | null
  }
}
