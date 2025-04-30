"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Trophy } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/useIsMobile"

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
import Chat from "./Chat"

// const sidebarItems = [
//   { label: "Home", href: "/home", icon: HomeIcon },
//   { label: "Raids", href: "/raids", icon: DoubleArrowIcon },
//   { label: "Team", href: "/team", icon: PeopleIcon },
//   { label: "Inventory", href: "/inventory", icon: FlagIcon },
//   { label: "", href: "", icon: StackIcon },
//   { label: "", href: "", icon: InfoIcon },
// ]

const sidebarItems = [
  { label: "Home", href: "/home", icon: HomeIcon },
  { label: "Leaderboard", href: "/leaderboard", icon: DoubleArrowIcon },
  { label: "Friends", href: "/friends", icon: PeopleIcon },
  { label: "Quests", href: "/quests", icon: FlagIcon },
  { label: "Inventory", href: "/inventory", icon: StackIcon },
  {
    label: "Docs",
    href: "https://docs.alienzone.io",
    icon: InfoIcon,
    isExternal: true,
  },
]

const RightSidebar = ({
  className,
  queryIsRewardModalOpen,
}: {
  className?: string
  queryIsRewardModalOpen?: boolean
}) => {
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(
    queryIsRewardModalOpen || false
  )
  const pathname = usePathname()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (queryIsRewardModalOpen) {
      setIsRewardModalOpen(true)
    }
  }, [queryIsRewardModalOpen])

  return (
    <div
      className={cn(
        " z-20 flex  lg:flex-col gap-2 max-lg:justify-between",
        className
      )}
    >
      <Link
        href="/"
        className={cn(
          "border border-gray-light rounded-normal cursor-pointer backdrop-blur-[40px] flex justify-center items-center size-14 max-lg:hidden",
          pathname === "/" ? "bg-white/20" : ""
        )}
      >
        <AlienzoneIcon className="size-6" />
      </Link>

      {pathname === "/home" && isMobile && (
        <Chat className="lg:hidden absolute left-8 bottom-10" btnClassName="" />
      )}

      <div className="glass-effect  flex justify-center rounded-normal flex-row lg:flex-col items-center gap-1.5 lg:gap-2.5 max-lg:h-14 lg:w-14 p-2 max-lg:backdrop-blur-0 max-lg:border-none">
        {sidebarItems.map((item, index) => {
          const isActive = pathname === item.href

          return (
            <Link
              href={item.href}
              key={index}
              title={item.label}
              target={item.isExternal ? "_blank" : ""}
            >
              <IconButton
                className={cn(
                  "size-10 lg:size-11 rounded-lg",
                  isActive ? "!bg-white/30" : ""
                )}
              >
                <item.icon className="size-4 lg:size-5" />
              </IconButton>
            </Link>
          )
        })}
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
