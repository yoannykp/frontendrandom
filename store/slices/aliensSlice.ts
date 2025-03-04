import { Alien, AliensState, CreateAlienData } from "@/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { createAlien, getAliens } from "@/lib/api"

const initialState: AliensState = {
  data: null,
  alien: null,
  loading: false,
  error: null,
  createStatus: {
    loading: false,
    error: null,
  },
}

export const fetchAliens = createAsyncThunk(
  "aliens/fetchAliens",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAliens()
      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to fetch aliens")
    }
  }
)

export const createNewAlien = createAsyncThunk(
  "aliens/createAlien",
  async (data: FormData, { rejectWithValue, dispatch }) => {
    try {
      const response = await createAlien(data)
      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      // Refresh aliens list after creating new one
      dispatch(fetchAliens())
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to create alien")
    }
  }
)

const aliensSlice = createSlice({
  name: "aliens",
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createStatus = {
        loading: false,
        error: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch aliens cases
      .addCase(fetchAliens.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAliens.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.alien = action.payload?.find((alien) => alien.selected) || null
      })
      .addCase(fetchAliens.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create alien cases
      .addCase(createNewAlien.pending, (state) => {
        state.createStatus.loading = true
        state.createStatus.error = null
      })
      .addCase(createNewAlien.fulfilled, (state) => {
        state.createStatus.loading = false
      })
      .addCase(createNewAlien.rejected, (state, action) => {
        state.createStatus.loading = false
        state.createStatus.error = action.payload as string
      })
  },
})

export const { resetCreateStatus } = aliensSlice.actions
export default aliensSlice.reducer
