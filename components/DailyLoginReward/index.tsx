import { useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

import BrandButton from "../ui/brand-button"
import { GradientBorder } from "../ui/gradient-border"

type RewardType = "STAR" | "XP" | "KNIFE" | "POTION" | "OUTFIT"

interface DailyReward {
  id: number
  type: RewardType
  amount: number
  claimed: boolean
  available: boolean
  image: string
}

const rewards: DailyReward[] = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  type: i % 5 === 4 ? "XP" : "STAR",
  amount: i % 5 === 4 ? 5000 : 20,
  claimed: i < 24,
  available: i < 26,
  image: i % 5 === 4 ? "/images/xp.png" : "/images/stars.png",
}))

const DailyLoginReward = () => {
  const [currentDay] = useState(25)
  const [multiplier] = useState(6)

  return (
    <div>
      <h2 className=" font-medium mb-5 bg-white/5 border border-white/10 w-max rounded-xl p-4 ">
        Daily Login Bonus
      </h2>
      <div className="w-full  mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Grid of rewards */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {rewards.map((reward) => (
                <GradientBorder
                  key={reward.id}
                  isSelected={reward.id === currentDay}
                >
                  <div
                    key={reward.id}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden flex flex-col",
                      reward.claimed
                        ? "bg-white/5"
                        : reward.available
                          ? "bg-white/10"
                          : "bg-white/5 opacity-50"
                    )}
                  >
                    {/* Day number */}
                    <span className="absolute top-2 left-2 ">{reward.id}</span>

                    {/* Reward image */}
                    <div className="w-full flex-1 flex items-center justify-center relative overflow-hidden ">
                      <div className="relative w-3/5 h-3/5">
                        <Image
                          src={reward.image}
                          alt={reward.type}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <Image
                        src={reward.image}
                        alt={reward.type}
                        width={200}
                        height={200}
                        className="opacity-10 !w-[135%]  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
                      />
                    </div>

                    {/* Claimed status */}
                    <div
                      className={cn(
                        "flex items-center justify-between text-xs bg-white/10 p-2 font-inter",
                        reward.claimed && "text-gray-400"
                      )}
                    >
                      <span>
                        {reward.claimed
                          ? "Claimed"
                          : reward.available
                            ? "Claim"
                            : "Not available"}
                      </span>
                      {reward.type === "XP" && (
                        <span className="font-medium">{reward.amount}</span>
                      )}
                    </div>
                  </div>
                </GradientBorder>
              ))}
            </div>
          </div>

          <div className="lg:w-[240px] flex-shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4 h-full">
              <div className="flex flex-col gap-2 bg-white/5 p-3 rounded text-center">
                <div className="text-lg font-medium">Today&apos;s Claim</div>
                <div className=" font-inter text-sm">
                  <span>06</span>
                  <span className="mx-1">:</span>
                  <span>54</span>
                  <span className="mx-1">:</span>
                  <span>09</span>
                  <span className="ml-2  text-gray-400">Left</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <div className="bg-white/10   rounded text-xs font-inter border border-white/10 flex w-max mx-auto">
                  <div className="border-r py-1 border-white/10  px-2 bg-white/5 ">
                    Multiplicator{" "}
                  </div>
                  <div className="font-volkhov  px-4 py-1">x6</div>
                </div>

                <div className="relative aspect-square  rounded-xl p-4 flex items-center justify-center overflow-hidden size-32 mx-auto my-4 border border-white/10">
                  <div className="relative w-20 h-20 ">
                    <Image
                      src="/images/stars.png"
                      alt="Reward"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Image
                    src="/images/stars.png"
                    alt="Reward"
                    width={200}
                    height={200}
                    className="opacity-10 !w-[120%]  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
                  />
                </div>

                <div className="bg-white/10   rounded text-xs font-inter border border-white/10 flex w-max mx-auto">
                  <div className="border-r py-1 border-white/10  px-2 bg-white/5 ">
                    20 STAR
                  </div>
                  <div className="font-volkhov  px-4 py-1">Claimed</div>
                </div>

                <div className="text-center w-max bg-white/5 rounded-full py-1 px-2 text-2xs text-white/50 mx-auto mt-auto">
                  What’s “Object name”?
                </div>
              </div>
            </div>
          </div>
        </div>
        <BrandButton className="w-full mt-4">Already Claimed</BrandButton>
      </div>
    </div>
  )
}

export default DailyLoginReward
