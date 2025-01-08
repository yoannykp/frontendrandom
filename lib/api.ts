import {
  Alien,
  AuthUserData,
  Profile,
  RaidHistoryResponse,
  RaidResponse,
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
  walletAddress: string
): Promise<ApiResponse<Profile | null>> => {
  const response = await apiManager.get<Profile | null>(
    "/profile/get-profile",
    {
      walletAddress,
    }
  )
  return response
}

export const createAlien = async ({
  name,
  element,
  image,
  strengthPoints,
}: {
  name: string
  element: string
  image: string
  strengthPoints: number
}): Promise<ApiResponse<any>> => {
  const response = await apiManager.post("/profile/create-alien", {
    name,
    element,
    image,
    strengthPoints,
  })
  return response
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
