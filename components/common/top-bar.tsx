"use client"

import Image from "next/image"
import { useProfile } from "@/store/hooks"

import { cn } from "@/lib/utils"

import {
  MailIcon,
  SettingsIcon,
  Shop2Icon,
  ShopIcon,
  VolumeIcon,
} from "../icons"
import IconButton from "../ui/icon-button"

const topbarItems = [
  { label: "", href: "", icon: MailIcon },
  { label: "", href: "", icon: ShopIcon },
  { label: "", href: "", icon: Shop2Icon },
  { label: "", href: "", icon: VolumeIcon },
  { label: "", href: "", icon: SettingsIcon },
]

const TopBar = ({ className }: { className?: string }) => {
  const { data: profile } = useProfile()
  return (
    <div
      className={cn(
        "absolute right-28 top-10 z-20 flex flex-col gap-2",
        className
      )}
    >
      <div className="lg:bg-white/10 w-max rounded-normal items-center gap-2.5 p-2 max-lg:backdrop-blur-0 max-lg:border-none  flex ">
        <div className="flex items-center gap-3 px-4">
          <span className="text-white/50 text-sm">{profile?.stars}</span>
          <Image src="/images/stars.png" alt="star" width={16} height={16} />
        </div>
        {topbarItems.map((item, index) => (
          <IconButton
            key={index}
            className="size-10 lg:size-6 rounded-lg opacity-50 pointer-events-none p-1"
          >
            <item.icon className="size-4 lg:size-5" />
          </IconButton>
        ))}
      </div>
    </div>
  )
}

export default TopBar
