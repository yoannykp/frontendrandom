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
  if (remainingTime <= 0) return "0s"
  const hours = Math.floor(remainingTime / (1000 * 60 * 60))
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000)

  let result = ""
  if (hours > 0) result += `${hours}h `
  if (minutes > 0) result += `${minutes}m `
  if (seconds > 0) result += `${seconds}s`
  return result.trim()
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
