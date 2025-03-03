import Image from "next/image"
import Link from "next/link"
import { useCharacters } from "@/store/hooks"
import { Character } from "@/types"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/useIsMobile"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const MultiSummonModal = ({
  isOpen,
  setIsOpen,
  characters,
  handleMultiSummon,
  loading,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  characters: Character[]
  handleMultiSummon: () => void
  loading: boolean
}) => {
  // Get the fetchCharacters function from the useCharacters hook
  const { fetchCharacters } = useCharacters()
  const isMobile = useIsMobile()

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
      <DialogContent className="bg-[url('/images/modal-bg.jpeg')] bg-cover bg-center bg-no-repeat min-w-full h-screen max-h-[calc(100dvh)] overflow-y-auto rounded-none p-0">
        <div className="flex flex-col gap-4 z-10 relative justify-center items-center w-full h-full p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="px-6 md:px-12 lg:px-20 py-3 md:py-4 lg:py-6 w-max bg-white/10 border-white/10 border rounded-xl relative overflow-hidden font-volkhov text-base md:text-lg lg:text-xl">
            Summon Result
            <span
              className={cn(
                "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                "group-disabled:group-hover:h-[30px]",
                "bg-[#EF98E6]"
              )}
            />
          </div>

          {/* Character display */}
          <div className="flex flex-wrap justify-center w-full max-w-full md:max-w-4xl my-4 md:my-6 lg:my-10 overflow-y-auto max-h-[50vh] md:max-h-[60vh]">
            {characters.length === 0 ? (
              <div className="text-center py-6 md:py-10">
                <p className="text-lg md:text-xl">No characters summoned</p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-1 md:gap-0">
                {characters.map((character, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative",
                      isMobile ? "w-[45%] md:w-auto" : "w-auto"
                    )}
                  >
                    <Image
                      src={character.image || ""}
                      alt={character.name || `Character ${index + 1}`}
                      width={500}
                      height={500}
                      className={cn(
                        "object-contain",
                        isMobile
                          ? "w-full h-auto"
                          : "size-40 md:size-44 lg:size-48 -mx-2 md:-mx-4 -my-1 md:-my-2.5"
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-5 w-full max-w-xs md:max-w-md">
            <Link
              href="/team"
              className="w-full px-4 md:px-10 bg-white/10 border-white/10 border rounded-xl py-3 md:py-4 relative overflow-hidden font-volkhov text-base md:text-lg flex items-center justify-center group text-center"
            >
              Go to Team
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                  "group-disabled:group-hover:h-[30px]",
                  "bg-[#EF98E6]"
                )}
              />
            </Link>

            <div className="w-full bg-white/10 px-4 py-2 rounded-xl relative overflow-hidden border border-white/10">
              <h3 className="font-volkhov text-sm md:text-base text-center">
                Multi Summon
              </h3>
              <button
                onClick={handleMultiSummon}
                disabled={loading}
                className="group mt-1 w-full bg-white/10 px-3 py-2 rounded-lg relative overflow-hidden border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 justify-between z-10 w-full">
                  <span className="text-sm md:text-base">
                    {loading ? "Summoning..." : "1000"}
                  </span>
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

export default MultiSummonModal
