import { DailyReward, DailyRewardsResponse } from "@/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { awardDailyRewards, getDailyRewards } from "@/lib/api"

interface DailyRewardsState {
  data: DailyRewardsResponse | null
  loading: boolean
  error: string | null
  awardStatus: {
    loading: boolean
    error: string | null
  }
}

const initialState: DailyRewardsState = {
  data: null,
  loading: false,
  error: null,
  awardStatus: {
    loading: false,
    error: null,
  },
}

export const fetchDailyRewards = createAsyncThunk(
  "dailyRewards/fetch",
  async () => {
    const response = await getDailyRewards()
    return response.data
  }
)

export const claimDailyRewards = createAsyncThunk(
  "dailyRewards/claim",
  async () => {
    const response = await awardDailyRewards()
    return response.data
  }
)

const dailyRewardsSlice = createSlice({
  name: "dailyRewards",
  initialState,
  reducers: {
    resetAwardStatus: (state) => {
      state.awardStatus = {
        loading: false,
        error: null,
      }
    },
    clearDailyRewards: () => initialState,
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
        state.error = action.error.message || "Failed to fetch daily rewards"
      })
      .addCase(claimDailyRewards.pending, (state) => {
        state.awardStatus.loading = true
        state.awardStatus.error = null
      })
      .addCase(claimDailyRewards.fulfilled, (state) => {
        state.awardStatus.loading = false
      })
      .addCase(claimDailyRewards.rejected, (state, action) => {
        state.awardStatus.loading = false
        state.awardStatus.error =
          action.error.message || "Failed to claim rewards"
      })
  },
})

export const { resetAwardStatus, clearDailyRewards } = dailyRewardsSlice.actions
export default dailyRewardsSlice.reducer
