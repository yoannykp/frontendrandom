"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useAliens, useAppDispatch } from "@/store/hooks"
import { fetchAliens } from "@/store/slices/aliensSlice"
import { fetchRaidHistory, fetchRaids } from "@/store/slices/raidsSlice"
import { fetchUserProfile } from "@/store/slices/userProfileSlice"
import { usePrivy } from "@privy-io/react-auth"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { getAliens } from "@/lib/api"
import { removeCookie } from "@/lib/cookie"
import { useIsMobile } from "@/hooks/useIsMobile"

const WALLET_INIT_TIMEOUT = 2000

export function Loader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { ready, authenticated, user } = usePrivy()
  const [isLoading, setIsLoading] = useState(true)
  const [walletInitialized, setWalletInitialized] = useState(false)
  const { data: aliens } = useAliens()
  const isMobile = useIsMobile()
  const pathname = usePathname()

  const searchParams = useSearchParams()

  useEffect(() => {
    const refferalCode = searchParams.get("refferalCode")
    if (refferalCode) {
      localStorage.setItem("refferalCode", refferalCode)
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete("refferalCode")
      router.replace(newSearchParams.toString())
    }
  }, [searchParams, router])

  // useEffect(() => {
  //   if (pathname !== "/pwa" && isMobile) {
  //     router.push("/pwa")
  //   }
  // }, [pathname, isMobile, router])

  useEffect(() => {
    const timer = setTimeout(() => {
      setWalletInitialized(true)
    }, WALLET_INIT_TIMEOUT)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleWalletState = async () => {
      if (!walletInitialized) return

      if (!authenticated) {
        removeCookie("accessToken")
        router.push("/auth")
        return
      }

      if (user?.wallet?.address) {
        try {
          await Promise.all([
            dispatch(fetchUserProfile(user?.wallet?.address)),
            dispatch(fetchRaids()),
            dispatch(fetchAliens()),
            dispatch(fetchRaidHistory()),
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
  }, [
    user?.wallet?.address,
    dispatch,
    walletInitialized,
    authenticated,
    router,
  ])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
