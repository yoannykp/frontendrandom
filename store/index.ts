import { configureStore } from "@reduxjs/toolkit"

import aliensReducer from "./slices/aliensSlice"
import charactersReducer from "./slices/charactersSlice"
import inventoryReducer from "./slices/inventorySlice"
import raidsReducer from "./slices/raidsSlice"
import teamReducer from "./slices/teamSlice"
import userProfileReducer from "./slices/userProfileSlice"

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    raids: raidsReducer,
    aliens: aliensReducer,
    team: teamReducer,
    characters: charactersReducer,
    inventory: inventoryReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
