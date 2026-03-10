"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAliens, useAppDispatch } from "@/store/hooks"
import { fetchAliens } from "@/store/slices/aliensSlice"
import { fetchRaidHistory, fetchRaids } from "@/store/slices/raidsSlice"
import { fetchUserProfile } from "@/store/slices/userProfileSlice"
import { usePrivy } from "@privy-io/react-auth"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { removeCookie } from "@/lib/cookie"

function ReferralCodeHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const refferalCode = searchParams.get("refferalCode")
    if (refferalCode) {
      localStorage.setItem("refferalCode", refferalCode)
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete("refferalCode")
      router.replace(newSearchParams.toString())
    }
  }, [searchParams, router])

  return null
}

export function Loader({ children, isDojoPage }: { children: React.ReactNode; isDojoPage?: boolean }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { ready, authenticated, user } = usePrivy()
  const [isLoading, setIsLoading] = useState(true)
  const { data: aliens } = useAliens()
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Prevent double initialization
    if (hasInitialized.current) return

    const handleWalletState = async () => {
      if (!ready) return

      if (!authenticated) {
        removeCookie("accessToken")
        router.push("/auth")
        return
      }

      if (user?.wallet?.address) {
        hasInitialized.current = true
        try {
          // Fetch all data in parallel — fetchAliens populates the Redux store
          const results = await Promise.all([
            dispatch(fetchUserProfile(user.wallet.address)),
            dispatch(fetchRaids()),
            dispatch(fetchAliens()),
            dispatch(fetchRaidHistory()),
          ])

          // Check aliens from the Redux action result instead of making a duplicate API call
          const aliensResult = results[2] as any
          const aliensData = aliensResult?.payload?.data ?? aliensResult?.payload

          if (!aliensData || (Array.isArray(aliensData) && aliensData.length === 0)) {
            removeCookie("accessToken")
            toast.error("Please create your first alien")
            router.push("/auth")
            hasInitialized.current = false
            return
          }
          setIsLoading(false)
        } catch (error) {
          console.error("Error fetching data:", error)
          hasInitialized.current = false
        }
      }
    }

    handleWalletState()
  }, [user?.wallet?.address, dispatch, ready, authenticated, router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Suspense fallback={null}>
        <ReferralCodeHandler />
      </Suspense>
      {children}
    </>
  )
}
