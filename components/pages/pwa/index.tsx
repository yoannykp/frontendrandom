"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAliens, useProfile } from "@/store/hooks"

import { calculateJackpot, getTokenPrice } from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"

import { InviteCard } from "./InviteCard"
import { JackpotCard } from "./JackpotCard"
import { UserProgress } from "./UserProgress"

export default function Home() {
  const [jackpotAmount, setJackpotAmount] = useState(0)
  const { data: aliens } = useAliens()
  const { data: profile } = useProfile()

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

  return (
    <>
      <div
        className="space-y-6 p-4 min-h-screen pb-20"
        style={{
          background: "url('/images/auth/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10 space-y-4">
          <JackpotCard amount={jackpotAmount} players={77500} />
          <Link
            href={
              "https://app.uniswap.org/explore/tokens/arbitrum/0x888aaa48ebea87c74f690189e947d2c679705972?chain=arbitrum"
            }
            target="_blank"
          >
            <BrandButton className="w-full mt-4" blurColor="bg-[#96DFF4]">
              Buy Token
            </BrandButton>
          </Link>
          <InviteCard />
          <UserProgress
            username={profile?.name ?? "Name"}
            tokenType="TON"
            stars={profile?.stars ?? 0}
            level="Airdrop Level 1"
            amount={0}
            profit={0}
            image={aliens?.[0]?.image ?? ""}
          />
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
