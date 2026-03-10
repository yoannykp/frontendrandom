import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { apiManager } from "@/lib/api"

export interface PortfolioState {
  data: any | null
  loading: boolean
  error: string | null
}

const initialState: PortfolioState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetchPortfolio",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiManager.get("/profile/portfolio")
      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to fetch portfolio")
    }
  }
)

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    clearPortfolio: (state) => {
      state.data = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearPortfolio } = portfolioSlice.actions
export default portfolioSlice.reducer
