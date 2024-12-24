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
  return (
    <div
      className={cn(
        "absolute right-28 top-28 z-20 flex flex-col gap-2",
        className
      )}
    >
      <div className="lg:bg-white/10 w-max rounded-normal items-center gap-2.5 p-2 max-lg:backdrop-blur-0 max-lg:border-none  flex ">
        {topbarItems.map((item, index) => (
          <IconButton key={index} className="size-10 lg:size-11 rounded-lg">
            <item.icon className="size-4 lg:size-5" />
          </IconButton>
        ))}
      </div>
    </div>
  )
}

export default TopBar
