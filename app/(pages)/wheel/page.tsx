"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useAliens } from "@/store/hooks"

import { canSpin, getSpinHistory, getWheelItems } from "@/lib/api"
import { cn } from "@/lib/utils"
import useSpinSound from "@/hooks/use-spin-sound"
import BrandButton from "@/components/ui/brand-button"
import IconButton from "@/components/ui/icon-button"
import ChatBox from "@/components/common/chat-box"
import { Loader } from "@/components/common/loader"
import RightSidebar from "@/components/common/right-sidebar"
import TopBar from "@/components/common/top-bar"
import { MenuIcon } from "@/components/icons"
import AlienzoneIcon from "@/components/icons/alienzone"
import WheelPage from "@/components/pages/wheel/page"
import Wheel from "@/components/pages/wheel/Wheel"

const colors = [
  "#FF8A00", // Stars
  "#FFD600", // Bronze Cut
  "#FF69B4", // Silver Knife
  "#FF99CC", // Golden Shears
  "#FF4444", // Uncommon Rune
  "#7FFF00", // Common Rune
  "#00BFFF", // Rare Rune
  "#4169E1", // Epic Rune
  // "#FF0000", // Legendary Rune
  // Additional colors if needed
  // "#9400D3",
  // "#00FF7F",
  // "#FF1493",
  // "#1E90FF",
  // "#FFB6C1",
  // "#32CD32",
  // "#FF6347",
  // "#8A2BE2",
  // "#20B2AA",
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

const Page = () => {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelItems, setWheelItems] = useState<
    {
      name: string
      color: string
    }[]
  >([])
  const [userCanSpin, setUserCanSpin] = useState(false)
  const [spinStatus, setSpinStatus] = useState<{
    canSpin: boolean
    secondsUntilNextSpin: number
  } | null>(null)
  const [spinHistory, setSpinHistory] = useState<string[]>([])
  const [isError, setIsError] = useState(false)
  const [winningItem, setWinningItem] = useState<{
    color: string
    name: string
  } | null>(null)
  const { alien } = useAliens()
  // Add new state for countdown
  const [nextSpinTime, setNextSpinTime] = useState<number>(0)
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [hasWonReward, setHasWonReward] = useState(false)
  const [play, { stop }] = useSpinSound("/sounds/spin.mp3", 0.5, 5000)

  useEffect(() => {
    fetchCanSpin()
    fetchWheelItems()
    fetchSpinHistory()
  }, [])

  // Remove the old sound effect
  useEffect(() => {
    if (!userCanSpin) {
      // Use the secondsUntilNextSpin from the API response
      let secondsRemaining = spinStatus?.secondsUntilNextSpin || 0

      const updateTimer = () => {
        if (secondsRemaining <= 0) {
          // Time's up, reset states and refresh spin status
          setTimeRemaining("")
          setHasWonReward(false)
          fetchCanSpin()
          return
        }

        // Format time as HH:MM:SS
        const hours = Math.floor(secondsRemaining / 3600)
        const minutes = Math.floor((secondsRemaining % 3600) / 60)
        const seconds = secondsRemaining % 60

        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        )

        secondsRemaining--
      }

      // Initial update
      updateTimer()

      // Update timer every second
      const interval = setInterval(updateTimer, 1000)

      // Clean up interval on component unmount
      return () => clearInterval(interval)
    } else {
      // Reset states when user can spin
      setTimeRemaining("")
      setHasWonReward(false)
    }
  }, [userCanSpin, spinStatus])

  // Add new useEffect for countdown timer
  // useEffect(() => {
  //   if (!userCanSpin) {
  //     // Calculate next day's start time (midnight)
  //     const updateTimer = () => {
  //       const now = new Date()
  //       const tomorrow = new Date(now)
  //       tomorrow.setDate(tomorrow.getDate() + 1)
  //       tomorrow.setHours(0, 0, 0, 0)

  //       const nextSpinTimestamp = Math.floor(tomorrow.getTime() / 1000)
  //       const currentTimestamp = Math.floor(now.getTime() / 1000)
  //       const secondsRemaining = nextSpinTimestamp - currentTimestamp

  //       // Format time as HH:MM:SS
  //       const hours = Math.floor(secondsRemaining / 3600)
  //       const minutes = Math.floor((secondsRemaining % 3600) / 60)
  //       const seconds = secondsRemaining % 60

  //       setTimeRemaining(
  //         `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  //       )
  //     }

  //     // Initial update
  //     updateTimer()

  //     // Update timer every second
  //     const interval = setInterval(updateTimer, 1000)

  //     // Clean up interval on component unmount
  //     return () => clearInterval(interval)
  //   }
  // }, [userCanSpin])

  const fetchCanSpin = async () => {
    const response = await canSpin()
    setUserCanSpin(response.data?.canSpin || false)
    setSpinStatus(response.data)
  }

  const fetchWheelItems = async () => {
    getWheelItems().then((res) => {
      const items = res.data?.map((item, index) => ({
        ...item,
        color: colors[index % colors.length],
      }))
      setWheelItems(items || [])
    })
  }

  const fetchSpinHistory = async () => {
    const response = await getSpinHistory()
    setSpinHistory(response.data?.spinTimes ?? [])
  }

  const handleSpinComplete = (item: { color: string; name: string }) => {
    if (!isError) {
      setSpinHistory([...spinHistory, new Date().toISOString()])
    }
    stop() // Stop the sound when spinning completes
    setWinningItem(item)
    setIsSpinning(false)
    // Immediately update the state and fetch new data
    fetchCanSpin()
    fetchWheelItems()
  }

  const handleSpin = async () => {
    if (!userCanSpin || isSpinning) return
    setIsError(false)
    play() // This will now handle the entire sound animation
    setIsSpinning(true)
  }

  return (
    <Loader>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            Loading...
          </div>
        }
      >
        <div
          className={cn(
            " bg-black max-lg:py-4   relative flex flex-col h-screen"
          )}
        >
          <div className=" relative z-20 pb-2 lg:hidden">
            <div className=" flex justify-between items-center  ">
              <div className="flex gap-2 items-center">
                <Link
                  href="/"
                  className="border border-gray-light rounded-normal cursor-pointer backdrop-blur-[40px] flex justify-center items-center size-14 "
                >
                  <AlienzoneIcon className="size-6" />
                </Link>
                <h1 className="text-white text-3xl ">Wheel</h1>
              </div>
              <IconButton
                onClick={() => setIsOpenMobileMenu(!isOpenMobileMenu)}
                showBase
                className="size-14"
              >
                <MenuIcon className="size-full" />
              </IconButton>
            </div>
            {isOpenMobileMenu && (
              <TopBar className="relative  top-auto right-auto lg:hidden items-center" />
            )}
          </div>
          <div className="relative flex-1 w-full overflow-hidden flex flex-col">
            <div className="relative z-10 h-full flex-1   flex flex-col overflow-auto">
              <RightSidebar className="absolute left-8 top-10 max-lg:hidden " />
              <ChatBox className="absolute left-8 bottom-10 max-lg:hidden" />
              <TopBar className="absolute right-8 top-10 max-lg:hidden " />
              <div className="absolute top-10 left-24  gap-3 z-20 hidden lg:flex h-14 items-center">
                <h1 className="text-white text-3xl ">Wheel</h1>
              </div>
              <div className="flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden lg:min-h-[calc(100vh-140px)] max-lg:hidden">
                <div className="absolute inset-0 bg-cover bg-bottom bg-no-repeat bg-[url('/images/wheel/background.svg')]">
                  <div
                    className={cn(
                      "absolute inset-0 bg-cover bg-bottom bg-no-repeat",
                      {
                        "bg-[url('/images/wheel/4.svg')]":
                          !userCanSpin &&
                          !isSpinning &&
                          spinHistory.filter(
                            (spin) =>
                              new Date(spin).toDateString() ===
                              new Date().toDateString()
                          ).length >= 3, // Daily limit reached (3 spins)
                        "bg-[url('/images/wheel/3.svg')]":
                          !userCanSpin &&
                          !isSpinning &&
                          spinHistory.filter(
                            (spin) =>
                              new Date(spin).toDateString() ===
                              new Date().toDateString()
                          ).length < 3, // Timer cooldown after spin
                        "bg-[url('/images/wheel/2.svg')]": isSpinning, // Spinning state
                        "bg-[url('/images/wheel/1.svg')]":
                          userCanSpin && !isSpinning, // Ready to spin
                      }
                    )}
                  />
                  <div
                    className="absolute inset-0 "
                    style={{
                      background:
                        "radial-gradient(91.36% 91.36% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
                    }}
                  ></div>

                  <Wheel
                    isSpinning={isSpinning}
                    onSpinComplete={handleSpinComplete}
                    items={wheelItems}
                    setIsError={setIsError}
                  />
                </div>

                <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-28 relative flex flex-col items-center justify-center gap-8  mx-auto ">
                  <WheelPage
                    wheelItems={wheelItems}
                    userCanSpin={userCanSpin}
                    spinHistory={spinHistory}
                    handleSpinComplete={handleSpinComplete}
                    setIsError={setIsError}
                    timeRemaining={timeRemaining}
                    hasWonReward={hasWonReward}
                    wheelSpinStatus={spinStatus}
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 max-lg:hidden">
                    <BrandButton
                      blurColor="bg-[#F49696]"
                      className="px-14"
                      onClick={handleSpin}
                      disabled={!userCanSpin || isSpinning || hasWonReward}
                    >
                      {isSpinning
                        ? "Spin in progress..."
                        : userCanSpin && !hasWonReward
                          ? "Spin"
                          : `Spin again in ${timeRemaining}`}
                    </BrandButton>
                  </div>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl  z-10  gap-3 lg:hidden flex-1">
                <WheelPage
                  wheelItems={wheelItems}
                  userCanSpin={userCanSpin}
                  spinHistory={spinHistory}
                  handleSpinComplete={handleSpinComplete}
                  setIsError={setIsError}
                  timeRemaining={timeRemaining}
                  hasWonReward={hasWonReward}
                  wheelSpinStatus={spinStatus}
                />
              </div>

              {/* Background Gradients */}
              <div
                className="fixed inset-0 "
                style={{
                  background:
                    "radial-gradient(91.36% 91.36% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
                }}
              ></div>
            </div>
          </div>
          <div className="z-10 relative mt-3 space-y-2 lg:hidden ">
            <RightSidebar />
          </div>
          <p className="text-center text-sm text-white/50 py-4 max-lg:hidden z-10 ">
            © {new Date().getFullYear()} Alienzone All rights reserved. Reach
            out to us at team@alienzone.io
          </p>
        </div>
      </Suspense>
    </Loader>
  )
}

export default Page
