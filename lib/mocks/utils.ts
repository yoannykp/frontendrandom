import { ApiError, ApiResponse } from "@/lib/api"

export const getMockApiResponse = <Data, Error extends ApiError>(
  data: Data,
  error?: Error
): ApiResponse<Data> => ({
  data,
  error: error || null,
})
