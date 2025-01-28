import { Raid, RaidHistoryResponse } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (num?: number, decimals: number = 2): string => {
  if (num === null || num === undefined || num === 0 || isNaN(num)) {
    return "0"
  }
  const absNum = Math.abs(num)
  let formattedNum: string
  let suffix = ""

  if (absNum >= 1e12) {
    formattedNum = (num / 1e12).toFixed(decimals)
    suffix = "T"
  } else if (absNum >= 1e9) {
    formattedNum = (num / 1e9).toFixed(decimals)
    suffix = "B"
  } else if (absNum >= 1e6) {
    formattedNum = (num / 1e6).toFixed(decimals)
    suffix = "M"
  } else if (absNum >= 1e3) {
    formattedNum = (num / 1e3).toFixed(decimals)
    suffix = "K"
  } else {
    let adjustedDecimals = decimals
    while (
      adjustedDecimals < 20 &&
      parseFloat(absNum.toFixed(adjustedDecimals)) === 0
    ) {
      adjustedDecimals++
    }
    formattedNum = absNum.toFixed(adjustedDecimals)
  }

  formattedNum = formattedNum.replace(/\.?0+$/, "")

  const sign = num < 0 ? "-" : ""

  return sign + formattedNum + suffix
}

export const formateWalletAddress = (address: string, lastLength?: number) => {
  return `${address.slice(0, 6)}...${address.slice(
    lastLength ? -lastLength : -4
  )}`
}

export const trimString = (str: string, length: number) => {
  return str.length > length ? `${str.slice(0, length)}...` : str
}

export const isRaidLaunched = (
  raid: Raid,
  histories?: RaidHistoryResponse[] | null
) => {
  if (!histories) return false
  const history = histories.find((h) => h.raidId === raid.id && h.inProgress)
  return history?.inProgress
}

export const calculateLaunchedRaidRemainingTime = (
  history?: RaidHistoryResponse | null,
  raid?: Raid | null
) => {
  if (!history || !raid || !history.inProgress) return null
  const createdAt = new Date(history.createdAt)
  const raidDuration = raid.duration
  const raidEndTime = new Date(createdAt.getTime() + raidDuration * 1000)
  const now = new Date()
  const remainingTime = raidEndTime.getTime() - now.getTime()
  return remainingTime
}

export const getActiveHistoryByRaidId = (
  histories: RaidHistoryResponse[] | null,
  raidId: number
) => {
  if (!histories) return null
  return histories.find((h) => h.raidId === raidId && h.inProgress)
}

export const formatRemainingTime = (remainingTime: number) => {
  if (remainingTime <= 0) {
    return {
      hours: { value: "00", text: "h" },
      minutes: { value: "00", text: "m" },
      seconds: { value: "00", text: "s" },
    }
  }

  const timeUnits = [
    { unit: "hours", divisor: 1000 * 60 * 60, text: "h" },
    { unit: "minutes", divisor: 1000 * 60, text: "m" },
    { unit: "seconds", divisor: 1000, text: "s" },
  ]

  const result = timeUnits.reduce(
    (acc, { unit, divisor, text }) => {
      const numValue =
        unit === "hours"
          ? Math.floor(remainingTime / divisor)
          : Math.floor(
              (remainingTime %
                timeUnits[timeUnits.findIndex((t) => t.unit === unit) - 1]
                  .divisor) /
                divisor
            )

      // Pad with zeros to ensure two digits
      const value = numValue.toString().padStart(2, "0")

      return { ...acc, [unit]: { value, text } }
    },
    {} as Record<string, { value: string; text: string }>
  )

  return result as {
    hours: { value: string; text: string }
    minutes: { value: string; text: string }
    seconds: { value: string; text: string }
  }
}

export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = duration % 60
  const result = []
  if (hours > 0) result.push(`${hours}h`)
  if (minutes > 0) result.push(`${minutes}m`)
  if (seconds > 0) result.push(`${seconds}s`)
  return result.join(" ")
}

export const calculateRaidProgress = (
  remainingTime: number,
  totalDuration: number
): number => {
  if (remainingTime <= 0) return 100
  if (totalDuration <= 0) return 0

  const elapsed = totalDuration - remainingTime / 1000
  const progress = (elapsed / totalDuration) * 100
  return Math.min(Math.max(progress, 0), 100) // Ensure value is between 0 and 100
}

// Fetch token price from Birdeye API
export async function getTokenPrice(): Promise<number> {
  try {
    const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS

    const response = await fetch(
      `https://api.geckoterminal.com/api/v2/simple/networks/arbitrum/token_price/${TOKEN_ADDRESS}`
    )

    const res = await response.json()
    // {
    //   data: {
    //     id: "e5aca29d-487d-42ad-a70e-00b6b91dfc8c",
    //     type: "simple_token_price",
    //     attributes: {
    //       token_prices: {
    //         "0x888aaa48ebea87c74f690189e947d2c679705972":
    //           "0.0340259571206654",
    //       },
    //     },
    //   },
    // }
    if (
      res.data &&
      res.data.attributes &&
      res.data.attributes.token_prices &&
      TOKEN_ADDRESS
    ) {
      return Number(res.data.attributes.token_prices[TOKEN_ADDRESS])
    }

    console.error("Invalid response from Birdeye API:", res)
    return 0
  } catch (error) {
    console.error("Error fetching token price from Birdeye:", error)
    return 0
  }
}

// Calculate jackpot amount
export function calculateJackpot(tokenPrice: number): number {
  const MULTIPLIER = 1_000_000
  return tokenPrice * MULTIPLIER
}
