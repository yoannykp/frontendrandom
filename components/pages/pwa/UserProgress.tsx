import Image from "next/image"
import { Alien, Profile } from "@/types"

import { addCacheBuster } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UserProgressProps {
  profile: Profile | null
  alien: Alien | null
  unseenReferralRewards: number
}

export function UserProgress({
  profile,
  alien,
  unseenReferralRewards,
}: UserProgressProps) {
  const progressInLevel = ((profile?.totalReferrals ?? 0) / 5) * 100

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 flex flex-col gap-4">
      {/* Alien Image */}
      <div className="w-full h-64  rounded-xl overflow-hidden bg-[#2C2D30]  relative lg:hidden">
        <img
          src={addCacheBuster(alien?.image)}
          alt="User's alien"
          className="w-full h-full object-contain z-10 relative"
        />
        {alien?.element && (
          <img
            src={addCacheBuster(alien?.element?.background)}
            alt="User's alien"
            className="w-full h-full object-cover absolute top-0 left-0"
          />
        )}
      </div>

      {/* User Details */}
      <div className="space-y-4">
        {/* Name and Stats */}
        <div className="flex justify-between items-center w-full">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 overflow-hidden w-full">
              <div className="text-white/70 font-medium whitespace-nowrap">
                {profile?.name}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-white/70 font-medium truncate whitespace-nowrap overflow-hidden">
                      {profile?.email}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{profile?.email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="text-white text-xl mt-1">{alien?.name}</div>
          </div>

          {unseenReferralRewards > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-blue-400 text-2xl">
                +{unseenReferralRewards} Stars
              </div>
              <Image
                src="/images/stars.png"
                alt="Star"
                width={40}
                height={40}
              />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <div className="mb-2">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
              <div
                className="h-full bg-[#9E96F4]"
                style={{ width: `${Math.min(progressInLevel, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-xs ">
            <span>{profile?.stars} Stars</span>
            <span>{profile?.totalReferrals} / 5</span>
          </div>
        </div>
      </div>
    </div>
  )
}
