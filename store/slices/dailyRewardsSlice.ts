import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { apiManager } from "@/lib/api"

export interface DailyRewardsState {
  data: any | null
  loading: boolean
  error: string | null
  awardStatus: "idle" | "pending" | "success" | "error"
}

const initialState: DailyRewardsState = {
  data: null,
  loading: false,
  error: null,
  awardStatus: "idle",
}

export const fetchDailyRewards = createAsyncThunk(
  "dailyRewards/fetchDailyRewards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiManager.get("/profile/get-daily-rewards")
      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to fetch daily rewards")
    }
  }
)

export const claimDailyRewards = createAsyncThunk(
  "dailyRewards/claimDailyRewards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiManager.get("/profile/claim-daily-reward")
      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to claim daily rewards")
    }
  }
)

const dailyRewardsSlice = createSlice({
  name: "dailyRewards",
  initialState,
  reducers: {
    clearDailyRewards: (state) => {
      state.data = null
      state.error = null
      state.awardStatus = "idle"
    },
    resetAwardStatus: (state) => {
      state.awardStatus = "idle"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyRewards.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDailyRewards.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDailyRewards.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(claimDailyRewards.pending, (state) => {
        state.awardStatus = "pending"
      })
      .addCase(claimDailyRewards.fulfilled, (state, action) => {
        state.awardStatus = "success"
        state.data = action.payload
      })
      .addCase(claimDailyRewards.rejected, (state, action) => {
        state.awardStatus = "error"
        state.error = action.payload as string
      })
  },
})

export const { clearDailyRewards, resetAwardStatus } =
  dailyRewardsSlice.actions
export default dailyRewardsSlice.reducer
