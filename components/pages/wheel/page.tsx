import { useState } from "react"
import { Calendar, Check, Grid2X2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"
import { GradientBorder } from "@/components/ui/gradient-border"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import Wheel from "./Wheel"

interface WheelPageProps {
  isSpinning?: boolean
  wheelItems?: { name: string; color: string }[]
  userCanSpin: boolean
  spinHistory: string[]
  handleSpinComplete: (item: { color: string; name: string }) => void
  setIsError: (isError: boolean) => void
}

const WheelPage = ({
  isSpinning: parentIsSpinning,
  wheelItems,
  userCanSpin,
  spinHistory,
  handleSpinComplete,
  setIsError,
}: WheelPageProps) => {
  const [openPopover, setOpenPopover] = useState<"calendar" | "items" | null>(
    null
  )
  // const [spinHistory, setSpinHistory] = useState<string[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastWonItem, setLastWonItem] = useState<{
    color: string
    name: string
  } | null>(null)

  const getCalendarData = () => {
    // Use UTC methods to avoid timezone issues
    const now = new Date()
    const currentMonth = now.getUTCMonth()
    const currentYear = now.getUTCFullYear()

    // Get first day and total days in month using UTC
    const firstDay = new Date(Date.UTC(currentYear, currentMonth, 1))
    const lastDay = new Date(Date.UTC(currentYear, currentMonth + 1, 0))
    const totalDays = lastDay.getUTCDate()

    // Create calendar grid
    const weeks: boolean[][] = []
    let currentWeek: boolean[] = []

    // Fill in empty days before first day of month
    const firstDayOfWeek = firstDay.getUTCDay()
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(false)
    }

    // Fill in days of month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(Date.UTC(currentYear, currentMonth, day))

      // Check if user spun on this day
      const dateString = date.toISOString().split("T")[0]
      const hasSpun = spinHistory.some(
        (spin) => spin.split("T")[0] === dateString
      )

      currentWeek.push(hasSpun)

      // Create new week after every 7 days
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek])
        currentWeek = []
      }
    }

    // Add remaining week if not empty and fill with false if needed
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(false)
      }
      weeks.push(currentWeek)
    }

    return weeks
  }

  // useEffect(() => {
  //   const fetchSpinHistory = async () => {
  //     const response = await getSpinHistory()
  //     setSpinHistory(response.data?.spinTimes ?? [])
  //   }
  //   fetchSpinHistory()
  // }, [])

  const handleSpin = async () => {
    if (!userCanSpin || isSpinning) return
    setIsSpinning(true)
  }

  // const handleSpinComplete = (item: { color: string; name: string }) => {
  //   // Add current date to spin history
  //   setSpinHistory([...spinHistory, new Date().toISOString()])
  //   setLastWonItem(item)
  //   setIsSpinning(false)
  // }

  const spinStatus = getCalendarData()
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  })

  const getDateForPositionOld = (weekIndex: number, dayIndex: number) => {
    const now = new Date()

    console.log("now", now)
    // Use UTC methods to avoid timezone issues
    const currentMonth = now.getUTCMonth()
    const currentYear = now.getUTCFullYear()

    // Get first day of month in UTC
    const firstDay = new Date(Date.UTC(currentYear, currentMonth, 1))

    // Calculate the day offset based on the first day of the month
    const firstDayOfWeek = firstDay.getUTCDay()

    // Calculate the actual day number in the month
    const dayNumber = weekIndex * 7 + dayIndex - firstDayOfWeek + 1

    // Create a new date object for this position using UTC
    const date = new Date(Date.UTC(currentYear, currentMonth, dayNumber))

    // Only return a formatted date if it's a valid day in the current month
    if (
      dayNumber > 0 &&
      dayNumber <=
        new Date(Date.UTC(currentYear, currentMonth + 1, 0)).getUTCDate()
    ) {
      // Format the date using UTC values
      return `${date.getUTCDate()} ${date.toLocaleString("en-US", { month: "long", timeZone: "UTC" })}, ${date.getUTCFullYear()}`
    }

    // For days outside the current month
    return ""
  }

  const getDateForPosition = (weekIndex: number, dayIndex: number) => {
    const now = new Date()

    console.log("now", now)
    // Use UTC methods to avoid timezone issues
    const currentMonth = now.getUTCMonth()
    const currentYear = now.getUTCFullYear()

    // Get first day of month in UTC
    const firstDay = new Date(Date.UTC(currentYear, currentMonth, 1))

    // Calculate the day offset based on the first day of the month
    const firstDayOfWeek = firstDay.getUTCDay()

    // Calculate the actual day number in the month
    const dayNumber = weekIndex * 7 + dayIndex - firstDayOfWeek + 1

    // Create a new date object for this position using UTC
    const date = new Date(Date.UTC(currentYear, currentMonth, dayNumber))

    // Only return a formatted date if it's a valid day in the current month
    if (
      dayNumber > 0 &&
      dayNumber <=
        new Date(Date.UTC(currentYear, currentMonth + 1, 0)).getUTCDate()
    ) {
      // Count total spins for this date
      const dateString = date.toISOString().split("T")[0]
      const totalSpins = spinHistory.filter(
        (spin) => spin.split("T")[0] === dateString
      ).length

      // Format the date using UTC values with total spins count
      return `${date.getUTCDate()} ${date.toLocaleString("en-US", { month: "long", timeZone: "UTC" })}${totalSpins > 0 ? ` - Total spins: ${totalSpins}` : ""}`
    }

    // For days outside the current month
    return ""
  }

  console.log("spinStatus", spinStatus)

  return (
    <div className="w-full h-full flex flex-col">
      {/* Desktop Version */}

      <div className="justify-end flex-1 hidden lg:flex h-full">
        <div className="group min-w-[300px] flex flex-col h-full">
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl group border border-white/10 shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-inter">Spin Calendar</h1>
              <span className="text-sm">{currentMonthName}</span>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1">
              <TooltipProvider>
                {spinStatus.map((week, weekIndex) =>
                  week.map((claimed, dayIndex) => {
                    const dateString = getDateForPosition(weekIndex, dayIndex)

                    return (
                      <Tooltip key={`${weekIndex}-${dayIndex}`}>
                        <TooltipTrigger asChild>
                          <div>
                            <GradientBorder isSelected={claimed}>
                              <div
                                className={cn(
                                  "size-10 flex items-center justify-center rounded transition-all bg-white/5"
                                )}
                              >
                                {claimed ? (
                                  <Check className="w-4 h-4 text-white" />
                                ) : (
                                  <X className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </GradientBorder>
                          </div>
                        </TooltipTrigger>
                        {dateString && (
                          <TooltipContent>{dateString}</TooltipContent>
                        )}
                      </Tooltip>
                    )
                  })
                )}
              </TooltipProvider>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl group border border-white/10 flex-1 mt-10 min-h-0 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="flex flex-col gap-2 pr-4">
                {wheelItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-white flex-1">{item.name}</span>
                    {/* {item.isNew && (
                      <span className="text-2xs font-inter bg-white/10 px-2 py-0.5 rounded-lg">
                        New
                      </span>
                    )} */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-full flex flex-col bg-white/5 p-4 rounded-2xl group border border-white/10 bg-bottom bg-no-repeat bg-[url('/images/wheel/wheel-bg.png')] lg:hidden flex-1 ">
        {/* Mobile Version */}
        <Wheel
          isSpinning={isSpinning}
          onSpinComplete={handleSpinComplete}
          items={wheelItems}
          setIsError={setIsError}
        />
        {/* Bottom Controls */}
        <div className="flex items-center gap-4 justify-center mt-auto">
          <BrandButton
            blurColor="bg-[#F49696]"
            className="px-14"
            onClick={handleSpin}
            disabled={!userCanSpin || isSpinning}
          >
            {isSpinning ? "Spinning..." : "Spin"}
          </BrandButton>
          <div className="flex gap-2 lg:hidden">
            <Popover
              open={openPopover === "calendar"}
              onOpenChange={(open) => setOpenPopover(open ? "calendar" : null)}
            >
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "size-14 rounded-xl border border-white/10 flex items-center justify-center",
                    openPopover === "calendar" ? "bg-white/20" : "bg-white/5"
                  )}
                >
                  <Calendar className="w-5 h-5 text-white" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[320px] p-4 bg-white/5 backdrop-blur-lg border-white/10 rounded-2xl"
                align="center"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-sm font-inter">Spin Calendar</h1>
                  <span className="text-sm">{currentMonthName}</span>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {spinStatus.map((week, weekIndex) =>
                    week.map((claimed, dayIndex) => (
                      <GradientBorder
                        key={`${weekIndex}-${dayIndex}`}
                        isSelected={claimed}
                      >
                        <div
                          className={cn(
                            "size-8 flex items-center justify-center rounded transition-all bg-white/5"
                          )}
                        >
                          {claimed ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : (
                            <X className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </GradientBorder>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover
              open={openPopover === "items"}
              onOpenChange={(open) => setOpenPopover(open ? "items" : null)}
            >
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "size-14 rounded-xl border border-white/10 flex items-center justify-center",
                    openPopover === "items" ? "bg-white/20" : "bg-white/5"
                  )}
                >
                  <Grid2X2 className="w-5 h-5 text-white" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[320px] p-4 bg-white/5 backdrop-blur-lg border-white/10 rounded-2xl"
                align="center"
              >
                <ScrollArea className="h-[320px]">
                  <div className="flex flex-col gap-2">
                    {wheelItems?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <div
                          className="w-8 h-8 rounded-lg"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white flex-1">{item.name}</span>
                        {/* {item.isNew && (
                          <span className="text-2xs font-inter bg-white/10 px-2 py-0.5 rounded-lg">
                            New
                          </span>
                        )} */}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WheelPage
