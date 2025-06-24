"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import useClickSound from "@/hooks/use-click-sound"
import { useIsMobile } from "@/hooks/useIsMobile"

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
//   { label: "Home", href: "/", icon: HomeIcon },
//   { label: "Raids", href: "/raids", icon: DoubleArrowIcon },
//   { label: "Team", href: "/team", icon: PeopleIcon },
//   { label: "Inventory", href: "/inventory", icon: FlagIcon },
//   { label: "", href: "", icon: StackIcon },
//   { label: "", href: "", icon: InfoIcon },
// ]

const sidebarItems = [
  { label: "Home", href: "/", icon: HomeIcon },
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

const RightSidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const playClickSound = useClickSound("/sounds/click.mp3")

  return (
    <div
      className={cn(
        "z-20 flex lg:flex-col gap-2 max-lg:justify-between",
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

      {pathname === "/" && isMobile && (
        <Chat className="lg:hidden absolute left-8 bottom-10" btnClassName="" />
      )}

      <div className="glass-effect flex justify-center rounded-normal flex-row lg:flex-col items-center gap-1.5 lg:gap-2.5 max-lg:h-14 lg:w-14 p-2 max-lg:backdrop-blur-0 max-lg:border-none">
        {sidebarItems.map((item, index) => {
          const isActive = pathname === item.href

          return (
            <Link
              href={item.href}
              key={index}
              title={item.label}
              target={item.isExternal ? "_blank" : ""}
              onClick={() => {
                playClickSound()
              }}
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
    </div>
  )
}

export default RightSidebar
