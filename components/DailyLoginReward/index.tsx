import { useEffect, useState } from "react"
import Image from "next/image"
import { useDailyRewards } from "@/store/hooks"
import { DailyReward } from "@/types"
import { Check, Lock } from "lucide-react"
import toast from "react-hot-toast"

import { cn } from "@/lib/utils"

import BrandButton from "../ui/brand-button"
import { GradientBorder } from "../ui/gradient-border"

const DailyLoginReward = () => {
  const {
    data: rewards,
    loading,
    claimRewards,
    fetchDailyRewards,
  } = useDailyRewards()
  const [currentReward, setCurrentReward] = useState<DailyReward | null>(null)
  const [timeLeft, setTimeLeft] = useState("")

  const isClaimed = (reward: DailyReward) => {
    return rewards?.claimedDailyRewards.some((r) => r.id === reward.id)
  }

  const isCurrent = (reward: DailyReward) => {
    const today = new Date()
    const rewardDay = new Date(reward.rewardDate)
    return rewardDay.toDateString() === today.toDateString()
  }

  useEffect(() => {
    fetchDailyRewards()
  }, [])

  const handleClaim = async () => {
    if (currentReward && isClaimed(currentReward)) return
    try {
      await claimRewards()
      toast.success("Daily rewards claimed successfully!")
      fetchDailyRewards() // Refresh the rewards data
    } catch (error) {
      toast.error("Failed to claim rewards")
    }
  }

  useEffect(() => {
    if (rewards?.dailyRewards) {
      const today = new Date()
      const currentReward =
        rewards.dailyRewards.find((reward) => isCurrent(reward)) || null
      setCurrentReward(currentReward)

      // Calculate time left until next reward
      if (currentReward) {
        const rewardDate = new Date(currentReward.rewardDate)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)

        const updateTimer = () => {
          const now = new Date()
          const diff = tomorrow.getTime() - now.getTime()

          if (diff <= 0) {
            setTimeLeft("00:00:00")
            return
          }

          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)

          setTimeLeft(
            `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          )
        }

        // Update immediately and then every second
        updateTimer()
        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
      }
    }
  }, [rewards])

  const getRewardImage = (reward: DailyReward) => {
    switch (reward.type) {
      case "STARS":
        return "/images/stars.png"
      case "ITEM":
        return reward.item?.image
      case "XP":
        return "/images/xp.png"
    }
  }

  return (
    <div>
      <h2 className="font-medium mb-5 bg-white/5 border border-white/10 w-max rounded-xl p-4">
        Daily Login Bonus
      </h2>
      <div className="w-full mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Grid of rewards */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {rewards?.dailyRewards &&
                rewards?.dailyRewards.map((reward) => (
                  <GradientBorder
                    key={reward.id}
                    isSelected={isCurrent(reward)}
                  >
                    <div
                      className={cn(
                        "relative aspect-square rounded-xl overflow-hidden flex flex-col",
                        isClaimed(reward)
                          ? "bg-white/5"
                          : isCurrent(reward)
                            ? "bg-white/10 cursor-pointer"
                            : "bg-white/5 opacity-50"
                      )}
                      onClick={() => {
                        if (isCurrent(reward)) {
                          handleClaim()
                        }
                      }}
                    >
                      {/* Day number */}
                      <span className="absolute top-2 left-2">{reward.id}</span>

                      {/* Reward image */}
                      <div className="w-full flex-1 flex items-center justify-center relative overflow-hidden">
                        <div className="relative w-3/5 h-3/5">
                          <Image
                            src={getRewardImage(reward) || ""}
                            alt={reward.type}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <Image
                          src={getRewardImage(reward) || ""}
                          alt={reward.type}
                          width={200}
                          height={200}
                          className="opacity-10 !w-[135%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
                        />
                      </div>

                      {/* Claimed status */}
                      {!isCurrent(reward) && (
                        <div
                          className={cn(
                            "flex items-center justify-between text-xs bg-white/10 p-2 font-inter",
                            isClaimed(reward) && "text-gray-400"
                          )}
                        >
                          <span>
                            {isClaimed(reward)
                              ? "Claimed"
                              : isCurrent(reward)
                                ? "Claim"
                                : "Not available"}
                          </span>
                          {isClaimed(reward) && <Check className="size-3" />}
                          {!isCurrent(reward) && !isClaimed(reward) && (
                            <Lock className="size-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </GradientBorder>
                ))}
            </div>
          </div>

          <div className="lg:w-[240px] flex-shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4 h-full">
              <div className="flex flex-col gap-2 bg-white/5 p-3 rounded text-center">
                <div className="text-lg font-medium">Today&apos;s Claim</div>
                <div className="font-inter text-sm">
                  <span>{timeLeft.split(":")[0]}</span>
                  <span className="mx-1">:</span>
                  <span>{timeLeft.split(":")[1]}</span>
                  <span className="mx-1">:</span>
                  <span>{timeLeft.split(":")[2]}</span>
                  <span className="ml-2 text-gray-400">Left</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <div className="bg-white/10 rounded text-xs font-inter border border-white/10 flex w-max mx-auto">
                  <div className="border-r py-1 border-white/10 px-2 bg-white/5">
                    Multiplicator{" "}
                  </div>
                  <div className="font-volkhov px-4 py-1">
                    x{rewards?.dailyStreak}
                  </div>
                </div>

                <div className="relative aspect-square rounded-xl p-4 flex items-center justify-center overflow-hidden size-32 mx-auto my-4 border border-white/10">
                  <div className="relative w-20 h-20">
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
                    className="opacity-10 !w-[120%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
                  />
                </div>

                <div className="bg-white/10 rounded text-xs font-inter border border-white/10 flex w-max mx-auto">
                  <div className="border-r py-1 border-white/10 px-2 bg-white/5">
                    {currentReward?.type === "STARS"
                      ? `${currentReward.amount} STAR`
                      : currentReward?.type === "XP"
                        ? `${currentReward.amount} XP`
                        : `${currentReward?.amount} ${currentReward?.item?.type}`}
                  </div>
                  <div className="font-volkhov px-4 py-1">
                    {loading ? "Loading..." : "Ready"}
                  </div>
                </div>

                <div className="text-center w-max bg-white/5 rounded-full py-1 px-2 text-2xs text-white/50 mx-auto mt-auto">
                  What&apos;s &quot;Object name&quot;?
                </div>
              </div>
            </div>
          </div>
        </div>
        <BrandButton
          className="w-full mt-4"
          onClick={handleClaim}
          disabled={loading}
        >
          {currentReward && !isClaimed(currentReward)
            ? "Claim Reward"
            : "Already Claimed"}
        </BrandButton>
      </div>
    </div>
  )
}

export default DailyLoginReward
