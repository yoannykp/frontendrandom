"use client"

import { useEffect, useState } from "react"
import { useAppKitAccount } from "@reown/appkit/react"
import { Loader2 } from "lucide-react"

import { useAppDispatch } from "@/lib/store/hooks"
import { fetchUserProfile } from "@/lib/store/slices/userProfileSlice"

export function Loader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { address } = useAppKitAccount()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (address) {
      dispatch(fetchUserProfile(address))
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
