import { useEffect, useState } from "react"
import Image from "next/image"
import { useWallet } from "@/context/wallet"
import { useCharacters } from "@/store/hooks"
import { fetchCharacters } from "@/store/slices/charactersSlice"
import { Character, ForgeTabs } from "@/types"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { ethers } from "ethers"
import { ArrowLeft, ArrowRight, Check, Lock, Plus } from "lucide-react"
import toast from "react-hot-toast"

import { getCharacterTiers, upgradeCharacter } from "@/lib/api"
import { cn, handleSignMessage } from "@/lib/utils"
import { useIsMobile } from "@/hooks/useIsMobile"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import CONTRACT_ABI from "@/app/assets/abi.json"

// Select Character Modal Component
const SelectCharacterModal = ({
  onCharacterSelect,
}: {
  onCharacterSelect: (character: Character) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: characters } = useCharacters()
  const isMobile = useIsMobile()

  const handleSelectCharacter = (character: Character) => {
    onCharacterSelect(character)
    setIsOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="glass-effect p-4 rounded-2xl flex items-center justify-center">
          <span className="text-2xl font-volkhov glass-effect size-12 rounded-lg flex items-center justify-center">
            <Plus />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[url('/images/modal-bg.jpeg')] bg-cover bg-center bg-no-repeat min-w-full h-screen max-h-[calc(100dvh)] overflow-y-auto rounded-none p-0">
        <div className="flex flex-col gap-4 z-10 relative justify-center items-center w-full h-full p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="px-6 md:px-12 lg:px-20 py-3 md:py-4 lg:py-6 w-max bg-white/10 border-white/10 border rounded-xl relative overflow-hidden font-volkhov text-base md:text-lg lg:text-xl">
            Select Character
            <span
              className={cn(
                "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                "group-disabled:group-hover:h-[30px]",
                "bg-[#D3EF98]"
              )}
            />
          </div>

          {/* Character grid */}
          <div className="flex flex-wrap justify-center w-full max-w-full md:max-w-4xl my-4 md:my-6 lg:my-10 gap-2 md:gap-0 overflow-y-auto max-h-[50vh] md:max-h-[60vh] p-2">
            {!characters || characters.length === 0 ? (
              <div className="text-center py-6 md:py-10">
                <p className="text-lg md:text-xl">No characters available</p>
                <p className="text-sm text-white/70 mt-2">
                  Go to Draw page to summon characters
                </p>
              </div>
            ) : (
              characters.map((character) => (
                <div
                  key={character.id}
                  className={cn(
                    "relative cursor-pointer transition-all duration-300 transform hover:scale-105",
                    isMobile ? "w-[45%] md:w-auto" : "w-auto"
                  )}
                  onClick={() => handleSelectCharacter(character)}
                >
                  <div className="relative">
                    <Image
                      src={character.image || "/images/character-img.png"}
                      alt={character.name}
                      width={500}
                      height={500}
                      className={cn(
                        "object-contain",
                        isMobile
                          ? "w-full h-auto"
                          : "size-40 md:size-44 lg:size-48 -mx-2 md:-mx-4 -my-1 md:-my-2.5"
                      )}
                    />
                    <div className="absolute bottom-0 left-0 right-0 text-center bg-black/50 py-1 mx-1 md:mx-4">
                      <p className="text-xs md:text-sm truncate px-1">
                        {character.name}
                      </p>
                      <p className="text-xs text-white/70">
                        {character.rarity} • {character.power}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Background overlay */}
        <div
          style={{
            background:
              "radial-gradient(523.95% 555.02% at -125.98% -386.39%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></div>
      </DialogContent>
    </Dialog>
  )
}

const ForgePage = ({ activeTab }: { activeTab: ForgeTabs }) => {
  const { data: characters } = useCharacters()
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )
  const [characterTiers, setCharacterTiers] = useState<Character[]>([])
  const [serverSignature, setServerSignature] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { signMessage } = usePrivy()
  const { wallets } = useWallets()
  const { provider, signer } = useWallet()
  useEffect(() => {
    if (characters) {
      setSelectedCharacter(characters[0])
    }
  }, [characters])

  useEffect(() => {
    const fetchCharacterTiers = async () => {
      if (selectedCharacter) {
        const res = await getCharacterTiers(selectedCharacter.id)
        if (res.data?.success) {
          setCharacterTiers(res.data.characters)
        }
      }
    }
    fetchCharacterTiers()
  }, [selectedCharacter])

  const handleUpgradeCharacter = async () => {
    try {
      if (!selectedCharacter) return
      setLoading(true)
      const response = await upgradeCharacter(selectedCharacter?.id)

      if (response.error) {
        toast.error(response.error.message)
        return
      }
      setServerSignature(response.data?.serverSignature || "")
    } catch (error) {
      toast.error("Error upgrading character")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleMintCharacter = async (character: Character) => {
    const wallet = wallets[0]
    if (!wallet) {
      toast.error("Please connect a wallet")
      return
    }

    if (!provider || !signer) {
      toast.error("Please connect a wallet")
      return
    }

    const charactersIds = [character.id]
    const tokenIds = [character.tokenId]
    const amounts = new Array(tokenIds.length).fill(1)

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
      const tx = await contract.mintBatch(tokenIds, amounts, serverSignature)
      const receipt = await tx.wait()

      console.log(receipt)

      toast.success("Upgraded successfully")
      fetchCharacters() // Refresh the characters list
    } catch (error) {
      console.error("Minting error:", error)
      toast.error("Failed to mint characters")
    }
  }

  return (
    <div className="w-full h-full rounded-lg backdrop-blur-xl border border-white/10 p-2">
      <div className=" h-full rounded-lg backdrop-blur-lg bg-white/10 px-14 py-10 flex flex-col ">
        {activeTab === ForgeTabs.ENHANCEMENT && (
          <div className="h-full w-full max-w-max mx-auto flex flex-col">
            {/* Main content */}
            <div className="flex  justify-center flex-1 max-w-max ">
              {/* Stage 01 */}
              <div className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3 ">
                <div className="aspect-square  relative">
                  <Image
                    src="/images/cat.jpeg"
                    alt="Stage 01 - Green Cat"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-4 ">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Stage 01
                  </h2>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#D3EF98] font-medium">
                      50% Boost
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#98EFC5] font-medium">+4</span>
                  </div>
                </div>
              </div>

              {/* Arrow and Check Icons */}
              <div className="flex flex-col items-center pt-10 mx-4 space-y-4 h-full">
                <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                  <ArrowLeft />
                </button>
                <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                  <Check />
                </button>
              </div>

              {/* Stage 02 */}
              <div className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3 ">
                <div className="aspect-square  relative">
                  <Image
                    src="/images/girl.jpeg"
                    alt="Stage 01 - Green Cat"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-4 ">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Stage 02
                  </h2>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#D3EF98] font-medium">
                      50% Boost
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#98EFC5] font-medium">+6</span>
                  </div>
                </div>
              </div>

              {/* Lock Icon */}
              <div className="flex flex-col items-center pt-10 mx-4 h-full">
                <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                  <Lock />
                </button>
              </div>

              {/* Stage 03 - Locked */}
              <div className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3 ">
                <div className="aspect-square  relative">
                  <Image
                    src="/images/girl.jpeg"
                    alt="Stage 01 - Green Cat"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 w-full h-full bg-black/70 flex items-center justify-center text-lg text-center"
                    // style={{
                    //   background:
                    //     "linear-gradient(204.14deg, rgba(255, 255, 255, 0) -1.34%, rgba(255, 255, 255, 0.0483146) 19.02%, rgba(255, 255, 255, 0.1) 43.97%, rgba(255, 255, 255, 0) 100.48%)",
                    // }}
                  >
                    Promote to <br /> Unlock
                  </div>
                </div>
                <div className="pt-4 ">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Stage 02
                  </h2>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#D3EF98] font-medium">
                      50% Boost
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#98EFC5] font-medium">+6</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="mt-8 flex items-center space-x-4 bg-white/10 p-2 rounded-xl backdrop-blur-lg">
              <div
                className={cn(
                  " px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1"
                )}
              >
                Object Name
              </div>
              <div
                className={cn(
                  " px-5 !h-14 rounded-xl text-sm border bg-white/5 border-white/10 flex items-center justify-between text-center flex-1"
                )}
              >
                <span>Requested to promote</span>
                <div className="rounded-full bg-white/10 flex  items-center  font-inter">
                  <span className="text-[#D3EF98] text-xs px-3">4/4</span>
                  <span className="p-0.5 bg-white/10 border border-white/10 rounded-full">
                    <Image
                      src="/images/girl.jpeg"
                      alt="Stage 01 - Green Cat"
                      width={30}
                      height={30}
                      className=" object-cover rounded-full"
                    />
                  </span>
                </div>
              </div>
              <button
                className={cn(
                  " px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1 relative group overflow-hidden"
                )}
              >
                <span
                  className={cn(
                    "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                    "group-disabled:group-hover:h-[30px] bg-[#D3EF98]"
                  )}
                />
                Promote
              </button>
            </div>
          </div>
        )}
        {activeTab === ForgeTabs.PROMOTION && (
          <div className="h-full w-full max-w-max mx-auto flex flex-col">
            {selectedCharacter ? (
              <>
                {/* Main content */}
                <div className="flex flex-col lg:flex-row  justify-center flex-1 max-w-max ">
                  {/* Stage 01 */}
                  <div className="w-full max-w-lg flex flex-col ">
                    <h3 className="text-center text-xl">Tier 1</h3>
                    <div className="aspect-square  relative">
                      <Image
                        src="/images/character-img.png"
                        alt="Stage 01 - Green Cat"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Arrow and Check Icons */}
                  <div className="flex flex-col items-center pt-20  gap-4 h-full">
                    <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                      <Check />
                    </button>
                    <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                      <ArrowRight />
                    </button>
                  </div>

                  {/* Stage 02 */}
                  <div className="w-full max-w-lg flex flex-col  ">
                    <h3 className="text-center text-xl">Tier 2</h3>
                    <div className="aspect-square  relative">
                      <Image
                        src="/images/character-img.png"
                        alt="Stage 01 - Green Cat"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Lock Icon */}
                  <div className="flex flex-col items-center pt-20  gap-4 h-full">
                    <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                      <Lock />
                    </button>
                    <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                      <ArrowRight />
                    </button>
                  </div>

                  <div className="w-full max-w-lg flex flex-col">
                    <h3 className="text-center text-xl">Tier 1</h3>
                    <div className="aspect-square  relative">
                      <Image
                        src="/images/character-img.png"
                        alt="Stage 01 - Green Cat"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom controls */}
                <div className="mt-8 flex items-center space-x-4 bg-white/10 p-2 rounded-xl backdrop-blur-lg">
                  <div
                    className={cn(
                      " px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1"
                    )}
                  >
                    Object Name
                  </div>
                  <div
                    className={cn(
                      " px-5 !h-14 rounded-xl text-sm border bg-white/5 border-white/10 flex items-center justify-between text-center flex-1"
                    )}
                  >
                    <span>Requested to promote</span>
                    <div className="rounded-full bg-white/10 flex  items-center  font-inter">
                      <span className="text-[#D3EF98] text-xs px-3">4/4</span>
                      <span className="p-0.5 bg-white/10 border border-white/10 rounded-full">
                        <Image
                          src="/images/girl.jpeg"
                          alt="Stage 01 - Green Cat"
                          width={30}
                          height={30}
                          className=" object-cover rounded-full"
                        />
                      </span>
                    </div>
                  </div>
                  <button
                    className={cn(
                      " px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1 relative group overflow-hidden"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                        "group-disabled:group-hover:h-[30px] bg-[#D3EF98]"
                      )}
                    />
                    Promote
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-bold mb-6">Select a character</h1>
                <SelectCharacterModal
                  onCharacterSelect={setSelectedCharacter}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgePage
