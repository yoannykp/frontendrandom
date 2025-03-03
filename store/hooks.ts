import { CreateAlienData } from "@/types"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import type { AppDispatch, RootState } from "./index"
import {
  createNewAlien,
  fetchAliens,
  resetCreateStatus,
} from "./slices/aliensSlice"
import { clearCharacters, fetchCharacters } from "./slices/charactersSlice"
import { fetchRaidHistory, fetchRaids } from "./slices/raidsSlice"
import {
  clearTeam,
  fetchTeam,
  resetUpdateStatus,
  updateUserTeam,
} from "./slices/teamSlice"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useProfile = () => {
  return useAppSelector((state) => state.userProfile)
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

  return {
    ...aliensState,
    fetchAliens: () => dispatch(fetchAliens()),
    createAlien: handleCreateAlien,
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
