"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDailyLoginReward } from "@/contexts/DailyLoginRewardContext"
import { useProfile } from "@/store/hooks"
import { UserIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import useClickSound from "@/hooks/use-click-sound"

import {
  MailIcon,
  SettingsIcon,
  Shop2Icon,
  ShopIcon,
  VolumeIcon,
} from "../icons"
import IconButton from "../ui/icon-button"

const TopBar = ({ className }: { className?: string }) => {
  const { data: profile } = useProfile()
  const { openRewardModal } = useDailyLoginReward()
  const router = useRouter()

  const topbarItems = [
    { label: "", href: "", icon: MailIcon },
    {
      label: "",
      href: "",
      icon: ShopIcon,
      onClick: () => openRewardModal(),
    },
    { label: "", href: "", icon: Shop2Icon },
    { label: "", href: "", icon: VolumeIcon },
    { label: "", href: "", icon: SettingsIcon },
    {
      label: "",
      href: "/profile",
      icon: UserIcon,
      onClick: () => router.push("/profile"),
    },
  ]
  const playClickSound = useClickSound("/sounds/click.mp3")

  return (
    <div
      className={cn(
        "absolute right-28 top-10 z-20 flex flex-col gap-2",
        className
      )}
    >
      <div className="lg:bg-white/10 w-max rounded-normal items-center gap-2.5 p-2 max-lg:backdrop-blur-0 max-lg:border-none flex glass-effect">
        <div className="flex items-center gap-3 px-4">
          <span className="text-white/50 text-sm">{profile?.stars}</span>
          <Image src="/images/stars.png" alt="star" width={16} height={16} />
        </div>
        {topbarItems.map((item, index) => (
          <IconButton
            key={index}
            className={cn(
              "size-10 lg:size-11 rounded-lg p-1",
              item.onClick ? "cursor-pointer" : "opacity-50 pointer-events-none"
            )}
            onClick={() => {
              playClickSound()
              item.onClick?.()
            }}
          >
            <item.icon className="size-4 lg:size-5" />
          </IconButton>
        ))}
      </div>
    </div>
  )
}

export default TopBar
