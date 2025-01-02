import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatBalance = (num?: number, decimals: number = 2): string => {
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
