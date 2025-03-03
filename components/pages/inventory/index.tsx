import React, { useState } from "react"
import Image from "next/image"
import { CloudLightning, X } from "lucide-react"

import { cn } from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"

const InventoryTabs = [
  {
    label: "All",
    value: "all",
    icon: CloudLightning,
  },
  {
    label: "Alien Gear",
    value: "gear",
    icon: CloudLightning,
  },
  {
    label: "Alien Raid",
    value: "raids",
    icon: CloudLightning,
  },
  {
    label: "Consumable",
    value: "consumable",
    icon: CloudLightning,
  },
  {
    label: "Dojo Items",
    value: "dojo",
    icon: CloudLightning,
  },
]

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<string>("")

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3">
        <div className="w-full h-full bg-white/5 backdrop-blur-lg rounded p-4">
          <div className="flex gap-2">
            {InventoryTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "px-4 h-10 rounded-lg  border border-white/10  flex-1 font-inter flex items-center gap-2 justify-between text-sm transition-all duration-300",
                  activeTab === tab.value ? "bg-white/20" : " bg-white/5"
                )}
              >
                <span>{tab.label}</span>
                <tab.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 mt-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-full bg-white/5 backdrop-blur-lg rounded-lg p-3 cursor-pointer"
                onClick={() => setSelectedItem(index.toString())}
              >
                <div className=" relative ">
                  <Image
                    src="/images/raids/raid-1.jpg"
                    alt="item"
                    width={100}
                    height={100}
                    className="object-cover w-full h-full rounded"
                  />
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <p>Item name</p>
                  <p className="border border-white/10 px-2  rounded-md text-2xs">
                    x2
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {selectedItem && (
          <div className="w-full h-full bg-white/5 backdrop-blur-lg rounded p-3 max-w-[400px] overflow-y-auto ">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Image
                  src="/images/raids/raid-1.jpg"
                  alt="item"
                  width={400}
                  height={400}
                  className="object-cover w-full h-[300px] rounded"
                />

                <button
                  onClick={() => setSelectedItem("")}
                  className="absolute top-3 right-3 bg-white/10 backdrop-blur-lg rounded size-8 flex items-center justify-center border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                  <h2 className="text-lg">Burn 4 Item Name</h2>
                  <div className="flex items-center  bg-white/10 rounded-lg border border-white/5">
                    <div className="px-2 py-1 bg-white/10 rounded-lg border border-white/10">
                      <span className="text-sm font-inter">Rating</span>
                    </div>
                    <span className="text-[#8CC417] px-3">8,7</span>
                  </div>
                </div>

                <p className="text-xs">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  a tellus sodales, volutpat urna sed, laoreet augue. Aliquam
                  erat volutpat. Mauris egestas eu lorem et porttitor.
                  Pellentesque blandit a purus non blandit. Quisque sit amet
                  auctor ligula. Proin euismod odio non laoreet sagittis.
                </p>
                <div className="bg-white/10 rounded-lg p-3 gap-3 flex flex-col">
                  <div className="bg-white/10 rounded-lg p-3">
                    <h3 className=" font-inter ">Burn 4 Item Name</h3>
                    <p className="text-xs text-white/60">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec a tellus.
                    </p>
                  </div>
                  <BrandButton blurColor="bg-[#96DFF4]" className="w-full">
                    Summon
                  </BrandButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InventoryPage
