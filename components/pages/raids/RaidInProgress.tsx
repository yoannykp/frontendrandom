"use client"

import React from "react"
import Image from "next/image"
import { useRaidTimer } from "@/context/raidTimer"
import { Raid } from "@/types"

import { calculateRaidProgress, formatRemainingTime } from "@/lib/utils"

interface RaidInProgressProps {
  raid: Raid
}
const RaidInProgress = ({ raid }: RaidInProgressProps) => {
  const { activeRaids } = useRaidTimer()
  const currentRaid = activeRaids.find((ar) => ar.id === raid?.id)

  const progress = currentRaid
    ? calculateRaidProgress(currentRaid.remainingTime, raid.duration)
    : 0

  return (
    <div className="lg:bg-white/10 rounded-sm lg:rounded-2xl  lg:p-4 max-lg:flex-1">
      <div className="h-full lg:h-[570px] rounded-lg flex flex-col justify-end p-4 lg:p-10 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={raid?.image}
            alt={raid?.title}
            fill
            className="object-cover rounded-lg"
          />
          <div
            className="absolute inset-0 bg-black/50"
            style={{
              background:
                "linear-gradient(289.69deg, rgba(0, 0, 0, 0) 8.33%, #000000 111.35%)",
            }}
          ></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-6">
            <h1 className="text-white text-3xl font-volkhov">{raid?.title}</h1>
            <div className="bg-white/10 rounded-full p-px">
              <Image
                src={raid.icon}
                alt={raid.title}
                width={35}
                height={35}
                className="object-cover size-6 lg:size-10"
              />
            </div>
          </div>
          <div className="flex gap-w p-3 lg:p-4 bg-white/10 backdrop-blur-lg rounded-xl gap-2 mt-3 lg:mt-5 max-lg:border border-white/20">
            <div className="bg-white/10 rounded-full flex items-center justify-center px-3 min-w-20 ">
              <h2 className="text-white font-inter text-xs whitespace-nowrap">
                {currentRaid &&
                  Object.entries(
                    formatRemainingTime(currentRaid.remainingTime)
                  ).map(([unit, { value, text }], index, arr) => (
                    <React.Fragment key={unit}>
                      <span>{value}</span>
                      {index < arr.length - 1 && (
                        <span className="text-white/50 mx-px">:</span>
                      )}
                    </React.Fragment>
                  ))}
              </h2>
            </div>
            <div className="w-full bg-white/10 rounded-full flex items-center p-2">
              <div
                className="h-2 lg:h-3 bg-[#66BFFF] rounded-full transition-all duration-1000 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white absolute -right-px top-1/2 -translate-y-1/2 filter blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RaidInProgress
