import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCharacters, useTeam } from "@/store/hooks"
import { Character } from "@/types"
import toast from "react-hot-toast"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/useIsMobile"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

const AddCharacterModal = () => {
  const { updateTeam, data: team, fetchTeam } = useTeam()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: characters, fetchCharacters } = useCharacters()
  const isMobile = useIsMobile()

  // Toggle character selection
  const toggleCharacterSelection = (character: Character) => {
    if (selectedCharacters.some((c) => c.id === character.id)) {
      // If already selected, remove it
      setSelectedCharacters(
        selectedCharacters.filter((c) => c.id !== character.id)
      )
    } else {
      // If not selected, add it (up to the available team slots)
      const availableSlots = 5 - (team?.team?.length || 0)
      if (selectedCharacters.length < availableSlots) {
        setSelectedCharacters([...selectedCharacters, character])
      } else {
        toast.error(
          `You can only add ${availableSlots} more character(s) to your team`
        )
      }
    }
  }

  // Check if a character is selected
  const isCharacterSelected = (character: Character) => {
    return selectedCharacters.some((c) => c.id === character.id)
  }

  // Add selected characters to team
  const handleAddSelectedToTeam = async () => {
    if (selectedCharacters.length === 0) {
      toast.error("Please select at least one character")
      return
    }

    try {
      setIsLoading(true)

      const currentCharacterIds =
        team?.team
          .filter((member) => member.type === "character")
          .map((member) => member.id) || []

      const currentAlienIds =
        team?.team
          .filter((member) => member.type === "alien")
          .map((member) => member.id) || []

      // Add selected character IDs to current character IDs
      const newCharacterIds = [
        ...currentCharacterIds,
        ...selectedCharacters.map((c) => c.id),
      ]

      await updateTeam({
        characterIds: newCharacterIds,
        alienIds: currentAlienIds,
      })

      toast.success("Characters added to team successfully")
      setSelectedCharacters([])
      fetchTeam()
      fetchCharacters()
      setIsOpen(false)
    } catch (error) {
      toast.error("Failed to add characters to team")
    } finally {
      setIsLoading(false)
    }
  }

  // Reset selections when modal opens/closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSelectedCharacters([])
    }
  }

  if (team?.team?.length && team.team.length >= 5) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="glass-effect p-4 rounded-2xl flex items-center justify-center">
          <span className="text-2xl font-volkhov glass-effect size-12 rounded-lg flex items-center justify-center">
            +
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[url('/images/modal-bg.jpeg')] bg-cover bg-center bg-no-repeat min-w-full h-screen max-h-[calc(100dvh)] overflow-y-auto rounded-none p-0">
        <div className="flex flex-col gap-4 z-10 relative justify-center items-center w-full h-full p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="px-6 md:px-12 lg:px-20 py-3 md:py-4 lg:py-6 w-max bg-white/10 border-white/10 border rounded-xl relative overflow-hidden font-volkhov text-base md:text-lg lg:text-xl">
            Add Character
            <span
              className={cn(
                "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                "group-disabled:group-hover:h-[30px]",
                "bg-[#EF98E6]"
              )}
            />
          </div>

          {/* Selection counter */}
          {selectedCharacters.length > 0 && (
            <div className="text-center mt-1 mb-0">
              <p className="text-white/80 text-sm md:text-base">
                {selectedCharacters.length} character
                {selectedCharacters.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}

          {/* Character grid */}
          <div className="flex flex-wrap justify-center w-full max-w-full md:max-w-4xl my-4 md:my-6 lg:my-10 gap-2 md:gap-0 overflow-y-auto max-h-[50vh] md:max-h-[60vh] p-2">
            {characters?.filter((character) => !character.onTeam).length ===
            0 ? (
              <div className="text-center py-6 md:py-10">
                <p className="text-lg md:text-xl">No characters available</p>
                <p className="text-sm text-white/70 mt-2">
                  Go to Draw page to summon characters
                </p>
              </div>
            ) : (
              characters
                ?.filter((character) => !character.onTeam)
                .map((character) => {
                  const isSelected = isCharacterSelected(character)

                  return (
                    <div
                      key={character.id}
                      className={cn(
                        "relative cursor-pointer transition-all duration-300 transform hover:scale-105",
                        isSelected && "scale-105",
                        isMobile ? "w-[45%] md:w-auto" : "w-auto"
                      )}
                      onClick={() => toggleCharacterSelection(character)}
                    >
                      <div className="relative">
                        <Image
                          src={character.teamImage || ""}
                          alt={character.name}
                          width={500}
                          height={500}
                          className={cn(
                            "object-contain",
                            isMobile
                              ? "w-full h-auto"
                              : "size-40 md:size-44 lg:size-48 -mx-2 md:-mx-4 -my-1 md:-my-2.5"
                          )}
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-green-500 rounded-full size-5 md:size-6 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 md:h-4 md:w-4 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 text-center bg-black/50 py-1 mx-1 md:mx-4">
                          <p className="text-xs md:text-sm truncate px-1">
                            {character.name}
                          </p>
                          <p className="text-xs text-white/70">
                            {character.rarity} • {character.power}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-5 w-full max-w-xs md:max-w-md whitespace-nowrap">
            <button
              className={cn(
                "w-full px-4 md:px-10 bg-white/10 border-white/10 border rounded-xl py-3 md:py-4 relative overflow-hidden font-volkhov text-base md:text-lg group",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              onClick={handleAddSelectedToTeam}
              disabled={selectedCharacters.length === 0 || isLoading}
            >
              {isLoading ? "Adding..." : "Add Characters"}
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                  "group-disabled:group-hover:h-[30px]",
                  "bg-[#EF98E6]"
                )}
              />
            </button>
            <Link
              href="/draw"
              className="w-full px-4 md:px-10 bg-white/10 border-white/10 border rounded-xl py-3 md:py-4 relative overflow-hidden font-volkhov text-base md:text-lg group text-center"
            >
              Go to Draw
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                  "group-disabled:group-hover:h-[30px] ",
                  "bg-[#EF98E6]"
                )}
              />
            </Link>
          </div>
        </div>

        {/* Background overlay */}
        <div
          style={{
            background:
              "radial-gradient(523.95% 555.02% at -125.98% -386.39%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></div>
      </DialogContent>
    </Dialog>
  )
}

export default AddCharacterModal
