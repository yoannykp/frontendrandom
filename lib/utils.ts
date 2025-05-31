import { Raid, RaidHistoryResponse } from "@/types"
import { ConnectedWallet } from "@privy-io/react-auth"
import { clsx, type ClassValue } from "clsx"
import { ethers } from "ethers"
import toast from "react-hot-toast"
import { twMerge } from "tailwind-merge"
import * as chains from "viem/chains"

declare global {
  interface Window {
    __cacheBusterTimestamp?: number
  }
}

export function getChain(chainId: number) {
  for (const chain of Object.values(chains)) {
    if ("id" in chain) {
      if (chain.id === chainId) {
        return chain
      }
    }
  }
  return chains.arbitrum
}

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
  const history = histories.find((h) => {
    return h.raidId === raid.id && h.inProgress
  })

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

// a utility funtion to sanitize input value on change allow space and special characters
export const sanitizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  return e.target.value.replace(/[^a-zA-Z0-9\s]/g, "")
}

// Add this ERC20 ABI for token balance checking
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
]

export async function getZoneBalance(
  provider: ethers.Provider | null,
  address: string
): Promise<number> {
  try {
    if (!provider) return 0

    const tokenAddress = "0x888aaa48ebea87c74f690189e947d2c679705972"
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)

    const [balance, decimals] = await Promise.all([
      contract.balanceOf(address),
      contract.decimals(),
    ])
    return Number(ethers.formatUnits(balance, decimals))
  } catch (error) {
    console.error("Error fetching ZONE balance:", error)
    return 0
  }
}

export const handleSignMessage = async (
  message: string,
  wallet: ConnectedWallet,
  signMessage: any
): Promise<string | null> => {
  let sign = ""

  if (wallet.connectorType === "embedded") {
    const response = await signMessage({
      message,
    })
    sign = response.signature
  } else {
    const provider = await wallet.getEthereumProvider()
    if (!provider) {
      toast.error("Please connect a wallet")
      return null
    }

    const ethersProvider = new ethers.BrowserProvider(provider)
    const signer = await ethersProvider.getSigner()

    const response = await signer.signMessage(message)
    sign = response
  }

  if (!sign) {
    toast.error("Please connect a wallet")
    return null
  }

  return sign
}

export const getEthWallet = (wallets: ConnectedWallet[]) => {
  console.log("wallets ===>", wallets)

  const wallet = wallets.find((wallet) => wallet.connectorType !== "embedded")
  if (wallet) {
    return wallet
  }
  return null
}

export const getUserWallet = (
  wallets: ConnectedWallet[],
  walletAddress: string
) => {
  const wallet = wallets.find((w) => w.address === walletAddress)
  if (wallet) {
    return wallet
  }
  return null
}

/**
 * Checks if a wallet is an external wallet (MetaMask, Rainbow, Coinbase Wallet, etc.)
 * @param wallet The wallet object to check
 * @param supportedWallets List of supported external wallet names (lowercase)
 * @returns Boolean indicating if the wallet is an external wallet
 */
// export const isExternalWallet = (
//   wallet: any,
//   supportedWallets: string[] = [
//     "metamask",
//     "rainbow",
//     "coinbase_wallet",
//     "phantom",
//   ]
// ): boolean => {
//   // Check if wallet has the expected structure
//   if (!wallet || typeof wallet !== "object") return false

//   // Check if it's an Ethereum wallet
//   if (wallet.type !== "ethereum") return false

//   // Check if it has meta information
//   if (!wallet.meta || !wallet.meta.name) return false

//   // Check if the wallet is from an external connector
//   if (
//     wallet.connectorType === "injected" ||
//     wallet.connectorType === "walletconnect"
//   ) {
//     // Check if the wallet name matches any in our supported list
//     const walletName = wallet.meta.name.toLowerCase()
//     return supportedWallets.some((name) => walletName.includes(name))
//   }

//   // Check wallet client type as fallback
//   if (wallet.walletClientType) {
//     const clientType = wallet.walletClientType.toLowerCase()
//     return supportedWallets.some((name) => clientType.includes(name))
//   }

//   return false
// }

/**
 * Adds a cache-busting query parameter to an image URL to prevent browser caching
 * Uses a stable timestamp for the current page session to prevent flickering
 * @param url The image URL to add the cache buster to
 * @returns The URL with a cache busting parameter added
 */
export function addCacheBuster(url: string | undefined | null): string {
  if (!url) return ""

  // Use a window-level variable to store the session timestamp
  // This ensures the timestamp stays consistent during the current page session
  if (typeof window !== "undefined") {
    if (!window.__cacheBusterTimestamp) {
      window.__cacheBusterTimestamp = Date.now()
    }

    // If the URL already has a query parameter, append the cache buster with &
    // Otherwise, add it with ?
    const separator = url.includes("?") ? "&" : "?"
    return `${url}${separator}v=${window.__cacheBusterTimestamp}`
  }

  // Fallback for server-side rendering
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}v=${Date.now()}`
}

// Cache for preloaded background images to prevent flickering
const backgroundImageCache: Record<string, string> = {}

/**
 * Specialized version of addCacheBuster for background images that prevents flickering
 * This function preloads the image and maintains a cache to ensure smooth background rendering
 * @param url The background image URL
 * @returns A cached URL with cache busting parameter
 */
export function getBackgroundImageUrl(url: string | undefined | null): string {
  if (!url) return ""

  // If we're on the server, just return a cache-busted URL
  if (typeof window === "undefined") {
    const separator = url.includes("?") ? "&" : "?"
    return `${url}${separator}v=${Date.now()}`
  }

  // Use the original URL as the cache key
  const cacheKey = url

  // If we already have this URL in the cache, return the cached version
  if (backgroundImageCache[cacheKey]) {
    return backgroundImageCache[cacheKey]
  }

  // Add cache buster
  const separator = url.includes("?") ? "&" : "?"
  const cacheBustedUrl = `${url}${separator}v=${window.__cacheBusterTimestamp || Date.now()}`

  // Store in cache
  backgroundImageCache[cacheKey] = cacheBustedUrl

  // Preload the image to prevent flickering
  if (typeof Image !== "undefined") {
    const img = new Image()
    img.src = cacheBustedUrl
  }

  return cacheBustedUrl
}
