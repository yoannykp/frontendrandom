import { InventoryItem } from "@/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { getUserInventory } from "@/lib/api"

// Define the inventory state interface
export interface InventoryState {
  data: InventoryItem[] | null
  loading: boolean
  error: string | null
}

const initialState: InventoryState = {
  data: null,
  loading: false,
  error: null,
}

// Create async thunk for fetching user inventory
export const fetchUserInventory = createAsyncThunk(
  "inventory/fetchUserInventory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserInventory()
      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to fetch inventory")
    }
  }
)

// Create the inventory slice
const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    clearInventory: (state) => {
      state.data = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch inventory cases
      .addCase(fetchUserInventory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserInventory.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUserInventory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearInventory } = inventorySlice.actions
export default inventorySlice.reducer
