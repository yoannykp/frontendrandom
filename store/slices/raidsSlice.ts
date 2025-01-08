import { Raid, RaidHistory, RaidsState } from "@/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { getRaidHistory, getRaids } from "@/lib/api"

const initialState: RaidsState = {
  data: null,
  loading: false,
  error: null,
  history: {
    data: null,
    loading: false,
    error: null,
  },
}

export const fetchRaids = createAsyncThunk(
  "raids/fetchRaids",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRaids()
      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to fetch raids")
    }
  }
)

export const fetchRaidHistory = createAsyncThunk(
  "raids/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRaidHistory()
      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to fetch raid history")
    }
  }
)

const raidsSlice = createSlice({
  name: "raids",
  initialState,
  reducers: {
    addRaidHistory: (state, action) => {
      if (state.history.data) {
        state.history.data = [...state.history.data, action.payload]
      } else {
        state.history.data = [action.payload]
      }
    },
    updateRaidHistoryStatus: (
      state,
      action: { payload: { raidId: number; inProgress: boolean } }
    ) => {
      if (state.history.data) {
        state.history.data = state.history.data.map((history) =>
          history.raidId === action.payload.raidId
            ? { ...history, inProgress: action.payload.inProgress }
            : history
        )
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch raids cases
      .addCase(fetchRaids.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRaids.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchRaids.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch raid history cases
      .addCase(fetchRaidHistory.pending, (state) => {
        state.history.loading = true
        state.history.error = null
      })
      .addCase(fetchRaidHistory.fulfilled, (state, action) => {
        state.history.loading = false
        state.history.data = action.payload
      })
      .addCase(fetchRaidHistory.rejected, (state, action) => {
        state.history.loading = false
        state.history.error = action.payload as string
      })
  },
})

export const { addRaidHistory, updateRaidHistoryStatus } = raidsSlice.actions
export default raidsSlice.reducer
