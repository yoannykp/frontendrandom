import { clearPortfolio, fetchPortfolio } from "@/store/slices/portfolioSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import type { AppDispatch, RootState } from "./index"
import {
  createNewAlien,
  fetchAliens,
  resetCreateStatus,
  updateAlienImage,
} from "./slices/aliensSlice"
import { clearCharacters, fetchCharacters } from "./slices/charactersSlice"
import {
  claimDailyRewards,
  clearDailyRewards,
  fetchDailyRewards,
  resetAwardStatus,
} from "./slices/dailyRewardsSlice"
import { clearInventory, fetchUserInventory } from "./slices/inventorySlice"
import { fetchRaidHistory } from "./slices/raidsSlice"
import {
  clearTeam,
  fetchTeam,
  resetUpdateStatus,
  updateUserTeam,
} from "./slices/teamSlice"
import { fetchUserProfile } from "./slices/userProfileSlice"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useProfile = () => {
  const dispatch = useAppDispatch()
  return {
    ...useAppSelector((state) => state.userProfile),
    fetchUserProfile: () => dispatch(fetchUserProfile()),
  }
}

export const useRaids = () => {
  return useAppSelector((state) => state.raids)
}

export const useRaidHistory = () => {
  const dispatch = useAppDispatch()
  const { history } = useAppSelector((state) => state.raids)

  return {
    ...history,
    fetchHistory: () => dispatch(fetchRaidHistory()),
  }
}

export const useAliens = () => {
  const dispatch = useAppDispatch()
  const aliensState = useAppSelector((state) => state.aliens)

  const handleCreateAlien = async (data: FormData) => {
    try {
      await dispatch(createNewAlien(data)).unwrap()
    } catch (error) {
      throw error
    }
  }

  const handleUpdateAlienImage = async (data: FormData) => {
    try {
      const response = await dispatch(updateAlienImage(data)).unwrap()
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    ...aliensState,
    fetchAliens: () => dispatch(fetchAliens()),
    createAlien: handleCreateAlien,
    updateAlienImage: handleUpdateAlienImage,
    resetCreateStatus: () => dispatch(resetCreateStatus()),
  }
}

export const useTeam = () => {
  const dispatch = useAppDispatch()
  const teamState = useAppSelector((state) => state.team)

  const handleUpdateTeam = async ({
    alienIds,
    characterIds,
  }: {
    alienIds: number[]
    characterIds: number[]
  }) => {
    try {
      await dispatch(updateUserTeam({ alienIds, characterIds })).unwrap()
    } catch (error) {
      throw error
    }
  }

  return {
    ...teamState,
    fetchTeam: () => dispatch(fetchTeam()),
    updateTeam: handleUpdateTeam,
    resetUpdateStatus: () => dispatch(resetUpdateStatus()),
    clearTeam: () => dispatch(clearTeam()),
  }
}

export const useCharacters = () => {
  const dispatch = useAppDispatch()
  const charactersState = useAppSelector((state) => state.characters)

  return {
    ...charactersState,
    fetchCharacters: () => dispatch(fetchCharacters()),
    clearCharacters: () => dispatch(clearCharacters()),
  }
}

export const useInventory = () => {
  const dispatch = useAppDispatch()
  return {
    ...useAppSelector((state) => state.inventory),
    fetchInventory: () => dispatch(fetchUserInventory()),
    clearInventory: () => dispatch(clearInventory()),
  }
}

export const useDailyRewards = () => {
  const dispatch = useAppDispatch()
  const dailyRewardsState = useAppSelector((state) => state.dailyRewards)

  const handleClaimRewards = async () => {
    const response = await dispatch(claimDailyRewards()).unwrap()
    return response
  }

  return {
    ...dailyRewardsState,
    fetchDailyRewards: () => dispatch(fetchDailyRewards()),
    claimRewards: handleClaimRewards,
    resetAwardStatus: () => dispatch(resetAwardStatus()),
    clearDailyRewards: () => dispatch(clearDailyRewards()),
  }
}

export const usePortfolio = () => {
  const dispatch = useAppDispatch()
  const portfolioState = useAppSelector((state) => state.portfolio)

  return {
    ...portfolioState,
    fetchPortfolio: () => dispatch(fetchPortfolio()),
    clearPortfolio: () => dispatch(clearPortfolio()),
  }
}
