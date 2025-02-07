"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAliens, useProfile } from "@/store/hooks"
import { useLogout } from "@privy-io/react-auth"

import { getUnseenReferralRewards, markReferralRewardsAsSeen } from "@/lib/api"
import { calculateJackpot, getTokenPrice } from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"

import { InviteCard } from "./InviteCard"
import { JackpotCard } from "./JackpotCard"
import { UserProgress } from "./UserProgress"

export default function Home() {
  const [jackpotAmount, setJackpotAmount] = useState(0)
  const { data: aliens } = useAliens()
  const router = useRouter()
  const { data: profile } = useProfile()
  const { logout } = useLogout()

  const [unseenReferralRewards, setUnseenReferralRewards] = useState(0)

  useEffect(() => {
    const fetchJackpotAmount = async () => {
      const tokenPrice = await getTokenPrice()
      const amount = calculateJackpot(tokenPrice)
      setJackpotAmount(amount)
    }

    fetchJackpotAmount()
    // Refresh price every minute
    // const interval = setInterval(fetchJackpotAmount, 60000)

    // return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    logout()
    router.push("/")
  }

  useEffect(() => {
    const fetchUnseenReferralRewards = async () => {
      const response = await getUnseenReferralRewards()
      setUnseenReferralRewards(response.data ?? 0)

      if (response.data && response.data > 0) {
        await markReferralRewardsAsSeen()
      }
    }
    fetchUnseenReferralRewards()
  }, [])

  return (
    <>
      <div
        className="space-y-6 p-4 min-h-screen pb-20 w-full  mx-auto lg:flex lg:flex-col lg:items-center lg:justify-center"
        style={{
          background: "url('/images/auth/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex gap-4 items-stretch w-full max-w-screen-lg">
          <div className="w-1/2 hidden lg:block">
            <div className="w-full h-full  rounded-xl overflow-hidden bg-[#2C2D30]  relative z-10">
              <img
                src={aliens?.[0]?.image}
                alt="User's alien"
                className="w-full h-full object-contain z-10 relative"
              />
              <img
                src={aliens?.[0]?.element.replace(".png", "-bg.png")}
                alt="User's alien"
                className="w-full h-full object-cover absolute top-0 left-0"
              />
            </div>
          </div>
          <div className="relative z-10 space-y-4 w-full lg:w-1/2">
            <JackpotCard amount={jackpotAmount} />

            <UserProgress
              profile={profile ?? null}
              alien={aliens?.[0] ?? null}
              unseenReferralRewards={unseenReferralRewards}
            />
            <InviteCard profile={profile ?? null} />
            <Link href={"/website/treasure"}>
              <BrandButton className="w-full mt-4" blurColor="bg-[#96DFF4]">
                Treasure
              </BrandButton>
            </Link>
            <Link
              href={
                "https://app.uniswap.org/explore/tokens/arbitrum/0x888aaa48ebea87c74f690189e947d2c679705972?chain=arbitrum"
              }
              target="_blank"
            >
              <BrandButton className="w-full mt-4" blurColor="bg-[#96DFF4]">
                Buy $ZONE
              </BrandButton>
            </Link>
            <BrandButton
              className="w-full mt-4"
              blurColor="bg-[#FFC0CB]"
              onClick={handleLogout}
            >
              Logout
            </BrandButton>
          </div>
        </div>
      </div>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/90 backdrop-blur-lg"
        style={{
          background:
            "radial-gradient(95.75% 157.14% at 100% 0%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 50%) 100%)",
        }}
      />
    </>
  )
}
