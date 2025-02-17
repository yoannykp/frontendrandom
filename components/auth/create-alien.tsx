"use client"

import { Dispatch, SetStateAction, useRef } from "react"
import Image from "next/image"
import { useAliens } from "@/store/hooks"
import { AuthUserData, CreateAlienData, Traits } from "@/types"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { sanitizeInput } from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import PreviousStepButton from "@/components/auth/previous-step-button"

import { GradientBorder } from "../ui/gradient-border"
import { AlienRenderer } from "./alien-renderer"

interface CreateAlienProps {
  current: number
  moveToPreviousStep: () => void
  moveToNextStep: () => void
  setUserData: Dispatch<SetStateAction<AuthUserData>>
  userData: AuthUserData
  createAlienData: CreateAlienData
  setCreateAlienData: Dispatch<SetStateAction<CreateAlienData>>
  traits: Traits | null
  selectedTraits: {
    hair: string
    face: string
  }
  setSelectedTraits: Dispatch<
    SetStateAction<{
      hair: string
      face: string
    }>
  >
}

const CreateAlien = ({
  current,
  moveToPreviousStep,
  moveToNextStep,
  setUserData,
  userData,
  createAlienData,
  setCreateAlienData,
  traits,
  selectedTraits,
  setSelectedTraits,
}: CreateAlienProps) => {
  const { createAlien, createStatus } = useAliens()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleCreateAlien = async () => {
    // Validate required fields
    if (!createAlienData.name) {
      toast.error("Please enter a name for your alien")
      return
    }
    if (!createAlienData.elementId) {
      toast.error("Please select an element for your alien")
      return
    }
    if (!selectedTraits.hair) {
      toast.error("Please select a hair style for your alien")
      return
    }
    if (!selectedTraits.face) {
      toast.error("Please select a face for your alien")
      return
    }

    try {
      // Get canvas content as PNG
      const canvas = canvasRef.current
      if (!canvas) {
        toast.error("Failed to generate alien image")
        return
      }

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to convert canvas to blob"))
          }
        }, "image/png")
      })

      // Create file from blob with a unique name
      const file = new File(
        [blob],
        `${createAlienData.name.toLowerCase().replace(/\s+/g, "-")}.png`,
        { type: "image/png" }
      )

      // convert file to base64 and open in new tab
      // const base64 = URL.createObjectURL(file)
      // window.open(base64, "_blank")

      // Create form data
      const formData = new FormData()
      formData.append("name", createAlienData.name)
      formData.append("elementId", createAlienData.elementId?.toString() || "")
      formData.append("image", file)
      formData.append("strengthPoints", "100") // Default strength points

      await createAlien(formData)

      if (!createStatus.error) {
        moveToNextStep()
      }
    } catch (error) {
      console.error("Error creating alien:", error)
      toast.error("Failed to create alien. Please try again.")
    }
  }

  return (
    <div className="w-full space-y-6 z-20 max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:h-full max-lg:overflow-y-auto max-lg:py-4 max-lg:px-2">
      <div className="relative w-full flex items-center justify-between">
        <BrandButton className="items-start cursor-auto max-lg:text-sm">
          Create your Alien
        </BrandButton>

        <PreviousStepButton
          current={current}
          moveToPreviousStep={moveToPreviousStep}
        />
      </div>

      {/* show loading if no traits are loaded */}
      {!traits && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      )}

      {traits && (
        <div className="p-2 lg:p-6 rounded-normal border border-gray-light backdrop-blur-[40px] flex flex-col lg:flex-row gap-4 overflow-hidden">
          <div className="w-full lg:w-[562px]">
            <AlienRenderer
              ref={canvasRef}
              selectedTraits={selectedTraits}
              element={
                traits?.elements?.find(
                  (element) => element.id === createAlienData.elementId
                )?.image || ""
              }
            />
          </div>

          <div className="w-full flex flex-col lg:gap-4 overflow-hidden px-2">
            <div className="space-y-2">
              <h3 className="text-xl max-lg:hidden">Name your Alien</h3>
              <input
                type="text"
                value={createAlienData.name}
                onChange={(e) =>
                  setCreateAlienData({
                    ...createAlienData,
                    name: sanitizeInput(e),
                  })
                }
                placeholder="Enter alien name"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5FFF95]"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl max-lg:hidden">Choose your Element</h3>

              <ScrollArea>
                <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap max-w-full no-scrollbar">
                  {traits?.elements?.map((element, index) => (
                    <GradientBorder
                      key={index}
                      isSelected={createAlienData.elementId === element.id}
                      className=" transition-colors duration-300"
                    >
                      <div
                        className="min-w-20 h-20 p-0.5 rounded-lg cursor-pointer"
                        onClick={() =>
                          setCreateAlienData({
                            ...createAlienData,
                            elementId: element.id,
                          })
                        }
                      >
                        <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <Image
                            src={element.image}
                            alt="element image"
                            width={200}
                            height={200}
                            className="size-[calc(100%-10px)] object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>
                      </div>
                    </GradientBorder>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl max-lg:hidden">Choose your Hair</h3>

              <ScrollArea>
                <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap max-w-full no-scrollbar">
                  {traits?.alienParts?.HAIR?.map((hair, index) => (
                    <GradientBorder
                      key={index}
                      isSelected={selectedTraits.hair === hair.image}
                      className=" transition-colors duration-300"
                    >
                      <div
                        className="min-w-20 h-20 p-0.5 rounded-lg cursor-pointer"
                        onClick={() =>
                          setSelectedTraits({
                            ...selectedTraits,
                            hair: hair.image,
                          })
                        }
                      >
                        <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <Image
                            src={hair.image}
                            alt="hair image"
                            width={200}
                            height={200}
                            className="size-[calc(100%+40px)] object-cover absolute top-2 -left-1"
                            crossOrigin="anonymous"
                          />
                        </div>
                      </div>
                    </GradientBorder>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl max-lg:hidden">Choose your Face</h3>

              <ScrollArea>
                <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap max-w-full no-scrollbar">
                  {traits?.alienParts?.FACE?.map((face, index) => (
                    <GradientBorder
                      key={index}
                      isSelected={selectedTraits.face === face.image}
                      className=" transition-colors duration-300"
                    >
                      <div
                        className="min-w-20 h-20 p-0.5 rounded-lg cursor-pointer"
                        onClick={() =>
                          setSelectedTraits({
                            ...selectedTraits,
                            face: face.image,
                          })
                        }
                      >
                        <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <Image
                            src={face.image}
                            alt="face image"
                            width={200}
                            height={200}
                            className="size-[calc(100%+150px)] object-cover absolute -top-9 -left-1"
                            crossOrigin="anonymous"
                          />
                        </div>
                      </div>
                    </GradientBorder>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <BrandButton
              className="items-start hover:-translate-y-1 duration-500 transition-transform w-full max-lg:mt-4"
              blurColor="bg-[#96DFF4]"
              onClick={handleCreateAlien}
              disabled={createStatus.loading}
            >
              {createStatus.loading ? "Creating..." : "Continue"}
            </BrandButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateAlien
