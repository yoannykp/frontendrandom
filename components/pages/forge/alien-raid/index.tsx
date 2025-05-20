import { useEffect, useState } from "react"
import Image from "next/image"
import { useInventory } from "@/store/hooks"
import { InventoryItem } from "@/types"

import { cn } from "@/lib/utils"

const AlienRaid = ({
  onSelect,
  isPortal2,
}: {
  onSelect: (item: InventoryItem) => void
  isPortal2?: boolean
}) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const { data: inventory, fetchInventory } = useInventory()

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
        (item) =>
          item.type === "CHARACTER" &&
          item.isPortal2 === isPortal2 &&
          item.upgradesToId !== null
      )
    )
    setLoading(false)
  }, [inventory])

  console.log("items ===>", items)

  return (
    <div>
      {/* <h2 className="font-medium mb-5 bg-white/15 border border-white/10 w-max rounded-xl p-4">
        Alien Raid
      </h2> */}
      <div className="w-full mx-auto bg-white/15 border border-white/10 backdrop-blur-md rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {rewards?.dailyRewards &&
                rewards?.dailyRewards.map((reward) => (
                  <GradientBorder
                    key={reward.id}
                    isSelected={isCurrent(reward)}
                  >
                    <div
                      className={cn(
                        "relative aspect-square rounded-xl overflow-hidden flex flex-col",
                        isClaimed(reward)
                          ? "bg-white/10"
                          : isCurrent(reward)
                            ? "bg-white/10 cursor-pointer"
                            : "bg-white/10 opacity-50"
                      )}
                      onClick={() => {
                        if (isCurrent(reward)) {
                          handleClaim()
                        }
                      }}
                    >
                      <span className="absolute top-2 left-2">{reward.id}</span>

                      <div className="w-full flex-1 flex items-center justify-center relative overflow-hidden">
                        <div className="relative w-3/5 h-3/5">
                          <Image
                            src={getRewardImage(reward) || ""}
                            alt={reward.type}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <Image
                          src={getRewardImage(reward) || ""}
                          alt={reward.type}
                          width={200}
                          height={200}
                          className="opacity-10 !w-[135%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
                        />
                      </div>

                      {!isCurrent(reward) && (
                        <div
                          className={cn(
                            "flex items-center justify-between text-xs bg-white/10 p-2 font-inter",
                            isClaimed(reward) && "text-gray-400"
                          )}
                        >
                          <span>
                            {isClaimed(reward)
                              ? "Claimed"
                              : isCurrent(reward)
                                ? "Claim"
                                : "Not available"}
                          </span>
                          {isClaimed(reward) && <Check className="size-3" />}
                          {!isCurrent(reward) && !isClaimed(reward) && (
                            <Lock className="size-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </GradientBorder>
                ))}
            </div>
          </div> */}

          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mt-4 pb-20 h-full overflow-y-auto">
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
      </div>
    </div>
  )
}

export default AlienRaid
