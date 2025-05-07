import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useProfile, useTeam } from "@/store/hooks"
import { Plus } from "lucide-react"

const TeamRecap = () => {
  const { data: profile } = useProfile()
  const { data: team } = useTeam()

  return (
    <div className="glass-effect p-2 lg:p-4 lg:mt-3 rounded-2xl">
      <div className="flex items-center gap-3 max-lg:flex-col w-full relative">
        <div className="space-y-3 bg-white/10 rounded p-4 w-[30%] max-lg:hidden">
          <h2 className="text-xl font-volkhov">Team Recap</h2>

          <div className="space-y-2 ">
            <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1">
              <span className="text-xs  font-inter">Strength points</span>
              <span className="font-volkhov text-2xs">
                {team?.teamStrengthPoints}
              </span>
            </div>
            <div className="flex  gap-2">
              <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1 flex-1">
                <span className="text-xs  font-inter uppercase">XP</span>
                <span className="font-volkhov text-2xs ">
                  +{team?.buffs?.xpBoost}%
                </span>
              </div>
              <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1 flex-1">
                <span className="text-xs  font-inter uppercase">Star</span>
                <span className="font-volkhov text-2xs">
                  +{team?.buffs?.starsBoost}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1">
              <span className="text-xs  font-inter">Raid time</span>
              <span className="font-volkhov text-2xs">
                +{team?.buffs?.raidTimeBoost}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between  max-lg:w-full">
          <h2 className="text-xm font-volkhov lg:hidden">Team Recap</h2>
          <Link
            href={"/team"}
            className="glass-effect  p-1 rounded-full absolute right-0 top-0"
          >
            <Plus className="size-4" />
          </Link>
        </div>

        <div className="flex space-x-3 flex-1 max-lg:w-full">
          {team?.team.map((member) => (
            <div
              key={member.id}
              className="aspect-square relative rounded-xl overflow-hidden border-2 border-white/10 hover:z-10 transition-all duration-300 flex-1 max-w-[90px] lg:max-w-[165px]"
            >
              <Image
                src={member.image || ""}
                alt={member.name || ""}
                fill
                className="object-cover relative z-10"
              />
              {member.type === "alien" && (
                <div
                  className="absolute inset-0 "
                  style={{
                    backgroundImage: `url(${member.element.background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamRecap
