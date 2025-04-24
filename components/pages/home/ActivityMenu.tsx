import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useProfile } from "@/store/hooks"
import { Plus } from "lucide-react"

import { levelRequirements } from "@/config/constants"
import { cn, formatNumber } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import {
  DojoIcon,
  DrawIcon,
  JournalIcon,
  RaidsIcon,
  StoreIcon,
  TeamIcon,
  UpgradeIcon,
  WheelIcon,
} from "@/components/icons"

import HomeCarousel from "./Carousel"

export const links = [
  {
    title: "Raids",
    href: "/raids",
    icon: RaidsIcon,
    image: "/images/pages/raids.png",
  },
  {
    title: "Dojo",
    href: "/dojo",
    icon: DojoIcon,
    image: "/images/pages/dojo.png",
  },
  {
    title: "Team",
    href: "/team",
    icon: TeamIcon,
    image: "/images/pages/team.png",
  },

  {
    title: "Upgrade",
    href: "/upgrade",
    icon: UpgradeIcon,
    image: "/images/pages/upgrade.png",
  },
  {
    title: "Draw",
    href: "/draw",
    icon: DrawIcon,
    image: "/images/pages/draw.png",
  },
  {
    title: "Journal",
    href: "/journal",
    icon: JournalIcon,
    image: "/images/pages/journal.png",
  },
  {
    title: "Store",
    href: "/store",
    icon: StoreIcon,
    image: "/images/pages/store.png",
  },
  {
    title: "Wheel",
    href: "/wheel",
    icon: WheelIcon,
    image: "/images/pages/wheel.png",
  },
]

const ActivityMenu = ({
  alien,
  isMobile,
  zoneBalance,
}: {
  alien: any
  isMobile?: boolean
  zoneBalance?: string | number | undefined
}) => {
  const { data: profile } = useProfile()

  console.log(alien)

  return (
    <div
      className={cn(
        "w-full z-10",
        isMobile
          ? "flex items-center justify-center left-0 lg:hidden"
          : "max-lg:hidden relative pb-12 px-8 pt-32 "
      )}
    >
      <div className="flex flex-col w-full lg:max-w-[670px] items-end ml-auto">
        <div className="glass-effect w-full rounded-2xl p-4 space-y-4  ">
          {/* Carousel */}
          <HomeCarousel />

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="glass-effect p-2 rounded-lg lg:rounded-xl  hover:scale-105 transition-all duration-300 hover:!bg-white/30"
              >
                <div className="relative pb-[40%] lg:pb-[60%] rounded-lg overflow-hidden">
                  <Image
                    src={link.image}
                    alt={link.title}
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="flex items-end justify-between gap-2 mt-3">
                  <h3 className="text-18 leading-none">{link.title}</h3>
                  <div className="glass-effect size-6 rounded-sm flex items-center justify-center">
                    <link.icon className="size-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="gap-4 mt-10 w-full justify-end hidden lg:flex">
          {/* Profile Image */}
          <div className="glass-effect p-2 rounded-xl ">
            <div
              className="relative flex items-center justify-center size-[100px] rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${alien?.element?.image.replace(".png", "-bg.png") || ""})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* <Image
                src="/images/characters/character-1-avatar.png"
                alt="Profile"
                className="object-cover"
                fill
              /> */}
              <img
                src={alien?.image}
                alt={alien?.name}
                className="size-22 rounded"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 glass-effect rounded-xl max-w-[390px] w-full">
            <div className="h-1/2 p-4 flex items-center gap-5">
              <div className="glass-effect flex w-max rounded-lg">
                <p className="glass-effect py-1 px-3 rounded-lg text-xs">
                  Level
                </p>
                <div className=" py-1 px-3 text-sm">{profile?.level}</div>
              </div>

              <div className="flex items-center w-full">
                <p className="glass-effect py-1 px-3 rounded-lg text-xs">XP</p>

                <Progress
                  value={profile?.experience}
                  total={levelRequirements[profile?.level ?? 0].requiredPoints}
                  className="w-full "
                />

                <p className="glass-effect py-1 px-3 rounded-lg text-xs font-volkhov">
                  {profile?.experience}/
                  {levelRequirements[profile?.level ?? 0].requiredPoints}
                </p>
              </div>
            </div>
            <div className="glass-effect h-1/2 rounded-b-xl flex items-center justify-center gap-5">
              <div className="flex items-center gap-2">
                <div className="size-6 lg:size-10 rounded-full p-px glass-effect flex items-center justify-center">
                  <Image
                    src="/images/coin-zone.png"
                    alt="Coin Zone"
                    width={50}
                    height={50}
                  />
                </div>
                <p className="text-xs font-volkhov">{zoneBalance} ZONE</p>
                <button className="glass-effect size-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                  <Plus className="size-3" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-6 lg:size-10 rounded-full p-px glass-effect flex items-center justify-center">
                  <Image
                    src="/images/stars.png"
                    alt="Star"
                    width={50}
                    height={50}
                  />
                </div>
                <p className="text-xs font-volkhov">
                  {formatNumber(profile?.stars)} STAR
                </p>
                <button className="glass-effect size-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                  <Plus className="size-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityMenu
