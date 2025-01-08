"use client"

import { Dispatch, SetStateAction } from "react"
import Image from "next/image"
import character from "@/public/images/characters/character-1.png"
import { useAliens } from "@/store/hooks"
import { AuthUserData, CreateAlienData } from "@/types"
import toast from "react-hot-toast"

import BrandButton from "@/components/ui/brand-button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import PreviousStepButton from "@/components/auth/previous-step-button"

const elements = [
  "/images/elements/element-1.png",
  "/images/elements/element-2.png",
  "/images/elements/element-3.png",
  "/images/elements/element-4.png",
  "/images/elements/element-5.png",
  "/images/elements/element-6.png",
  "/images/elements/element-7.png",
  "/images/elements/element-8.png",
]

interface CreateAlienProps {
  current: number
  moveToPreviousStep: () => void
  moveToNextStep: () => void
  setUserData: Dispatch<SetStateAction<AuthUserData>>
  userData: AuthUserData
  createAlienData: CreateAlienData
  setCreateAlienData: Dispatch<SetStateAction<CreateAlienData>>
}

const CreateAlien = ({
  current,
  moveToPreviousStep,
  moveToNextStep,
  setUserData,
  userData,
  createAlienData,
  setCreateAlienData,
}: CreateAlienProps) => {
  const { createAlien, createStatus } = useAliens()

  const handleCreateAlien = async () => {
    // Validate required fields
    if (!createAlienData.name) {
      toast.error("Please enter a name for your alien")
      return
    }
    if (!createAlienData.element) {
      toast.error("Please select an element for your alien")
      return
    }
    if (!createAlienData.hair) {
      toast.error("Please select a hair style for your alien")
      return
    }
    if (!createAlienData.face) {
      toast.error("Please select a face for your alien")
      return
    }

    try {
      await createAlien(createAlienData)
      if (!createStatus.error) {
        moveToNextStep()
      }
    } catch (error) {
      toast.error("Failed to create alien. Please try again.")
    }
  }

  return (
    <div className="w-full space-y-6 z-20">
      <div className="relative w-full flex items-center justify-between">
        <BrandButton className="items-start cursor-auto">
          Create your Alien
        </BrandButton>

        <PreviousStepButton
          current={current}
          moveToPreviousStep={moveToPreviousStep}
        />
      </div>
      <div className="p-6 rounded-normal border border-gray-light backdrop-blur-[40px] flex flex-col lg:flex-row gap-4 overflow-hidden">
        <Image
          src={character}
          alt="image"
          placeholder="blur"
          className="w-full lg:w-[462px] lg:h-[620px] h-auto object-cover rounded-normal"
        />

        <div className="w-full flex flex-col gap-8 overflow-hidden px-2">
          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-2xl">Name your Alien</h3>
              <input
                type="text"
                value={createAlienData.name}
                onChange={(e) =>
                  setCreateAlienData({
                    ...createAlienData,
                    name: e.target.value,
                  })
                }
                placeholder="Enter alien name"
                className="w-full px-4 py-2 rounded-lg bg-gray-dark text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5FFF95]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-2xl">Choose your Element</h3>
              <p className="text-white text-[12px] font-inter">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <ScrollArea>
              <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap max-w-full no-scrollbar">
                {elements.map((element, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 p-0.5 rounded-lg shrink-0 cursor-pointer"
                    style={{
                      background:
                        createAlienData.element === element
                          ? "linear-gradient(360deg, #5FFF95 0%, rgba(95, 255, 149, 0) 100%)"
                          : "unset",
                    }}
                    onClick={() =>
                      setCreateAlienData({
                        ...createAlienData,
                        element: element,
                      })
                    }
                  >
                    <div className="w-full h-full bg-gray-dark rounded-lg flex items-center justify-center">
                      <Image
                        src={element}
                        alt="element image"
                        width={64}
                        height={64}
                        className="w-16 h-16"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-2xl">Choose your Hair</h3>
              <p className="text-off-white text-[12px] font-inter">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <ScrollArea>
              <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap max-w-full no-scrollbar">
                {elements.map((element, index) => (
                  <div
                    key={index}
                    className="min-w-20 h-20 p-0.5 rounded-lg cursor-pointer"
                    style={{
                      background:
                        createAlienData.hair === index.toString()
                          ? "linear-gradient(360deg, #5FFF95 0%, rgba(95, 255, 149, 0) 100%)"
                          : "unset",
                    }}
                    onClick={() =>
                      setCreateAlienData({
                        ...createAlienData,
                        hair: index.toString(),
                      })
                    }
                  >
                    <div className="w-full h-full bg-gray-dark rounded-lg flex items-center justify-center"></div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-2xl">Choose your Face</h3>
              <p className="text-white text-[12px] font-inter">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <ScrollArea>
              <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap max-w-full no-scrollbar">
                {elements.map((element, index) => (
                  <div
                    key={index}
                    className="min-w-20 h-20 p-0.5 rounded-lg cursor-pointer"
                    style={{
                      background:
                        createAlienData.face === index.toString()
                          ? "linear-gradient(360deg, #5FFF95 0%, rgba(95, 255, 149, 0) 100%)"
                          : "unset",
                    }}
                    onClick={() =>
                      setCreateAlienData({
                        ...createAlienData,
                        face: index.toString(),
                      })
                    }
                  >
                    <div className="w-full h-full bg-gray-dark rounded-lg flex items-center justify-center"></div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <BrandButton
            className="items-start hover:-translate-y-1 duration-500 transition-transform w-full"
            blurColor="bg-[#96DFF4]"
            onClick={handleCreateAlien}
            disabled={createStatus.loading}
          >
            {createStatus.loading ? "Creating..." : "Continue"}
          </BrandButton>
        </div>
      </div>
    </div>
  )
}

export default CreateAlien
