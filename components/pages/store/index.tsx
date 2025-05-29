import { useEffect, useState } from "react"
import Image from "next/image"
import { useWallet } from "@/context/wallet"
import { useInventory, useProfile } from "@/store/hooks"
import { Character, InventoryItem } from "@/types"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { ethers } from "ethers"
import { ArrowLeft, Loader2, X } from "lucide-react"
import toast from "react-hot-toast"

import {
  burnGear,
  getStoreWearables,
  getWearableObjectDetails,
  updateGearBalance,
} from "@/lib/api"
import { cn, getEthWallet, handleSignMessage } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import BrandButton from "@/components/ui/brand-button"
import CONTRACT_ABI from "@/app/assets/wearablesContractAbi.json"

// Define the BurnGearResponse type

const storeTabs = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Hair",
    value: "hair",
  },
  {
    label: "Eyes",
    value: "eyes",
  },
  {
    label: "Mouth",
    value: "mouth",
  },
  {
    label: "Background",
    value: "background",
  },
  {
    label: "Outfits",
    value: "outfits",
  },
  {
    label: "Marks",
    value: "marks",
  },
  {
    label: "Powers",
    value: "powers",
  },
]

const StorePage = () => {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { wallets } = useWallets()
  const { provider, signer } = useWallet()
  const { signMessage } = usePrivy()
  const [isMinted, setIsMinted] = useState(false)
  const [storeWearables, setStoreWearables] = useState<any[]>([])
  const [loadingItemId, setLoadingItemId] = useState(null)
  const [isLoading, setIsLoading] = useState({
    buy: false,
    sell: false,
    transfer: false,
  })

  // Fetch inventory data when component mounts
  useEffect(() => {
    fetchStoreWearables()
  }, [])

  // Handle tab change
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue)
    // Only reset selected item when changing tabs
    setSelectedItem(null)
  }

  const fetchStoreWearables = async () => {
    try {
      setLoading(true)
      const response = await getStoreWearables()
      if (response.error) {
        toast.error(response.error.message || "Failed to fetch store wearables")
        return
      }
      setStoreWearables(response.data)
    } catch (error) {
      console.error("Error fetching store wearables:", error)
      toast.error("Failed to fetch store wearables")
    } finally {
      setLoading(false)
    }
  }

  // Filter inventory items based on the selected tab
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
          (item) => item.alienPart.type.toLowerCase() === activeTab
        )
      )
    }
  }, [storeWearables, activeTab]) // Remove selectedItem from dependencies

  const fetchSelectedItemDetails = async (item: any) => {
    try {
      setLoadingItemId(item.id)
      const response = await getWearableObjectDetails(item.subject)
      console.log("fetchSelectedItemDetails response", response)
      setSelectedItem(response.data)
    } catch (e) {
      console.log("fetchSelectedItemDetails error", e)
    } finally {
      setLoadingItemId(null)
    }
  }

  console.log("storeWearables ==>", storeWearables)

  function formatTinyNumberJSX(value: number) {
    if (value === 0) return <span>$0</span>

    const parts = value.toExponential().split("e-")

    if (parts.length === 2) {
      const significant = parseFloat(parts[0])
      const zeros = parseInt(parts[1]) - 1
      const decimalPart = significant.toString().split(".")[1] || ""

      return (
        <span>
          $0.{decimalPart}
          <sub>{zeros}</sub>
        </span>
      )
    }

    // For regular numbers
    return <span>${value}</span>
  }

  // const handleTransfer = async (subject: string, amount: number) => {
  const handleTransfer = async (subject: string) => {
    console.log("handleTransfer")
    setIsLoading({ ...isLoading, transfer: true })

    // const subject =
    //   "0xb7fbc0ed8d213b20fd87a6dc606ea6408011c15f43415245898593f5808fbdd6"
    const amount = ethers.parseEther("0.001")

    if (!signer) {
      toast.error("Wallet not connected")
      return
    }

    const from = await signer.getAddress()
    const to = "0x6b7B85684092e7986a0C5471A97420227DcEE204"

    console.log(
      `Subject: ${subject}\tAmount: ${amount.toString()}\tFrom: ${from}\tTo: ${to}`
    )

    try {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_WEARABLES_CONTRACT_ADDRESS || "",
        CONTRACT_ABI,
        signer
      )

      const tx = await contract.transferWearables(subject, from, to, amount)
      await tx.wait()

      toast.success("Wearables transferred successfully!")
      console.log("Transaction hash:", tx.hash)
    } catch (error) {
      console.error("Transfer failed:", error)
      toast.error("Transfer failed")
    } finally {
      setIsLoading({ ...isLoading, transfer: false })
    }
  }

  const handleBuy = async (subject: string) => {
    console.log("handleTransfer")

    setIsLoading({ ...isLoading, buy: true })
    // const subject =
    //   "0xb7fbc0ed8d213b20fd87a6dc606ea6408011c15f43415245898593f5808fbdd6"
    const amount = ethers.parseEther("0.001")

    if (!signer) {
      toast.error("Wallet not connected")
      return
    }

    try {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_WEARABLES_CONTRACT_ADDRESS || "",
        CONTRACT_ABI,
        signer
      )

      console.log("contract", contract)
      console.log("signer", signer)

      console.log("subject", subject)
      console.log("amount", amount)

      const price = await contract.getBuyPriceAfterFee(subject, amount)

      console.log(
        `Subject: ${subject}\tAmount: ${amount.toString()}\tPrice: ${price.toString()}`
      )

      const tx = await contract.buyWearables(subject, amount, {
        value: price,
      })
      await tx.wait()

      toast.success("Wearables bought successfully!")
      console.log("Transaction hash:", tx.hash)
    } catch (error) {
      console.error("Buy failed:", error)
      toast.error("Buy failed")
    } finally {
      setIsLoading({ ...isLoading, buy: false })
    }
  }

  const handleSell = async (subject: string) => {
    console.log("handleTransfer")

    setIsLoading({ ...isLoading, sell: true })
    // const subject =
    //   "0xb7fbc0ed8d213b20fd87a6dc606ea6408011c15f43415245898593f5808fbdd6"
    const amount = ethers.parseEther("0.001")

    if (!signer) {
      toast.error("Wallet not connected")
      return
    }

    try {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_WEARABLES_CONTRACT_ADDRESS || "",
        CONTRACT_ABI,
        signer
      )

      const price = await contract.getBuyPriceAfterFee(subject, amount)

      console.log(
        `Subject: ${subject}\tAmount: ${amount.toString()}\tPrice: ${price.toString()}`
      )

      const tx = await contract.sellWearables(subject, amount, {
        value: price,
      })
      await tx.wait()

      toast.success("Wearables sold successfully!")
      console.log("Transaction hash:", tx.hash)
    } catch (error) {
      console.error("Sell failed:", error)
      toast.error("Sell failed")
    } finally {
      setIsLoading({ ...isLoading, sell: false })
    }
  }

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col lg:flex-row gap-3 overflow-hidden">
        {/* Item details sidebar - full screen on mobile when an item is selected */}
        {selectedItem && (
          <div
            className={cn(
              "bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-3 overflow-y-auto transition-all duration-300",
              "fixed inset-0 z-50 lg:static lg:z-auto lg:w-full lg:max-w-[400px] lg:inset-auto",
              "lg:opacity-100 lg:translate-y-0"
            )}
          >
            <div className="flex flex-col gap-4 h-full">
              <div className="relative flex items-center justify-center bg-white/10 rounded-lg">
                <Image
                  src={selectedItem?.alienPart?.image || ""}
                  alt="item"
                  width={400}
                  height={400}
                  className="object-cover h-[300px] rounded"
                />
              </div>

              {/* <div className="flex flex-col gap-3 bg-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg">Your Cart</h2>
                  <div className="flex items-center">2 items</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                    <Image
                      src={selectedItem.image || ""}
                      alt="item"
                      width={1000}
                      height={1000}
                      className="object-cover h-8 w-8 rounded"
                    />
                    <div className="flex items-center justify-between">
                      <p className="truncate mr-2 text-sm">Item name</p>
                      <Badge variant="epic">Epic</Badge>
                    </div>
                    <p className="truncate mr-2 text-sm">250</p>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="top-3 right-3 bg-white/10 backdrop-blur-lg rounded size-5 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                    <Image
                      src={selectedItem.image || ""}
                      alt="item"
                      width={1000}
                      height={1000}
                      className="object-cover h-8 w-8 rounded"
                    />
                    <div className="flex items-center justify-between">
                      <p className="truncate mr-2 text-sm">Item name</p>
                      <Badge variant="legendary">Legendary</Badge>
                    </div>
                    <p className="truncate mr-2 text-sm">250</p>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="top-3 right-3 bg-white/10 backdrop-blur-lg rounded size-5 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                    <Image
                      src={selectedItem.image || ""}
                      alt="item"
                      width={1000}
                      height={1000}
                      className="object-cover h-8 w-8 rounded"
                    />
                    <div className="flex items-center justify-between">
                      <p className="truncate mr-2 text-sm">Item name</p>
                      <Badge variant="legendary">Legendary</Badge>
                    </div>
                    <p className="truncate mr-2 text-sm">250</p>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="top-3 right-3 bg-white/10 backdrop-blur-lg rounded size-5 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <BrandButton
                  blurColor="bg-[#96DFF4]"
                  className="w-full font-light"
                  onClick={handleBurnGear}
                  disabled={loading}
                >
                  {loading ? "Summoning..." : "Buy for 450"}
                  {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                </BrandButton>
              </div> */}
            </div>
          </div>
        )}

        {selectedItem && (
          <div className="relative w-full h-full bg-white/5 glass-effect border border-white/10 rounded-xl p-5 flex flex-col lg:flex-row gap-3 overflow-hidden">
            <div className="flex flex-col gap-3 w-full">
              <BrandButton
                blurColor="bg-[#96DFF4]"
                className="font-light w-max"
                onClick={() => setSelectedItem(null)}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to store</span>
              </BrandButton>

              <div className="flex flex-col gap-4 w-full">
                <h2 className="text-lg font-bold">{selectedItem?.name}</h2>
                <p className="text-sm">{selectedItem?.description}</p>
                <div className="flex flex-col mt-3 gap-1 p-3">
                  <div className="flex items-center justify-between">
                    <p className="truncate mr-2 text-sm">Type</p>
                    <Badge
                      variant={selectedItem?.alienPart?.type?.toLowerCase()}
                    >
                      {selectedItem?.alienPart?.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <p className="truncate mr-2">Availability</p>
                    <p className=" text-2xs whitespace-nowrap">
                      {selectedItem?.availabilityInWei}/
                      {selectedItem?.totalSupplyInWei}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <p className="truncate mr-2">Total supply</p>
                    <p className="text-2xs whitespace-nowrap">
                      {/* {selectedItem?.totalSupply} */}
                      {formatTinyNumberJSX(selectedItem?.totalSupply)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <p className="truncate mr-2">Item price</p>
                    <p className=" text-2xs whitespace-nowrap">
                      {/* {selectedItem?.buyPrice} */}
                      {formatTinyNumberJSX(selectedItem?.buyPrice)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BrandButton
                  blurColor="bg-[#96DFF4]"
                  className="w-full font-light"
                  onClick={() => handleBuy(selectedItem?.subject)}
                  disabled={isLoading.buy}
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
                  disabled={isLoading.sell}
                >
                  {isLoading.sell ? "Selling... " : "Sell"}
                  {isLoading.sell && (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  )}
                </BrandButton>
                <BrandButton
                  blurColor="bg-[#EF98E6]"
                  className="w-full font-light"
                  onClick={() => handleTransfer(selectedItem?.subject)}
                  disabled={isLoading.transfer}
                >
                  {isLoading.transfer ? "Transferring... " : "Transfer"}
                  {isLoading.transfer && (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  )}
                </BrandButton>
              </div>
            </div>
          </div>
        )}

        {/* Main content area - hidden on mobile when item is selected */}
        {!selectedItem && (
          <div
            className={cn(
              "w-full h-full bg-white/5 backdrop-blur-lg rounded p-4 overflow-hidden",
              selectedItem ? "hidden lg:block" : "block"
            )}
          >
            {/* Tabs - scrollable on small screens */}
            <div className="flex gap-2 max-lg:flex-wrap pb-2 scrollbar-hide">
              {storeTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={cn(
                    "px-3 sm:px-4 h-10 lg:w-full rounded-lg border border-white/10 whitespace-nowrap flex items-center gap-2 justify-between text-xs sm:text-sm transition-all duration-300",
                    activeTab === tab.value ? "bg-white/20" : "bg-white/5"
                  )}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mt-4 pb-20 h-full overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-full h-max backdrop-blur-lg rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/10 ",
                      selectedItem?.id === item.id &&
                        selectedItem?.type === item.type
                        ? "bg-white/20"
                        : "bg-white/5"
                    )}
                    onClick={() =>
                      loadingItemId ? null : fetchSelectedItemDetails(item)
                    }
                  >
                    <div className="relative aspect-square bg-white/10 rounded-tl-lg rounded-tr-lg">
                      <Image
                        src={item?.alienPart?.image || ""}
                        alt="item"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full rounded"
                      />
                    </div>
                    <div className="flex flex-col mt-3 gap-1 p-3">
                      <div className="flex items-center justify-between">
                        <p className="truncate mr-2 text-sm">{item.name}</p>
                        <Badge variant={item?.alienPart?.type?.toLowerCase()}>
                          {item?.alienPart?.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <p className="truncate mr-2">Total supply</p>
                        <p className="text-2xs whitespace-nowrap">
                          {/* {item?.totalSupply} */}
                          {formatTinyNumberJSX(item?.totalSupply)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <p className="truncate mr-2">Item price</p>
                        <p className=" text-2xs whitespace-nowrap">
                          {/* {item?.buyPrice} */}
                          {formatTinyNumberJSX(item?.buyPrice)}
                        </p>
                      </div>
                      <div className="flex items-center justify-center border border-white/10 rounded-lg p-2 mt-2 hover:bg-white/10 transition-all duration-200">
                        {loadingItemId === item.id ? "Loading... " : "Buy"}
                        {loadingItemId === item.id && (
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-white/60">
                  {storeWearables.length === 0
                    ? "No items found"
                    : "Loading Wearables..."}
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
