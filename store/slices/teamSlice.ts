import { TeamState } from "@/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { getTeam, updateTeam } from "@/lib/api"

const initialState: TeamState = {
  data: null,
  loading: false,
  error: null,
  updateStatus: {
    loading: false,
    error: null,
  },
}

export const fetchTeam = createAsyncThunk(
  "team/fetchTeam",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTeam()
      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to fetch team")
    }
  }
)

export const updateUserTeam = createAsyncThunk(
  "team/updateTeam",
  async (
    data: { alienIds: number[]; characterIds: number[] },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await updateTeam(data)
      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      // Refresh team data after update
      dispatch(fetchTeam())
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to update team")
    }
  }
)

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    resetUpdateStatus: (state) => {
      state.updateStatus = {
        loading: false,
        error: null,
      }
    },
    clearTeam: (state) => {
      state.data = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch team cases
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update team cases
      .addCase(updateUserTeam.pending, (state) => {
        state.updateStatus.loading = true
        state.updateStatus.error = null
      })
      .addCase(updateUserTeam.fulfilled, (state) => {
        state.updateStatus.loading = false
      })
      .addCase(updateUserTeam.rejected, (state, action) => {
        state.updateStatus.loading = false
        state.updateStatus.error = action.payload as string
      })
  },
})

export const { resetUpdateStatus, clearTeam } = teamSlice.actions
export default teamSlice.reducer
