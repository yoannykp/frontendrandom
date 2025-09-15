"use client"

import { Suspense, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useAliens, useAppDispatch, useInventory } from "@/store/hooks"
import { fetchAliens } from "@/store/slices/aliensSlice"
import { fetchCharacters } from "@/store/slices/charactersSlice"
import { fetchRaidHistory, fetchRaids } from "@/store/slices/raidsSlice"
import { fetchTeam } from "@/store/slices/teamSlice"
import { fetchUserProfile } from "@/store/slices/userProfileSlice"
import { usePrivy } from "@privy-io/react-auth"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { getAliens } from "@/lib/api"
import { removeCookie } from "@/lib/cookie"
import { useIsMobile } from "@/hooks/useIsMobile"

const WALLET_INIT_TIMEOUT = 2000

// Separate component for handling search params
function SearchParamsHandler() {
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

export function Loader({
  children,
  isDojoPage,
}: {
  children: React.ReactNode
  isDojoPage?: boolean
}) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { ready, authenticated, user } = usePrivy()
  const [isLoading, setIsLoading] = useState(true)
  const { data: aliens } = useAliens()
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const { fetchInventory } = useInventory()

  useEffect(() => {
    const handleWalletState = async () => {
      if (!ready) return

      if (!authenticated) {
        removeCookie("accessToken")
        router.push("/auth")
        return
      }

      if (user?.wallet?.address) {
        try {
          await Promise.all([
            dispatch(fetchUserProfile(user?.id || "")),
            dispatch(fetchRaids()),
            dispatch(fetchAliens()),
            dispatch(fetchRaidHistory()),
            dispatch(fetchTeam()),
            dispatch(fetchCharacters()),
            fetchInventory(),
          ])

          const aliens = await getAliens()

          if (aliens?.data?.length === 0 || !aliens?.data) {
            removeCookie("accessToken")
            toast.error("Please create your first alien")
            router.push("/auth")
            return
          }
          setIsLoading(false)
        } catch (error) {
          console.error("Error fetching data:", error)
        }
      }
    }

    handleWalletState()
  }, [user?.wallet?.address, dispatch, ready, authenticated, router])

  if (isLoading && isDojoPage) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
      <div className="relative">
        {children}
        {isLoading && !isDojoPage && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
            <Loader2 className="size-10 animate-spin text-white" />
          </div>
        )}
      </div>
    </>
  )
}
