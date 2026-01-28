import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { getPortfolio } from "@/lib/api"
import { GetPortfolioResponse } from "@/lib/types"

type PortfolioData = GetPortfolioResponse

// Define the portfolio state interface
export interface PortfolioState {
  data: PortfolioData | null
  loading: boolean
  error: string | null
}

const initialState: PortfolioState = {
  data: null,
  loading: false,
  error: null,
}

// Create async thunk for fetching user inventory
export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetchPortfolio",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPortfolio()

      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to fetch portfolio")
    }
  }
)

// Create the inventory slice
const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    clearPortfolio: (state) => {
      state.data = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch inventory cases
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
