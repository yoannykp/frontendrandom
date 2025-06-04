import { useEffect, useState } from "react"
import Image from "next/image"
import { useWallet } from "@/context/wallet"
import { useInventory } from "@/store/hooks"
import { Character, InventoryItem } from "@/types"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { ethers } from "ethers"
import { CloudLightning, Loader2, X } from "lucide-react"
import toast from "react-hot-toast"

import { LIMIT_FOR_SUMMON_OR_MINT } from "@/config/constants"
import { burnGear, consumeConsumableItem, updateGearBalance } from "@/lib/api"
import { cn, handleSignMessage } from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"
import SummonModal from "@/components/pages/draw/SummonModal"
import CONTRACT_ABI from "@/app/assets/abi.json"

// Define the BurnGearResponse type

const InventoryTabs = [
  {
    label: "All",
    value: "all",
    icon: CloudLightning,
  },
  {
    label: "Alien Gear",
    value: "gear",
    icon: CloudLightning,
  },
  {
    label: "Alien Raid",
    value: "raids",
    icon: CloudLightning,
  },
  {
    label: "Consumable",
    value: "consumable",
    icon: CloudLightning,
  },
  {
    label: "Dojo Items",
    value: "dojo",
    icon: CloudLightning,
  },
]

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isSummonModalOpen, setIsSummonModalOpen] = useState(false)
  const [summonedCharacter, setSummonedCharacter] = useState<Character | null>(
    null
  )
  const { data: inventory, fetchInventory } = useInventory()
  const { wallets } = useWallets()
  const { provider, signer, wallet } = useWallet()
  const { signMessage } = usePrivy()
  const [isMinted, setIsMinted] = useState(false)

  console.log("wallet ====>", wallet)

  useEffect(() => {
    if (isSummonModalOpen) {
      setIsMinted(false)
    }
  }, [isSummonModalOpen])

  // Fetch inventory data when component mounts
  useEffect(() => {
    fetchInventory()
  }, [])

  // Handle tab change
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue)
    // Only reset selected item when changing tabs
    setSelectedItem(null)
  }

  // Filter inventory items based on the selected tab
  useEffect(() => {
    if (!inventory) {
      setFilteredItems([])
      return
    }

    if (activeTab === "all") {
      setFilteredItems(inventory)
    } else if (activeTab === "gear") {
      setFilteredItems(inventory?.filter((item) => item.type === "GEAR"))
    } else if (activeTab === "raids") {
      setFilteredItems(inventory?.filter((item) => item.type === "CHARACTER"))
    } else if (activeTab === "dojo") {
      setFilteredItems(inventory?.filter((item) => item.type === "ALIEN_PART"))
    } else if (activeTab === "consumable") {
      setFilteredItems(inventory?.filter((item) => item.type === "CONSUMABLE"))
    }
  }, [inventory, activeTab]) // Remove selectedItem from dependencies

  // Handle burn gear functionality
  const handleBurnGear = async () => {
    // if (!selectedItem || selectedItem.type !== "GEAR") return
    if (!selectedItem) return
    if (selectedItem.type !== "GEAR") {
      toast.error("User does not have this gear")
      return
    }

    console.log("selectedItem ==>", selectedItem)

    try {
      setLoading(true)
      const response = await burnGear(selectedItem.id)

      if (response.error) {
        toast.error(response.error.message || "Failed to burn gear")
        return
      }

      // Cast the response data to BurnGearResponse type
      const burnResponse = response.data

      if (burnResponse && burnResponse.success && burnResponse.character) {
        handleMintCharacter(
          burnResponse.serverSignature,
          burnResponse.nonce,
          burnResponse.character,
          selectedItem.id
        )
      } else {
        // @ts-expect-error 'burnResponse' is not typed
        toast.error(burnResponse?.error?.message || "Failed to burn gear")
        setLoading(false)
      }
    } catch (error) {
      console.error("Error burning gear:", error)
      toast.error("An error occurred while burning gear")
      setLoading(false)
    } finally {
      // setLoading(false)
    }
  }

  const handleConsumeableItem = async () => {
    if (!selectedItem) return
    if (selectedItem.type !== "CONSUMABLE") {
      toast.error("User does not have this consumable item")
      return
    }

    try {
      setLoading(true)
      const response = await consumeConsumableItem(selectedItem.id)

      if (response.error) {
        toast.error(response.error.message || "Failed to use consumable item")
        return
      }

      // Cast the response data to BurnGearResponse type
      const burnResponse = response.data

      if (response.data?.success) {
        toast.success("Consumable item used successfully")
        setLoading(false)
        setSelectedItem(null)
        fetchInventory()
      } else {
        // @ts-expect-error 'response' is not typed
        toast.error(response?.error?.message || "Failed to use consumable item")
      }
    } catch (error) {
      console.error("Error using consumable item:", error)
      toast.error("An error occurred while using consumable item")
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleMintCharacter = async (
    serverSignature: string,
    nonce: number,
    character: Character,
    gearId: number
  ) => {
    // const wallet = getEthWallet(wallets)

    console.log("wallet ====>", wallet)
    if (!wallet) {
      toast.error("Please connect a wallet")
      setLoading(false)
      return
    }

    if (!provider || !signer) {
      toast.error("Please connect a wallet")
      setLoading(false)
      return
    }

    const charactersIds = [character.id]
    const tokenIds = [character.tokenId]
    const amounts = new Array(tokenIds.length).fill(1)

    try {
      const signature = await handleSignMessage(
        charactersIds.join(","),
        wallet,
        signMessage
      )

      if (!signature) {
        toast.error("Signature failed or was cancelled")
        setLoading(false)
        return
      }

      // Step 2: Perform the transaction using the server signature
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
      if (!contractAddress) {
        toast.error("Contract address not configured")
        setLoading(false)
        return
      }

      const contract = new ethers.Contract(
        contractAddress,
        CONTRACT_ABI,
        signer
      )

      // Perform the mint transaction
      const tx = await contract.mintBatch(
        tokenIds,
        amounts,
        Number(nonce),
        serverSignature
      )
      const receipt = await tx.wait()

      console.log("Tx ==> ", tx)
      console.log("Receipt ==> ", receipt)

      const response = await updateGearBalance(gearId)
      // Refresh inventory
      fetchInventory()

      console.log("Response ==> ", response)

      // Set the summoned character and open the summon modal
      setSummonedCharacter(character)

      // Reset selected item
      setSelectedItem(null)

      setIsSummonModalOpen(true)
      toast.success("Gear burned successfully!")
    } catch (error: any) {
      console.error("Minting error:", error)

      // More specific error handling with concise messages
      if (error.code === 4001) {
        toast.error("Transaction rejected")
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient funds")
      } else if (error.message?.includes("user rejected")) {
        toast.error("Transaction cancelled")
      } else if (error.message?.includes("insufficient funds")) {
        toast.error("Insufficient funds")
      } else {
        toast.error("Failed to mint. Please try again")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col lg:flex-row gap-3 overflow-hidden">
        {/* Main content area - hidden on mobile when item is selected */}
        <div
          className={cn(
            "w-full h-full bg-white/5 backdrop-blur-lg rounded p-4 overflow-hidden",
            selectedItem ? "hidden lg:block" : "block"
          )}
        >
          {/* Tabs - scrollable on small screens */}
          <div className="flex gap-2 max-lg:flex-wrap pb-2 scrollbar-hide">
            {InventoryTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={cn(
                  "px-3 sm:px-4 h-10 lg:w-full rounded-lg border border-white/10 whitespace-nowrap flex items-center gap-2 justify-between text-xs sm:text-sm transition-all duration-300",
                  activeTab === tab.value ? "bg-white/20" : "bg-white/5"
                )}
              >
                <span>{tab.label}</span>
                <tab.icon className="w-4 h-4 hidden sm:block" />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mt-4 pb-20 h-full overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-full h-full backdrop-blur-lg rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-white/10",
                    selectedItem?.id === item.id &&
                      selectedItem?.type === item.type
                      ? "bg-white/20"
                      : "bg-white/5"
                  )}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.image || ""}
                      alt="item"
                      width={100}
                      height={100}
                      className="object-cover w-full h-full rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <p className="truncate mr-2">{item.name}</p>
                    <p className="border border-white/10 px-2 rounded-md text-2xs whitespace-nowrap">
                      x{item.quantity}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-white/60">
                {inventory
                  ? "No items found in this category"
                  : "Loading inventory..."}
              </div>
            )}
          </div>
        </div>

        {/* Item details sidebar - full screen on mobile when an item is selected */}
        {selectedItem && (
          <div
            className={cn(
              "bg-white/5 backdrop-blur-lg rounded p-3 overflow-y-auto transition-all duration-300",
              "fixed inset-0 z-50 lg:static lg:z-auto lg:w-full lg:max-w-[400px] lg:inset-auto",
              "lg:opacity-100 lg:translate-y-0"
            )}
          >
            <div className="flex flex-col gap-4 h-full">
              <div className="relative flex items-center justify-center">
                <Image
                  src={selectedItem.image || ""}
                  alt="item"
                  width={400}
                  height={400}
                  className="object-cover  h-[300px] rounded"
                />

                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 bg-white/10 backdrop-blur-lg rounded size-8 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                  <h2 className="text-lg"> {selectedItem.name}</h2>
                  <div className="flex items-center bg-white/10 rounded-lg border border-white/5">
                    <div className="px-2 py-1 bg-white/10 rounded-lg border border-white/10">
                      <span className="text-sm font-inter">Type</span>
                    </div>
                    <span className="text-[#8CC417] px-3">
                      {selectedItem.type}
                    </span>
                  </div>
                </div>

                <p className="text-xs">
                  {selectedItem.description || "No description available."}
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-3 gap-3 flex flex-col">
                <div className="bg-white/10 rounded-lg p-3">
                  <h3 className="font-inter">
                    Burn {LIMIT_FOR_SUMMON_OR_MINT} {selectedItem.name}
                  </h3>
                  <p className="text-xs text-white/60">
                    Use this item to enhance your character or alien.
                  </p>
                </div>
                <BrandButton
                  blurColor="bg-[#96DFF4]"
                  className="w-full"
                  onClick={
                    selectedItem.type === "CONSUMABLE"
                      ? handleConsumeableItem
                      : handleBurnGear
                  }
                  disabled={loading}
                >
                  {loading
                    ? selectedItem.type === "CONSUMABLE"
                      ? "Consuming..."
                      : "Summoning..."
                    : selectedItem.type === "CONSUMABLE"
                      ? "Use"
                      : "Summon"}
                  {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                </BrandButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summon Modal for showing character after burning gear */}
      {summonedCharacter && (
        <SummonModal
          title="You got"
          isOpen={isSummonModalOpen}
          setIsOpen={setIsSummonModalOpen}
          summonType="character"
          summonItems={[summonedCharacter]}
          loading={false}
          showCloseButton={true}
          isMinted={isMinted}
          setIsMinted={setIsMinted}
        />
      )}
    </div>
  )
}

export default InventoryPage
