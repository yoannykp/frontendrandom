import Image from "next/image"
import { useAliens, useProfile, useTeam } from "@/store/hooks"
import { ArrowLeft, ArrowRight, Plus } from "lucide-react"

import { cn, formatNumber } from "@/lib/utils"
import IconButton from "@/components/ui/icon-button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const DOJO_ITEMS = [
  {
    id: 1,
    value: "hairs",
    label: "Hairs",
    image: "/images/pages/dojo/hairs.png",
  },
  {
    id: 2,
    value: "eyes",
    label: "Eyes",
    image: "/images/pages/dojo/eyes.png",
  },
  {
    id: 3,
    value: "mouth",
    label: "Mouth",
    image: "/images/pages/dojo/mouth.png",
  },
  {
    id: 4,
    value: "background",
    label: "Background",
    image: "/images/pages/dojo/background.png",
  },
  {
    id: 5,
    value: "body",
    label: "Outfit & Stance",
    image: "/images/pages/dojo/body.png",
  },
  {
    id: 6,
    value: "marks",
    label: "Marks",
    image: "/images/pages/dojo/marks.png",
  },
  {
    id: 7,
    value: "powers",
    label: "Powers",
    image: "/images/pages/dojo/power.png",
  },
  {
    id: 8,
    value: "accessories",
    label: "Accessories",
    image: "/images/pages/dojo/accessories.png",
  },
]

const DojoPage = () => {
  const { data: aliens, alien } = useAliens()
  const { data: profile } = useProfile()
  const { data: team } = useTeam()

  return (
    <div className="w-full h-full  flex flex-col">
      <div className="items-center justify-between flex-1 hidden lg:flex">
        <div className="flex items-center gap-3 h-full">
          <IconButton showBase className="size-5 lg:size-14">
            <ArrowLeft />
          </IconButton>
          <div className="flex flex-col gap-2">
            {DOJO_ITEMS.slice(0, 4).map((item) => (
              <button
                key={item.id}
                className="flex items-center flex-col gap-2 bg-white/10 rounded-xl p-2 border border-white/10 aspect-square relative hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  className="w-24 h-24 opacity-30"
                  width={100}
                  height={100}
                />
                <span className="text-[8px] absolute bottom-3 left-1/2 -translate-x-1/2">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 h-full">
          <div className="flex flex-col gap-2">
            {DOJO_ITEMS.slice(4, 8).map((item) => (
              <button
                key={item.id}
                className="flex items-center flex-col gap-2 bg-white/10 rounded-xl p-2 border border-white/10 aspect-square relative hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  className="w-24 h-24 opacity-30"
                  width={100}
                  height={100}
                />
                <span className="text-[8px] absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          <IconButton showBase className="size-5 lg:size-14">
            <ArrowRight />
          </IconButton>
        </div>
      </div>

      <ScrollArea className="lg:hidden">
        <div className="flex items-center gap-1  whitespace-nowrap ">
          {DOJO_ITEMS?.map((item, index) => (
            <button
              key={item.id}
              className="flex items-center flex-col gap-2 bg-white/10 rounded-xl p-2 border border-white/10 aspect-square shrink-0 relative hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              <Image
                src={item.image}
                alt={item.label}
                className="w-24 h-24 opacity-30"
                width={100}
                height={100}
              />
              <span className="text-[8px] absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex items-end justify-center gap-4">
        <div className="flex items-center justify-center flex-col gap-4">
          <div className="flex items-center gap-5">
            <button className="relative bg-white/10 backdrop-blur-lg px-6 py-4 rounded-2xl overflow-hidden group border border-white/10 min-w-32">
              Remove
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[50px] blur-[20px] z-[-1] group-hover:h-[60px] duration-500 transition-all",
                  "group-disabled:group-hover:h-[50px] bg-[#FF5F5F80]"
                )}
              />
            </button>
            <button className="relative bg-white/10 backdrop-blur-lg px-10 py-2 rounded-2xl overflow-hidden group border border-white/10 flex-col flex items-center">
              <span>Upgrade</span>
              <span className="text-2xs flex items-center gap-2 font-inter">
                for 150{" "}
                <span className="rounded-full size-5 border border-white/10 flex items-center justify-center">
                  <Image
                    src={"/images/stars.png"}
                    alt="stars"
                    width={12}
                    height={12}
                  />
                </span>
              </span>
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[50px] blur-[20px] z-[-1] group-hover:h-[60px] duration-500 transition-all",
                  "group-disabled:group-hover:h-[50px] bg-[#5FFF9580]"
                )}
              />
            </button>
            <button className="relative bg-white/10 backdrop-blur-lg px-6 py-4 rounded-2xl overflow-hidden group border border-white/10 min-w-32">
              Equip
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[50px] blur-[20px] z-[-1] group-hover:h-[60px] duration-500 transition-all",
                  "group-disabled:group-hover:h-[50px] bg-[#5FBCFF80]"
                )}
              />
            </button>
          </div>
          <div className="flex items-center gap-5">
            <Image
              src={alien?.element?.image ?? ""}
              alt="element"
              width={50}
              height={50}
            />
            <div className="bg-white/10 border border-white/10 rounded-xl backdrop-blur-lg px-4 h-14 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-6 lg:size-10 rounded-full p-px glass-effect flex items-center justify-center">
                  <Image
                    src="/images/coin-zone.png"
                    alt="Coin Zone"
                    width={50}
                    height={50}
                  />
                </div>
                <p className="text-xs font-volkhov">3,621,000 ZONE</p>
                <button className="glass-effect size-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                  <Plus className="size-3" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-6 lg:size-10 rounded-full p-px glass-effect flex items-center justify-center">
                  <Image
                    src="/images/stars.png"
                    alt="Star"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-xs font-volkhov">
                  {formatNumber(profile?.stars)} STAR
                </p>
                <button className="glass-effect size-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                  <Plus className="size-3" />
                </button>
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl backdrop-blur-lg px-4 h-14 flex items-center gap-4">
              <div className="border border-white/10 rounded flex items-center">
                <div className="relative overflow-hidden h-full px-2 py-0.5 text-2xs bg-white/10 border border-white/10 rounded">
                  Alien
                  <span
                    className={cn(
                      "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-[10px] blur-[6px] z-[-1]  duration-500 transition-all",
                      " bg-[#ff975fa8]"
                    )}
                  />
                </div>
                <span className="px-3 text-[#FF985F] text-sm">
                  {aliens?.length}
                </span>
              </div>
              <div className="border border-white/10 rounded flex items-center">
                <div className="relative overflow-hidden h-full px-2 py-0.5 text-2xs bg-white/10 border border-white/10 rounded">
                  Items
                  <span
                    className={cn(
                      "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-[10px] blur-[6px] z-[-1]  duration-500 transition-all",
                      " bg-[#FF5FF980]"
                    )}
                  />
                </div>
                <span className="px-3 text-[#FF5FF9] text-sm">
                  {aliens?.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-effect p-4 rounded-2xl ">
          <h2 className="text-lg font-volkhov mb-2">Bonus Details</h2>
          <div className="space-y-2">
            {(() => {
              const entries = Object.entries(team?.buffs || {})
              return (
                <>
                  {/* First row with first two entries */}
                  {entries.length > 0 && (
                    <div className="flex gap-2">
                      {entries.slice(0, 2).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex-1 flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1"
                        >
                          <span className="text-xs font-inter text-white/70">
                            {key}
                          </span>
                          <span className="text-xs font-volkhov">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Second row with third entry */}
                  {entries.length > 2 && (
                    <div className="flex">
                      <div
                        key={entries[2][0]}
                        className="flex-1 flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1"
                      >
                        <span className="text-xs font-inter text-white/70">
                          {entries[2][0]}
                        </span>
                        <span className="text-xs font-volkhov">
                          {entries[2][1]}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DojoPage
