import {
  Alien,
  AlienPart,
  AlienPartsGroup,
  AuthUserData,
  BurnGearResponse,
  Character,
  DailyRewardsResponse,
  EquippedAlienParts,
  Gear,
  InventoryItem,
  Leaderboard,
  Pack,
  Profile,
  RaidHistoryResponse,
  RaidResponse,
  SpinResult,
  TeamResponse,
  Traits,
} from "@/types"
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

import { getCookie, setCookie } from "./cookie"

// Define the structure for API errors
interface ApiError {
  message: string
  code?: string | number
  details?: any
}

// Define the structure for API responses
interface ApiResponse<T = any> {
  data: T | null
  error: ApiError | null
}

// Define the structure for API call options
interface ApiCallOptions {
  url: string
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  data?: any
  params?: Record<string, string | number | boolean>
  headers?: Record<string, string>
}

class ApiManager {
  private axiosInstance: AxiosInstance

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 20000, // 20 seconds timeout
    })

    // Add request interceptor for adding auth token, etc.
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = getCookie("accessToken")
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
  }

  private handleApiError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || error.message,
        code: error.response?.status,
        details: error.response?.data,
      }
    }
    return {
      message: "An unexpected error occurred",
      details: error,
    }
  }

  async call<T = any>(options: ApiCallOptions): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        url: options.url,
        method: options.method || "GET",
        data: options.data,
        params: options.params,
        headers: options.headers,
      }

      const response: AxiosResponse<T> = await this.axiosInstance(config)

      return {
        data: response.data,
        error: null,
      }
    } catch (error) {
      console.error("API Error:", error)
      return {
        data: null,
        error: this.handleApiError(error),
      }
    }
  }

  // Convenience methods for common HTTP methods
  async get<T = any>(
    url: string,
    params?: Record<string, string | number | boolean>,
    data?: any
  ): Promise<ApiResponse<T>> {
    return this.call<T>({ url, method: "GET", params, data })
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.call<T>({ url, method: "POST", data })
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.call<T>({ url, method: "PUT", data })
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.call<T>({ url, method: "DELETE" })
  }
}

// Create and export an instance of ApiManager
export const apiManager = new ApiManager(process.env.NEXT_PUBLIC_API_URL || "")

export const authenticate = async ({
  signature,
  signedMessage,
  register,
}: {
  signature: string
  signedMessage: string
  register?: AuthUserData
}): Promise<
  ApiResponse<{
    accessToken: string
    walletAddress: string
  } | null>
> => {
  const response = await apiManager.post<{
    accessToken: string
    walletAddress: string
  }>("/auth/authenticate", {
    signature,
    signedMessage,
    accessToken: "",
    register,
  })

  const accessToken = response.data?.accessToken

  if (accessToken) {
    setCookie("accessToken", accessToken)
  }

  return response
}

export const checkUserExist = async (
  walletAddress: string
): Promise<ApiResponse<boolean>> => {
  const response = await apiManager.get<boolean>(`/users/check-exists`, {
    walletAddress,
  })
  return response
}

export const getProfile = async (
  walletAddress?: string,
  privyId?: string
): Promise<ApiResponse<Profile | null>> => {
  const response = await apiManager.get<Profile | null>(
    "/profile/get-profile",
    {
      walletAddress: walletAddress || "",
      privyId: privyId || "",
    }
  )
  return response
}

export const createAlien = async (
  data: FormData
): Promise<ApiResponse<Alien>> => {
  return apiManager.call<Alien>({
    url: "/profile/create-alien",
    method: "POST",
    data,
  })
}

export const createAlienApi = async (
  data: FormData
): Promise<ApiResponse<{ success: boolean }>> => {
  return apiManager.call<{ success: boolean }>({
    url: "/profile/create-alien",
    method: "POST",
    data,
  })
}

export const updateAlien = async (
  data: FormData
): Promise<ApiResponse<{ alien: Alien; success: boolean }>> => {
  return apiManager.call<{ alien: Alien; success: boolean }>({
    url: "/profile/update-alien-image",
    method: "POST",
    data,
  })
}

export const getAliens = async (): Promise<ApiResponse<Alien[]>> => {
  const response = await apiManager.get<Alien[]>("/profile/get-aliens")
  return response
}

export const getRaids = async (): Promise<ApiResponse<RaidResponse[]>> => {
  const response = await apiManager.get<RaidResponse[]>("/raids/get-list")
  return response
}

export const launchRaid = async ({
  raidId,
  alienIds,
}: {
  raidId: number
  alienIds: number[]
}): Promise<ApiResponse<RaidHistoryResponse>> => {
  const response = await apiManager.post<RaidHistoryResponse>(
    "/raids/launch-raid",
    {
      raidId,
      alienIds,
      characterIds: [],
    }
  )
  return response
}

export const getRaidHistory = async (): Promise<
  ApiResponse<RaidHistoryResponse[]>
> => {
  const response = await apiManager.get<RaidHistoryResponse[]>(
    "/raids/get-raid-history"
  )
  return response
}

export const getOnboardingData = async (): Promise<ApiResponse<Traits>> => {
  const response = await apiManager.get<Traits>("/profile/get-onboarding-data")
  return response
}

export const getUnseenReferralRewards = async (): Promise<
  ApiResponse<number>
> => {
  const response = await apiManager.get<number>(
    "/profile/unseen-referral-rewards"
  )
  return response
}

export const markReferralRewardsAsSeen = async (): Promise<
  ApiResponse<boolean>
> => {
  const response = await apiManager.post<boolean>(
    "/profile/mark-referral-rewards-seen"
  )
  return response
}

export const getAllPacks = async (): Promise<ApiResponse<Pack[]>> => {
  const response = await apiManager.get<Pack[]>("/packs")
  return response
}

export const createCheckoutSession = async (
  type: "PACK" | "ALIEN_PART" | "STARS" | "XP" | "REP",
  itemId: number,
  quantity?: number
): Promise<ApiResponse<{ url: string }>> => {
  const response = await apiManager.post<{
    url: string
  }>("/stripe/create-checkout", {
    type,
    itemId,
    quantity,
  })
  return response
}

export const updateTeam = async ({
  alienIds,
  characterIds,
}: {
  alienIds: number[]
  characterIds: number[]
}): Promise<ApiResponse<boolean>> => {
  return apiManager.post<boolean>("/profile/update-team", {
    alienIds,
    characterIds,
  })
}

export const getTeam = async (
  walletAddress?: string,
  raidId?: number
): Promise<ApiResponse<TeamResponse>> => {
  const params: Record<string, string | number | boolean> = {}
  if (walletAddress) {
    params.walletAddress = walletAddress
  }
  if (raidId) {
    params.raidId = raidId
  }
  const response = await apiManager.get<TeamResponse>(
    "/profile/get-team",
    params
  )
  return response
}

export const summonCharacter = async ({
  portal,
}: {
  portal: number
}): Promise<
  ApiResponse<{ character: Character; success: boolean; error: ApiError }>
> => {
  const response = await apiManager.post<{
    character: Character
    success: boolean
    error: ApiError
  }>("/character/summon-character", {
    portal,
  })
  return response
}
export const multiSummonCharacter = async ({
  portal,
}: {
  portal: number
}): Promise<
  ApiResponse<{
    summonResults: { character: Character; isNew: boolean }[]
    success: boolean
    error: ApiError
  }>
> => {
  const response = await apiManager.post<{
    summonResults: { character: Character; isNew: boolean }[]
    success: boolean
    error: ApiError
  }>("/character/multi-summon-characters", {
    portal,
  })
  return response
}

export const getAllCharacters = async (): Promise<
  ApiResponse<{ userCharacters: Character[]; success: boolean }>
> => {
  const response = await apiManager.get<{
    userCharacters: Character[]
    success: boolean
  }>("/character/get-user-characters")
  return response
}

export const summonGear = async (): Promise<
  ApiResponse<{ gear: Gear; success: boolean; error: ApiError }>
> => {
  const response = await apiManager.post<{
    gear: Gear
    success: boolean
    error: ApiError
  }>("/character/summon-gear")
  return response
}
export const multiSummonGear = async (): Promise<
  ApiResponse<{
    summonResults: { gears: Gear[]; isNew: boolean }[]
    success: boolean
    error: ApiError
  }>
> => {
  const response = await apiManager.post<{
    summonResults: { gears: Gear[]; isNew: boolean }[]
    success: boolean
    error: ApiError
  }>("/character/multi-summon-gear")
  return response
}

export const getUserInventory = async (): Promise<
  ApiResponse<InventoryItem[]>
> => {
  const response = await apiManager.get<InventoryItem[]>(
    "/inventory/get-user-inventory"
  )
  return response
}

export const getStoreInventory = async (
  walletAddress?: string
): Promise<ApiResponse<InventoryItem[]>> => {
  const params: Record<string, string | number | boolean> = {}
  if (walletAddress) {
    params.walletAddress = walletAddress
  }
  const response = await apiManager.get<InventoryItem[]>(
    "/inventory/get-store-inventory",
    params
  )
  return response
}

export const burnGear = async (
  gearId: number
): Promise<ApiResponse<BurnGearResponse>> => {
  const response = await apiManager.post<BurnGearResponse>(
    "/character/burn-gear",
    {
      gearId,
    }
  )
  return response
}

export const consumeConsumableItem = async (
  itemId: number
): Promise<ApiResponse<BurnGearResponse>> => {
  const response = await apiManager.post<BurnGearResponse>(
    "/profile/use-consumable-item",
    {
      itemId,
    }
  )
  return response
}

export const updateGearBalance = async (
  gearId: number
): Promise<ApiResponse<BurnGearResponse>> => {
  const response = await apiManager.post<BurnGearResponse>(
    "/character/update-gear-balance",
    {
      gearId,
    }
  )
  return response
}

// export const getCharacterTiers = async (
//   characterId: number
// ): Promise<ApiResponse<{ characters: Character[]; success: boolean }>> => {
//   const response = await apiManager.get<{
//     characters: Character[]
//     success: boolean
//   }>("/character/tiers", {
//     characterId,
//   })
//   return response
// }

export const fetchCharacterTiers = async (): Promise<
  ApiResponse<{
    success: boolean
    allCharacterTiers: {
      [portalKey: string]: {
        stage1: Character
        stage2: Character
        stage3: Character
      }[]
    }
  }>
> => {
  const response = await apiManager.get<{
    success: boolean
    allCharacterTiers: {
      [portalKey: string]: {
        stage1: Character
        stage2: Character
        stage3: Character
      }[]
    }
  }>("/character/tiers")
  return response
}

export const upgradeCharacter = async (
  characterId: number
): Promise<
  ApiResponse<{
    success: boolean
    serverSignature: string
    nonce: number
    character: Character
    oldTokenId: number
    oldTokenAmount: number
    newTokenId: number
    newCharacter: Character
  }>
> => {
  const response = await apiManager.post<{
    success: boolean
    serverSignature: string
    nonce: number
    character: Character
    oldTokenId: number
    oldTokenAmount: number
    newTokenId: number
    newCharacter: Character
  }>("/character/upgrade-character", {
    characterId,
  })
  return response
}

export const getLeaderboard = async ({
  offset,
  limit,
  filter,
  search,
  date,
}: {
  offset?: number
  limit?: number
  filter?: "enterprises" | "likes"
  search?: string
  date?: string | null
}): Promise<ApiResponse<{ users: Leaderboard[]; thisUser?: Leaderboard }>> => {
  const params: Record<string, string | number | boolean> = {}
  if (offset) {
    params.offset = offset
  }
  if (limit) {
    params.limit = limit
  }
  if (filter) {
    params.filter = filter
  }
  if (search) {
    params.search = search
  }
  if (date) {
    params.date = date
  }

  const response = await apiManager.get<{
    users: Leaderboard[]
    thisUser?: Leaderboard
  }>(`/profile/get-leaderboard`, params)
  return response
}

export const mintCharacters = async (
  characterIds: number[],
  signature: string
): Promise<
  ApiResponse<{
    success: boolean
    characterIds: number[]
    serverSignature: string
    transactionId: number
    nonce: number
    unmintedCharacterIds: number[]
  }>
> => {
  const response = await apiManager.post<{
    success: true
    characterIds: number[]
    serverSignature: string
    transactionId: number
    nonce: number
    unmintedCharacterIds: number[]
  }>("/character/mint-character", {
    characterIds,
    signature,
  })
  return response
}

export const handleFailedMint = async (
  unmintedCharacterId: number
): Promise<
  ApiResponse<{
    success: boolean
  }>
> => {
  const response = await apiManager.post<{
    success: true
  }>("/character/handle-failed-mint", {
    unmintedCharacterId,
  })
  return response
}

export const likeUser = async (
  userId: number
): Promise<ApiResponse<{ liked: boolean }>> => {
  const response = await apiManager.post<{ liked: boolean }>(
    "/profile/like-user",
    {
      userId,
    }
  )
  return response
}

export const getDailyRewards = async (): Promise<
  ApiResponse<DailyRewardsResponse>
> => {
  const response = await apiManager.get<DailyRewardsResponse>(
    "/profile/get-daily-rewards"
  )
  return response
}

export const awardDailyRewards = async (): Promise<ApiResponse<any>> => {
  const response = await apiManager.get<any>("/profile/claim-daily-reward")
  return response
}

export const spinWheel = async (): Promise<
  ApiResponse<{ success: true; result: SpinResult }>
> => {
  const response = await apiManager.get<{ success: true; result: SpinResult }>(
    "/wheel/spin"
  )
  return response
}

export const canSpin = async (): Promise<
  ApiResponse<{
    success: boolean
    canSpin: boolean
    secondsUntilNextSpin: number
  }>
> => {
  const response = await apiManager.get<{
    success: boolean
    canSpin: boolean
    secondsUntilNextSpin: number
  }>("/wheel/can-spin")
  return response
}

export const getSpinHistory = async (): Promise<
  ApiResponse<{ success: boolean; spinTimes: string[] }>
> => {
  const response = await apiManager.get<{
    success: boolean
    spinTimes: string[]
  }>("/wheel/spin-history")
  return response
}

export const getWheelItems = async (): Promise<
  ApiResponse<{ name: string }[]>
> => {
  const response = await apiManager.get<{ name: string }[]>("/wheel/rewards")
  return response
}

export const getOwnedAlienParts = async (
  walletAddress?: string
): Promise<
  ApiResponse<{
    userAlienParts: AlienPartsGroup[]
    elements: Element[]
    alienPartsList: AlienPart[]
  }>
> => {
  const params: Record<string, string | number | boolean> = {}
  if (walletAddress) {
    params.walletAddress = walletAddress
  }
  const response = await apiManager.get<{
    userAlienParts: AlienPartsGroup[]
    elements: Element[]
    alienPartsList: AlienPart[]
  }>("/profile/get-owned-alien-parts", params)

  if (response.data) {
    return {
      data: {
        userAlienParts: response.data.userAlienParts,
        elements: response.data.elements,
        alienPartsList: response.data.alienPartsList,
      },
      error: null,
    }
  }

  return {
    data: null,
    error: response.error,
  }
}

export const getDojoOwnedAlienParts = async (
  walletAddress?: string
): Promise<
  ApiResponse<{
    userAlienParts: AlienPartsGroup[]
    elements: Element[]
    alienPartsList: AlienPart[]
  }>
> => {
  const params: Record<string, string | number | boolean> = {}
  if (walletAddress) {
    params.walletAddress = walletAddress
  }
  const response = await apiManager.get<{
    userAlienParts: AlienPartsGroup[]
    elements: Element[]
    alienPartsList: AlienPart[]
  }>("/profile/get-dojo-owned-alien-parts", params)

  console.log("getDojoOwnedAlienParts response ===>", response)

  if (response.data) {
    return {
      data: {
        userAlienParts: response.data.userAlienParts,
        elements: response.data.elements,
        alienPartsList: response.data.alienPartsList,
      },
      error: null,
    }
  }

  return {
    data: null,
    error: response.error,
  }
}

export const getEquippedAlienParts = async (
  alienId?: number
): Promise<ApiResponse<EquippedAlienParts>> => {
  const params: Record<string, string | number | boolean> = {}
  if (alienId) {
    params.alienId = alienId
  }
  const response = await apiManager.get<EquippedAlienParts>(
    "/profile/get-equipped-alien-parts",
    params
  )
  console.log("getEquippedAlienParts response ===>", response)
  return response
}

// export const equipAlienPart = async ({
//   alienId,
//   partIds,
// }: {
//   alienId: number
//   partIds: number[]
// }): Promise<ApiResponse<{ success: boolean; message: string }>> => {
//   const response = await apiManager.post("/profile/equip-alien-part", {
//     alienId,
//     partIds,
//   })
//   return response
// }

export const equipAlienPart = async ({
  alienId,
  parts,
}: {
  alienId: number
  parts: { type: string; id: number }[]
}): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  const response = await apiManager.post("/profile/equip-alien-part", {
    alienId,
    parts,
  })
  return response
}

export const getFriendsList = async (
  walletAddress?: string
): Promise<ApiResponse<any>> => {
  const params: Record<string, string | number | boolean> = {}
  if (walletAddress) {
    params.walletAddress = walletAddress
  }
  const response = await apiManager.get<any>("/friends/list", params)
  return response
}

export const togglePinFriend = async (
  friendId: number
): Promise<ApiResponse<any>> => {
  const response = await apiManager.post<any>(`/friends/toggle-pin/${friendId}`)
  return response
}

export const addFriend = async (
  userIds: number[]
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await apiManager.post<{ success: boolean }>("/friends/add", {
    userIds,
  })
  return response
}

export const getMessages = async (
  friendId?: number
): Promise<ApiResponse<any>> => {
  const response = await apiManager.get<any>("/chat/messages", {
    friendId: friendId || "",
  })
  return response
}

export const sendMessage = async (
  receiverId?: number | string,
  content?: string
): Promise<ApiResponse<any>> => {
  const response = await apiManager.post<any>("/chat/send", {
    receiverId: receiverId || "",
    content,
  })
  return response
}

export const searchFriend = async (
  query: string
): Promise<ApiResponse<any>> => {
  const response = await apiManager.get<any>("/friends/search", {
    query,
  })
  return response
}

export const getQuestList = async (): Promise<ApiResponse<any>> => {
  const response = await apiManager.get<any>("/quests/list")
  return response
}

export const claimQuest = async (
  questId: number
): Promise<ApiResponse<any>> => {
  const response = await apiManager.post<any>("/quests/claim-rewards", {
    questId,
  })
  return response
}

export const getForgeList = async (): Promise<ApiResponse<any>> => {
  const response = await apiManager.get<any>("/profile/get-forge-parts")
  return response
}

export const forgeAlienPart = async (
  alienPartId: number
): Promise<ApiResponse<any>> => {
  const response = await apiManager.post<any>("/profile/forge-parts", {
    alienPartId,
  })
  return response
}

export const enhanceAlienPart = async (
  alienPartId: number
): Promise<ApiResponse<any>> => {
  const response = await apiManager.post<any>("/profile/enhance-parts", {
    alienPartId,
  })
  return response
}

export const getStoreWearables = async (): Promise<ApiResponse<any>> => {
  const response = await apiManager.get<any>("/store/wearables")
  return response
}

export const getWearableObjectDetails = async (
  subject: string
): Promise<ApiResponse<any>> => {
  const response = await apiManager.get<any>(`/store/wearables/${subject}`)
  return response
}

export const processBoughtQuest = async (
  subject: string
): Promise<ApiResponse<any>> => {
  const response = await apiManager.post<any>("/store/wearables/bought-quest", {
    subject,
  })
  return response
}

export const getUser = async (userId: string) => {
  return await apiManager.get(`/users/${userId}`)
}
