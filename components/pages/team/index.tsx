import Image from "next/image"
import { useAliens, useCharacters, useTeam } from "@/store/hooks"
import { X } from "lucide-react"
import toast from "react-hot-toast"

import { cn } from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"

import AddCharacterModal from "./AddCharacterModal"

const TeamPage = () => {
  const { data: aliens, alien } = useAliens()
  const { data: team, updateTeam, fetchTeam } = useTeam()
  const { fetchCharacters } = useCharacters()

  // Function to remove a team member
  const handleRemoveTeamMember = async (
    memberId: number,
    memberType: "alien" | "character"
  ) => {
    try {
      // Get current team members
      const currentCharacterIds =
        team?.team
          .filter((member) => member.type === "character")
          .map((member) => member.id) || []

      const currentAlienIds =
        team?.team
          .filter((member) => member.type === "alien")
          .map((member) => member.id) || []

      // Filter out the member to remove
      const newCharacterIds =
        memberType === "character"
          ? currentCharacterIds.filter((id) => id !== memberId)
          : currentCharacterIds

      const newAlienIds =
        memberType === "alien"
          ? currentAlienIds.filter((id) => id !== memberId)
          : currentAlienIds

      // Update the team
      await updateTeam({
        characterIds: newCharacterIds,
        alienIds: newAlienIds,
      })

      toast.success("Team member removed successfully")
      fetchTeam()
      fetchCharacters()
    } catch (error) {
      toast.error("Failed to remove team member")
      console.error(error)
    }
  }

  return (
    <>
      <div className="flex lg:items-end gap-2 lg:gap-4  w-full flex-col lg:flex-row">
        <div className="flex flex-col justify-end gap-2 lg:gap-4 flex-1 items-end">
          <div className="glass-effect p-4 rounded-2xl lg:max-w-[200px] w-full">
            <h2 className="text-lg font-volkhov mb-2">Team Overall</h2>
            <div className="flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1">
              <span className="text-xs font-inter text-white/70">
                Strength points
              </span>
              <span className="text-xs font-volkhov">
                {team?.teamStrengthPoints}
              </span>
            </div>
          </div>

          <div className="glass-effect p-4 rounded-2xl w-full">
            <h2 className="text-lg font-volkhov mb-2">Buffs</h2>
            <div className="space-y-2">
              {Object.entries(team?.buffs || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1"
                >
                  <span className="text-xs font-inter text-white/70">
                    {key}
                  </span>
                  <span className="text-xs font-volkhov">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center col-span-3 max-lg:hidden">
          <div className="relative size-[405px] rounded-2xl overflow-hidden">
            <Image
              src={alien?.image || ""}
              alt="Character"
              fill
              className="object-cover z-10"
            />
            <Image
              src={alien?.element?.background || ""}
              alt="User's alien"
              fill
            />
          </div>
        </div>

        <div className="space-y-2 lg:space-y-4 flex-1">
          <BrandButton
            blurColor="bg-[#EF98E6]"
            className="w-full lg:max-w-[200px]"
            isLink
            href="/raids"
          >
            Go Raids
          </BrandButton>
          <div className="glass-effect p-4 rounded-2xl ">
            <h2 className="text-lg font-volkhov mb-2">Synergies</h2>
            <div className="space-y-2">
              {Object.entries(team?.synergies || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1"
                >
                  <span className="text-xs font-inter text-white/70">
                    {key}
                  </span>
                  <span className="text-xs font-volkhov">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4  w-full">
        {/* remove team.member.type === "alien" and team.member.id === alien.id */}
        {team?.team
          .filter((member) => member.type === "character")
          .map((member, index) => (
            <div
              key={index}
              className="glass-effect p-1 rounded-2xl flex flex-col items-center relative overflow-hidden "
            >
              {/* Remove button */}
              <button
                className={cn(
                  "absolute top-2 right-2 z-20 bg-white/10 shadow-lg border border-white/10 rounded-lg p-1.5"
                )}
                onClick={() => handleRemoveTeamMember(member.id, member.type)}
                title="Remove from team"
              >
                <X className="size-3 text-white" />
              </button>

              <div className="relative w-full aspect-square shrink-0">
                <Image
                  src={member.image || ""}
                  alt={`Team member ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="absolute bottom-0 left-0 w-full h-full text-center flex flex-col justify-end p-4 z-10">
                <span className="text-lg font-volkhov mb-2">{member.name}</span>
                <div className="flex gap-2">
                  <div className="flex justify-between items-center gap-2 bg-white/5 rounded px-2 py-1 whitespace-nowrap backdrop-blur-lg">
                    <span className="text-[10px] font-inter text-white/70">
                      Strength points
                    </span>
                    <span className="text-xs font-volkhov">
                      {member.strengthPoints}
                    </span>
                  </div>
                  <div className="flex items-center -space-x-2 backdrop-blur-lg bg-white/5 rounded px-2 py-1">
                    <Image
                      src="/images/stars.png"
                      alt="Star"
                      width={16}
                      height={16}
                    />
                    <Image
                      src="/images/stars.png"
                      alt="Star"
                      width={16}
                      height={16}
                    />
                    <Image
                      src="/images/stars.png"
                      alt="Star"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black"></div>
            </div>
          ))}
        <AddCharacterModal />
      </div>
    </>
  )
}

export default TeamPage
