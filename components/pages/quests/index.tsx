"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDailyRewards, useProfile } from "@/store/hooks"
import { DailyReward } from "@/types"
import { CheckCircle, Loader2, MessageSquare, Plus } from "lucide-react"
import toast from "react-hot-toast"

import { claimQuest, getQuestList } from "@/lib/api"
import { cn } from "@/lib/utils"

interface Quest {
  id: number
  icon: string
  title: string
  timeLeft: string
  action: string
  type: "login" | "raid" | "buy" | "message" | "wheel"
  progress?: string
  completed?: boolean
  frequency?: string
  description?: string
  currentProgress?: number
  requiredNumber?: number
  isCompleted?: boolean
  isClaimed?: boolean
  rewards?: {
    stars: number
  }
}

interface Reward {
  type: "XP" | "STAR" | "ITEM"
  amount: string
  day: number
  claimed: boolean
  icon: string
}

// Temp data for daily quests
const DAILY_QUESTS: Quest[] = [
  {
    id: 1,
    icon: "/images/cat.jpeg",
    title: "Daily Login Bonus",
    timeLeft: "1h left",
    action: "Claim",
    type: "login",
  },
  {
    id: 2,
    icon: "/images/girl.jpeg",
    title: "Complete 3 Raids",
    timeLeft: "3h left",
    progress: "2/3",
    action: "Go",
    type: "raid",
  },
  {
    id: 3,
    icon: "/images/cat.jpeg",
    title: "Spend 1000 Coins",
    timeLeft: "5h left",
    progress: "750/1000",
    action: "Go",
    type: "buy",
  },
]

// Temp data for weekly quests
const WEEKLY_QUESTS: Quest[] = [
  {
    id: 1,
    icon: "/images/cat.jpeg",
    title: "Connect on AlienRaids",
    timeLeft: "1h left",
    action: "Claim",
    type: "message",
  },
  {
    id: 2,
    icon: "/images/girl.jpeg",
    title: "Use the Lucky Wheel 5 times",
    timeLeft: "1h left",
    progress: "20/20",
    action: "Go",
    type: "wheel",
  },
  {
    id: 3,
    icon: "/images/cat.jpeg",
    title: "Buy 5 items in the Store",
    timeLeft: "6h left",
    progress: "5/5",
    action: "Go",
    type: "buy",
    completed: true,
  },
  {
    id: 4,
    icon: "/images/girl.jpeg",
    title: "Use the Lucky Wheel 5 times",
    timeLeft: "12h left",
    progress: "5/5",
    action: "Go",
    type: "wheel",
  },
  {
    id: 5,
    icon: "/images/cat.jpeg",
    title: "Collect your first Raids rewards",
    timeLeft: "24h left",
    action: "Claim",
    type: "wheel",
  },
  {
    id: 6,
    icon: "/images/girl.jpeg",
    title: "Send your team on a Raid",
    timeLeft: "36h left",
    action: "Go",
    type: "raid",
  },
]

const REWARDS: Reward[] = [
  {
    type: "XP",
    amount: "3000XP",
    day: 1,
    claimed: true,
    icon: "/images/xp.png",
  },
  {
    type: "XP",
    amount: "5000XP",
    day: 2,
    claimed: true,
    icon: "/images/xp.png",
  },
  {
    type: "STAR",
    amount: "150 STAR",
    day: 3,
    claimed: true,
    icon: "/images/stars.png",
  },
  {
    type: "XP",
    amount: "800XP",
    day: 4,
    claimed: true,
    icon: "/images/xp.png",
  },
  {
    type: "STAR",
    amount: "300 STAR",
    day: 5,
    claimed: false,
    icon: "/images/stars.png",
  },
  {
    type: "STAR",
    amount: "500 STAR",
    day: 6,
    claimed: false,
    icon: "/images/stars.png",
  },
]

const formatTimeRemaining = (
  timestamp: string | number,
  frequency: "daily" | "weekly"
): string => {
  if (!timestamp) return "Time remaining"

  let targetTime: Date

  if (typeof timestamp === "string") {
    targetTime = new Date(timestamp)
  } else {
    // If timestamp is a number (seconds since epoch)
    targetTime = new Date(timestamp * 1000)
  }

  const now = new Date()
  let diffInSeconds = Math.floor((targetTime.getTime() - now.getTime()) / 1000)

  // Don't go below zero
  diffInSeconds = Math.max(0, diffInSeconds)

  // Calculate time units
  const days = Math.floor(diffInSeconds / (3600 * 24))
  const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((diffInSeconds % 3600) / 60)

  // Format based on time remaining
  if (days > 0) {
    return days === 1 ? "1 day left" : `${days} days left`
  } else if (hours > 0) {
    return `${hours}h left`
  } else if (minutes > 0) {
    return minutes === 1 ? "1 min left" : `${minutes} mins left`
  } else {
    return "Less than 1 min"
  }
}

// Format time from seconds to HH:MM:SS
const formatTime = (timestamp: string | number): string => {
  if (!timestamp) return "00:00:00"

  let targetTime: Date

  if (typeof timestamp === "string") {
    targetTime = new Date(timestamp)
  } else {
    // If timestamp is a number (seconds since epoch)
    targetTime = new Date(timestamp * 1000)
  }

  const now = new Date()
  let diffInSeconds = Math.floor((targetTime.getTime() - now.getTime()) / 1000)

  // Don't go below zero
  diffInSeconds = Math.max(0, diffInSeconds)

  const hours = Math.floor(diffInSeconds / 3600)
  const minutes = Math.floor((diffInSeconds % 3600) / 60)
  const seconds = diffInSeconds % 60

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

// Format weekly reset time to show days remaining when > 1 day
const formatWeeklyTime = (timestamp: string | number): string => {
  if (!timestamp) return "00:00:00"

  let targetTime: Date

  if (typeof timestamp === "string") {
    targetTime = new Date(timestamp)
  } else {
    // If timestamp is a number (seconds since epoch)
    targetTime = new Date(timestamp * 1000)
  }

  const now = new Date()
  let diffInSeconds = Math.floor((targetTime.getTime() - now.getTime()) / 1000)

  // Don't go below zero
  diffInSeconds = Math.max(0, diffInSeconds)

  // Calculate days
  const days = Math.floor(diffInSeconds / (3600 * 24))

  // If less than 1 day, use the regular format time
  if (days < 1) {
    return formatTime(timestamp)
  }

  // Return days format
  return days === 1 ? "1 day" : `${days} days`
}

const QuestsPage = () => {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("weekly")
  const [timer, setTimer] = useState("")
  const [quests, setQuests] = useState<Quest[]>([])
  const [dailyResetTime, setDailyResetTime] = useState<number>(0)
  const [weeklyResetTime, setWeeklyResetTime] = useState<number>(0)
  const [claimQuestId, setClaimQuestId] = useState<number>(0)
  const { fetchUserProfile } = useProfile()
  const {
    data: rewards,
    loading,
    claimRewards,
    fetchDailyRewards,
  } = useDailyRewards()
  // Filter quests based on active tab
  const filteredQuests = quests.filter((quest) => quest.frequency === activeTab)
  const router = useRouter()

  useEffect(() => {
    fetchDailyRewards()
  }, [])

  // Fallback to mock data if no quests from API
  const currentQuests =
    filteredQuests.length > 0
      ? filteredQuests
      : activeTab === "daily"
        ? DAILY_QUESTS
        : WEEKLY_QUESTS

  // Calculate progress percentage based on claimed rewards
  const claimedCount = REWARDS.filter((reward) => reward.claimed).length
  const progressPercentage = (claimedCount / REWARDS.length) * 100

  useEffect(() => {
    getQuestList().then((res) => {
      if (res.data.quests) {
        setQuests(res.data.quests)
      }
      if (res.data.dailyResetTime) {
        setDailyResetTime(res.data.dailyResetTime)
      }
      if (res.data.weeklyResetTime) {
        setWeeklyResetTime(res.data.weeklyResetTime)
      }
    })
  }, [])

  // Update timer every second
  useEffect(() => {
    const resetTime = activeTab === "daily" ? dailyResetTime : weeklyResetTime
    if (!resetTime) return

    // Set initial timer value
    const updateTimer = () => {
      if (activeTab === "daily") {
        setTimer(formatTime(resetTime))
      } else {
        setTimer(formatWeeklyTime(resetTime))
      }
    }

    // Initial update
    updateTimer()

    // Update timer every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [activeTab, dailyResetTime, weeklyResetTime])

  const handleClaimQuest = (questId: number) => {
    setClaimQuestId(questId)
    claimQuest(questId).then((res) => {
      if (res.data.success) {
        toast.success("Quest claimed successfully")
        fetchUserProfile()

        setClaimQuestId(0)
        currentQuests.map((quest) => {
          if (quest.id === questId) {
            quest.isClaimed = true
          }
        })
      }
    })
  }

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

  const redirectTo = (type: Quest["type"]) => {
    let link = ""
    switch (type) {
      case "login":
        link = "/login"
        break
      case "raid":
        link = "/raids"
        break
      case "buy":
        link = "/store"
        break
      case "message":
        link = "/friends"
        break
      case "wheel":
        link = "/wheel"
        break
    }

    router.push(link)
  }

  const isClaimed = (reward: DailyReward) => {
    return rewards?.claimedDailyRewards.some((r) => r.id === reward.id)
  }

  const showGoButton = (quest: Quest) => {
    const types = ["login", "buy"]

    return types.includes(quest.type)
      ? quest.currentProgress !== undefined &&
          quest.requiredNumber !== undefined &&
          Number(quest.currentProgress) >= Number(quest.requiredNumber)
      : true
  }

  return (
    <div className="w-full h-full rounded-xl backdrop-blur-xl border border-white/10 p-3 flex flex-col gap-3">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("daily")}
          className={cn(
            "flex items-center gap-3 min-w-32 px-4 py-3 rounded-lg cursor-pointer border border-white/10 transition-all duration-200 font-inter justify-between",
            activeTab === "daily" ? "bg-white/20" : "bg-white/5"
          )}
        >
          Daily
          <MessageSquare className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTab("weekly")}
          className={cn(
            "flex items-center gap-3 min-w-32 px-4 py-3 rounded-lg cursor-pointer border border-white/10 transition-all duration-200 font-inter justify-between",
            activeTab === "weekly" ? "bg-white/20" : "bg-white/5"
          )}
        >
          Weekly
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Points Section */}
      <div className="bg-white/5 rounded-lg p-3 flex gap-4 flex-col lg:flex-row">
        {/* Left side - Title and Timer */}
        <div className="flex flex-col gap-1 bg-white/5 rounded-lg p-3  items-center justify-center text-center h-full px-32">
          <h2 className="text-2xl font-semibold text-white">
            {activeTab === "daily" ? "Daily Points" : "Weekly Points"}
          </h2>
          <p className="text-sm text-[#8E9297]">
            New Quests in{" "}
            <span className="text-white font-medium tracking-wider min-w-[4.5rem] inline-block">
              {timer}
            </span>
          </p>
        </div>

        {/* Right side - Progress Bar and Rewards */}
        <div className="flex-1 bg-white/5 rounded-lg p-3">
          {/* Reward Points */}
          <div className="flex justify-between mt-4">
            {rewards?.dailyRewards &&
              rewards?.dailyRewards.map((reward, index) => (
                <div key={index} className="flex flex-col  gap-2">
                  {/* Reward Box */}
                  <div className="relative flex items-center gap-3 rounded-xl lg:min-w-[120px]">
                    {/* Icon Container */}
                    <div className="relative max-lg:hidden">
                      <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center p-1.5">
                        <Image
                          src={getRewardImage(reward) || ""}
                          alt={reward.type}
                          width={32}
                          height={32}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col">
                      <span className="text-[11px] text-white">
                        Day {reward.id}
                      </span>
                      <span className="text-sm text-white font-medium">
                        {reward.amount}
                      </span>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="ml-4">
                    <div
                      className={cn(
                        "size-2.5 rounded-full border-2  border-white/10",
                        isClaimed(reward) ? "bg-[#EA66FF]" : "bg-white/10"
                      )}
                    />
                  </div>
                </div>
              ))}
          </div>

          {/* Progress Bar */}
          <div className="relative h-1.5 bg-white/10 rounded-full mt-4">
            <div
              className="absolute left-0 top-0 h-full bg-[#EA66FF] rounded-full"
              style={{
                width: rewards?.dailyRewards?.length
                  ? `${(rewards?.dailyStreak / rewards.dailyRewards.length) * 100}%`
                  : "0%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Quests List */}
      <div className="flex-1 overflow-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {currentQuests.map((quest) => (
          <div
            key={quest.id}
            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src={quest.icon || "/images/cat.jpeg"}
                alt={quest.title || quest.description || "Quest"}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-white">{quest.title || quest.description}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/50">
                  {formatTimeRemaining(
                    activeTab == "daily" ? dailyResetTime : weeklyResetTime,
                    activeTab
                  )}
                </span>
                {(quest.progress ||
                  (quest.currentProgress !== undefined &&
                    quest.requiredNumber)) && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="text-sm text-white/50">
                      {quest.progress ||
                        `${quest.currentProgress}/${quest.requiredNumber}`}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded bg-white/5 border border-white/10 flex justify-center p-1.5 items-center gap-1">
                <Image
                  src="/images/stars.png"
                  alt="stars"
                  width={26}
                  height={26}
                />
                <span className="text-sm text-white font-medium">
                  {quest?.rewards?.stars}
                </span>
              </div>
              {showGoButton(quest) && (
                <button
                  className={cn(
                    "h-12 w-20 flex justify-center items-center rounded-lg",
                    quest.isCompleted
                      ? "bg-[#62B67C] text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                  onClick={() => {
                    if (quest.isCompleted && !quest.isClaimed) {
                      handleClaimQuest(quest.id)
                    } else {
                      redirectTo(quest.type)
                    }
                  }}
                  disabled={
                    quest.isClaimed ||
                    claimQuestId === quest.id ||
                    !!claimQuestId
                  }
                >
                  {quest.isClaimed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : claimQuestId === quest.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : quest.isCompleted ? (
                    "Claim"
                  ) : (
                    "Go"
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestsPage
