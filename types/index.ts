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
  refferalCode?: string
}

export interface CreateAlienData {
  name: string
  elementId?: number
  image: string | Blob | File
  strengthPoints: number
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
  refferalCode: string
  totalReferrals: number
}

export interface RaidReward {
  id: number
  type: RewardType
  amount: number
  raidId: number
}

export enum RewardType {
  STARS = "STARS",
  XP = "XP",
  REP = "REP",
}

export interface Raid {
  id: number
  title: string
  description: string
  duration: number
  rewards: RaidReward[]
  createdAt: string
  updatedAt: string
  icon: string
  image: string
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
  element?: Element
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

export type AlienPart = {
  id: number
  name: string
  image: string
  type: AlienPartType
  description?: string
  price?: number
  isDefault: boolean
  alienPartGroupId?: number
}

export enum AlienPartType {
  BODY = "BODY",
  CLOTHES = "CLOTHES",
  FACE = "FACE",
  HEAD = "HEAD",
  EYES = "EYES",
  MOUTH = "MOUTH",
  HAIR = "HAIR",
  MARKS = "MARKS",
  POWERS = "POWERS",
  ACCESSORIES = "ACCESSORIES",
}

export type Element = {
  id: number
  name: string
  image: string
  background?: string
}

export type Traits = {
  elements: Element[]
  alienParts: {
    EYES: AlienPart[]
    MOUTH: AlienPart[]
    HAIR: AlienPart[]
    FACE: AlienPart[]
  }
}

export interface Pack {
  id: number
  name: string
  description: string
  image: string
  price: number
  createdAt: string
  updatedAt: string
  rewards: PackReward[]
  isPurchased: boolean
}

// enum PackRewardType {
//   STARS
//   ALIEN_PART
//   XP
//   REP
// }

// model PackReward {
//   id          Int            @id @default(autoincrement())
//   pack        Pack           @relation(fields: [packId], references: [id])
//   packId      Int
//   type        PackRewardType
//   amount      Int?
//   alienPart   AlienPart?     @relation(fields: [alienPartId], references: [id])
//   alienPartId Int?
//   createdAt   DateTime       @default(now())
//   updatedAt   DateTime       @updatedAt

//   @@index([packId])
//   @@index([alienPartId])
// }

export enum PackRewardType {
  STARS = "STARS",
  ALIEN_PART = "ALIEN_PART",
  XP = "XP",
  REP = "REP",
}

export interface PackReward {
  id: number
  type: PackRewardType
  amount: number
}

export interface Character {
  id: number
  name: string
  rarity: string
  power: number
  image: string | null
  teamImage: string | null
  video: string | null
  tokenId: number
  tier: number
  element?: Element
  elementId: number
  createdAt: string
  updatedAt: string
}

export interface InventoryItem {
  id: number
  name: string
  type: string
  image: string | null
  quantity?: number
}

export interface TeamState {
  data: any | null
  loading: boolean
  error: string | null
  updateStatus: {
    loading: boolean
    error: string | null
  }
}
