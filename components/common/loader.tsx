"use client"

import { useEffect, useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { fetchAliens } from "@/store/slices/aliensSlice"
import { fetchRaidHistory, fetchRaids } from "@/store/slices/raidsSlice"
import { fetchUserProfile } from "@/store/slices/userProfileSlice"
import { useAppKitAccount } from "@reown/appkit/react"
import { Loader2 } from "lucide-react"

export function Loader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { address } = useAppKitAccount()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (address) {
      dispatch(fetchUserProfile(address))
      dispatch(fetchRaids())
      dispatch(fetchAliens())
      dispatch(fetchRaidHistory())
      setIsLoading(false)
    }
  }, [address, dispatch])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
