"use client"

import Image from "next/image"

import BrandButton from "@/components/ui/brand-button"

const page = () => {
  return (
    <>
      <div className="absolute top-10 left-24 flex gap-3 z-20 h-14 items-center">
        <h1 className="text-3xl ">Team</h1>
      </div>
      <div className=" flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden lg:min-h-[calc(100vh-40px)]">
        <div className="absolute inset-0 bg-[url('/images/pages/team-bg.jpg')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/pages/team-bg.jpg')]">
          <div className="absolute inset-0 bg-[#181818CC]"></div>
        </div>

        <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-28 relative flex flex-col items-center justify-center gap-8 max-w-[930px] mx-auto">
          <div className="flex items-end gap-4  w-full">
            <div className="flex flex-col justify-end gap-4 flex-1">
              <div className="glass-effect p-4 rounded-2xl">
                <h2 className="text-lg font-volkhov mb-2">Team Overall</h2>
                <div className="flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1">
                  <span className="text-xs font-inter text-white/70">
                    Strength points
                  </span>
                  <span className="text-xs font-volkhov">240</span>
                </div>
              </div>

              <div className="glass-effect p-4 rounded-2xl">
                <h2 className="text-lg font-volkhov mb-2">Buffs</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1">
                    <span className="text-xs font-inter text-white/70">
                      Lorem Ipsum
                    </span>
                    <span className="text-xs font-volkhov">4</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1 ">
                    <span className="text-xs font-inter text-white/70">
                      Lorem Ipsum
                    </span>
                    <span className="text-xs font-volkhov">6</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1">
                    <span className="text-xs font-inter text-white/70">
                      Lorem Ipsum
                    </span>
                    <span className="text-xs font-volkhov">7</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center col-span-3">
              <div className="relative size-[405px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/characters/character-1-main.png"
                  alt="Character"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <BrandButton blurColor="bg-[#EF98E6]" className="w-full">
                Go Raids
              </BrandButton>
              <div className="glass-effect p-4 rounded-2xl ">
                <h2 className="text-lg font-volkhov mb-2">Synergies</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1">
                    <span className="text-xs font-inter text-white/70">
                      Lorem Ipsum
                    </span>
                    <span className="text-xs font-volkhov">X2</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1   ">
                    <span className="text-xs font-inter text-white/70">
                      Loyalty
                    </span>
                    <span className="text-xs font-volkhov">X3</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1">
                    <span className="text-xs font-inter text-white/70">
                      Serenity
                    </span>
                    <span className="text-xs font-volkhov">X1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4  w-full">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="glass-effect p-2 rounded-2xl flex flex-col items-center relative overflow-hidden"
              >
                <div className="relative w-full aspect-square  shrink-0 ">
                  <Image
                    src={`/images/raids/raid-${index + 1}.jpg`}
                    alt={`Team member ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="absolute bottom-0 left-0 w-full h-full text-center flex flex-col justify-end p-4  z-10">
                  <span className="text-lg font-volkhov mb-2">Name</span>
                  <div className="flex gap-2">
                    <div className="flex justify-between items-center gap-2 bg-white/10 rounded px-2 py-1 whitespace-nowrap">
                      <span className="text-[10px] font-inter text-white/70">
                        Strength points
                      </span>
                      <span className="text-xs font-volkhov">240</span>
                    </div>
                    <div className="flex items-center -space-x-2 bg-white/10 rounded px-2 py-1">
                      <Image
                        src="/images/star.png"
                        alt="Star"
                        width={16}
                        height={16}
                      />
                      <Image
                        src="/images/star.png"
                        alt="Star"
                        width={16}
                        height={16}
                      />
                      <Image
                        src="/images/star.png"
                        alt="Star"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black "></div>
              </div>
            ))}
            <button className="glass-effect p-4 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-volkhov glass-effect size-12 rounded-lg flex items-center justify-center">
                +
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Background Gradients */}
      <div
        className="fixed inset-0 "
        style={{
          background:
            "radial-gradient(91.36% 91.36% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
        }}
      ></div>
      {/* <div
        className="fixed inset-0 "
        style={{
          background:
            "radial-gradient(48.12% 75.2% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.81) 100%)",
        }}
      ></div> */}
    </>
  )
}

export default page
