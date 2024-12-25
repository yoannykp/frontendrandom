"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"
import { Button } from "@/components/ui/button"

const raids = [
  {
    id: 1,
    name: "Hoshikage Siege",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-1.jpg",
    icon: "/images/raids/raid-1_icon.png",
    isActive: true,
  },
  {
    id: 2,
    name: "Nisshoku Encounter",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-2.jpg",
    icon: "/images/raids/raid-1_icon.png",
    isActive: false,
  },
  {
    id: 3,
    name: "Inseki Mission",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-3.jpg",
    icon: "/images/raids/raid-1_icon.png",
    isActive: false,
  },
  {
    id: 4,
    name: "Ten no Conquest",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-4.jpg",
    icon: "/images/raids/raid-1_icon.png",
    isActive: false,
  },
  {
    id: 5,
    name: "Tenkū Assault",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-1.jpg",
    icon: "/images/raids/raid-1_icon.png",
    isActive: false,
  },
  {
    id: 6,
    name: "Tenkū Assault",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-1.jpg",
    icon: "/images/raids/raid-1_icon.png",
    isActive: false,
  },
  {
    id: 7,
    name: "Tenkū Assault",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-1.jpg",
    icon: "/images/raids/raid-1_icon.png",
    isActive: false,
  },
  {
    id: 8,
    name: "Tenkū Assault",
    description: "Quest description, Lorem ipsum dolor sit amet.",
    time: "2h",
    image: "/images/raids/raid-1.jpg",
    icon: "/images/raids/raid-1_icon.png",
    isActive: false,
  },
]

const Page = () => {
  const pathname = usePathname()
  return (
    <>
      <div className="absolute top-10 left-24 flex gap-3 z-20">
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

      <div className=" flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden lg:min-h-[calc(100vh-40px)]">
        <div className="absolute inset-0 bg-[url('/images/characters/character-1-mobile.png')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/pages/bg.jpg')] "></div>

        <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-[105px] relative flex gap-3">
          <div className="glass-effect h-full rounded-2xl w-[420px] p-4 flex flex-col gap-2">
            {raids.map((raid) => (
              <div
                key={raid.id}
                className={cn(
                  "flex gap-3 bg-white/10 p-4 rounded-lg relative cursor-pointer  transition-all duration-300",
                  raid.isActive ? "" : "opacity-10"
                )}
              >
                <div className="absolute top-4 right-4 bg-white/10 rounded-full p-px">
                  <Image
                    src={raid.icon}
                    alt={raid.name}
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                </div>
                <div className="relative  rounded overflow-hidden aspect-square w-14 shrink-0">
                  <Image src={raid.image} alt={raid.name} fill />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 font-inter ">
                    <h2 className="text-[18px]  font-inter ">{raid.name}</h2>
                    <span className="text-xs text-white/50 ">{raid.time}</span>
                  </div>
                  <p className=" text-white/50 text-xs">{raid.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 h-full">
            <div className="glass-effect  rounded-2xl p-4">
              <div className="bg-white/10  rounded-xl p-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10  rounded-lg p-4 ">
                    <Image
                      src="/images/raids/raid-1.jpg"
                      alt="Raid"
                      width={500}
                      height={500}
                      className="object-cover aspect-auto max-w-[190px] max-h-[190px] rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-volkhov mb-1">
                        Nisshoku Encounter
                      </h2>
                      <span className="text-xs text-white/50">2h left</span>
                      <div className=" bg-white/10 rounded-full p-px">
                        <Image
                          src="/images/raids/raid-1_icon.png"
                          alt="Raid"
                          width={30}
                          height={30}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <p className="text-white/50 text-sm mt-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Fusce sagittis ipsum sit amet tortor efficitur volutpat.
                      Nullam a quam efficitur, sagittis est non, vestibulum
                      ligula. Praesent et dolor lorem. Suspendisse sodales
                      varius tempor. Suspendisse ullamcorper elit in sapien
                      venenatis fermentum. Phasellus egestas, urna sagittis
                      interdum ornare, lectus nunc pharetra nisl, et hendrerit
                      ligula urna vitae lacus. Sed ac dui nibh.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4 border p-4 rounded-lg">
                <h2 className="text-lg font-inter mb-4">Rewards</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="glass-effect p-4 rounded-xl flex flex-col items-center relative overflow-hidden min-h-[150px] justify-center">
                    <Image
                      src="/images/star.png"
                      alt="Star"
                      width={500}
                      height={500}
                      className="object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-10"
                    />
                    <div className="relative size-20 mb-2">
                      <Image
                        src="/images/star.png"
                        alt="Star"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm">+ 500 STAR</span>
                  </div>
                </div>
              </div>

              <BrandButton className=" w-full" blurColor="bg-[#EF98E6]">
                Launch Hunt
              </BrandButton>
            </div>
            <div className="glass-effect p-4 mt-3 rounded-2xl">
              <div className="flex items-center gap-3 ">
                <div className="space-y-3 bg-white/10 rounded p-4 w-[30%]">
                  <h2 className="text-xl font-volkhov">Team Recap</h2>

                  <div className="space-y-2 ">
                    <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1">
                      <span className="text-xs  font-inter">
                        Strengh points
                      </span>
                      <span className="font-volkhov text-2xs">4400</span>
                    </div>
                    <div className="flex  gap-2">
                      <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1 flex-1">
                        <span className="text-xs  font-inter uppercase">
                          XP
                        </span>
                        <span className="font-volkhov text-2xs ">+3%</span>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1 flex-1">
                        <span className="text-xs  font-inter uppercase">
                          Star
                        </span>
                        <span className="font-volkhov text-2xs">+3%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1">
                      <span className="text-xs  font-inter">Raid time</span>
                      <span className="font-volkhov text-2xs">-3%</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 flex-1">
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
            {/* End of team recap section */}
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
