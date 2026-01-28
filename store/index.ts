import { configureStore } from "@reduxjs/toolkit"

import aliensReducer from "./slices/aliensSlice"
import charactersReducer from "./slices/charactersSlice"
import dailyRewardsReducer from "./slices/dailyRewardsSlice"
import inventoryReducer from "./slices/inventorySlice"
import portfolioReducer from "./slices/portfolioSlice"
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
    dailyRewards: dailyRewardsReducer,
    portfolio: portfolioReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
