import { Character } from "@/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { getAllCharacters } from "@/lib/api"

// Define the characters state interface
export interface CharactersState {
  data: Character[] | null
  loading: boolean
  error: string | null
}

const initialState: CharactersState = {
  data: null,
  loading: false,
  error: null,
}

// Create async thunk for fetching all characters
export const fetchCharacters = createAsyncThunk(
  "characters/fetchCharacters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllCharacters()
      if (response.error) {
        return rejectWithValue(response.error.message)
      }
      return response.data?.userCharacters
    } catch (error) {
      return rejectWithValue("Failed to fetch characters")
    }
  }
)

// Create the characters slice
const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    clearCharacters: (state) => {
      state.data = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch characters cases
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload as Character[]
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCharacters } = charactersSlice.actions
export default charactersSlice.reducer
