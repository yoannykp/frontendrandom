import { useState } from "react"
import { useRaidHistory, useRaids } from "@/store/hooks"
import { Raid } from "@/types"
import { Plus } from "lucide-react"

import { isRaidLaunched } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowBack } from "@/components/icons"

import NoRaid from "./NoRaid"
import RaidInProgress from "./RaidInProgress"
import RaidsList from "./RaidsList"
import SingleRaid from "./SingleRaid"
import TeamRecap from "./TeamRecap"

const RaidsPage = () => {
  const [isRaidsListOpen, setIsRaidsListOpen] = useState(false)
  const { data: raids } = useRaids()
  const [selectedRaid, setSelectedRaid] = useState<Raid | null>(null)
  const { data: histories } = useRaidHistory()
  return (
    <>
      <div className="hidden lg:flex w-full relative  gap-3 ">
        <RaidsList
          selectedRaid={selectedRaid}
          setSelectedRaid={setSelectedRaid}
          raids={raids || []}
        />
        <div className="flex-1 h-full flex flex-col">
          <SingleRaid raid={selectedRaid || undefined} />
          <TeamRecap />
          {/* End of team recap section */}
        </div>
      </div>

      <div className="flex flex-col rounded-2xl glass-effect z-10 p-2 gap-3 lg:hidden flex-1">
        <button
          onClick={() => {
            if (selectedRaid) {
              setSelectedRaid(null)
            } else {
              setIsRaidsListOpen(!isRaidsListOpen)
            }
          }}
          className="w-full glass-effect  px-3 py-3 z-10 flex items-center justify-between font-volkhov gap-2 lg:hidden h-max rounded-sm"
        >
          {selectedRaid
            ? "Back to List"
            : isRaidsListOpen
              ? "Back to Raids Home"
              : "Open Raids List"}
          {selectedRaid || isRaidsListOpen ? (
            <ArrowBack className="size-5" />
          ) : (
            <Plus className="size-5" />
          )}
        </button>

        {isRaidsListOpen && !selectedRaid && (
          <ScrollArea className="flex-1 flex flex-col ">
            <RaidsList
              selectedRaid={selectedRaid}
              setSelectedRaid={setSelectedRaid}
              raids={raids || []}
            />
          </ScrollArea>
        )}

        {selectedRaid && isRaidLaunched(selectedRaid, histories) && (
          <RaidInProgress raid={selectedRaid} />
        )}

        {selectedRaid && !isRaidLaunched(selectedRaid, histories) && (
          <ScrollArea className="flex-1 flex flex-col ">
            <SingleRaid raid={selectedRaid} />
          </ScrollArea>
        )}

        {!selectedRaid && !isRaidsListOpen ? <NoRaid /> : ""}

        <TeamRecap />
      </div>
    </>
  )
}

export default RaidsPage
