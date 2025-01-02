"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowBack } from "@/components/icons"
import RaidsList from "@/components/pages/hunts/RaidsList"
import SingleRaid from "@/components/pages/hunts/SingleRaid"
import TeamRecap from "@/components/pages/raids/TeamRecap"

const Page = () => {
  const pathname = usePathname()
  const [isRaidsListOpen, setIsRaidsListOpen] = useState(false)
  const [selectedRaid, setSelectedRaid] = useState<number | null>(null)
  return (
    <>
      <div className="fixed inset-0  bg-cover bg-center bg-no-repeat bg-[url('/images/pages/bg.jpg')]  lg:hidden "></div>

      <div className="absolute top-10 left-24  gap-3 z-20 hidden lg:flex ">
        <Link href="/raids">
          <Button
            className={cn(
              " px-5 !h-14 rounded-xl",
              pathname === "/raids" ? "glass-effect" : "opacity-70"
            )}
          >
            Raids
          </Button>
        </Link>
        <Link href="/hunt">
          <Button
            className={cn(
              " px-5 !h-14 rounded-xl",
              pathname === "/hunt" ? "glass-effect" : "opacity-70"
            )}
          >
            Hunt
          </Button>
        </Link>
      </div>

      <div className="justify-end  relative flex-1 rounded-2xl overflow-hidden min-h-[calc(100vh-40px)]   hidden lg:flex ">
        <div className="absolute inset-0 bg-[url('/images/characters/character-1-mobile.png')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/pages/bg.jpg')] hidden lg:block "></div>

        <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-[105px] relative  gap-3 hidden lg:flex">
          <RaidsList
            selectedRaid={selectedRaid}
            setSelectedRaid={setSelectedRaid}
          />
          <div className="flex-1 h-full">
            <SingleRaid />
            <TeamRecap />
            {/* End of team recap section */}
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-2xl glass-effect z-10 p-2 gap-3 lg:hidden flex-1 max-h-full">
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
              ? "Back to Hunts Home"
              : "Open Hunts List"}
          {selectedRaid || isRaidsListOpen ? (
            <ArrowBack className="size-5" />
          ) : (
            <Plus className="size-5" />
          )}
        </button>
        {isRaidsListOpen || selectedRaid ? (
          <ScrollArea className="flex-1 flex flex-col ">
            {selectedRaid ? (
              <SingleRaid />
            ) : isRaidsListOpen ? (
              <RaidsList
                selectedRaid={selectedRaid}
                setSelectedRaid={setSelectedRaid}
              />
            ) : null}
          </ScrollArea>
        ) : (
          ""
        )}

        {!selectedRaid && !isRaidsListOpen ? (
          <div
            className="flex-1  rounded-sm relative overflow-hidden h-full"
            style={{
              backgroundImage: "url('/images/pages/raids-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="absolute inset-0 "
              style={{
                background:
                  "linear-gradient(0deg, rgba(217, 217, 217, 0.07), rgba(217, 217, 217, 0.07)),linear-gradient(248.67deg, rgba(0, 0, 0, 0) -17.77%, #000000 110%)",
              }}
            />

            <div className="px-4 py-8 flex flex-col gap-2 justify-between h-full relative z-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-volkhov">Hunts</h2>
                <p className="text-white/50 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                  sagittis ipsum sit amet tortor efficitur volutpat. Nullam a
                  quam efficitur, sagittis est non, vestibulum ligula.
                </p>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="bg-white/10 p-2 lg:mt-3 rounded-sm lg:rounded-2xl lg:hidden">
          <div className="flex items-center justify-between ">
            <h2 className="text-xm font-volkhov">Team Recap</h2>
            <button className="glass-effect  p-1 rounded-full">
              <Plus className="size-4" />
            </button>
          </div>
          <div className="flex space-x-1 flex-1 mt-2 bg-white/10 rounded-lg p-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square relative rounded-xl overflow-hidden border-2 border-white/10 hover:z-10 transition-all duration-300 flex-1"
              >
                <Image
                  src={`/images/raids/raid-1.jpg`}
                  alt={`Team member ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Gradients */}
      <div
        className="fixed inset-0 "
        style={{
          background:
            "radial-gradient(69.65% 69.65% at 43.52% 23.05%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.54) 100%)",
        }}
      ></div>
      <div
        className="fixed inset-0 "
        style={{
          background:
            "radial-gradient(48.12% 75.2% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.81) 100%)",
        }}
      ></div>
    </>
  )
}

export default Page
