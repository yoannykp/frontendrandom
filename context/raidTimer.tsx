"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAppDispatch, useRaidHistory, useRaids } from "@/store/hooks"
import { updateRaidHistoryStatus } from "@/store/slices/raidsSlice"
import { Raid, RaidHistoryResponse } from "@/types"
import toast from "react-hot-toast"

import { calculateLaunchedRaidRemainingTime } from "@/lib/utils"

type RaidTimerContextType = {
  activeRaids: { raidId: number; remainingTime: number }[]
}

const RaidTimerContext = createContext<RaidTimerContextType | undefined>(
  undefined
)

export const RaidTimerProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const dispatch = useAppDispatch()
  const { data: raidHistory } = useRaidHistory()
  const { data: raids } = useRaids()
  const [activeRaids, setActiveRaids] = useState<
    { raidId: number; remainingTime: number }[]
  >([])

  useEffect(() => {
    if (!raidHistory || !raids) return

    const updateTimers = () => {
      const activeRaidHistories = raidHistory.filter(
        (history) => history.inProgress
      )
      const newActiveRaids = activeRaidHistories
        .map((history) => {
          const raid = raids.find((r) => r.id === history.raidId)
          if (!raid) return null

          const remainingTime =
            calculateLaunchedRaidRemainingTime(history, raid) || 0

          // If raid is complete, update its status
          if (remainingTime <= 0) {
            dispatch(
              updateRaidHistoryStatus({ raidId: raid.id, inProgress: false })
            )
            toast.success(
              `Raid completed! You got ${raid.rewards
                .map((reward) => `${reward.amount} ${reward.type}`)
                .join(", ")}`
            )
            return null
          }

          return { raidId: raid.id, remainingTime }
        })
        .filter(
          (raid): raid is { raidId: number; remainingTime: number } =>
            raid !== null
        )

      setActiveRaids(newActiveRaids)
    }

    updateTimers()
    const interval = setInterval(updateTimers, 1000)

    return () => clearInterval(interval)
  }, [raidHistory, raids, dispatch])

  return (
    <RaidTimerContext.Provider value={{ activeRaids }}>
      {children}
    </RaidTimerContext.Provider>
  )
}

export const useRaidTimer = () => {
  const context = useContext(RaidTimerContext)
  if (context === undefined) {
    throw new Error("useRaidTimer must be used within a RaidTimerProvider")
  }
  return context
}
