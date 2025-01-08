import { configureStore } from "@reduxjs/toolkit"

import aliensReducer from "./slices/aliensSlice"
import raidsReducer from "./slices/raidsSlice"
import userProfileReducer from "./slices/userProfileSlice"

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    raids: raidsReducer,
    aliens: aliensReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
