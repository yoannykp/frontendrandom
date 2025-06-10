import { useEffect, useState } from "react"
import Image from "next/image"
import { useInventory } from "@/store/hooks"
import { InventoryItem } from "@/types"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { cn } from "@/lib/utils"

const PromotionData = ({
  onSelect,
  onClose,
}: {
  onSelect: (item: InventoryItem) => void
  onClose: () => void
}) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const {
    data: inventory,
    fetchInventory,
    loading: inventoryLoading,
  } = useInventory()
  const portalTabs = [
    { title: "Portal 1", isPortal2: false },
    { title: "Portal 2", isPortal2: true },
  ]
  const [activeTab, setActiveTab] = useState(portalTabs[0])
  const handleTabChange = (tab: { title: string; isPortal2: boolean }) => {
    const filteredItems = inventory?.filter((item) => {
      if (tab.isPortal2) {
        return (
          item.type === "CHARACTER" &&
          item.upgradesToId !== null &&
          item.isPortal2 === true
        )
      } else {
        return (
          item.type === "CHARACTER" &&
          item.upgradesToId !== null &&
          item.isPortal2 === false
        )
      }
    })
    setItems(filteredItems || [])
    setActiveTab(tab)
  }

  console.log("inventory ====>", inventory)

  useEffect(() => {
    fetchInventory()
  }, [])

  useEffect(() => {
    if (!inventory) {
      setItems([])
      return
    }

    // Check if inventory is an object
    if (typeof inventory !== "object") {
      toast.error("Failed to load inventory")
      onClose()
      return
    }

    // if (!inventory?.success) {
    //   toast.error(inventory?.error?.message || "Failed to load inventory")
    //   onClose()
    //   return
    // }

    const filteredItems = Array.isArray(inventory)
      ? inventory.filter(
          (item) => item.type === "CHARACTER" && item.upgradesToId !== null
        )
      : []

    setItems(filteredItems || [])
    setLoading(false)
  }, [inventory])

  return (
    <div
      className={cn(
        "w-full h-[calc(100vh-200px)] overflow-y-auto mx-auto bg-white/15 border border-white/10 backdrop-blur-md rounded-2xl p-6",
        inventoryLoading && "flex items-center justify-center"
      )}
    >
      {!inventoryLoading ? (
        <div className="flex gap-2 max-lg:flex-wrap pb-2 scrollbar-hide">
          {portalTabs.map((tab) => (
            <button
              key={tab.title}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "px-3 sm:px-4 h-10 w-full rounded-lg border border-white/10 whitespace-nowrap flex items-center gap-2 justify-between text-xs sm:text-sm transition-all duration-300",
                activeTab.title === tab.title ? "bg-white/20" : "bg-white/5"
              )}
            >
              <span>{tab.title}</span>
            </button>
          ))}
        </div>
      ) : (
        ""
      )}
      {inventoryLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm"> Loading data...</span>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mt-4 h-full overflow-y-auto">
            {items.length > 0
              ? items.map((item, index) => (
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
              : ""}
          </div>
        </div>
      )}
      {!inventoryLoading && items.length === 0 && inventory && (
        <div className="col-span-full text-white/60 w-full h-full flex items-center justify-center">
          No data found
        </div>
      )}
    </div>
  )
}

export default PromotionData
