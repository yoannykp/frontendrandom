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
  image: string
  isHunt: boolean
  element: Element
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
  isHunt: boolean
  characters: undefined
  inProgress: boolean
  createdAt: string
  updatedAt: string
}

export interface RaidHistoryResponse extends RaidHistory {
  aliens: Alien[]
  error?: any
  success: boolean
  raidHistory: RaidHistory[]
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
  selected: boolean
  updatedAt: string
}

export interface AliensState {
  data: Alien[] | null
  alien: Alien | null
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

export interface TeamResponse {
  teamStrengthPoints: number
  team: {
    id: number
    name: string
    strengthPoints: number
    element: Element
    image: string | null
    type: "character" | "alien"
    isSelected: boolean
  }[]
  synergies: Record<string, number>
  buffs: {
    starsBoost: number
    xpBoost: number
    raidTimeBoost: number
  }
}

export interface TeamState {
  data: TeamResponse | null
  loading: boolean
  error: string | null
  updateStatus: {
    loading: boolean
    error: string | null
  }
}

export interface CharactersState {
  data: Character[] | null
  loading: boolean
  error: string | null
}

export interface BurnGearResponse {
  success: boolean
  character: Character
  serverSignature: string
  nonce: number
}
export interface Character {
  id: number
  name: string
  rarity: CharacterRarity
  power: number
  tier: number
  image?: string
  video?: string
  portal: number
  elementId: number
  upgradeReq?: number
  onTeam: boolean
  quantity: number
  tokenId?: number
}

export enum CharacterRarity {
  SR = "SR",
}

export interface Gear {
  id: number
  rarity: string
  image: string
  summonedCharacterId?: number
}

export interface InventoryItem {
  id: number
  name: string
  quantity: number
  tier?: number
  isPortal2?: boolean
  image: string
  description: string
  type: "CHARACTER" | "ELEMENT" | "ALIEN_PART" | "GEAR"
}

export interface Leaderboard {
  id: number
  name: string
  country: string
  enterprise: string
  image: string
  level: number
  experience: number
  reputation: number
  rank: number
  walletAddress: string
  stars: number
  createdAt: string
  isLiked: boolean
  twitterId?: string
}

export enum ForgeTabs {
  ENHANCEMENT = "enhancement",
  PROMOTION = "promotion",
  FORGE = "forge",
}

export enum DailyRewardType {
  STARS = "STARS",
  ITEM = "ITEM",
  XP = "XP",
}

export interface DailyReward {
  id: number
  type: DailyRewardType
  itemId: number | null
  item?: Item
  amount: number
  alienPartId: number | null
  gearItemId: number | null
  rewardDate: string
  createdAt: string
  updatedAt: string
}

export interface Item {
  id: number
  type: ItemType
  quality: ItemQuality
  description: string
  image: string
  users: UserItem[]
  dailyRewards: DailyReward[]
}

export enum ItemType {
  SHEARS = "SHEARS",
  CUT = "CUT",
  KNIFE = "KNIFE",
}

export enum ItemQuality {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLDEN = "GOLDEN",
}

export interface UserItem {
  id: number
  userId: number
  itemId: number
  quantity: number
  user: Profile
  item: Item
}

export interface DailyRewardsResponse {
  success: true
  dailyRewards: DailyReward[]
  dailyStreak: number
  lastDailyClaimed: string
  claimedDailyRewards: DailyReward[]
}
export interface SpinResult {
  type: string
  amount: number
  itemType?: ItemType
  itemQuality?: ItemQuality
  runeType?: RuneType
  message: string
}

export enum RuneType {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export interface AlienPartItem {
  id: number
  type: string
  image: string
  name: string
  description: string
  price: number
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface AlienPartsGroup {
  id: number
  name: string
  description: string
  userId: number
  createdAt: string
  updatedAt: string
  elementId: number
  parts: AlienPartItem[]
}

interface TraitItem {
  id: number
  type: string
  image: string
  name: string
  description: string
  price: number
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface EquippedAlienParts {
  body: TraitItem | null
  clothes: TraitItem | null
  head: TraitItem | null
  eyes: TraitItem | null
  mouth: TraitItem | null
  hair: TraitItem | null
  marks: TraitItem | null
  powers: TraitItem | null
  accessories: TraitItem | null
  face: TraitItem | null
  background?: TraitItem | null
}
