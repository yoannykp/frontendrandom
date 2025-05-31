import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useWallet } from "@/context/wallet"
import { useCharacters } from "@/store/hooks"
import { Character, Gear } from "@/types"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { ethers } from "ethers"
import toast from "react-hot-toast"

import { handleFailedMint, mintCharacters } from "@/lib/api"
import { cn, handleSignMessage } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import CONTRACT_ABI from "@/app/assets/abi.json"

const SummonModal = ({
  isOpen,
  setIsOpen,
  summonType,
  summonItems,
  handleMultiSummon,
  loading,
  title,
  showCloseButton = false,
  showMintButton = false,
  isMinted,
  setIsMinted,
  hideNextButton = false,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  summonType: "character" | "gear"
  summonItems: Character[] | Gear[]
  handleMultiSummon?: () => void
  loading: boolean
  title?: string
  showCloseButton?: boolean
  showMintButton?: boolean
  isMinted: boolean
  setIsMinted: (isMinted: boolean) => void
  hideNextButton?: boolean
}) => {
  // Get the fetchCharacters function from the useCharacters hook
  const { fetchCharacters } = useCharacters()
  const { signMessage } = usePrivy()
  const { wallets } = useWallets()
  const { provider, signer, wallet } = useWallet()
  const [isMinting, setIsMinting] = useState(false)
  const [unmintedCharacterIds, setUnmintedCharacterIds] = useState<number[]>([])

  // Handle modal close to refresh characters
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Refresh characters when modal is closed
      fetchCharacters()
    }
    setIsOpen(open)
  }

  const handleMintCharacter = async () => {
    if (summonType === "gear") return

    // const wallet = getEthWallet(wallets)
    console.log("wallet ====>", wallet)
    if (!wallet) {
      toast.error("Please connect a wallet")
      return
    }

    if (!provider || !signer) {
      toast.error("Please connect a wallet")
      return
    }

    const charactersIds = summonItems.map((item) => item.id)
    const tokenIds = summonItems
      .map((item) => (item as Character).tokenId)
      .filter((id) => id !== undefined)

    // Validate tokenIds array
    if (!tokenIds.length) {
      toast.error("No valid token IDs found")
      return
    }

    const amounts = new Array(tokenIds.length).fill(1)

    console.log("Wallet ===>", wallet)
    console.log("Token IDs to mint:", tokenIds)

    try {
      // Sign the message for authentication
      const signature = await handleSignMessage(
        tokenIds.join(","),
        wallet,
        signMessage
      )

      if (!signature) {
        toast.error("Failed to sign message")
        return
      }

      setIsMinting(true)

      // Step 1: Get server signature and transaction ID
      const response = await mintCharacters(tokenIds, signature)

      console.log("Mint Response ==>", response)
      if (response.error || !response.data || !response.data.success) {
        setIsMinting(false)

        toast.error(
          response.error?.message ||
            // @ts-expect-error 'error' is not defined in the response
            response.data?.error?.message ||
            "Failed to get mint data"
        )
        if (response.data) {
          const { unmintedCharacterIds } = response.data

          if (unmintedCharacterIds.length > 0) {
            for (const id of unmintedCharacterIds) {
              await handleFailedMint(id)
            }
          }
        }
        return
      }

      if (response.data.success) {
        const { serverSignature, transactionId, nonce, unmintedCharacterIds } =
          response.data

        if (unmintedCharacterIds.length > 0) {
          setUnmintedCharacterIds(unmintedCharacterIds)
        }

        // Step 2: Perform the transaction using the server signature
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
        if (!contractAddress) {
          toast.error("Contract address not configured")
          setIsMinting(false)
          return
        }

        const contract = new ethers.Contract(
          contractAddress,
          CONTRACT_ABI,
          signer
        )

        try {
          // First try to estimate gas to catch potential errors before sending
          const gasEstimate = await contract.mintBatch.estimateGas(
            tokenIds,
            amounts,
            Number(nonce),
            serverSignature
          )

          console.log("Gas estimate:", gasEstimate.toString())

          // Add 20% buffer to gas estimate
          const gasLimit = Math.floor(Number(gasEstimate) * 1.2)

          // Perform the mint transaction with explicit gas limit
          const tx = await contract.mintBatch(
            tokenIds,
            amounts,
            Number(nonce),
            serverSignature,
            {
              gasLimit: gasLimit,
            }
          )

          console.log("Transaction sent:", tx.hash)
          toast.success("Transaction submitted, waiting for confirmation...")

          const receipt = await tx.wait()
          console.log("Transaction confirmed:", receipt)

          toast.success("Minted successfully")
          setIsMinted(true)
          fetchCharacters() // Refresh the characters list
        } catch (txError: any) {
          console.error("Transaction error:", txError)

          if (unmintedCharacterIds.length > 0) {
            for (const id of unmintedCharacterIds) {
              await handleFailedMint(id)
            }
            setUnmintedCharacterIds([])
          }

          // Handle specific error cases
          if (txError.code === "ACTION_REJECTED") {
            toast.error("Transaction was rejected by user")
          } else if (txError.reason) {
            toast.error(`Transaction failed: ${txError.reason}`)
          } else {
            toast.error(
              "Transaction failed. Please check your wallet and try again."
            )
          }

          setIsMinting(false)
        }
      }
    } catch (error: any) {
      if (unmintedCharacterIds.length > 0) {
        for (const id of unmintedCharacterIds) {
          await handleFailedMint(id)
        }
        setUnmintedCharacterIds([])
      }
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

      setIsMinting(false)
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <Dialog modal={false} open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[url('/images/modal-bg.jpeg')] bg-cover bg-center bg-no-repeat min-w-full h-screen max-h-[calc(100dvh)] overflow-y-auto rounded-none ">
        <div className="flex flex-col gap-4 z-10 relative justify-center items-center">
          <div className="px-20 w-max bg-white/10 border-white/10 border rounded-xl py-6 relative overflow-hidden font-volkhov text-xl">
            {title || "Summon Result"}
            <span
              className={cn(
                "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                "group-disabled:group-hover:h-[30px]",
                "bg-[#EF98E6]"
              )}
            />
          </div>

          <div className="flex flex-wrap max-w-4xl my-10 justify-center">
            {summonItems.map((item, index) => (
              <Image
                key={index}
                src={item.image || ""}
                alt={summonType === "character" ? "Character" : "Gear"}
                width={500}
                height={500}
                className="size-48 -mx-4 -my-2.5"
              />
            ))}
          </div>

          <div className="flex gap-5 ">
            {showCloseButton && (
              <button
                onClick={() => setIsOpen(false)}
                className="px-10 w-max bg-white/10 border-white/10 border rounded-xl py-5 relative overflow-hidden font-volkhov text-lg flex items-center justify-center group"
              >
                Close
                <span
                  className={cn(
                    "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                    "group-disabled:group-hover:h-[30px]",
                    "bg-[#EF98E6]"
                  )}
                />
              </button>
            )}
            {/* {showMultiSummon && (
              <div className="bg-white/10 px-4 py-2 rounded-xl relative overflow-hidden border border-white/10">
                <h3 className="font-volkhov">
                  {summonType === "character"
                    ? "Multi Summon"
                    : "Multi Gear Summon"}
                </h3>

                <button
                  onClick={handleMultiSummon}
                  disabled={loading}
                  className="group mt-1 w-full bg-white/10 px-3 py-1 rounded-lg relative overflow-hidden border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2 justify-between z-10 w-full ">
                    <span>{summonType === "character" ? "1000" : "1000"}</span>
                    <Image
                      src="/images/stars.png"
                      alt="Star"
                      width={20}
                      height={20}
                    />
                  </div>
                </button>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[50px] blur-[15px] z-[-1] group-hover:h-[40px] duration-500 transition-all bg-[#EF98E6]"></div>
              </div>
            )} */}
            {showMintButton && (
              <button
                onClick={handleMintCharacter}
                className="px-10 w-max bg-white/10 border-white/10 border rounded-xl py-5 relative overflow-hidden font-volkhov text-lg flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isMinting || isMinted}
              >
                {isMinting ? "Minting..." : isMinted ? "Minted" : "Mint"}
                {summonItems.length > 1 ? " All" : " Character"}
                <span
                  className={cn(
                    "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                    "group-disabled:group-hover:h-[30px]",
                    "bg-[#EF98E6]"
                  )}
                />
              </button>
            )}
            {!hideNextButton && (
              <Link
                href={summonType === "character" ? "/team" : "/inventory"}
                className="px-10 w-max bg-white/10 border-white/10 border rounded-xl py-5 relative overflow-hidden font-volkhov text-lg flex items-center justify-center group"
              >
                Next
                <span
                  className={cn(
                    "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                    "group-disabled:group-hover:h-[30px]",
                    "bg-[#EF98E6]"
                  )}
                />
              </Link>
            )}
          </div>
        </div>

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

export default SummonModal
