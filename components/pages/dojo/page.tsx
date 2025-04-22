"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAliens, useProfile, useTeam } from "@/store/hooks"
import type { AuthUserData, CreateAlienData } from "@/types"
import { useWallets } from "@privy-io/react-auth"
import { ArrowLeft, ArrowRight, Loader2, Plus } from "lucide-react"
import toast from "react-hot-toast"

import {
  equipAlienPart,
  getEquippedAlienParts,
  getOwnedAlienParts,
} from "@/lib/api"
import { cn, formatNumber } from "@/lib/utils"
import { GradientBorder } from "@/components/ui/gradient-border"
import IconButton from "@/components/ui/icon-button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { RenderAlien } from "./render-alien"

const DOJO_ITEMS = [
  {
    id: 1,
    value: "hairs",
    label: "Hairs",
    image: "/images/pages/dojo/hairs.png",
  },
  {
    id: 2,
    value: "eyes",
    label: "Eyes",
    image: "/images/pages/dojo/eyes.png",
  },
  {
    id: 3,
    value: "mouth",
    label: "Mouth",
    image: "/images/pages/dojo/mouth.png",
  },
  {
    id: 4,
    value: "background",
    label: "Background",
    image: "/images/pages/dojo/background.png",
  },
  {
    id: 5,
    value: "body",
    label: "Outfit & Stance",
    image: "/images/pages/dojo/body.png",
  },
  {
    id: 6,
    value: "marks",
    label: "Marks",
    image: "/images/pages/dojo/marks.png",
  },
  {
    id: 7,
    value: "powers",
    label: "Powers",
    image: "/images/pages/dojo/power.png",
  },
  {
    id: 8,
    value: "accessories",
    label: "Accessories",
    image: "/images/pages/dojo/accessories.png",
  },
]

const DojoPage = () => {
  const { data: aliens, alien, updateAlienImage, fetchAliens } = useAliens()
  const { data: profile } = useProfile()
  const { data: team } = useTeam()
  const [traits, setTraits] = useState<{
    HAIR: any[]
    EYES: any[]
    MOUTH: any[]
    ELEMENT: any[]
  }>({
    HAIR: [],
    EYES: [],
    MOUTH: [],
    ELEMENT: [],
  })
  const router = useRouter()
  const { wallets } = useWallets()

  const [userData, setUserData] = useState<AuthUserData>({
    name: "",
    code: "random",
    country: "",
    twitterId: "random",
    image: "/images/user.png",
    refferalCode: "",
  })

  const [createAlienData, setCreateAlienData] = useState<CreateAlienData>({
    name: "",
    elementId: undefined,
    image: "",
    strengthPoints: 87,
  })

  const [selectedTraits, setSelectedTraits] = useState<{
    hair: string
    eyes: string
    mouth: string
    hairId: number
    eyesId: number
    mouthId: number
    elementId: number
    element: string
  }>({
    hair: "",
    eyes: "",
    mouth: "",
    element: "",
    hairId: 0,
    eyesId: 0,
    mouthId: 0,
    elementId: 0,
  })

  const [defaultTraits, setDefaultTraits] = useState<{
    hair: string
    eyes: string
    mouth: string
    hairId: number
    eyesId: number
    mouthId: number
    elementId: number
    element: string
  }>({
    hair: "",
    eyes: "",
    mouth: "",
    element: "",
    hairId: 0,
    eyesId: 0,
    mouthId: 0,
    elementId: 0,
  })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // Add a ref for the canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (alien?.id) {
      getEquippedAlienParts(alien?.id).then((res) => {
        if (res.data) {
          // Initialize updated traits object
          const updatedTraits = { ...selectedTraits }

          // Set hair if available
          if (res.data?.hair) {
            updatedTraits.hair = res.data.hair.image
            updatedTraits.hairId = res.data.hair.id
          }

          // Set eyes if available
          if (res.data?.eyes) {
            updatedTraits.eyes = res.data.eyes.image
            updatedTraits.eyesId = res.data.eyes.id
          }

          // Set mouth if available
          if (res.data?.mouth) {
            updatedTraits.mouth = res.data.mouth.image
            updatedTraits.mouthId = res.data.mouth.id
          }

          // Set background if available (assuming background is part of the response)
          if (alien?.element?.image) {
            updatedTraits.element = alien.element.image
            updatedTraits.elementId = alien.element.id
          }

          // Update the selected traits state
          setSelectedTraits(updatedTraits)
          setDefaultTraits(updatedTraits)
        }
      })
    }
  }, [alien])

  useEffect(() => {
    if (wallets?.[0]?.address) {
      getOwnedAlienParts(wallets?.[0]?.address).then((res) => {
        if (res.data && Array.isArray(res.data?.userAlienParts)) {
          // Initialize parts map
          const partsMap: Record<string, any[]> = {
            hair: [],
            eyes: [],
            mouth: [],
            element: [],
          }

          // Process all objects in the array and collect their parts
          res.data.userAlienParts.forEach((collection) => {
            if (collection.parts && Array.isArray(collection.parts)) {
              collection.parts.forEach((part: any) => {
                const type = part.type.toLowerCase()
                if (partsMap[type] !== undefined) {
                  partsMap[type].push(part)
                }
              })
            }
          })

          // Update traits with the grouped parts
          setTraits({
            HAIR: partsMap.hair || [],
            EYES: partsMap.eyes || [],
            MOUTH: partsMap.mouth || [],
            ELEMENT: res.data?.elements || [],
          })
        }
      })
    }
  }, [wallets])

  // Track loading state

  const handleEquipParts = async () => {
    if (!alien?.id) {
      toast.error("No alien selected")
      return
    }
    if (
      selectedTraits.hairId === 0 ||
      selectedTraits.eyesId === 0 ||
      selectedTraits.mouthId === 0 ||
      selectedTraits.elementId === 0
    ) {
      toast.error("Some traits are not selected")
      return
    }

    // Get the part IDs directly from the selectedTraits object
    const selectedPartIds = []

    // Add each selected trait ID if it exists
    if (selectedTraits.hairId) selectedPartIds.push(selectedTraits.hairId)
    if (selectedTraits.eyesId) selectedPartIds.push(selectedTraits.eyesId)
    if (selectedTraits.mouthId) selectedPartIds.push(selectedTraits.mouthId)
    if (selectedTraits.elementId) selectedPartIds.push(selectedTraits.elementId)

    if (selectedPartIds.length === 0) {
      toast.error("Some traits are not selected")
      return
    }

    setIsLoading(true)

    try {
      // Equip each part one by one
      const response = await equipAlienPart({
        alienId: alien.id,
        partIds: selectedPartIds,
      })

      if (response.data && response.data.success) {
        const success = await handleUpdateAlienImage()
        if (success) {
          toast.success("Parts equipped successfully")
        } else {
          toast.error("Failed to update alien image")
        }
      } else {
        toast.error(`${response.data?.message || "Failed to equip parts"}`)
      }
    } catch (error) {
      console.error("Error equipping parts:", error)
      toast.error("Failed to equip parts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateAlienImage = async () => {
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
      formData.append("image", file)
      formData.append("alienId", alien?.id?.toString() || "")

      const response = await updateAlienImage(formData)
      console.log("updateAlienImage response ===>", response)

      if (response?.success) {
        await fetchAliens()
      }

      return response && response.success
    } catch (error) {
      console.error("Error creating alien:", error)
      toast.error("Failed to create alien. Please try again.")
      return false
    }
  }

  return (
    <div className=" flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden lg:min-h-[calc(100vh-140px)] max-lg:hidden">
      <RenderAlien
        ref={canvasRef}
        selectedTraits={selectedTraits}
        element={selectedTraits?.element || alien?.element?.image || ""}
      />
      <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-28 relative flex flex-col items-center justify-center gap-8  mx-auto ">
        <div className="w-full h-full  flex flex-col">
          <div className="items-center justify-between flex-1 hidden lg:flex">
            <div className="flex items-center gap-3 h-full">
              <IconButton showBase className="size-5 lg:size-14">
                <ArrowLeft />
              </IconButton>
              <div className="flex flex-col gap-2">
                {DOJO_ITEMS.slice(0, 4).map((item) => (
                  <Popover key={item.id}>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center flex-col gap-2 bg-white/10 rounded-xl p-2 border border-white/10 aspect-square relative hover:bg-white/20 transition-all duration-300 shadow-lg",
                          // Disable hover effect when no traits are available
                          (item.value === "hairs" &&
                            traits.HAIR.length === 0) ||
                            (item.value === "eyes" &&
                              traits.EYES.length === 0) ||
                            (item.value === "mouth" &&
                              traits.MOUTH.length === 0) ||
                            (item.value === "background" &&
                              traits.ELEMENT.length === 0)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        )}
                        onClick={() => {
                          // Only set selected category if traits are available
                          if (
                            (item.value === "hairs" &&
                              traits.HAIR.length > 0) ||
                            (item.value === "eyes" && traits.EYES.length > 0) ||
                            (item.value === "mouth" &&
                              traits.MOUTH.length > 0) ||
                            (item.value === "background" &&
                              traits.ELEMENT.length > 0) ||
                            !["hairs", "eyes", "mouth", "background"].includes(
                              item.value
                            )
                          ) {
                            setSelectedCategory(item.value)
                          }
                        }}
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.label}
                          className="w-24 h-24 opacity-30"
                          width={100}
                          height={100}
                        />
                        <span className="text-[8px] absolute bottom-3 left-1/2 -translate-x-1/2">
                          {item.label}
                        </span>
                      </button>
                    </PopoverTrigger>
                    {((item.value === "hairs" && traits.HAIR.length > 0) ||
                      (item.value === "eyes" && traits.EYES.length > 0) ||
                      (item.value === "mouth" && traits.MOUTH.length > 0) ||
                      (item.value === "background" &&
                        traits.ELEMENT.length > 0) ||
                      !["hairs", "eyes", "mouth", "background"].includes(
                        item.value
                      )) && (
                      <PopoverContent
                        className="w-64 p-3 rounded-xl border border-gray-light backdrop-blur-[40px] glass-effect"
                        side="right"
                        align="start"
                      >
                        <ScrollArea className="h-[150px]">
                          <div className="grid grid-cols-3 gap-2">
                            {item.value === "hairs" &&
                              traits?.HAIR?.map((hair, index) => (
                                <GradientBorder
                                  key={index}
                                  isSelected={selectedTraits.hairId === hair.id}
                                  className=" transition-colors duration-300"
                                >
                                  <div
                                    key={index}
                                    className="aspect-square bg-white/10 rounded-lg p-1 hover:bg-white/20 cursor-pointer transition-all"
                                    onClick={() =>
                                      setSelectedTraits({
                                        ...selectedTraits,
                                        hair: hair.image,
                                        hairId: hair.id,
                                      })
                                    }
                                  >
                                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                                      <Image
                                        src={hair.image}
                                        alt={hair.name}
                                        width={50}
                                        height={50}
                                        className="object-cover"
                                        crossOrigin="anonymous"
                                      />
                                    </div>
                                  </div>
                                </GradientBorder>
                              ))}

                            {item.value === "eyes" &&
                              traits?.EYES?.map((eyes, index) => (
                                <GradientBorder
                                  key={index}
                                  isSelected={selectedTraits.eyesId === eyes.id}
                                  className=" transition-colors duration-300"
                                >
                                  <div
                                    key={index}
                                    className="aspect-square bg-white/10 rounded-lg p-1 hover:bg-white/20 cursor-pointer transition-all"
                                    onClick={() =>
                                      setSelectedTraits({
                                        ...selectedTraits,
                                        eyes: eyes.image,
                                        eyesId: eyes.id,
                                      })
                                    }
                                  >
                                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                                      <Image
                                        src={eyes.image}
                                        alt={eyes.name}
                                        width={50}
                                        height={50}
                                        className="object-cover"
                                        crossOrigin="anonymous"
                                      />
                                    </div>
                                  </div>
                                </GradientBorder>
                              ))}

                            {item.value === "mouth" &&
                              traits?.MOUTH?.map((mouth, index) => (
                                <GradientBorder
                                  key={index}
                                  isSelected={
                                    selectedTraits.mouthId === mouth.id
                                  }
                                  className=" transition-colors duration-300"
                                >
                                  <div
                                    key={index}
                                    className="aspect-square bg-white/10 rounded-lg p-1 hover:bg-white/20 cursor-pointer transition-all"
                                    onClick={() =>
                                      setSelectedTraits({
                                        ...selectedTraits,
                                        mouth: mouth.image,
                                        mouthId: mouth.id,
                                      })
                                    }
                                  >
                                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                                      <Image
                                        src={mouth.image}
                                        alt={mouth.name}
                                        width={50}
                                        height={50}
                                        className="object-cover"
                                        crossOrigin="anonymous"
                                      />
                                    </div>
                                  </div>
                                </GradientBorder>
                              ))}

                            {item.value === "background" &&
                              traits?.ELEMENT?.map((element, index) => (
                                <GradientBorder
                                  key={index}
                                  isSelected={
                                    selectedTraits.elementId === element.id
                                  }
                                  className=" transition-colors duration-300"
                                >
                                  <div
                                    key={index}
                                    className="aspect-square bg-white/10 rounded-lg p-1 hover:bg-white/20 cursor-pointer transition-all"
                                    onClick={() =>
                                      setSelectedTraits({
                                        ...selectedTraits,
                                        element: element.image,
                                        elementId: element.id,
                                      })
                                    }
                                  >
                                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                                      <Image
                                        src={element.image}
                                        alt={element.name}
                                        width={50}
                                        height={50}
                                        className="object-cover"
                                        crossOrigin="anonymous"
                                      />
                                    </div>
                                  </div>
                                </GradientBorder>
                              ))}

                            {/* Example items - replace with actual data */}
                            {!["hairs", "eyes", "mouth", "background"].includes(
                              item.value
                            ) &&
                              [1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                  key={i}
                                  className="aspect-square bg-white/10 rounded-lg p-1 hover:bg-white/20 cursor-pointer transition-all"
                                >
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-xs">
                                      {item.label} {i}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <ScrollBar orientation="vertical" />
                        </ScrollArea>
                      </PopoverContent>
                    )}
                  </Popover>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 h-full">
              <div className="flex flex-col gap-2">
                {DOJO_ITEMS.slice(4, 8).map((item) => (
                  <Popover key={item.id}>
                    <PopoverTrigger asChild>
                      <button
                        className="flex items-center flex-col gap-2 bg-white/10 rounded-xl p-2 border border-white/10 aspect-square relative hover:bg-white/20 transition-all duration-300 shadow-lg"
                        onClick={() => setSelectedCategory(item.value)}
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.label}
                          className="w-24 h-24 opacity-30"
                          width={100}
                          height={100}
                        />
                        <span className="text-[8px] absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          {item.label}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      // className="w-64 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl"
                      className="w-64 p-3 rounded-xl border border-gray-light backdrop-blur-[40px] glass-effect"
                      side="left"
                      align="start"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {/* Example items - replace with actual data */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="aspect-square bg-white/10 rounded-lg p-1 hover:bg-white/20 cursor-pointer transition-all"
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs">
                                {item.label} {i}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
              <IconButton showBase className="size-5 lg:size-14">
                <ArrowRight />
              </IconButton>
            </div>
          </div>

          <ScrollArea className="lg:hidden">
            <div className="flex items-center gap-1  whitespace-nowrap ">
              {DOJO_ITEMS?.map((item, index) => (
                <Popover key={item.id}>
                  <PopoverTrigger asChild>
                    <button
                      className="flex items-center flex-col gap-2 bg-white/10 rounded-xl p-2 border border-white/10 aspect-square shrink-0 relative hover:bg-white/20 transition-all duration-300 shadow-lg"
                      onClick={() => setSelectedCategory(item.value)}
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.label}
                        className="w-24 h-24 opacity-30"
                        width={100}
                        height={100}
                      />
                      <span className="text-[8px] absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        {item.label}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-64 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl"
                    side="bottom"
                    align="start"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {/* Example items - replace with actual data */}
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="aspect-square bg-white/10 rounded-lg p-1 hover:bg-white/20 cursor-pointer transition-all"
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs">
                              {item.label} {i}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="flex items-end justify-center gap-4">
            <div className="flex items-center justify-center flex-col gap-4">
              <div className="flex items-center gap-5">
                <button
                  className="relative bg-white/10 backdrop-blur-lg px-6 py-4 rounded-2xl overflow-hidden group border border-white/10 min-w-32"
                  onClick={() => setSelectedTraits(defaultTraits)}
                >
                  Remove
                  <span
                    className={cn(
                      "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[50px] blur-[20px] z-[-1] group-hover:h-[60px] duration-500 transition-all",
                      "group-disabled:group-hover:h-[50px] bg-[#FF5F5F80]"
                    )}
                  />
                </button>
                <button
                  className="relative bg-white/10 backdrop-blur-lg px-10 py-2 rounded-2xl overflow-hidden group border border-white/10 flex-col flex items-center"
                  onClick={handleEquipParts}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Equipping...
                    </span>
                  ) : (
                    <span>Equip</span>
                  )}
                  <span className="text-2xs flex items-center gap-2 font-inter">
                    for 150{" "}
                    <span className="rounded-full size-5 border border-white/10 flex items-center justify-center">
                      <Image
                        src={"/images/stars.png"}
                        alt="stars"
                        width={12}
                        height={12}
                      />
                    </span>
                  </span>
                  <span
                    className={cn(
                      "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[50px] blur-[20px] z-[-1] group-hover:h-[60px] duration-500 transition-all",
                      "group-disabled:group-hover:h-[50px] bg-[#5FFF9580]"
                    )}
                  />
                </button>

                {/* <button
                  className="relative bg-white/10 backdrop-blur-lg px-6 py-4 rounded-2xl overflow-hidden group border border-white/10 min-w-32"
                  onClick={handleEquipParts}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Equipping...
                    </span>
                  ) : (
                    "Equip"
                  )}
                  <span
                    className={cn(
                      "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[50px] blur-[20px] z-[-1] group-hover:h-[60px] duration-500 transition-all",
                      "group-disabled:group-hover:h-[50px] bg-[#5FBCFF80]"
                    )}
                  />
                </button> */}
              </div>
              <div className="flex items-center gap-5">
                <Image
                  src={(selectedTraits?.element || alien?.element?.image) ?? ""}
                  alt="element"
                  width={50}
                  height={50}
                />
                <div className="bg-white/10 border border-white/10 rounded-xl backdrop-blur-lg px-4 h-14 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="size-6 lg:size-10 rounded-full p-px glass-effect flex items-center justify-center">
                      <Image
                        src="/images/coin-zone.png"
                        alt="Coin Zone"
                        width={50}
                        height={50}
                      />
                    </div>
                    <p className="text-xs font-volkhov">3,621,000 ZONE</p>
                    <button className="glass-effect size-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-6 lg:size-10 rounded-full p-px glass-effect flex items-center justify-center">
                      <Image
                        src="/images/stars.png"
                        alt="Star"
                        width={30}
                        height={30}
                      />
                    </div>
                    <p className="text-xs font-volkhov">
                      {formatNumber(profile?.stars)} STAR
                    </p>
                    <button className="glass-effect size-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-xl backdrop-blur-lg px-4 h-14 flex items-center gap-4">
                  <div className="border border-white/10 rounded flex items-center">
                    <div className="relative overflow-hidden h-full px-2 py-0.5 text-2xs bg-white/10 border border-white/10 rounded">
                      Alien
                      <span
                        className={cn(
                          "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-[10px] blur-[6px] z-[-1]  duration-500 transition-all",
                          " bg-[#ff975fa8]"
                        )}
                      />
                    </div>
                    <span className="px-3 text-[#FF985F] text-sm">
                      {aliens?.length}
                    </span>
                  </div>
                  <div className="border border-white/10 rounded flex items-center">
                    <div className="relative overflow-hidden h-full px-2 py-0.5 text-2xs bg-white/10 border border-white/10 rounded">
                      Items
                      <span
                        className={cn(
                          "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-[10px] blur-[6px] z-[-1]  duration-500 transition-all",
                          " bg-[#FF5FF980]"
                        )}
                      />
                    </div>
                    <span className="px-3 text-[#FF5FF9] text-sm">
                      {aliens?.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-effect p-4 rounded-2xl ">
              <h2 className="text-lg font-volkhov mb-2">Bonus Details</h2>
              <div className="space-y-2">
                {(() => {
                  const entries = Object.entries(team?.buffs || {})
                  return (
                    <>
                      {/* First row with first two entries */}
                      {entries.length > 0 && (
                        <div className="flex gap-2">
                          {entries.slice(0, 2).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex-1 flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1"
                            >
                              <span className="text-xs font-inter text-white/70">
                                {key}
                              </span>
                              <span className="text-xs font-volkhov">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Second row with third entry */}
                      {entries.length > 2 && (
                        <div className="flex">
                          <div
                            key={entries[2][0]}
                            className="flex-1 flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1"
                          >
                            <span className="text-xs font-inter text-white/70">
                              {entries[2][0]}
                            </span>
                            <span className="text-xs font-volkhov">
                              {entries[2][1]}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DojoPage
