import { Profile } from "@/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { getProfile } from "@/lib/api"

interface UserProfileState {
  data: Profile | null
  loading: boolean
  error: string | null
}

const initialState: UserProfileState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
  async (privyId?: string) => {
    const response = await getProfile("", privyId)
    if (response.error) {
      throw new Error(response.error.message)
    }
    return response.data
  }
)

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.data = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch profile"
      })
  },
})

export const { clearUserProfile } = userProfileSlice.actions
export default userProfileSlice.reducer
