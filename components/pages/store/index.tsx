import { useEffect, useState } from "react"
import Image from "next/image"
import { useWallet } from "@/context/wallet"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { ethers } from "ethers"
import { ArrowLeft, Loader2, X } from "lucide-react"
import toast from "react-hot-toast"

import {
  getStoreWearables,
  getWearableObjectDetails,
  processBoughtQuest,
} from "@/lib/api"
import { cn } from "@/lib/utils"
import useClickSound from "@/hooks/use-click-sound"
import { Badge } from "@/components/ui/badge"
import BrandButton from "@/components/ui/brand-button"
import CONTRACT_ABI from "@/app/assets/wearablesContractAbi.json"
import ZONE_TOKEN_ABI from "@/app/assets/zoneTokenContractAbi.json"

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
  const [showTransferInput, setShowTransferInput] = useState(false)
  const [transferAddress, setTransferAddress] = useState("")
  const [quantity, setQuantity] = useState("")
  const playClickSound = useClickSound("/sounds/click.mp3")

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

  function formatTinyNumberJSX(value: number, showDollarSign = true) {
    if (value === 0) return <span>{showDollarSign ? "$0" : "0"}</span>

    const parts = value.toExponential().split("e-")

    if (parts.length === 2) {
      const significant = parseFloat(parts[0]).toString().replace(".", "")
      const zeros = parseInt(parts[1]) - 1
      if (zeros > 3) {
        return (
          <span>
            {showDollarSign ? "$" : ""}0.0
            <sub>{zeros - 1}</sub>
            {significant}
          </span>
        )
      }
      return (
        <span>
          {showDollarSign ? "$" : ""}0.
          {"0".repeat(zeros)}
          {significant}
        </span>
      )
    }

    // For regular numbers
    return (
      <span>
        {showDollarSign ? "$" : ""}
        {value}
      </span>
    )
  }

  const handleBoughtQuest = async (subject: string) => {
    if (!subject) {
      toast.error("User does not have this consumable item")
      return
    }

    try {
      setLoading(true)
      await processBoughtQuest(subject)
      // fetchStoreWearables()
    } catch (error) {
      console.error("Error processing bought quest:", error)
      toast.error("An error occurred while processing bought quest")
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  // const handleTransfer = async (subject: string, amount: number) => {
  const handleTransfer = async (subject: string) => {
    if (!transferAddress) {
      toast.error("Please enter a wallet address")
      return
    }

    if (!ethers.isAddress(transferAddress)) {
      toast.error("Invalid wallet address")
      return
    }

    console.log("handleTransfer")
    setIsLoading({ ...isLoading, transfer: true })

    const amount = ethers.parseEther("0.001")

    if (!signer) {
      toast.error("Wallet not connected")
      return
    }

    const from = await signer.getAddress()
    const to = transferAddress

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
      setShowTransferInput(false)
      setTransferAddress("")
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
        toast.error("Failed to transfer. Please try again")
      }
    } finally {
      setIsLoading({ ...isLoading, transfer: false })
    }
  }

  const handleBuy = async (subject: string) => {
    console.log("handleBuy called!")

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

      const signerAddress = await signer.getAddress()
      const zoneTokenBalance = await zoneTokenContract.balanceOf(signerAddress)
      console.log("zoneTokenBalance ===>", zoneTokenBalance, signerAddress)

      if (zoneTokenBalance < amount) {
        toast.error("Insufficient zone token balance")
        return
      }

      const zoneTokenAllowance = await zoneTokenContract.allowance(
        await signer.getAddress(),
        contractAddress
      )
      // console.log("zoneTokenAllowance", zoneTokenAllowance)
      if (zoneTokenAllowance < amount) {
        await zoneTokenContract.approve(contractAddress, amount * BigInt(2))
      }
      // const newZoneTokenAllowance = await zoneTokenContract.allowance(await signer.getAddress(), contractAddress)
      // console.log("New zoneTokenAllowance", newZoneTokenAllowance)

      // Validate inputs before calling contract
      // console.log("Calling getBuyPriceAfterFee with:")
      // console.log("- subject:", subject)
      // console.log("- amount:", amount.toString())
      // console.log("Calling getBuyPriceAfterFee with:")
      // console.log("- subject:", subject)
      // console.log("- amount:", amount.toString())

      // const network = await signer.provider?.getNetwork()
      // console.log("Current network:", network?.chainId)
      // const network = await signer.provider?.getNetwork()
      // console.log("Current network:", network?.chainId)

      const tx = await contract.buyWearables(subject, amount)
      await tx.wait()

      console.log("tx =========>", tx)

      toast.success("Wearables bought successfully!")
      handleBoughtQuest(subject)
      setQuantity("")
      console.log("Transaction hash:", tx.hash)
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
    console.log("handleTransfer")

    setIsLoading({ ...isLoading, sell: true })
    // const subject =
    //   "0xb7fbc0ed8d213b20fd87a6dc606ea6408011c15f43415245898593f5808fbdd6"
    const amount = ethers.parseEther("0.001")

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

      const price = await contract.getSellPriceAfterFee(subject, amount)

      console.log(
        `Subject: ${subject}\tAmount: ${amount.toString()}\tPrice: ${price.toString()}`
      )

      const tx = await contract.sellWearables(subject, amount)
      await tx.wait()

      toast.success("Wearables sold successfully!")
      console.log("Transaction hash:", tx.hash)
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

  console.log("selectedItem ==>sdfsdf", selectedItem)

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col lg:flex-row gap-3 overflow-hidden">
        {/* Item details sidebar - full screen on mobile when an item is selected */}
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
              </div>
            </div>
          </div>
        )}

        {selectedItem && (
          <div className="relative w-full h-full bg-white/5 glass-effect border border-white/10 rounded-xl p-5 flex flex-col lg:flex-row gap-3 overflow-hidden">
            <div className="flex flex-col gap-3 w-full">
              <BrandButton
                blurColor="bg-[#96DFF4]"
                className="font-light w-max"
                onClick={() => {
                  setSelectedItem(null)
                  setShowTransferInput(false)
                  setTransferAddress("")
                  setQuantity("")
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to store</span>
              </BrandButton>

              <div className="flex flex-col gap-4 h-full lg:hidden">
                <div className="relative flex items-center justify-center bg-white/10 rounded-lg">
                  <Image
                    src={selectedItem?.alienPart?.image || ""}
                    alt="item"
                    width={400}
                    height={400}
                    className="object-cover h-[350px] rounded"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full lg:mt-4">
                <h2 className="text-xl font-bold">{selectedItem?.name}</h2>
                <p className="text-lg font-volkhov">
                  {selectedItem?.description}
                </p>

                <div className="flex flex-col mt-3 gap-[0.35rem] py-3">
                  <div className="flex items-center justify-between">
                    <p className="truncate mr-2 text-[16px] font-semibold">
                      Type
                    </p>
                    <Badge
                      variant={selectedItem?.alienPart?.type?.toLowerCase()}
                    >
                      {selectedItem?.alienPart?.type}
                    </Badge>
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
                      {/* {selectedItem?.totalSupply} */}
                      {selectedItem?.totalSupply
                        ? formatTinyNumberJSX(selectedItem?.totalSupply, false)
                        : 0}
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
                      <p className=" text-[16px] whitespace-nowrap">
                        {/* {selectedItem?.buyPrice} */}
                        {selectedItem?.buyPrice
                          ? formatTinyNumberJSX(selectedItem?.buyPrice, false)
                          : 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <p className="truncate mr-2 text-[16px] font-semibold">
                      Held Amount
                    </p>
                    <p className=" text-[16px] whitespace-nowrap">
                      {selectedItem?.heldAmount
                        ? formatTinyNumberJSX(selectedItem?.heldAmount)
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!showTransferInput ? (
                  <>
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
                        <BrandButton
                          blurColor="bg-[#EF98E6]"
                          className="w-full font-light"
                          onClick={() => setShowTransferInput(true)}
                          disabled={
                            isLoading.transfer || !selectedItem?.heldAmount
                          }
                        >
                          Transfer
                        </BrandButton>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter wallet address"
                        value={transferAddress}
                        onChange={(e) => setTransferAddress(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF98E6]/50"
                      />
                      <button
                        onClick={() => {
                          setShowTransferInput(false)
                          setTransferAddress("")
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <BrandButton
                      blurColor="bg-[#EF98E6]"
                      className="w-full font-light"
                      onClick={() => handleTransfer(selectedItem?.subject)}
                      disabled={isLoading.transfer || !transferAddress}
                    >
                      {isLoading.transfer ? "Sending... " : "Send"}
                      {isLoading.transfer && (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      )}
                    </BrandButton>
                  </div>
                )}
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
                  onClick={() => {
                    playClickSound()
                    handleTabChange(tab.value)
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
                          {formatTinyNumberJSX(item?.totalSupply, false)}
                        </p>
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
                          <p className=" text-2xs whitespace-nowrap">
                            {formatTinyNumberJSX(item?.buyPrice, false)}
                          </p>
                        </div>
                      </div>
                      {/* Commenting out buy button as requested */}
                      {/* <div className="flex items-center justify-center border border-white/10 rounded-lg p-2 mt-2 hover:bg-white/10 transition-all duration-200">
                        {loadingItemId === item.id ? "Loading... " : "Buy"}
                        {loadingItemId === item.id && (
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        )}
                      </div> */}
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
