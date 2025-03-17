import {
  Alien,
  AuthUserData,
  BurnGearResponse,
  Character,
  Gear,
  InventoryItem,
  Leaderboard,
  Pack,
  Profile,
  RaidHistoryResponse,
  RaidResponse,
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

export const getProfile = async (): Promise<ApiResponse<Profile | null>> => {
  const response = await apiManager.get<Profile | null>("/profile/get-profile")
  return response
}

export const createAlien = async (
  data: FormData
): Promise<ApiResponse<Alien>> => {
  return apiManager.call<Alien>({
    url: "/profile/create-alien",
    method: "POST",
    data,
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
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

export const getTeam = async (): Promise<ApiResponse<TeamResponse>> => {
  const response = await apiManager.get<TeamResponse>("/profile/get-team")
  return response
}

export const summonCharacter = async ({
  portal,
}: {
  portal: number
}): Promise<ApiResponse<{ character: Character; success: boolean }>> => {
  const response = await apiManager.post<{
    character: Character
    success: boolean
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
  }>
> => {
  const response = await apiManager.post<{
    summonResults: { character: Character; isNew: boolean }[]
    success: boolean
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
  ApiResponse<{ gear: Gear; success: boolean }>
> => {
  const response = await apiManager.post<{
    gear: Gear
    success: boolean
  }>("/character/summon-gear")
  return response
}
export const multiSummonGear = async (): Promise<
  ApiResponse<{
    summonResults: { gears: Gear[]; isNew: boolean }[]
    success: boolean
  }>
> => {
  const response = await apiManager.post<{
    summonResults: { gears: Gear[]; isNew: boolean }[]
    success: boolean
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
export const getCharacterTiers = async (
  characterId: number
): Promise<ApiResponse<{ characters: Character[]; success: boolean }>> => {
  const response = await apiManager.get<{
    characters: Character[]
    success: boolean
  }>("/character/tiers", {
    characterId,
  })
  return response
}

export const getLeaderboard = async (): Promise<ApiResponse<Leaderboard[]>> => {
  const response = await apiManager.get<Leaderboard[]>(
    "/profile/get-leaderboard"
  )
  return response
}
