import { Key } from "react"
import Image from "next/image"
import { InventoryItem } from "@/types"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const EnhancementData = ({
  onSelect,
  forgeList,
  userId,
  forgeListLoading,
}: {
  onSelect: (item: InventoryItem) => void
  forgeList?: any
  userId?: number
  forgeListLoading?: boolean
}) => {
  return (
    <div
      className={cn(
        "w-full h-[calc(100vh-200px)] overflow-y-auto mx-auto bg-white/15 border border-white/10 backdrop-blur-md rounded-2xl p-6",
        forgeListLoading && "flex items-center justify-center"
      )}
    >
      {forgeListLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm"> Loading data...</span>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mt-4 h-full overflow-y-auto">
            {forgeList.length > 0 ? (
              forgeList.map((item: any, index: Key | null | undefined) => (
                <div
                  key={index}
                  className={cn(
                    "w-full h-full backdrop-blur-lg rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-white/10"
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
                      {(userId &&
                        item.userPowers.filter(
                          (power: any) => power.userId === userId
                        )[0]?.power) ||
                        0}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-white/60">
                {forgeList ? "No data found" : "Loading data..."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancementData
