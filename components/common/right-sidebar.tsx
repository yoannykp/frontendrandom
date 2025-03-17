"use client"

import { useState } from "react"
import Link from "next/link"
import { Trophy } from "lucide-react"

import { cn } from "@/lib/utils"

import DailyLoginModal from "../DailyLoginReward/Modal"
import {
  DoubleArrowIcon,
  FlagIcon,
  HomeIcon,
  InfoIcon,
  PeopleIcon,
  StackIcon,
} from "../icons"
import AlienzoneIcon from "../icons/alienzone"
import IconButton from "../ui/icon-button"
import ChatBox from "./chat-box"

const sidebarItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Raids", href: "/raids", icon: DoubleArrowIcon },
  { label: "Team", href: "/team", icon: PeopleIcon },
  { label: "Inventory", href: "/inventory", icon: FlagIcon },
  { label: "", href: "", icon: StackIcon },
  { label: "", href: "", icon: InfoIcon },
]

const RightSidebar = ({ className }: { className?: string }) => {
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false)
  return (
    <div
      className={cn(
        " z-20 flex  lg:flex-col gap-2 max-lg:justify-between",
        className
      )}
    >
      <Link
        href={"/"}
        className="border border-gray-light rounded-normal cursor-pointer backdrop-blur-[40px] flex justify-center items-center size-14 max-lg:hidden"
      >
        <AlienzoneIcon className="size-6" />
      </Link>

      <ChatBox className="lg:hidden" />

      <div className="glass-effect  flex justify-center rounded-normal flex-row lg:flex-col items-center gap-1.5 lg:gap-2.5 max-lg:h-14 lg:w-14 p-2 max-lg:backdrop-blur-0 max-lg:border-none">
        {sidebarItems.map((item, index) => (
          <Link href={item.href} key={index} title={item.label}>
            <IconButton className="size-10 lg:size-11 rounded-lg">
              <item.icon className="size-4 lg:size-5" />
            </IconButton>
          </Link>
        ))}
      </div>
      <button onClick={() => setIsRewardModalOpen(true)}>
        <Trophy className="size-5" />
      </button>
      <DailyLoginModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
      />
    </div>
  )
}

export default RightSidebar
