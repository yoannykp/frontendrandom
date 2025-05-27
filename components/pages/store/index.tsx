import { useEffect, useState } from "react"
import Image from "next/image"
import { useWallet } from "@/context/wallet"
import { useInventory } from "@/store/hooks"
import { Character, InventoryItem } from "@/types"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { ethers } from "ethers"
import { CloudLightning, Loader2, X } from "lucide-react"
import toast from "react-hot-toast"

import { burnGear, updateGearBalance } from "@/lib/api"
import { cn, getEthWallet, handleSignMessage } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import BrandButton from "@/components/ui/brand-button"
import SummonModal from "@/components/pages/draw/SummonModal"
import CONTRACT_ABI from "@/app/assets/abi.json"

// Define the BurnGearResponse type

const storeTabs = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Hair",
    value: "gear",
  },
  {
    label: "Eyes",
    value: "raids",
  },
  {
    label: "Mouth",
    value: "consumable",
  },
  {
    label: "Background",
    value: "dojo",
  },
  {
    label: "Outfits",
    value: "dojo",
  },
  {
    label: "Marks",
    value: "dojo",
  },
  {
    label: "Powers",
    value: "dojo",
  },
]

const StorePage = () => {
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
  const { provider, signer } = useWallet()
  const { signMessage } = usePrivy()
  const [isMinted, setIsMinted] = useState(false)

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
      setFilteredItems(inventory.filter((item) => item.type === "GEAR"))
    } else if (activeTab === "raids") {
      setFilteredItems(inventory.filter((item) => item.type === "CHARACTER"))
    } else if (activeTab === "dojo") {
      setFilteredItems(inventory.filter((item) => item.type === "ALIEN_PART"))
    } else if (activeTab === "consumable") {
      setFilteredItems(inventory.filter((item) => item.type === "ELEMENT"))
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

      console.log("Burn Response ==>", burnResponse)
      console.log("selectedItem ==>", selectedItem)

      if (burnResponse && burnResponse.success && burnResponse.character) {
        // Show success message
        // toast.success("Gear burned successfully!")

        // // Set the summoned character and open the summon modal
        // setSummonedCharacter(burnResponse.character)

        // // Reset selected item
        // setSelectedItem(null)

        // Refresh inventory
        // fetchInventory()

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

  const handleMintCharacter = async (
    serverSignature: string,
    nonce: number,
    character: Character,
    gearId: number
  ) => {
    const wallet = getEthWallet(wallets)
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
    } catch (error) {
      console.error("Minting error:", error)
      if (error instanceof Error) {
        // More descriptive error message based on the actual error
        if (error.message.includes("user rejected")) {
          toast.error("Transaction was cancelled by user")
        } else {
          toast.error(`Failed to mint: ${error.message}`)
        }
      } else {
        toast.error("Failed to mint characters")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col lg:flex-row gap-3 overflow-hidden">
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
              <div className="relative flex items-center justify-center bg-white/10 rounded-lg">
                <Image
                  src={selectedItem.image || ""}
                  alt="item"
                  width={400}
                  height={400}
                  className="object-cover h-[300px] rounded"
                />

                {/* <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 bg-white/10 backdrop-blur-lg rounded size-8 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button> */}
              </div>

              <div className="flex flex-col gap-3 bg-white/10 rounded-lg p-3">
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
              </div>

              {/* <div className="bg-white/10 rounded-lg p-3 gap-3 flex flex-col">
                <div className="bg-white/10 rounded-lg p-3">
                  <h3 className="font-inter">Burn 4 {selectedItem.name}</h3>
                  <p className="text-xs text-white/60">
                    Use this item to enhance your character or alien.
                  </p>
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

        {/* Main content area - hidden on mobile when item is selected */}
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
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative aspect-square bg-white/10 rounded-tl-lg rounded-tr-lg">
                    <Image
                      src={item.image || ""}
                      alt="item"
                      width={100}
                      height={100}
                      className="object-cover w-full h-full rounded"
                    />
                  </div>
                  <div className="flex flex-col mt-3 gap-1 p-3">
                    <div className="flex items-center justify-between">
                      <p className="truncate mr-2 text-sm">{item.name}</p>
                      <Badge variant="epic">Legendary</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <p className="truncate mr-2">Volume</p>
                      <p className="text-2xs whitespace-nowrap">100</p>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <p className="truncate mr-2">Item price</p>
                      <p className=" text-2xs whitespace-nowrap">50</p>
                    </div>
                    <div className="flex items-center justify-center border border-white/10 rounded-lg p-2 mt-2 hover:bg-white/10 transition-all duration-200">
                      Add to cart
                    </div>
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

export default StorePage
