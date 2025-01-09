"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAppDispatch, useRaidHistory, useRaids } from "@/store/hooks"
import { updateRaidHistoryStatus } from "@/store/slices/raidsSlice"
import { RaidResponse } from "@/types"
import toast from "react-hot-toast"

import { calculateLaunchedRaidRemainingTime } from "@/lib/utils"

type RaidTimerContextType = {
  activeRaids: (RaidResponse & {
    remainingTime: number
  })[]
  mostSoonToCompleteRaid:
    | (RaidResponse & {
        remainingTime: number
      })
    | null
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
    (RaidResponse & {
      remainingTime: number
    })[]
  >([])
  const [mostSoonToCompleteRaid, setMostSoonToCompleteRaid] = useState<
    | (RaidResponse & {
        remainingTime: number
      })
    | null
  >(null)

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

          return { ...raid, remainingTime }
        })
        .filter((raid) => raid !== null)

      setActiveRaids(newActiveRaids)

      if (newActiveRaids.length > 0) {
        const firstRaid = newActiveRaids.sort(
          (a, b) => a.remainingTime - b.remainingTime
        )[0]
        console.log(firstRaid)
        setMostSoonToCompleteRaid(firstRaid)
      } else {
        setMostSoonToCompleteRaid(null)
      }
    }

    updateTimers()
    const interval = setInterval(updateTimers, 1000)

    return () => clearInterval(interval)
  }, [raidHistory, raids, dispatch])

  return (
    <RaidTimerContext.Provider value={{ activeRaids, mostSoonToCompleteRaid }}>
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
