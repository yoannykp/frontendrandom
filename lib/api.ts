import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

import { getCookie } from "./cookie"

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
}: {
  signature: string
  signedMessage: string
}): Promise<boolean> => {
  const response = await apiManager.post("/auth/authenticate", {
    signature,
    signedMessage,
    accessToken: "",
  })
  const accessToken = response.data?.accessToken
  return response.error === null
}
