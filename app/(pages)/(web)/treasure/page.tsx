"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useWallet } from "@/context/wallet"
import { useProfile } from "@/store/hooks"
import { Pack } from "@/types"
import type { EmblaCarouselType } from "embla-carousel"
import { ArrowLeft, Info, Plus } from "lucide-react"

import { getAllPacks } from "@/lib/api"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ItemCard from "@/components/pages/treasure/ItemCard"

const tabs = [
  {
    id: "special",
    label: "Special",
    active: true,
  },
  // {
  //   id: "zone",
  //   label: "ZONE",
  //   active: false,
  // },
  // {
  //   id: "swap",
  //   label: "Swap",
  //   active: false,
  // },
]

interface PackDetailsModalProps {
  pack: Pack | null
  isOpen: boolean
  onClose: () => void
}

const PackDetailsModal = ({ pack, isOpen, onClose }: PackDetailsModalProps) => {
  if (!pack) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-lg border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Info size={20} />
            {pack.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="relative h-48">
            <Image
              src={pack.image}
              alt={pack.name}
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-4">
            {/* <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg mb-2">Description</h3>
              <p className="text-white/70">
                {pack.description || "No description available."}
              </p>
            </div> */}

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div
                className="grid grid-cols-2 gap-2"
                dangerouslySetInnerHTML={{ __html: pack.description }}
              ></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const Page = () => {
  const [activeTab, setActiveTab] = useState("star")
  const [packs, setPacks] = useState<Pack[]>([])
  const { data: profile } = useProfile()
  const { user } = useWallet()
  const [api, setApi] = useState<EmblaCarouselType>()
  const [current, setCurrent] = useState(0)
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)

  useEffect(() => {
    const fetchPacks = async () => {
      const response = await getAllPacks()
      if (response.data) {
        setPacks(response.data)
      }
    }
    fetchPacks()
  }, [])

  useEffect(() => {
    if (!api) return

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <>
      <div className="absolute top-10 left-24 flex gap-3 z-20 h-14 items-center max-lg:hidden">
        <h1 className="text-3xl ">Treasure</h1>
      </div>
      <div className="flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden max-lg:hidden ">
        <div className="absolute inset-0 bg-[url('/images/pages/team-bg.jpg')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/pages/team-bg.jpg')]">
          <div className="absolute inset-0 bg-[#181818CC]"></div>
        </div>
        <div className="w-full z-10  pr-8 pl-24 pt-28 relative flex flex-col gap-8   h-[calc(100vh-90px)]">
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-lg h-full flex flex-col">
            {/* Navigation Tabs */}
            <div className="flex  items-center gap-3">
              <div className="flex gap-3 flex-1">
                <Link href="/">
                  <button
                    className={cn(
                      "px-8 h-14 rounded-xl text-xl transition-all duration-300 flex items-center gap-2 bg-white/10 border border-white/10 hover:bg-white/10"
                    )}
                  >
                    <ArrowLeft size={24} /> Back
                  </button>
                </Link>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-8 h-14 rounded-xl text-xl transition-all duration-300 flex-1 bg-white/10 border border-white/10",
                      activeTab === tab.id ? "bg-white/20" : "hover:bg-white/10"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Carousel Section */}
            <div className=" mt-4 bg-white/10 rounded px-2 py-4 relative flex-1">
              <Carousel
                className="w-full h-full"
                setApi={setApi}
                opts={{
                  loop: true,
                }}
              >
                <CarouselContent className="h-full">
                  {packs.map((pack, index) => (
                    <CarouselItem
                      key={index}
                      className="lg:basis-1/2 xl:basis-1/3 "
                    >
                      <ItemCard pack={pack} setSelectedPack={setSelectedPack} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Navigation Dots */}
              {/* <div className="flex gap-2 justify-center mt-4">
                {packs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`size-2 rounded-full transition-colors ${
                      current === index ? "bg-white scale-110" : "bg-white/30"
                    }`}
                  />
                ))}
              </div> */}
            </div>

            {/* Balance Display */}
            <div className="flex items-center gap-4 border border-white/10 rounded-xl px-4 mt-4 bg-white/10 justify-center">
              <div className="flex h-14 items-center gap-2">
                <Image
                  src="/images/coin-zone.png"
                  alt="ZONE"
                  width={24}
                  height={24}
                />
                <span>{user?.zoneBalance} ZONE</span>
                <button className="ml-2 rounded-full p-1 border border-white/10">
                  <Plus size={12} />
                </button>
              </div>
              <div className="flex h-14 items-center gap-2 ">
                <Image
                  src="/images/stars.png"
                  alt="STAR"
                  width={24}
                  height={24}
                />
                <span>{profile?.stars} STAR</span>
                <button className="ml-2  rounded-full p-1 border border-white/10">
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-2xl glass-effect z-10 p-2 gap-3 lg:hidden flex-1 lg:max-h-full">
        <div className="flex  items-center gap-3">
          <div className="flex gap-3 flex-1">
            <Link href="/">
              <button
                className={cn(
                  "px-8 h-12  rounded-xl  transition-all duration-300 flex items-center gap-2 bg-white/10 border border-white/10 hover:bg-white/10"
                )}
              >
                <ArrowLeft size={16} /> Back
              </button>
            </Link>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-8 h-12 rounded-xl  transition-all duration-300 flex-1 bg-white/10 border border-white/10",
                  activeTab === tab.id ? "bg-white/20" : "hover:bg-white/10"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className=" bg-white/10 rounded px-2 py-4 flex-1 relative flex flex-col gap-4">
          <Carousel
            className="w-full flex-1"
            setApi={setApi}
            opts={{
              loop: true,
            }}
          >
            <CarouselContent className="h-full">
              {packs.map((pack, index) => (
                <CarouselItem
                  key={index}
                  className=" lg:basis-1/2 xl:basis-1/3 "
                >
                  <ItemCard pack={pack} setSelectedPack={setSelectedPack} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation Dots for Mobile */}
          <div className="flex gap-2 justify-center ">
            {packs.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`size-2 rounded-full transition-colors ${
                  current === index ? "bg-white scale-110" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 border border-white/10 rounded-xl px-4  bg-white/10 justify-center">
          <div className="flex h-14 items-center gap-2">
            <Image
              src="/images/coin-zone.png"
              alt="ZONE"
              width={24}
              height={24}
            />
            <span>{user?.zoneBalance} ZONE</span>
            <button className="ml-2 rounded-full p-1 border border-white/10">
              <Plus size={12} />
            </button>
          </div>
          <div className="flex h-14 items-center gap-2 ">
            <Image src="/images/stars.png" alt="STAR" width={24} height={24} />
            <span>{profile?.stars} STAR</span>
            <button className="ml-2  rounded-full p-1 border border-white/10">
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Background Gradients */}
      <div
        className="fixed inset-0"
        style={{
          background:
            "radial-gradient(91.36% 91.36% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
        }}
      ></div>

      <PackDetailsModal
        pack={selectedPack}
        isOpen={!!selectedPack}
        onClose={() => setSelectedPack(null)}
      />
    </>
  )
}

export default Page
