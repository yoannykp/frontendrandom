"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { RewardType } from "@/types"

const NoRaid = () => {
  const pathname = usePathname()
  const isHunt = pathname === "/hunt"

  return (
    <div className="lg:bg-white/10 rounded-sm lg:rounded-2xl  lg:p-4 flex-1">
      <div className=" h-full rounded-lg flex flex-col p-4 lg:p-10 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={"/images/pages/raids-bg.jpg"}
            alt={"No Raid"}
            fill
            className="object-cover rounded-lg"
          />
          <div
            className="absolute inset-0 bg-black/50"
            style={{
              background:
                "linear-gradient(248.67deg, rgba(0, 0, 0, 0) -17.77%, #000000 110%)",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-3xl font-volkhov">
              {isHunt ? "Hunt" : "Raids"}
            </h2>
            <p className="text-white/50 text-sm max-w-[400px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              sagittis ipsum sit amet tortor efficitur volutpat. Nullam a quam
              efficitur, sagittis est non, vestibulum ligula.
            </p>
          </div>
          <div className="ml-auto">
            <div className="bg-white/5 rounded-full py-2 px-4  lg:pl-6 filter backdrop-blur-sm flex items-center gap-10">
              <h1 className="font-inter max-lg:hidden">Rewards</h1>
              <div className="flex items-center gap-2">
                {Object.values(RewardType).map((type) => (
                  <div
                    key={type}
                    className="bg-white/5 rounded-full p-2 filter backdrop-blur-sm border border-white/20"
                  >
                    <Image
                      src={`/images/${type.toLowerCase()}.png`}
                      alt={type}
                      width={30}
                      height={30}
                      className="max-lg:size-5"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoRaid
