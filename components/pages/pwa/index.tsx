"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAliens, useProfile } from "@/store/hooks"
import { useLogout } from "@privy-io/react-auth"
import { Copy, CopyCheck, Loader2, LogOut } from "lucide-react"
import { FaTelegram } from "react-icons/fa6"

import { getUnseenReferralRewards, markReferralRewardsAsSeen } from "@/lib/api"
import {
  calculateJackpot,
  formateWalletAddress,
  getTokenPrice,
} from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"
import { TwitterX } from "@/components/icons"

import { InviteCard } from "./InviteCard"
import { JackpotCard } from "./JackpotCard"
import { UserProgress } from "./UserProgress"

export default function Home() {
  const [jackpotAmount, setJackpotAmount] = useState(0)
  const { data: aliens, alien } = useAliens()
  const router = useRouter()
  const { data: profile } = useProfile()
  const { logout } = useLogout()
  const [unseenReferralRewards, setUnseenReferralRewards] = useState(0)
  const [isCopied, setIsCopied] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const fetchJackpotAmount = async () => {
      const tokenPrice = await getTokenPrice()
      const amount = calculateJackpot(tokenPrice)
      setJackpotAmount(amount)
    }

    fetchJackpotAmount()
    // Refresh price every minute
    const interval = setInterval(fetchJackpotAmount, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    setIsLoggingOut(true)
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

  const handleCopy = (value: string) => {
    setIsCopied(true)
    navigator.clipboard.writeText(value)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <>
      <div
        className=" p-4 min-h-screen w-full  mx-auto lg:flex lg:flex-col lg:items-center lg:justify-center"
        style={{
          background: "url('/images/image1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex gap-4 items-stretch w-full max-w-screen-lg">
            <div className="w-1/2 hidden lg:block">
              <div className="w-full h-full  rounded-xl overflow-hidden bg-[#2C2D30]  relative z-10">
                <img
                  src={alien?.image}
                  alt="User's alien"
                  className="w-full h-[calc(100%+130px)] object-contain z-10 relative"
                />
                <img
                  src={alien?.element?.background}
                  alt="User's alien"
                  className="w-full h-full object-cover absolute top-0 left-0"
                />
              </div>
            </div>
            <div className="relative z-10 space-y-4 w-full lg:w-1/2">
              <JackpotCard amount={jackpotAmount} />

              <UserProgress
                profile={profile ?? null}
                alien={alien ?? null}
                unseenReferralRewards={unseenReferralRewards}
              />
              <InviteCard profile={profile ?? null} />
              <div className="flex gap-2">
                <Link href={"/treasure"} className="w-full">
                  <BrandButton className="w-full mt-4" blurColor="bg-[#96DFF4]">
                    Treasure
                  </BrandButton>
                </Link>
                <Link href={"/raids"} className="w-full">
                  <BrandButton className="w-full mt-4" blurColor="bg-[#96DFF4]">
                    Raid
                  </BrandButton>
                </Link>
              </div>
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
              <div className="flex gap-2">
                {/* wallet add */}
                <BrandButton
                  className="w-full flex items-center gap-2"
                  blurColor="bg-[#FFC0CB]"
                  onClick={() => handleCopy(profile?.walletAddress ?? "")}
                >
                  {/* chain logo */}
                  <Image
                    src={"/images/logos/arb.png"}
                    alt="chain logo"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                  {formateWalletAddress(profile?.walletAddress ?? "")}{" "}
                  {isCopied ? (
                    <CopyCheck className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </BrandButton>
                <BrandButton
                  blurColor="bg-[#FFC0CB]"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <Loader2 className="size-6 animate-spin" />
                  ) : (
                    <LogOut className="size-6" />
                  )}
                </BrandButton>
              </div>
            </div>
          </div>
        </div>
        <div className="py-4  z-20 relative flex flex-col items-center justify-center text-white/50 gap-4">
          <div className="flex gap-4">
            <Link
              href="https://taap.it/alienzone2"
              target="_blank"
              className="hover:text-white"
            >
              <TwitterX size={24} />
            </Link>
            <Link
              href="https://taap.it/alienzone"
              target="_blank"
              className="hover:text-white"
            >
              <FaTelegram size={24} />
            </Link>
          </div>
          <p className="text-center text-sm      ">
            © {new Date().getFullYear()} Alienzone All rights reserved. Reach
            out to us at{" "}
            <a href="mailto:team@alienzone.io" className="underline">
              team@alienzone.io
            </a>
          </p>
        </div>
      </div>

      <div
        className="fixed top-0 left-0 w-full h-full bg-black/10 backdrop-blur-lg "
        style={{
          background:
            "radial-gradient(95.75% 157.14% at 100% 0%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 50%) 100%)",
        }}
      />
    </>
  )
}
