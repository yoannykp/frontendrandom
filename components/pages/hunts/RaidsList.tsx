import React, { Dispatch, SetStateAction } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

const raids = [
  {
    id: 1,
    name: "Hoshikage Siege",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-1.jpg",
    icon: "/images/raids/raid-1_icon.png",
  },
  {
    id: 2,
    name: "Nisshoku Encounter",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-2.jpg",
    icon: "/images/raids/raid-1_icon.png",
  },
  {
    id: 3,
    name: "Inseki Mission",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-3.jpg",
    icon: "/images/raids/raid-1_icon.png",
  },
  {
    id: 4,
    name: "Ten no Conquest",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-4.jpg",
    icon: "/images/raids/raid-1_icon.png",
  },
  {
    id: 5,
    name: "Tenkū Assault",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-1.jpg",
    icon: "/images/raids/raid-1_icon.png",
  },
  {
    id: 6,
    name: "Tenkū Assault",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-1.jpg",
    icon: "/images/raids/raid-1_icon.png",
  },
  {
    id: 7,
    name: "Tenkū Assault",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-1.jpg",
    icon: "/images/raids/raid-1_icon.png",
  },
  {
    id: 8,
    name: "Tenkū Assault",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-1.jpg",
    icon: "/images/raids/raid-1_icon.png",
  },
]

const RaidsList = ({
  selectedRaid,
  setSelectedRaid,
}: {
  selectedRaid: number | null
  setSelectedRaid: Dispatch<SetStateAction<number | null>>
}) => {
  return (
    <div className="lg:glass-effect h-full lg:rounded-2xl w-full lg:w-[420px] lg:p-4 flex flex-col gap-2">
      {raids.map((raid) => (
        <div
          key={raid.id}
          className={cn(
            "flex gap-3  p-4 rounded-lg relative cursor-pointer  transition-all duration-300",
            selectedRaid == raid.id
              ? "bg-white/30 opacity-100"
              : "bg-white/10 hover:bg-white/30 opacity-30 hover:opacity-100"
          )}
          onClick={() => setSelectedRaid(raid.id)}
        >
          <div className="absolute top-4 right-4 bg-white/10 rounded-full p-px">
            <Image
              src={raid.icon}
              alt={raid.name}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <div className="relative  rounded overflow-hidden aspect-square w-14 shrink-0">
            <Image src={raid.image} alt={raid.name} fill />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-inter ">
              <h2 className="text-[18px]  font-inter ">{raid.name}</h2>
              <span className="text-xs text-white/50 ">{raid.time}</span>
            </div>
            <p className=" text-white/50 text-xs">{raid.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RaidsList
