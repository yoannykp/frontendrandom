import React, { Dispatch, SetStateAction } from "react"
import Image from "next/image"
import { Raid } from "@/types"

import { cn, formatDuration } from "@/lib/utils"

const RaidsList = ({
  selectedRaid,
  setSelectedRaid,
  raids,
}: {
  selectedRaid: Raid | null
  setSelectedRaid: Dispatch<SetStateAction<Raid | null>>
  raids: Raid[]
}) => {
  return (
    <div className="lg:glass-effect h-full lg:rounded-2xl w-full lg:w-[420px] lg:p-4 flex flex-col gap-2">
      {raids.map((raid) => (
        <div
          key={raid.id}
          className={cn(
            "flex gap-3  p-4 rounded-lg relative cursor-pointer  transition-all duration-300",
            selectedRaid?.id === raid.id
              ? "bg-white/30"
              : "bg-white/10 hover:bg-white/30"
          )}
          onClick={() => setSelectedRaid(raid)}
        >
          <div className="absolute top-4 right-4 bg-white/10 rounded-full p-px">
            <Image
              src={raid.icon}
              alt={raid.title}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <div className="relative  rounded overflow-hidden aspect-square w-14 shrink-0">
            <Image src={raid.image} alt={raid.title} fill />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-inter ">
              <h2 className="text-[18px]  font-inter ">{raid.title}</h2>
              <span className="text-xs text-white/50 ">
                {formatDuration(raid.duration)}
              </span>
            </div>
            <p className="text-white/50 text-xs line-clamp-1">
              {raid.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RaidsList
