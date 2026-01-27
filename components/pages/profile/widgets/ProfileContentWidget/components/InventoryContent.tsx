import { useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useProfile } from "@/store/hooks"
import { Loader2 } from "lucide-react"

import { getStoreInventory } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export const InventoryContent = () => {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get("walletAddress")
  const [storeInventoryItems, setStoreInventoryItems] = useState<any[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const { data: profile } = useProfile()

  useEffect(() => {
    const fetchStoreInventory = async () => {
      setItemsLoading(true)
      try {
        const targetWalletAddress = walletAddress || profile?.walletAddress
        const response = await getStoreInventory(targetWalletAddress)
        if (response?.data && response?.data?.length > 0) {
          setStoreInventoryItems(response.data)
        } else {
          setStoreInventoryItems([])
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error("Error fetching user data:", error)
      } finally {
        setItemsLoading(false)
      }
    }

    void fetchStoreInventory()
  }, [walletAddress, profile?.walletAddress])

  return (
    <ScrollArea className="flex-1">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3 p-0.5">
        {storeInventoryItems.length > 0 && !itemsLoading ? (
          storeInventoryItems?.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl p-3 flex flex-col"
            >
              <div className="h-[250px] rounded-lg bg-white/5 mb-3 relative">
                <Image
                  src={item?.image || ""}
                  alt={item?.name || ""}
                  fill
                  className="rounded-lg"
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center justify-between gap-2 w-full">
                  <span className="text-white font-medium">{item.name}</span>

                  <Badge variant={item?.type?.toLowerCase()}>
                    {item?.type}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center flex-col text-sm">
                <div className="flex items-center gap-1 justify-between w-full">
                  <span className="text-white/50">Item Price</span>
                  <div className="flex items-center gap-1">
                    <span>{item.price || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 justify-between w-full">
                  <span className="text-white/50">Quantity</span>
                  <div className="flex items-center gap-1">
                    <span>{item.quantity || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-white/60">
            {itemsLoading ? (
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
    </ScrollArea>
  )
}
