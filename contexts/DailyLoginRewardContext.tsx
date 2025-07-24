"use client"

import {
  createContext,
  ReactNode,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"

import DailyLoginModal from "@/components/DailyLoginReward/Modal"

interface DailyLoginRewardContextType {
  isRewardModalOpen: boolean
  openRewardModal: () => void
  closeRewardModal: () => void
}

const DailyLoginRewardContext = createContext<
  DailyLoginRewardContextType | undefined
>(undefined)

function DailyLoginRewardContent({ children }: { children: ReactNode }) {
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { ready, authenticated } = usePrivy()

  const openRewardModal = () => setIsRewardModalOpen(true)
  const closeRewardModal = () => setIsRewardModalOpen(false)

  useEffect(() => {
    if (searchParams.get("showDailyReward") && ready && authenticated) {
      openRewardModal()
      router.replace(window.location.pathname, { scroll: false })
    }
  }, [searchParams, router])

  return (
    <DailyLoginRewardContext.Provider
      value={{
        isRewardModalOpen,
        openRewardModal,
        closeRewardModal,
      }}
    >
      {children}
      <DailyLoginModal />
    </DailyLoginRewardContext.Provider>
  )
}

export function DailyLoginRewardProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Suspense>
      <DailyLoginRewardContent>{children}</DailyLoginRewardContent>
    </Suspense>
  )
}

export function useDailyLoginReward() {
  const context = useContext(DailyLoginRewardContext)
  if (context === undefined) {
    throw new Error(
      "useDailyLoginReward must be used within a DailyLoginRewardProvider"
    )
  }
  return context
}
