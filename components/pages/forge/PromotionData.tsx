import { useEffect, useState } from "react"
import Image from "next/image"
import { useInventory } from "@/store/hooks"
import { InventoryItem } from "@/types"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const PromotionData = ({
  onSelect,
}: {
  onSelect: (item: InventoryItem) => void
}) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const {
    data: inventory,
    fetchInventory,
    loading: inventoryLoading,
  } = useInventory()

  useEffect(() => {
    fetchInventory()
  }, [])

  useEffect(() => {
    if (!inventory) {
      setItems([])
      return
    }

    setItems(
      inventory.filter(
        (item) => item.type === "CHARACTER" && item.upgradesToId !== null
      )
    )
    setLoading(false)
  }, [inventory])

  return (
    <div
      className={cn(
        "w-full h-[calc(100vh-200px)] overflow-y-auto mx-auto bg-white/15 border border-white/10 backdrop-blur-md rounded-2xl p-6",
        inventoryLoading && "flex items-center justify-center"
      )}
    >
      {inventoryLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm"> Loading data...</span>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mt-4 h-full overflow-y-auto">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-full h-full backdrop-blur-lg rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-white/10",
                    selectedItem?.id === item.id &&
                      selectedItem?.type === item.type
                      ? "bg-white/20"
                      : "bg-white/5"
                  )}
                  onClick={() => onSelect(item)}
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
              <div className="col-span-full text-white/60">
                {inventory ? "No data found" : "Loading data..."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PromotionData
