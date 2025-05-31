import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Character, ForgeTabs, InventoryItem } from "@/types"
import { ArrowLeft, ArrowRight, Check, Loader2, Lock, Plus } from "lucide-react"
import type { Swiper as SwiperType } from "swiper"
import { EffectCoverflow, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import "@/styles/swiper.css"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/navigation"

import { useWallet } from "@/context/wallet"
import { useAliens, useProfile } from "@/store/hooks"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { ethers } from "ethers"
import toast from "react-hot-toast"

import {
  enhanceAlienPart,
  fetchCharacterTiers,
  forgeAlienPart,
  getForgeList,
  getOwnedAlienParts,
  upgradeCharacter,
} from "@/lib/api"
import { cn, getEthWallet, handleSignMessage } from "@/lib/utils"
import CONTRACT_ABI from "@/app/assets/abi.json"

import SummonModal from "../draw/SummonModal"
import Modal from "./Modal"

const formatRemainingTime = (targetDate: string) => {
  if (!targetDate) return null

  const now = new Date()
  const target = new Date(targetDate)
  const timeDiff = target.getTime() - now.getTime()

  // Return null if the date has passed
  if (timeDiff < 0) return null

  const hours = Math.floor(timeDiff / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

  return {
    hours,
    minutes,
    seconds,
  }
}

const CustomArrow = ({
  direction,
  onClick,
}: {
  direction: "left" | "right"
  onClick?: () => void
}) => (
  <button
    onClick={onClick}
    className="size-12 rounded-xl bg-white/15 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white"
  >
    {direction === "left" ? (
      <ArrowLeft className="w-5 h-5" />
    ) : (
      <ArrowRight className="w-5 h-5" />
    )}
  </button>
)

// eslint-disable-next-line complexity
const ForgePage = ({ activeTab }: { activeTab: ForgeTabs }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeItem, setActiveItem] = useState<any>(null)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const swiperRef = useRef<SwiperType>()
  const [forgeList, setForgeList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userRuneAmounts, setUserRuneAmounts] = useState<any>({
    COMMON: 0,
    UNCOMMON: 0,
    RARE: 0,
    EPIC: 0,
    LEGENDARY: 0,
  })
  const [selectedCharacter, setSelectedCharacter] = useState<
    Character | InventoryItem | null
  >(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [characterTiers, setCharacterTiers] = useState<any>({})
  const [tierObj, setTierObj] = useState<any>(null)
  const [selectedForPromotion, setSelectedForPromotion] = useState<any>(null)
  const { wallets } = useWallets()
  const { provider, signer, wallet } = useWallet()
  const [dataLoaded, setDataLoaded] = useState(false)
  const { signMessage } = usePrivy()
  const [promotedCharacter, setPromotedCharacter] = useState<Character | null>(
    null
  )
  const [isSummonModalOpen, setIsSummonModalOpen] = useState(false)
  const [isMinted, setIsMinted] = useState(false)
  const [selectedEnhancementObj, setSelectedEnhancementObj] =
    useState<any>(null)
  const [userEnhancedParts, setUserEnhancedParts] = useState<any[]>([])
  const { data: profile } = useProfile()
  const { alien } = useAliens()
  const [forgeListLoading, setForgeListLoading] = useState(false)
  const [remainingTime, setRemainingTime] = useState<string | null>(null)

  console.log("profile ====>", profile?.id, alien?.userId)

  useEffect(() => {
    fetchInitialData()
  }, [selectedCharacter, activeTab])

  const fetchInitialData = async () => {
    await fetchForgeList()
    fetchCharacterTiers().then((res) => {
      setCharacterTiers(res.data?.allCharacterTiers || {})
      setDataLoaded(true)
    })
    await getOwnedAlienParts().then((res) => {
      console.log("res.data?.userAlienParts", res)
      setUserEnhancedParts(res.data?.alienPartsList || [])
    })
  }

  useEffect(() => {
    if (
      (activeTab === ForgeTabs.ENHANCEMENT ||
        activeTab === ForgeTabs.PROMOTION) &&
      selectedCharacter &&
      dataLoaded
    ) {
      const portalTiers = [...characterTiers.portal2, ...characterTiers.portal1]
      // if (activeTab === ForgeTabs.ENHANCEMENT) {
      //   portalTiers = characterTiers.portal2
      // } else if (activeTab === ForgeTabs.PROMOTION) {
      //   portalTiers = characterTiers.portal1
      // }

      const tierObj = portalTiers?.find((tierObj: any) => {
        const stageName = `stage${selectedCharacter.tier}`
        return tierObj[stageName]?.id === selectedCharacter.id
      })

      setSelectedCharacter(null)

      if (!tierObj) {
        toast.error("Character not found")
        return
      }

      setTierObj(tierObj)

      console.log("Found tier object ===>", tierObj)
    }
  }, [selectedCharacter, activeTab, characterTiers, dataLoaded])

  useEffect(() => {
    setTierObj(null)
    setSelectedForPromotion(null)
    setPromotedCharacter(null)
    setIsSummonModalOpen(false)
    setIsMinted(false)
    setSelectedEnhancementObj(null)
  }, [activeTab])

  // Add this useEffect for countdown
  useEffect(() => {
    if (!activeItem?.userForgeTime) {
      setRemainingTime(null)
      return
    }

    const updateTime = () => {
      const time = formatRemainingTime(activeItem.userForgeTime)
      if (!time) {
        setRemainingTime(null)
        return
      }
      const formattedTime = `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}:${String(time.seconds).padStart(2, "0")}`
      setRemainingTime(formattedTime)
    }

    updateTime() // Initial update
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [activeItem?.userForgeTime])

  // Function to handle forge request
  const handleForge = async () => {
    if (!activeItemId) return
    setIsLoading(true)
    try {
      const response = await forgeAlienPart(Number(activeItemId))
      if (response.data?.success) {
        // Get the current real index from the swiper
        const currentRealIndex = swiperRef.current?.realIndex || 0
        // Update active item based on the current slide after refetching
        if (forgeList[currentRealIndex]) {
          setActiveItem(forgeList[currentRealIndex])
          setActiveItemId(forgeList[currentRealIndex].id)
        }
        await fetchForgeList()
        toast.success(response.data?.message || "Forge successful")
      } else {
        toast.error(
          response.data?.error?.message ||
            response?.data?.message ||
            "Forge failed"
        )
      }
    } catch (error) {
      console.error("Error forging item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle enhance request
  const handleEnhance = async () => {
    if (!selectedEnhancementObj) return
    setIsLoading(true)
    try {
      const response = await enhanceAlienPart(Number(selectedEnhancementObj.id))
      if (response.data?.success) {
        await fetchInitialData()

        setSelectedEnhancementObj(null)
        toast.success("Enhanced successfully")
      } else {
        toast.error(
          response.data?.error?.message ||
            response?.data?.message ||
            "Enhance failed"
        )
      }
    } catch (error) {
      console.error("Error enhancing item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchForgeList = async () => {
    try {
      setForgeListLoading(true)
      const res = await getForgeList()
      const sortedForgeList = res.data?.alienParts.sort(
        (a: any, b: any) => a.id - b.id
      )
      setForgeList(sortedForgeList || [])
      setUserRuneAmounts(
        res.data?.userRuneAmounts || {
          COMMON: 0,
          UNCOMMON: 0,
          RARE: 0,
          EPIC: 0,
          LEGENDARY: 0,
        }
      )

      // Get the current real index from the swiper
      const currentRealIndex = swiperRef.current?.realIndex || 0

      // Set active item based on the current slide after refetching
      if (sortedForgeList && sortedForgeList.length > 0) {
        if (sortedForgeList[currentRealIndex]) {
          setActiveItem(sortedForgeList[currentRealIndex])
          setActiveItemId(sortedForgeList[currentRealIndex].id)
        } else {
          // Fallback to first item if current index is no longer valid
          setActiveItem(sortedForgeList[0])
          setActiveItemId(sortedForgeList[0].id)
        }
      }
      setForgeListLoading(false)
      return res
    } catch (error) {
      console.error("Error fetching forge list:", error)
      return { data: { alienParts: [], userRuneAmounts: {} } }
    } finally {
      setForgeListLoading(false)
    }
  }

  const handlePromote = async () => {
    if (!selectedForPromotion) return
    setIsLoading(true)

    try {
      const response = await upgradeCharacter(selectedForPromotion.id)

      const upgradeResponse = response.data

      if (upgradeResponse && upgradeResponse.success) {
        // Show success message
        // toast.success("Promoted successfully!")

        // Set the summoned character and open the summon modal

        // Reset selected item
        // setSelectedForPromotion(null)

        // Refresh inventory
        // fetchForgeList()

        handleMintCharacter(
          upgradeResponse.serverSignature,
          upgradeResponse.nonce,
          upgradeResponse.character,
          upgradeResponse.oldTokenId,
          upgradeResponse.oldTokenAmount,
          upgradeResponse.newTokenId,
          upgradeResponse.newCharacter
        )
      } else {
        // @ts-expect-error 'burnResponse' is not typed
        toast.error(upgradeResponse?.error?.message || "Failed to promote")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error promoting character:", error)
      setIsLoading(false)
    } finally {
      // setIsLoading(false)
    }
  }

  const handleMintCharacter = async (
    serverSignature: string,
    nonce: number,
    character: Character,
    oldTokenId: number,
    oldTokenAmount: number,
    newTokenId: number,
    newCharacter: Character
  ) => {
    // const wallet = getEthWallet(wallets)
    console.log("wallet ====>", wallet)
    if (!wallet) {
      toast.error("Please connect a wallet")
      return
    }

    console.log("oldTokenAmount ===>", oldTokenAmount, oldTokenId, newTokenId)

    if (!provider || !signer) {
      toast.error("Please connect a wallet")
      return
    }

    const charactersIds = [character.id]
    // const tokenIds = [character.tokenId]
    // const amounts = new Array(tokenIds.length).fill(1)

    const oldTokenIds = [oldTokenId]
    const newTokenIds = [newTokenId]
    // const amounts = new Array(oldTokenIds.length).fill(1)
    const amounts = new Array(oldTokenIds.length).fill(oldTokenAmount)

    const signature = await handleSignMessage(
      charactersIds.join(","),
      wallet,
      signMessage
    )

    if (!signature) {
      toast.error("Please connect a wallet")
      return
    }

    try {
      // Step 2: Perform the transaction using the server signature
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
      if (!contractAddress) {
        toast.error("Contract address not configured")
        return
      }

      const contract = new ethers.Contract(
        contractAddress,
        CONTRACT_ABI,
        signer
      )

      // Perform the mint transaction
      const tx = await contract.upgrade(
        oldTokenIds,
        amounts,
        newTokenId,
        Number(nonce),
        serverSignature
      )
      const receipt = await tx.wait()

      console.log("Tx ==> ", tx)
      console.log("Receipt ==> ", receipt)

      setSelectedForPromotion(null)
      fetchInitialData()

      // TODO: Remove this if separate promotion and enhancement pages are created
      // Reset selected character and tier object
      setSelectedCharacter(null)
      setTierObj(null)

      setPromotedCharacter(newCharacter)
      setIsSummonModalOpen(true)
      toast.success("Promoted successfully!")
    } catch (error: any) {
      console.error("Minting error:", error)
      // if (error instanceof Error) {
      //   // More descriptive error message based on the actual error
      //   if (error.message.includes("user rejected")) {
      //     toast.error("Transaction cancelled")
      //   } else if (error.message.includes("insufficient funds")) {
      //     toast.error("Insufficient funds")
      //   } else {
      //     toast.error("Failed to mint. Please try again")
      //   }
      // } else {
      //   toast.error("Failed to mint. Please try again")
      // }
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
      setIsLoading(false)
    }
  }

  console.log("selectedEnhancementObj ====>", selectedEnhancementObj)
  console.log("forgeList ====>", forgeList)

  // Break down the complex function into smaller helper functions
  const renderStage1 = (tierObj: any) => (
    <div
      className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3 cursor-pointer"
      onClick={() => setSelectedForPromotion(tierObj?.stage1)}
    >
      {/* Stage 1 content */}
      <div className="aspect-square relative">
        {tierObj?.stage2?.image ? (
          <Image
            src={tierObj?.stage1?.image}
            alt="Stage 01 image"
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center text-lg text-center rounded-lg">
            Promote to <br /> Unlock
          </div>
        )}
      </div>
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-white mb-3">Stage 01</h2>
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/50 text-sm font-inter">Name</span>
          <span className="text-[#D3EF98] font-medium">
            {tierObj?.stage1?.name || "--"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-sm font-inter">Total</span>
          <span className="text-[#98EFC5] font-medium">
            {tierObj?.stage1?.quantity ?? "--"}
          </span>
        </div>
      </div>
    </div>
  )

  const renderStage2 = (tierObj: any) => (
    <div
      className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3 cursor-pointer"
      onClick={() => setSelectedForPromotion(tierObj?.stage2)}
    >
      {/* Stage 2 content */}
      <div className="aspect-square relative">
        {tierObj?.stage2?.image ? (
          <Image
            src={tierObj?.stage2?.image}
            alt="Stage 02"
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center text-lg text-center rounded-lg">
            Promote to <br /> Unlock
          </div>
        )}
      </div>
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-white mb-3">Stage 02</h2>
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/50 text-sm font-inter">Name</span>
          <span className="text-[#D3EF98] font-medium">
            {tierObj?.stage2?.name || "--"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-sm font-inter">Total</span>
          <span className="text-[#98EFC5] font-medium">
            {tierObj?.stage2?.quantity ?? "--"}
          </span>
        </div>
      </div>
    </div>
  )

  const getPower = () => {
    return selectedEnhancementObj
      ? selectedEnhancementObj.userPowers.filter(
          (power: any) => power.userId === alien?.userId
        )[0]?.power || 0
      : 0
  }

  return (
    <div className="w-full h-full rounded-lg backdrop-blur-xl border border-white/10 p-2">
      <div className="h-full rounded-lg backdrop-blur-lg bg-white/10 px-14 py-10 flex flex-col">
        {activeTab === ForgeTabs.ENHANCEMENT && (
          <div className={cn("h-full w-full max-w-max mx-auto flex flex-col")}>
            {!selectedEnhancementObj ? (
              <div
                className={cn(
                  "h-full w-full max-w-max mx-auto flex flex-col justify-center"
                )}
              >
                <div className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3">
                  <div
                    className="aspect-square relative cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <div className="absolute inset-0 w-full h-full bg-white/10 rounded-md flex items-center justify-center text-lg text-center">
                      <Plus className="w-20 h-20" />
                    </div>
                  </div>
                  <div className="pt-4 w-full justify-center flex items-center">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      Add Item to Enhance{" "}
                    </h2>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center flex-1 max-w-max">
                {/* Stage 01 */}
                <div className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3">
                  {/* Stage 1 content */}
                  <div className="aspect-square relative">
                    <Image
                      src={selectedEnhancementObj?.image}
                      alt="Stage 01 image"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#D3EF98] font-medium">
                        {selectedEnhancementObj?.name || "--"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-sm font-inter">
                        Power
                      </span>
                      <span className="text-[#98EFC5] font-medium">
                        {Number(getPower())}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow and Check Icons */}
                <div className="flex flex-col items-center pt-10 mx-4 space-y-4 h-full">
                  <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                    {4 <
                    Number(
                      userRuneAmounts[selectedEnhancementObj.forgeRuneType] || 0
                    ) ? (
                      <Check />
                    ) : (
                      <Lock />
                    )}
                  </button>
                  <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                    <ArrowRight />
                  </button>
                </div>

                {/* Stage 02 */}
                <div className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3">
                  {/* Stage 1 content */}
                  <div className="aspect-square relative">
                    <Image
                      src={selectedEnhancementObj?.image}
                      alt="Stage 01 image"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#D3EF98] font-medium">
                        {`${selectedEnhancementObj?.name} +5` || "--"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-sm font-inter">
                        Power
                      </span>
                      <span className="text-[#98EFC5] font-medium">
                        {Number(getPower() + 5) ?? "--"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedEnhancementObj && (
              <div className="mt-4 flex items-center space-x-4 bg-white/10 p-2 rounded-xl backdrop-blur-lg">
                <div className="px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1">
                  {selectedEnhancementObj?.name || "--"}
                </div>
                <div className="px-2 !h-14 rounded-xl text-sm border bg-white/5 border-white/10 flex items-center justify-between text-center flex-1">
                  <span>Requested to promote</span>
                  <div className="rounded-full bg-white/10 flex items-center font-inter">
                    <span className="text-[#D3EF98] text-xs px-3">
                      {selectedEnhancementObj?.forgeRuneType &&
                      userRuneAmounts[selectedEnhancementObj.forgeRuneType] !==
                        undefined
                        ? userRuneAmounts[selectedEnhancementObj.forgeRuneType]
                        : 0}
                      /4
                    </span>
                    {selectedEnhancementObj?.image && (
                      <span className="p-0.5 bg-white/10 border border-white/10 rounded-full">
                        <Image
                          src={selectedEnhancementObj?.image}
                          alt="Selected for promotion"
                          width={30}
                          height={30}
                          className="object-cover rounded-full"
                        />
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1 relative group overflow-hidden"
                  onClick={handleEnhance}
                  disabled={
                    !selectedEnhancementObj ||
                    isLoading ||
                    4 >
                      Number(
                        userRuneAmounts[selectedEnhancementObj.forgeRuneType] ||
                          0
                      )
                  }
                  // disabled={
                  //   !selectedEnhancementObj ||
                  //   isLoading ||
                  //   Number(
                  //     selectedEnhancementObj?.forgeRuneType &&
                  //       userRuneAmounts[
                  //         selectedEnhancementObj.forgeRuneType
                  //       ] !== undefined
                  //       ? userRuneAmounts[selectedEnhancementObj.forgeRuneType]
                  //       : 0
                  //   ) < Number(selectedEnhancementObj?.forgeRuneAmount || 0)
                  // }
                >
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all group-disabled:group-hover:h-[30px] bg-[#D3EF98]" />
                  {isLoading ? "Enhancing..." : "Enhance"}
                  {isLoading && (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === ForgeTabs.PROMOTION && (
          <div className={cn("h-full w-full max-w-max mx-auto flex flex-col")}>
            {!selectedCharacter && !tierObj ? (
              <div
                className={cn(
                  "h-full w-full max-w-max mx-auto flex flex-col justify-center"
                )}
              >
                <div className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3">
                  <div
                    className="aspect-square relative cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <div className="absolute inset-0 w-full h-full bg-white/10 rounded-md flex items-center justify-center text-lg text-center">
                      <Plus className="w-20 h-20" />
                    </div>
                  </div>
                  <div className="pt-4 w-full justify-center flex items-center">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      Add Character to Promote
                    </h2>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center flex-1 max-w-max">
                {/* Stage 01 */}
                {renderStage1(tierObj)}

                {/* Arrow and Check Icons */}
                <div className="flex flex-col items-center pt-10 mx-4 space-y-4 h-full">
                  <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                    {tierObj?.stage1?.quantity &&
                    tierObj?.stage1?.upgradeReq &&
                    Number(tierObj?.stage1?.quantity) >=
                      Number(tierObj?.stage1?.upgradeReq) ? (
                      <Check />
                    ) : (
                      <Lock />
                    )}
                  </button>
                  <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                    <ArrowRight />
                  </button>
                </div>

                {/* Stage 02 */}
                {renderStage2(tierObj)}

                {/* Arrow and Check Icons */}
                <div className="flex flex-col items-center pt-10 mx-4 space-y-4 h-full">
                  <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                    {tierObj?.stage2?.quantity &&
                    tierObj?.stage2?.upgradeReq &&
                    Number(tierObj?.stage2?.quantity) >=
                      Number(tierObj?.stage2?.upgradeReq) ? (
                      <Check />
                    ) : (
                      <Lock />
                    )}
                  </button>
                  <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                    <ArrowRight />
                  </button>
                </div>

                {/* Stage 03 - Locked */}
                <div className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3">
                  <div className="aspect-square relative">
                    {tierObj?.stage3?.image && (
                      <Image
                        src={tierObj?.stage3?.image}
                        alt="Stage 03"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {tierObj?.stage3?.quantity < 1 && (
                      <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center text-lg text-center rounded-lg">
                        Promote to <br /> Unlock
                      </div>
                    )}
                  </div>
                  <div className="pt-4">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      Stage 03
                    </h2>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/50 text-sm font-inter">
                        Name
                      </span>
                      <span className="text-[#D3EF98] font-medium">
                        {tierObj?.stage3?.name || "--"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-sm font-inter">
                        Total
                      </span>
                      <span className="text-[#98EFC5] font-medium">
                        {tierObj?.stage3?.quantity ?? "--"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedForPromotion && (
              <div className="mt-8 flex items-center space-x-4 bg-white/10 p-2 rounded-xl backdrop-blur-lg">
                <div className="px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1">
                  {selectedForPromotion?.name || "--"}
                </div>
                <div className="px-5 !h-14 rounded-xl text-sm border bg-white/5 border-white/10 flex items-center justify-between text-center flex-1">
                  <span>Requested to promote</span>
                  <div className="rounded-full bg-white/10 flex items-center font-inter">
                    <span className="text-[#D3EF98] text-xs px-3">
                      {selectedForPromotion?.quantity ?? "--"}/
                      {selectedForPromotion?.upgradeReq ?? "--"}
                    </span>
                    {selectedForPromotion?.image && (
                      <span className="p-0.5 bg-white/10 border border-white/10 rounded-full">
                        <Image
                          src={selectedForPromotion?.image}
                          alt="Selected for promotion"
                          width={30}
                          height={30}
                          className="object-cover rounded-full"
                        />
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1 relative group overflow-hidden"
                  onClick={() => handlePromote()}
                  disabled={
                    Number(selectedForPromotion?.quantity || 0) <
                      Number(selectedForPromotion?.upgradeReq || 0) || isLoading
                  }
                >
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all group-disabled:group-hover:h-[30px] bg-[#D3EF98]" />
                  {isLoading ? "Promoting..." : "Promote"}
                  {isLoading && (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === ForgeTabs.FORGE && (
          <div className="h-full w-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Swiper
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={3}
                initialSlide={1}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 300,
                  modifier: 1,
                  slideShadows: false,
                }}
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper
                }}
                modules={[EffectCoverflow, Navigation]}
                className="w-full py-10"
                onSlideChange={(swiper) => {
                  setActiveIndex(swiper.activeIndex)
                  // Get the real index considering loop mode
                  const realIndex = swiper.realIndex
                  // Update active item ID when slide changes
                  if (forgeList[realIndex]?.id) {
                    setActiveItem(forgeList[realIndex])
                    setActiveItemId(forgeList[realIndex].id)
                  }
                }}
              >
                {forgeList.map((item, index) => (
                  <SwiperSlide key={index} className="w-full">
                    {({ isActive }) => (
                      <div className="rounded-xl transition-all duration-300 p-2">
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={400}
                            height={400}
                            className="object-cover w-full h-full rounded-lg"
                          />
                        </div>
                        {isActive && (
                          <>
                            <h3 className="text-center text-[#5FD7FF] text-xl mt-4">
                              {item.name}
                            </h3>
                            <p className="text-center text-[#5FD7FF] text-lg">
                              Power {item.power}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <div className="absolute -left-22 top-1/2 -translate-y-1/2 z-10">
                <CustomArrow
                  direction="left"
                  onClick={() => swiperRef.current?.slidePrev()}
                />
              </div>
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                <CustomArrow
                  direction="right"
                  onClick={() => swiperRef.current?.slideNext()}
                />
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 right-0 flex flex-col gap-2 w-[300px] p-4">
              <div className="w-full h-14 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <span className="text-[#5FD7FF] text-xl">
                  {activeItem?.name}
                </span>
              </div>
              <div className="w-full h-14 rounded-xl bg-[#1A1D1F]/60 backdrop-blur-md border border-white/10 flex items-center justify-between px-4">
                <span className="text-white/80">Requested to promote</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#5FD7FF]">
                    {activeItem?.forgeRuneType &&
                    userRuneAmounts[activeItem.forgeRuneType] !== undefined
                      ? userRuneAmounts[activeItem.forgeRuneType]
                      : 0}
                    /{activeItem?.forgeRuneAmount || 0}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#5FD7FF]/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#5FD7FF]" />
                  </div>
                </div>
              </div>
              <button
                onClick={handleForge}
                disabled={
                  !activeItemId ||
                  isLoading ||
                  Number(
                    activeItem?.forgeRuneType &&
                      userRuneAmounts[activeItem.forgeRuneType] !== undefined
                      ? userRuneAmounts[activeItem.forgeRuneType]
                      : 0
                  ) < Number(activeItem?.forgeRuneAmount || 0) ||
                  !!activeItem?.userForgeTime
                }
                className="w-full h-14 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center relative group overflow-hidden"
              >
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all group-disabled:group-hover:h-[30px] bg-[#5FD7FF]" />

                {remainingTime ? (
                  <span className="text-white text-sm ml-2">
                    {remainingTime}
                  </span>
                ) : (
                  <span className="text-white text-xl">
                    {isLoading ? "Forging..." : "Forge"}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={(item) => {
            setDataLoaded(false)
            if (activeTab === ForgeTabs.ENHANCEMENT) {
              setSelectedEnhancementObj(item)
            } else {
              setSelectedCharacter(item)
            }
            setIsModalOpen(false)
          }}
          forgeList={userEnhancedParts}
          isEnhancement={activeTab === ForgeTabs.ENHANCEMENT}
          userId={alien?.userId}
          forgeListLoading={forgeListLoading}
        />

        {/* Summon Modal for showing character after promoting */}
        {promotedCharacter && (
          <SummonModal
            title="Promoted Character"
            isOpen={isSummonModalOpen}
            setIsOpen={setIsSummonModalOpen}
            summonType="character"
            summonItems={[promotedCharacter]}
            loading={false}
            showCloseButton={true}
            isMinted={isMinted}
            setIsMinted={setIsMinted}
            hideNextButton={true}
          />
        )}
      </div>
    </div>
  )
}

export default ForgePage
