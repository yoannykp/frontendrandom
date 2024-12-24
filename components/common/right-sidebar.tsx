import Link from "next/link"

import { cn } from "@/lib/utils"

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
  { label: "", href: "", icon: HomeIcon },
  { label: "", href: "", icon: DoubleArrowIcon },
  { label: "", href: "", icon: PeopleIcon },
  { label: "", href: "", icon: FlagIcon },
  { label: "", href: "", icon: StackIcon },
  { label: "", href: "", icon: InfoIcon },
]

const RightSidebar = ({ className }: { className?: string }) => {
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
          <IconButton key={index} className="size-10 lg:size-11 rounded-lg">
            <item.icon className="size-4 lg:size-5" />
          </IconButton>
        ))}
      </div>
    </div>
  )
}

export default RightSidebar
