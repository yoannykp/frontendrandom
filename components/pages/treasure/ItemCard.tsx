import React, { useState } from "react"
import Image from "next/image"
import { Pack } from "@/types"
import { Loader2, Plus } from "lucide-react"

import { createCheckoutSession } from "@/lib/api"
import { isPwa } from "@/hooks/isPwa"

interface ItemCardProps {
  pack: Pack
  setSelectedPack: (pack: Pack) => void
}

const ItemCard = ({ pack, setSelectedPack }: ItemCardProps) => {
  const [isBuying, setIsBuying] = useState(false)
  const isPwaMode = isPwa()

  const handleBuy = async (pack: Pack) => {
    setIsBuying(true)
    const response = await createCheckoutSession("PACK", pack.id)
    if (response.data) {
      // Add event listener before opening new tab
      const handleMessage = (event: MessageEvent) => {
        if (event.data === "PURCHASE_COMPLETE") {
          // Refresh page
          window.location.reload()
        }
      }
      window.addEventListener("message", handleMessage)

      // Check if running as PWA on iOS
      if (isPwaMode) {
        // For PWA, open in same window
        window.location.href = response.data.url
      } else {
        // For regular browser, open in new tab
        window.open(response.data.url, "_blank")
      }
    }
    setIsBuying(false)
  }

  return (
    <div className="bg-white/10 p-4 rounded-lg flex flex-col gap-4  mx-2 border border-white/10 min-h-[500px] h-[calc(100vh-440px)]">
      <div className="flex justify-between items-center border border-white/10  rounded-xl h-12 px-4">
        <p>{pack.name}</p>
        <button
          className="ml-2 rounded-full p-1 border border-white/10 hover:bg-white/10 transition-colors"
          onClick={() => setSelectedPack(pack)}
        >
          <Plus size={12} />
        </button>
      </div>
      <div className="relative flex-1">
        <Image
          src={pack.image}
          alt={pack.name}
          fill
          className="object-contain"
        />
      </div>
      {pack.isPurchased ? (
        <div className="bg-white/10 h-12 rounded flex items-center justify-center text-center px-4">
          <p>Claimed</p>
        </div>
      ) : (
        <button
          className="bg-white/10 h-12 rounded flex items-center justify-between px-4 cursor-pointer hover:bg-white/20 transition-all duration-300"
          onClick={() => handleBuy(pack)}
          disabled={isBuying}
        >
          {isBuying ? (
            <div className="flex items-center gap-2 w-full justify-center">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : (
            <>
              <p className="">Buy for</p>
              <p className="text-[#5FD7FF]">{pack.price}$</p>
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default ItemCard
