"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useRaidTimer } from "@/context/raidTimer"
import { useWallet } from "@/context/wallet"
import { useAliens, useProfile, useRaids } from "@/store/hooks"
import { Plus } from "lucide-react"

import { levelRequirements } from "@/config/constants"
import {
  addCacheBuster,
  formateWalletAddress,
  formatNumber,
  formatRemainingTime,
  getBackgroundImageUrl,
} from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import Chat from "@/components/common/Chat"
import RightSidebar from "@/components/common/right-sidebar"
import TopBar from "@/components/common/top-bar"
import { ArrowBack } from "@/components/icons"
import ActivityMenu from "@/components/pages/home/ActivityMenu"
import countries from "@/app/assets/countries.json"

const Page = () => {
  const [isActivityMenuOpen, setIsActivityMenuOpen] = useState(false)
  const { data: profile } = useProfile()
  const { data: aliens, alien } = useAliens()
  const { data: raids } = useRaids()
  const { user } = useWallet()
  const { activeRaids, mostSoonToCompleteRaid } = useRaidTimer()

  console.log("profile ====>", profile)
  console.log("alien ====>", alien)

  return (
    <>
      {!isActivityMenuOpen && (
        <>
          <div className="flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden">
            {/* <div className="absolute inset-0 bg-[url('/images/characters/character-1-mobile.png')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/characters/character-1-main.png')]"></div> */}

            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${getBackgroundImageUrl(alien?.element?.image?.replace(".png", "-bg.png") || "")})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <img
              src={addCacheBuster(alien?.image || "")}
              alt={alien?.name || "Alien character"}
              className="absolute bg-cover bg-no-repeat"
              style={{
                backgroundSize: "cover",
                backgroundPosition: "25% center",
                left: "25%",
                transform: "translateX(-50%)",
                width: "50%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "25% center",
              }}
            />

            {/* <div
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${alien?.image || ""})`,
                backgroundSize: "cover",
                backgroundPosition: "25% center", // Position at 25% from left instead of center
                left: "25%", // Position at 25% from left
                transform: "translateX(-50%)", // Center the image at that 25% point
                width: "50%", // Control the width of the image
              }}
            /> */}

            <div className="absolute top-4 lg:top-10 right-4 lg:left-[23%] glass-effect z-10 px-3 py-2 rounded-xl w-max">
              <div className="flex items-center gap-2">
                <div className="glass-effect w-6 h-[1.35rem] rounded-lg relative">
                  <div className="absolute inset-0 -bottom-0.5 flex items-center justify-center">
                    {
                      countries.find(
                        (country) =>
                          country.name.toLowerCase().split(",")[0].trim() ===
                          profile?.country?.toLowerCase()?.split(",")[0].trim()
                      )?.flag
                    }
                  </div>
                </div>
                <p className="text-lg font-volkhov">
                  {formateWalletAddress(profile?.walletAddress ?? "")}
                </p>
              </div>
              <div className="flex items-center gap-6 bg-white/10 rounded-lg py-1 px-2">
                <p className="text-xs">Strength points</p>
                <p className="font-volkhov text-sm">
                  {(alien?.strengthPoints || 0) + (alien?.equipmentPower || 0)}
                </p>
              </div>
            </div>
            {mostSoonToCompleteRaid && (
              <div className="absolute top-4 lg:top-10 right-4 lg:right-[31rem] glass-effect z-10 px-3 py-2 rounded-xl w-44 max-lg:hidden">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-volkhov">Ongoing Raid</p>

                  <div className="relative">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <div className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <div className="absolute top-0 left-0 w-2 h-2 bg-red-300 rounded-full animate-ping" />
                  </div>
                </div>
                <p className="text-xs text-white/50">
                  Ends in{" "}
                  {mostSoonToCompleteRaid &&
                    Object.entries(
                      formatRemainingTime(mostSoonToCompleteRaid.remainingTime)
                    )
                      .filter(([_, { value }]) => parseInt(value) > 0)
                      .map(([unit, { value, text }], index, arr) => (
                        <React.Fragment key={unit}>
                          <span>
                            {value}
                            {text}
                          </span>
                          {index < arr.length - 1 && (
                            <span className="text-white/50 mx-px">:</span>
                          )}
                        </React.Fragment>
                      ))}{" "}
                </p>
              </div>
            )}
            <TopBar className="absolute right-8  max-lg:hidden" />
            <RightSidebar className="absolute left-8 top-10 max-lg:hidden " />
            <Chat
              className="hidden lg:block absolute left-8 bottom-10"
              btnClassName="absolute left-8 bottom-10"
            />
            <ActivityMenu zoneBalance={user?.zoneBalance} alien={alien} />
          </div>
          <div className="lg:hidden space-y-4 relative z-10 mt-4">
            <div className="flex gap-4  w-full justify-end">
              {/* Stats */}
              <div className="flex-1 glass-effect rounded-xl w-full ">
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

                    <Progress
                      value={profile?.experience}
                      total={
                        levelRequirements[profile?.level ?? 0].requiredPoints
                      }
                      className="w-full "
                    />

                    <p className="glass-effect py-1 px-3 rounded-lg text-xs font-volkhov">
                      {profile?.experience}/
                      {levelRequirements[profile?.level ?? 0].requiredPoints}
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
                    <p className="text-xs font-volkhov">
                      {user?.zoneBalance} ZONE
                    </p>
                    <button className="glass-effect size-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-6 lg:size-10 rounded-full p-px glass-effect flex items-center justify-center">
                      <Image
                        src="/images/stars.png"
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
          <ActivityMenu
            isMobile
            zoneBalance={user?.zoneBalance}
            alien={alien}
          />
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
