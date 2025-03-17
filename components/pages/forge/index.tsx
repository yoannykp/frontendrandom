import { useEffect, useState } from "react"
import Image from "next/image"
import { useCharacters } from "@/store/hooks"
import { Character } from "@/types"
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react"

import { getCharacterTiers } from "@/lib/api"
import { cn } from "@/lib/utils"
import { ForgeTabs } from "@/app/(pages)/forge/page"

const ForgePage = ({ activeTab }: { activeTab: ForgeTabs }) => {
  const [characterTiers, setCharacterTiers] = useState<Character[]>([])
  const { data: characters } = useCharacters()

  useEffect(() => {
    const fetchCharacterTiers = async () => {
      if (!characters) return
      const response = await getCharacterTiers(characters[0].id)
      setCharacterTiers(response.data?.characters || [])
    }
    fetchCharacterTiers()
  }, [characters])

  return (
    <div className="w-full h-full rounded-lg backdrop-blur-xl border border-white/10 p-2">
      <div className=" h-full rounded-lg backdrop-blur-lg bg-white/10 p-4 lg:px-14  lg:py-10 flex flex-col ">
        {activeTab === ForgeTabs.ENHANCEMENT && (
          <div className="h-full w-full max-w-max mx-auto flex flex-col">
            {/* Main content */}
            <div className="flex  justify-center flex-1 max-w-max ">
              {/* Stage 01 */}
              <div className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3 ">
                <div className="aspect-square  relative">
                  <Image
                    src="/images/cat.jpeg"
                    alt="Stage 01 - Green Cat"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-4 ">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Stage 01
                  </h2>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#D3EF98] font-medium">
                      50% Boost
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#98EFC5] font-medium">+4</span>
                  </div>
                </div>
              </div>

              {/* Arrow and Check Icons */}
              <div className="flex flex-col items-center pt-10 mx-4 space-y-4 h-full">
                <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                  <ArrowLeft />
                </button>
                <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                  <Check />
                </button>
              </div>

              {/* Stage 02 */}
              <div className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3 ">
                <div className="aspect-square  relative">
                  <Image
                    src="/images/girl.jpeg"
                    alt="Stage 01 - Green Cat"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-4 ">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Stage 02
                  </h2>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#D3EF98] font-medium">
                      50% Boost
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#98EFC5] font-medium">+6</span>
                  </div>
                </div>
              </div>

              {/* Lock Icon */}
              <div className="flex flex-col items-center pt-10 mx-4 h-full">
                <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center justify-center text-white">
                  <Lock />
                </button>
              </div>

              {/* Stage 03 - Locked */}
              <div className="w-full max-w-sm rounded-xl border border-white/10 backdrop-blur-md flex flex-col p-3 ">
                <div className="aspect-square  relative">
                  <Image
                    src="/images/girl.jpeg"
                    alt="Stage 01 - Green Cat"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 w-full h-full bg-black/70 flex items-center justify-center text-lg text-center"
                    // style={{
                    //   background:
                    //     "linear-gradient(204.14deg, rgba(255, 255, 255, 0) -1.34%, rgba(255, 255, 255, 0.0483146) 19.02%, rgba(255, 255, 255, 0.1) 43.97%, rgba(255, 255, 255, 0) 100.48%)",
                    // }}
                  >
                    Promote to <br /> Unlock
                  </div>
                </div>
                <div className="pt-4 ">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Stage 02
                  </h2>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#D3EF98] font-medium">
                      50% Boost
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm font-inter">
                      Attribut Name
                    </span>
                    <span className="text-[#98EFC5] font-medium">+6</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="mt-8 flex items-center space-x-4 bg-white/10 p-2 rounded-xl backdrop-blur-lg">
              <div
                className={cn(
                  " px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1"
                )}
              >
                Object Name
              </div>
              <div
                className={cn(
                  " px-5 !h-14 rounded-xl text-sm border bg-white/5 border-white/10 flex items-center justify-between text-center flex-1"
                )}
              >
                <span>Requested to promote</span>
                <div className="rounded-full bg-white/10 flex  items-center  font-inter">
                  <span className="text-[#D3EF98] text-xs px-3">4/4</span>
                  <span className="p-0.5 bg-white/10 border border-white/10 rounded-full">
                    <Image
                      src="/images/girl.jpeg"
                      alt="Stage 01 - Green Cat"
                      width={30}
                      height={30}
                      className=" object-cover rounded-full"
                    />
                  </span>
                </div>
              </div>
              <button
                className={cn(
                  " px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1 relative group overflow-hidden"
                )}
              >
                <span
                  className={cn(
                    "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                    "group-disabled:group-hover:h-[30px] bg-[#D3EF98]"
                  )}
                />
                Promote
              </button>
            </div>
          </div>
        )}
        {activeTab === ForgeTabs.PROMOTION && (
          <div className="h-full w-full max-w-max mx-auto flex flex-col max-lg:items-center">
            {/* Main content */}
            <div className="flex flex-col max-lg:items-center lg:flex-row  justify-center flex-1 max-w-max max-lg:gap-4">
              {/* Stage 01 */}
              {characterTiers.map((character, index) => {
                const nextCharacter = characters?.[index + 1]
                const isDisabled =
                  nextCharacter?.upgradeReq === undefined ||
                  nextCharacter?.upgradeReq > character.quantity

                return (
                  <>
                    <div className="w-full max-w-sm lg:max-w-lg flex flex-col ">
                      <h3 className="text-center text-xl">
                        Tier {character.tier}
                      </h3>
                      <div className="aspect-square  relative">
                        <Image
                          src={character.image || ""}
                          alt={character.name || ""}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {index < (characters?.length || 0) - 1 && (
                      <div className="flex max-lg:justify-center lg:flex-col  items-center lg:pt-20  gap-4 h-full">
                        <span className="w-12 h-12 bg-white/5 border border-white/10 rounded-md flex items-center justify-center text-white ">
                          {isDisabled ? <Lock /> : <Check />}
                        </span>
                        <span className="w-12 h-12 bg-white/5 border border-white/10 rounded-md flex items-center justify-center text-white ">
                          <ArrowRight />
                        </span>
                      </div>
                    )}
                  </>
                )
              })}
            </div>

            {/* Bottom controls */}
            <div className="mt-8 flex items-center space-x-4 bg-white/10 p-2 rounded-xl backdrop-blur-lg">
              <div
                className={cn(
                  " px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1"
                )}
              >
                Object Name
              </div>
              <div
                className={cn(
                  " px-5 !h-14 rounded-xl text-sm border bg-white/5 border-white/10 flex items-center justify-between text-center flex-1"
                )}
              >
                <span>Requested to promote</span>
                <div className="rounded-full bg-white/10 flex  items-center  font-inter">
                  <span className="text-[#D3EF98] text-xs px-3">4/4</span>
                  <span className="p-0.5 bg-white/10 border border-white/10 rounded-full">
                    <Image
                      src="/images/girl.jpeg"
                      alt="Stage 01 - Green Cat"
                      width={30}
                      height={30}
                      className=" object-cover rounded-full"
                    />
                  </span>
                </div>
              </div>
              <button
                className={cn(
                  " px-5 !h-14 rounded-xl text-lg border bg-white/5 border-white/10 flex items-center justify-center text-center flex-1 relative group overflow-hidden"
                )}
              >
                <span
                  className={cn(
                    "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] group-hover:h-[40px] duration-500 transition-all",
                    "group-disabled:group-hover:h-[30px] bg-[#D3EF98]"
                  )}
                />
                Promote
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgePage
