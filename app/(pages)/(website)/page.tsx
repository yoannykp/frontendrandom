"use client"

import { useState } from "react"
import Image from "next/image"
import { useRaidTimer } from "@/context/raidTimer"
import { useAliens, useProfile, useRaids } from "@/store/hooks"
import { Plus } from "lucide-react"

import { formatNumber, formatRemainingTime } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { ArrowBack, FranceIcon } from "@/components/icons"
import ActivityMenu from "@/components/pages/home/ActivityMenu"

const Page = () => {
  const [isActivityMenuOpen, setIsActivityMenuOpen] = useState(false)
  const { data: profile } = useProfile()
  const { data: aliens } = useAliens()
  const { data: raids } = useRaids()
  const { activeRaids } = useRaidTimer()

  // Find the first active raid to display
  const activeRaid = activeRaids[0]
  const raidDetails = activeRaid
    ? raids?.find((r) => r.id === activeRaid.raidId)
    : null

  return (
    <>
      {!isActivityMenuOpen && (
        <>
          <div className=" flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden ">
            <div className="absolute inset-0 bg-[url('/images/characters/character-1-mobile.png')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/characters/character-1-main.png')]"></div>
            <div className="absolute top-4 lg:top-10 right-4 lg:left-[23%]  glass-effect  z-10  px-3 py-2 rounded-xl w-max">
              <div className="flex items-center gap-2">
                <div className="glass-effect p-1 rounded-lg">
                  <FranceIcon size={13} />
                </div>
                <p className="text-lg font-volkhov">
                  {profile?.walletAddress.slice(0, 6)}
                </p>
              </div>
              <div className="flex items-center gap-6 bg-white/10 rounded-lg py-1 px-2">
                <p className="text-xs">Strengh points</p>
                <p className="font-volkhov text-sm">
                  {aliens?.[0]?.strengthPoints ?? 0}
                </p>
              </div>
            </div>
            {activeRaid && raidDetails && (
              <div className="absolute top-4 lg:top-10 right-4 lg:right-[330px] glass-effect z-10 px-3 py-2 rounded-xl w-44">
                <div className="flex items-center gap-2">
                  <p className="font-volkhov">Ongoing Raid</p>
                </div>
                <p className="text-xs text-white/50">
                  {formatRemainingTime(activeRaid.remainingTime)} left
                </p>
              </div>
            )}
            <ActivityMenu />
          </div>
          <div className="lg:hidden space-y-4 relative z-10 mt-4">
            <div className="flex gap-4  w-full justify-end">
              {/* Stats */}
              <div className="flex-1 glass-effect rounded-xl   w-full ">
                <div className="h-1/2 p-4 flex items-center gap-5">
                  <div className="glass-effect flex w-max rounded-lg">
                    <p className="glass-effect py-1 px-3 rounded-lg text-xs">
                      Level
                    </p>
                    <div className=" py-1 px-3 text-sm">{profile?.level}</div>
                  </div>

                  <div className="flex items-center w-full">
                    <p className="glass-effect py-1 px-3 rounded-lg text-xs">
                      XP
                    </p>

                    <Progress value={60} className="w-full " />

                    <p className="glass-effect py-1 px-3 rounded-lg text-xs font-volkhov">
                      157/200
                    </p>
                  </div>
                </div>
                <div className="glass-effect h-1/2 rounded-b-xl flex items-center justify-center gap-5">
                  <div className="flex items-center gap-2">
                    <div className="size-6 lg:size-10 rounded-full p-px glass-effect flex items-center justify-center">
                      <Image
                        src="/images/coin-zone.png"
                        alt="Coin Zone"
                        width={50}
                        height={50}
                      />
                    </div>
                    <p className="text-xs font-volkhov">3,621,000 ZONE</p>
                    <button className="glass-effect size-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-6 lg:size-10 rounded-full p-px glass-effect flex items-center justify-center">
                      <Image
                        src="/images/star.png"
                        alt="Star"
                        width={50}
                        height={50}
                      />
                    </div>
                    <p className="text-xs font-volkhov">
                      {formatNumber(profile?.stars)} STAR
                    </p>
                    <button className="glass-effect size-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsActivityMenuOpen(!isActivityMenuOpen)}
              className="w-full glass-effect rounded-xl px-2 py-4"
            >
              Activity Menu
            </button>
          </div>
        </>
      )}

      {/* Activity Menu Mobile */}
      {isActivityMenuOpen && (
        <>
          <button
            onClick={() => setIsActivityMenuOpen(!isActivityMenuOpen)}
            className="w-full glass-effect rounded-2xl px-3 py-3 z-10 mb-3 flex items-center justify-between font-volkhov gap-2 "
          >
            Back to Home
            <ArrowBack className="size-4" />
          </button>
          <ActivityMenu isMobile />
        </>
      )}

      {/* Background Gradients */}
      <div
        className="fixed inset-0 "
        style={{
          background:
            "radial-gradient(69.65% 69.65% at 43.52% 23.05%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.54) 100%)",
        }}
      ></div>
      <div
        className="fixed inset-0 "
        style={{
          background:
            "radial-gradient(48.12% 75.2% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.81) 100%)",
        }}
      ></div>
    </>
  )
}

export default Page
