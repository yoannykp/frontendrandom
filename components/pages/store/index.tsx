"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useWallet } from "@/context/wallet"
import { useProfile } from "@/store/hooks"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { ethers } from "ethers"
import { ArrowLeft, Check, Loader2, Lock, Star, TrendingUp } from "lucide-react"
import toast from "react-hot-toast"

import {
  getStoreWearables,
  getWearableDetails,
  getWearableActivity,
  unlockWithStars,
  getUserUnlockedWearables,
  progressBoughtQuest,
} from "@/lib/api"
import { cn } from "@/lib/utils"
import useClickSound from "@/hooks/use-click-sound"
import { Badge } from "@/components/ui/badge"
import BrandButton from "@/components/ui/brand-button"
import CONTRACT_ABI from "@/app/assets/wearablesContractAbi.json"
import ZONE_TOKEN_ABI from "@/app/assets/zoneTokenContractAbi.json"

// Category filter tabs
const storeTabs = [
  { label: "All", value: "all" },
  { label: "Hair", value: "hair" },
  { label: "Eyes", value: "eyes" },
  { label: "Mouth", value: "mouth" },
  { label: "Background", value: "background" },
  { label: "Outfits", value: "outfits" },
  { label: "Marks", value: "marks" },
  { label: "Powers", value: "powers" },
]

// Sort options
const sortOptions = [
  { label: "All", value: "all" },
  { label: "Trending", value: "trending" },
  { label: "Newest", value: "newest" },
]

// Rarity badge colors
const rarityColors: Record<string, string> = {
  COMMON: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  UNCOMMON: "bg-green-500/20 text-green-300 border-green-500/30",
  RARE: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  EPIC: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  LEGENDARY: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
}

// Stars prices for unlocking
const starsUnlockPrices: Record<string, number> = {
  UNCOMMON: 500,
  RARE: 1500,
  EPIC: 3000,
  LEGENDARY: 6000,
}

const StorePage = () => {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [activeSort, setActiveSort] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { wallets } = useWallets()
  const { provider, signer } = useWallet()
  const { data: profile } = useProfile()
  const [storeWearables, setStoreWearables] = useState<any[]>([])
  const [unlockedWearables, setUnlockedWearables] = useState<Set<string>>(new Set())
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState({
    buy: false,
    sell: false,
    unlock: false,
  })
  const [quantity, setQuantity] = useState("")
  const [itemActivity, setItemActivity] = useState<any[]>([])
  const [activityLoading, setActivityLoading] = useState(false)
  const playClickSound = useClickSound("/sounds/click.mp3")

  // Fetch store data on mount
  useEffect(() => {
    fetchStoreWearables()
    fetchUnlockedWearables()
  }, [])

  // Refetch when sort changes
  useEffect(() => {
    fetchStoreWearables()
  }, [activeSort])

  const fetchStoreWearables = async () => {
    try {
      setLoading(true)
      const response = await getStoreWearables({
        sort: activeSort as "all" | "trending" | "newest",
      })
      if (response.error) {
        toast.error(response.error.message || "Failed to fetch store wearables")
        return
      }
      setStoreWearables(response.data || [])
    } catch (error) {
      console.error("Error fetching store wearables:", error)
      toast.error("Failed to fetch store wearables")
    } finally {
      setLoading(false)
    }
  }

  const fetchUnlockedWearables = async () => {
    try {
      const response = await getUserUnlockedWearables()
      if (response.data) {
        setUnlockedWearables(new Set(response.data))
      }
    } catch (error) {
      console.error("Error fetching unlocked wearables:", error)
    }
  }

  // Filter items by category tab
  useEffect(() => {
    if (!storeWearables) {
      setFilteredItems([])
      return
    }

    if (activeTab === "all") {
      setFilteredItems(storeWearables)
    } else {
      setFilteredItems(
        storeWearables.filter(
          (item) => item.alienPart?.type?.toLowerCase() === activeTab
        )
      )
    }
  }, [storeWearables, activeTab])

  const fetchSelectedItemDetails = async (item: any) => {
    try {
      setLoadingItemId(item.id)
      const response = await getWearableDetails(item.subject)
      setSelectedItem({ ...response.data, rarity: item.rarity, volume7d: item.volume7d })
      // Fetch activity for this item
      fetchItemActivity(item.subject)
    } catch (e) {
      console.error("fetchSelectedItemDetails error", e)
    } finally {
      setLoadingItemId(null)
    }
  }

  const fetchItemActivity = async (subject: string) => {
    try {
      setActivityLoading(true)
      const response = await getWearableActivity(subject, 10)
      setItemActivity(response.data || [])
    } catch (error) {
      console.error("Error fetching item activity:", error)
      setItemActivity([])
    } finally {
      setActivityLoading(false)
    }
  }

  // Format price to 2 decimal places
  const formatPrice = (value: number): string => {
    if (!value || value === 0) return "0.00"
    if (value < 0.01) {
      // For very small numbers, use subscript notation
      const parts = value.toExponential().split("e-")
      if (parts.length === 2) {
        const significant = parseFloat(parts[0]).toFixed(2).replace(".", "")
        const zeros = parseInt(parts[1]) - 1
        return `0.0(${zeros})${significant}`
      }
    }
    return value.toFixed(2)
  }

  // Format volume
  const formatVolume = (value: number): string => {
    if (!value || value === 0) return "0"
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toFixed(2)
  }

  const handleBoughtQuest = async (subject: string) => {
    if (!subject) return
    try {
      await progressBoughtQuest(subject)
    } catch (error) {
      console.error("Error processing bought quest:", error)
    }
  }

  const handleUnlockWithStars = async (subject: string) => {
    setIsLoading({ ...isLoading, unlock: true })
    try {
      const response = await unlockWithStars(subject)
      if (response.error) {
        toast.error(response.error.message || "Failed to unlock item")
        return
      }
      toast.success(`Item unlocked! ${response.data?.starsSpent} Stars spent.`)
      // Add to unlocked set
      setUnlockedWearables((prev) => new Set([...prev, subject]))
      // Refresh unlocked list
      fetchUnlockedWearables()
    } catch (error: any) {
      console.error("Error unlocking with stars:", error)
      toast.error("Failed to unlock item")
    } finally {
      setIsLoading({ ...isLoading, unlock: false })
    }
  }

  const handleBuy = async (subject: string) => {
    setIsLoading({ ...isLoading, buy: true })

    try {
      if (!quantity || parseFloat(quantity) <= 0) {
        toast.error("Please enter a valid quantity")
        return
      }

      if (!quantity || parseFloat(quantity) < 0.001) {
        toast.error("Please enter a valid quantity (min 0.001)")
        return
      }

      const parsedQuantity = parseFloat(quantity)
      if (
        selectedItem?.availability &&
        parsedQuantity > selectedItem.availability
      ) {
        toast.error("Quantity exceeds available supply")
        return
      }

      const amount = ethers.parseEther(quantity)

      if (!signer) {
        toast.error("Wallet not connected")
        return
      }

      const contractAddress = process.env.NEXT_PUBLIC_WEARABLES_CONTRACT_ADDRESS
      if (!contractAddress || !ethers.isAddress(contractAddress)) {
        toast.error("Invalid contract configuration")
        return
      }

      const contract = new ethers.Contract(
        contractAddress,
        CONTRACT_ABI,
        signer
      )

      const zoneTokenContractAddress =
        process.env.NEXT_PUBLIC_ZONE_TOKEN_CONTRACT_ADDRESS
      if (
        !zoneTokenContractAddress ||
        !ethers.isAddress(zoneTokenContractAddress)
      ) {
        toast.error("Invalid zone token contract configuration")
        return
      }
      const zoneTokenContract = new ethers.Contract(
        zoneTokenContractAddress,
        ZONE_TOKEN_ABI,
        signer
      )

      const response = await getWearableDetails(subject)
      const price = response.data.buyPrice.toString()

      const signerAddress = await signer.getAddress()
      const zoneTokenBalance = await zoneTokenContract.balanceOf(signerAddress)

      if (zoneTokenBalance < BigInt(quantity) * ethers.parseEther(price)) {
        toast.error("Insufficient zone token balance")
        return
      }

      const zoneTokenAllowance = await zoneTokenContract.allowance(
        await signer.getAddress(),
        contractAddress
      )
      if (zoneTokenAllowance < BigInt(quantity) * ethers.parseEther(price)) {
        await zoneTokenContract.approve(
          contractAddress,
          BigInt(quantity) * ethers.parseEther(price) * BigInt(2)
        )
      }

      const tx = await contract.buyWearables(subject, amount)
      await tx.wait()

      toast.success("Wearables bought successfully!")
      handleBoughtQuest(subject)
      setQuantity("")
    } catch (error: any) {
      console.error("Full error object:", error)

      if (error.code === 4001) {
        toast.error("Transaction rejected")
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient funds")
      } else if (error.code === "CALL_EXCEPTION") {
        toast.error("Transaction failed. Please try again")
      } else if (error.message?.includes("user rejected")) {
        toast.error("Transaction cancelled")
      } else if (error.message?.includes("insufficient funds")) {
        toast.error("Insufficient funds")
      } else if (error.message?.includes("missing revert data")) {
        toast.error("Transaction failed. Please try again")
      } else {
        toast.error("Failed to buy. Please try again")
      }
    } finally {
      setIsLoading({ ...isLoading, buy: false })
    }
  }

  const handleSell = async (subject: string) => {
    setIsLoading({ ...isLoading, sell: true })

    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    if (!quantity || parseFloat(quantity) < 0.001) {
      toast.error("Please enter a valid quantity (min 0.001)")
      return
    }

    const parsedQuantity = parseFloat(quantity)
    if (
      selectedItem?.heldAmount &&
      parsedQuantity > selectedItem.heldAmount
    ) {
      toast.error("Quantity exceeds held amount")
      return
    }

    const amount = ethers.parseEther(quantity)

    if (!signer) {
      toast.error("Wallet not connected")
      return
    }

    const contractAddress = process.env.NEXT_PUBLIC_WEARABLES_CONTRACT_ADDRESS
    if (!contractAddress || !ethers.isAddress(contractAddress)) {
      toast.error("Invalid contract configuration")
      return
    }

    try {
      const contract = new ethers.Contract(
        contractAddress,
        CONTRACT_ABI,
        signer
      )

      const tx = await contract.sellWearables(subject, amount)
      await tx.wait()

      toast.success("Wearables sold successfully!")
    } catch (error: any) {
      console.error("Full error object:", error)

      if (error.code === 4001) {
        toast.error("Transaction rejected")
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient funds")
      } else if (error.code === "CALL_EXCEPTION") {
        toast.error("Transaction failed. Please try again")
      } else if (error.message?.includes("user rejected")) {
        toast.error("Transaction cancelled")
      } else if (error.message?.includes("insufficient funds")) {
        toast.error("Insufficient funds")
      } else if (error.message?.includes("missing revert data")) {
        toast.error("Transaction failed. Please try again")
      } else {
        toast.error("Failed to sell. Please try again")
      }
    } finally {
      setIsLoading({ ...isLoading, sell: false })
    }
  }

  // Check if item is unlocked for trading (Common = always unlocked)
  const isItemUnlocked = (item: any): boolean => {
    if (!item?.rarity || item.rarity === "COMMON") return true
    return unlockedWearables.has(item.subject)
  }

  // Check if user owns this item (heldAmount > 0)
  const isItemOwned = (item: any): boolean => {
    return item?.heldAmount && item.heldAmount > 0
  }

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col lg:flex-row gap-3 overflow-hidden">
        {/* Item details sidebar - desktop only */}
        {selectedItem && (
          <div
            className={cn(
              "hidden lg:block bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-3 overflow-y-auto transition-all duration-300 inset-0 z-50 lg:z-auto lg:w-full lg:max-w-[400px] lg:inset-auto lg:opacity-100 lg:translate-y-0"
            )}
          >
            <div className="flex flex-col gap-4 h-full">
              <div className="relative flex items-center justify-center bg-white/10 rounded-lg">
                <Image
                  src={selectedItem?.alienPart?.image || ""}
                  alt="item"
                  width={400}
                  height={400}
                  className="object-cover h-[350px] rounded"
                />
                {/* Owned indicator on image */}
                {isItemOwned(selectedItem) && (
                  <div className="absolute top-2 right-2 bg-green-500/80 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Selected item detail view */}
        {selectedItem && (
          <div className="relative w-full h-full bg-white/5 glass-effect border border-white/10 rounded-xl p-5 flex flex-col gap-3 overflow-y-auto">
            <div className="flex flex-col gap-3 w-full">
              <BrandButton
                blurColor="bg-[#96DFF4]"
                className="font-light w-max"
                onClick={() => {
                  setSelectedItem(null)
                  setQuantity("")
                  setItemActivity([])
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to store</span>
              </BrandButton>

              {/* Mobile image */}
              <div className="flex flex-col gap-4 h-full lg:hidden">
                <div className="relative flex items-center justify-center bg-white/10 rounded-lg">
                  <Image
                    src={selectedItem?.alienPart?.image || ""}
                    alt="item"
                    width={400}
                    height={400}
                    className="object-cover h-[350px] rounded"
                  />
                  {isItemOwned(selectedItem) && (
                    <div className="absolute top-2 right-2 bg-green-500/80 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full lg:mt-4">
                <h2 className="text-xl font-bold">{selectedItem?.name}</h2>
                <p className="text-lg font-volkhov">
                  {selectedItem?.description}
                </p>

                <div className="flex flex-col mt-3 gap-[0.35rem] py-3">
                  {/* Rarity (replaces Type) */}
                  <div className="flex items-center justify-between">
                    <p className="truncate mr-2 text-[16px] font-semibold">
                      Rarity
                    </p>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md text-xs font-medium border",
                        rarityColors[selectedItem?.rarity] || rarityColors.COMMON
                      )}
                    >
                      {selectedItem?.rarity
                        ? selectedItem.rarity.charAt(0) +
                          selectedItem.rarity.slice(1).toLowerCase()
                        : "Common"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <p className="truncate mr-2 text-[16px] font-semibold">
                      Availability
                    </p>
                    <p className="text-[16px] whitespace-nowrap">
                      {selectedItem?.availability}/{selectedItem?.totalSupply}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <p className="truncate mr-2 text-[16px] font-semibold">
                      Total supply
                    </p>
                    <p className="text-[16px] whitespace-nowrap">
                      {selectedItem?.totalSupply || 0}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <p className="truncate mr-2 text-[16px] font-semibold">
                      Item price
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="size-3 flex items-center justify-center">
                        <Image
                          src="/images/coin-zone.png"
                          alt="Coin Zone"
                          width={50}
                          height={50}
                        />
                      </div>
                      <p className="text-[16px] whitespace-nowrap">
                        {formatPrice(selectedItem?.buyPrice || 0)}
                      </p>
                    </div>
                  </div>
                  {/* 7D Volume */}
                  <div className="flex items-center justify-between text-xs">
                    <p className="truncate mr-2 text-[16px] font-semibold">
                      7D Volume
                    </p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <p className="text-[16px] whitespace-nowrap">
                        {formatVolume(selectedItem?.volume7d || 0)} ZONE
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <p className="truncate mr-2 text-[16px] font-semibold">
                      Held Amount
                    </p>
                    <p className="text-[16px] whitespace-nowrap">
                      {selectedItem?.heldAmount || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Unlock with Stars (for non-Common items that aren't unlocked) */}
              {selectedItem?.rarity &&
                selectedItem.rarity !== "COMMON" &&
                !isItemUnlocked(selectedItem) && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-yellow-400" />
                      <p className="text-sm font-semibold text-yellow-300">
                        Unlock required to trade
                      </p>
                    </div>
                    <p className="text-xs text-white/60 mb-3">
                      This {selectedItem.rarity.toLowerCase()} item requires{" "}
                      {starsUnlockPrices[selectedItem.rarity] || 0} Stars to
                      unlock for trading.
                    </p>
                    <BrandButton
                      blurColor="bg-[#FFD700]"
                      className="w-full font-light"
                      onClick={() =>
                        handleUnlockWithStars(selectedItem?.subject)
                      }
                      disabled={isLoading.unlock}
                    >
                      <Star className="w-4 h-4 mr-1" />
                      {isLoading.unlock
                        ? "Unlocking..."
                        : `Unlock for ${starsUnlockPrices[selectedItem.rarity] || 0} Stars`}
                      {isLoading.unlock && (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      )}
                    </BrandButton>
                  </div>
                )}

              {/* Buy/Sell controls (only if unlocked or Common) */}
              {isItemUnlocked(selectedItem) && (
                <div className="flex flex-col gap-3 w-full">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="0.001"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#96DFF4]/50"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <BrandButton
                      blurColor="bg-[#96DFF4]"
                      className="w-full font-light"
                      onClick={() => handleBuy(selectedItem?.subject)}
                      disabled={isLoading.buy || !quantity}
                    >
                      {isLoading.buy ? "Buying... " : "Buy"}
                      {isLoading.buy && (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      )}
                    </BrandButton>
                    <BrandButton
                      blurColor="bg-[#F49696]"
                      className="w-full font-light"
                      onClick={() => handleSell(selectedItem?.subject)}
                      disabled={isLoading.sell || !selectedItem?.heldAmount}
                    >
                      {isLoading.sell ? "Selling... " : "Sell"}
                      {isLoading.sell && (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      )}
                    </BrandButton>
                  </div>
                </div>
              )}

              {/* Activity section */}
              <div className="mt-4 border-t border-white/10 pt-4">
                <h3 className="text-sm font-semibold mb-3">Activity</h3>
                {activityLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-xs text-white/60">Loading activity...</span>
                  </div>
                ) : itemActivity.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {itemActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-medium",
                              activity.type === "BUY"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            )}
                          >
                            {activity.type}
                          </span>
                          <span className="text-white/60 truncate max-w-[120px]">
                            {activity.walletAddress
                              ? `${activity.walletAddress.slice(0, 6)}...${activity.walletAddress.slice(-4)}`
                              : "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/80">
                            {activity.amount} × {formatPrice(activity.price || 0)}
                          </span>
                          <div className="size-3 flex items-center justify-center">
                            <Image
                              src="/images/coin-zone.png"
                              alt="ZONE"
                              width={12}
                              height={12}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/40 text-center py-4">
                    No activity yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main content area - grid view */}
        {!selectedItem && (
          <div
            className={cn(
              "w-full h-full bg-white/5 backdrop-blur-lg rounded p-4 overflow-hidden",
              selectedItem ? "hidden lg:block" : "block"
            )}
          >
            {/* Sort options */}
            <div className="flex gap-2 mb-3">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    playClickSound()
                    setActiveSort(option.value)
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border border-white/10 text-xs transition-all duration-300",
                    activeSort === option.value
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/60 hover:text-white"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Category filter tabs */}
            <div className="flex gap-2 max-lg:flex-wrap pb-2 scrollbar-hide">
              {storeTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    playClickSound()
                    setActiveTab(tab.value)
                    setSelectedItem(null)
                  }}
                  className={cn(
                    "px-3 sm:px-4 h-10 lg:w-full rounded-lg border border-white/10 whitespace-nowrap flex items-center gap-2 justify-between text-xs sm:text-sm transition-all duration-300",
                    activeTab === tab.value ? "bg-white/20" : "bg-white/5"
                  )}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mt-4 pb-20 h-full overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-full h-max backdrop-blur-lg rounded-lg cursor-pointer opacity-100 transition-all duration-200 hover:bg-white/10 relative",
                      selectedItem?.id === item.id &&
                        selectedItem?.type === item.type
                        ? "bg-white/20 opacity-20"
                        : "bg-white/5"
                    )}
                    onClick={() =>
                      loadingItemId ? null : fetchSelectedItemDetails(item)
                    }
                  >
                    <div className="relative aspect-square bg-white/10 rounded-tl-lg rounded-tr-lg">
                      {loadingItemId === item.id && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10 rounded-tl-lg rounded-tr-lg">
                          <Loader2 className="w-8 h-8 animate-spin text-white" />
                        </div>
                      )}
                      <Image
                        src={item?.alienPart?.image || ""}
                        alt="item"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full rounded"
                      />
                      {/* Owned indicator */}
                      {isItemOwned(item) && (
                        <div className="absolute top-2 right-2 bg-green-500/80 rounded-full p-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {/* Lock indicator for non-unlocked rare+ items */}
                      {item?.rarity &&
                        item.rarity !== "COMMON" &&
                        !unlockedWearables.has(item.subject) && (
                          <div className="absolute top-2 left-2 bg-yellow-500/80 rounded-full p-0.5">
                            <Lock className="w-3 h-3 text-white" />
                          </div>
                        )}
                    </div>
                    <div className="flex flex-col mt-3 gap-1 p-3">
                      <div className="flex items-center justify-between">
                        <p className="truncate mr-2 text-sm">{item.name}</p>
                        {/* Rarity badge instead of Type */}
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap",
                            rarityColors[item?.rarity] || rarityColors.COMMON
                          )}
                        >
                          {item?.rarity
                            ? item.rarity.charAt(0) +
                              item.rarity.slice(1).toLowerCase()
                            : "Common"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <p className="truncate mr-2">Item price</p>
                        <div className="flex items-center gap-1">
                          <div className="size-3 flex items-center justify-center">
                            <Image
                              src="/images/coin-zone.png"
                              alt="Coin Zone"
                              width={50}
                              height={50}
                            />
                          </div>
                          <p className="text-2xs whitespace-nowrap">
                            {formatPrice(item?.buyPrice || 0)}
                          </p>
                        </div>
                      </div>
                      {/* 7D Volume */}
                      <div className="flex items-center justify-between text-xs">
                        <p className="truncate mr-2">7D Vol</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <p className="text-2xs whitespace-nowrap text-green-300">
                            {formatVolume(item?.volume7d || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-white/60">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="text-sm">Loading Items...</span>
                    </div>
                  ) : (
                    "No items found"
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StorePage
