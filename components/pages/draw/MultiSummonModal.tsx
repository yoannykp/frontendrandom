import Image from "next/image"
import Link from "next/link"
import { useCharacters } from "@/store/hooks"
import { Character } from "@/types"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Define a Gear type based on the API response
interface Gear {
  id: number
  rarity: string
  image: string
  summonedCharacterId?: number
}

const SummonModal = ({
  isOpen,
  setIsOpen,
  summonType,
  summonItems,
  handleMultiSummon,
  loading,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  summonType: "character" | "gear"
  summonItems: Character[] | Gear[]
  handleMultiSummon: () => void
  loading: boolean
}) => {
  // Get the fetchCharacters function from the useCharacters hook
  const { fetchCharacters } = useCharacters()

  // Handle modal close to refresh characters
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Refresh characters when modal is closed
      fetchCharacters()
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[url('/images/modal-bg.jpeg')] bg-cover bg-center bg-no-repeat min-w-full h-screen max-h-[calc(100dvh)] overflow-y-auto rounded-none ">
        <div className="flex flex-col gap-4 z-10 relative justify-center items-center">
          <div className="px-20 w-max bg-white/10 border-white/10 border rounded-xl py-6 relative overflow-hidden font-volkhov text-xl">
            Summon Result
            <span
              className={cn(
                "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                "group-disabled:group-hover:h-[30px]",
                "bg-[#EF98E6]"
              )}
            />
          </div>

          <div className="flex flex-wrap max-w-4xl my-10 justify-center">
            {summonItems.map((item, index) => (
              <Image
                key={index}
                src={item.image || ""}
                alt={summonType === "character" ? "Character" : "Gear"}
                width={500}
                height={500}
                className={cn(
                  "-mx-4 -my-2.5",
                  summonItems.length === 1 ? "size-80" : "size-48"
                )}
              />
            ))}
          </div>

          <div className="flex gap-5 ">
            <Link
              href={summonType === "character" ? "/team" : "/inventory"}
              className="px-10 w-max bg-white/10 border-white/10 border rounded-xl py-5 relative overflow-hidden font-volkhov text-lg flex items-center justify-center group"
            >
              Next
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                  "group-disabled:group-hover:h-[30px]",
                  "bg-[#EF98E6]"
                )}
              />
            </Link>
            <div className="bg-white/10 px-4 py-2 rounded-xl relative overflow-hidden border border-white/10">
              <h3 className="font-volkhov">
                {summonType === "character"
                  ? "Multi Summon"
                  : "Multi Gear Summon"}
              </h3>
              <button
                onClick={handleMultiSummon}
                disabled={loading}
                className="group mt-1 w-full bg-white/10 px-3 py-1 rounded-lg relative overflow-hidden border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 justify-between z-10 w-full ">
                  <span>{summonType === "character" ? "1000" : "500"}</span>
                  <Image
                    src="/images/stars.png"
                    alt="Star"
                    width={20}
                    height={20}
                  />
                </div>
              </button>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[50px] blur-[15px] z-[-1] group-hover:h-[40px] duration-500 transition-all bg-[#EF98E6]"></div>
            </div>
          </div>
        </div>

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

export default SummonModal
