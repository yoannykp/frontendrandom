"use client"

import Image from "next/image"
import { useAliens, useAppDispatch, useRaidHistory } from "@/store/hooks"
import { addRaidHistory } from "@/store/slices/raidsSlice"
import { Raid } from "@/types"
import toast from "react-hot-toast"

import { launchRaid } from "@/lib/api"
import { formatDuration, isRaidLaunched } from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"

import NoRaid from "./NoRaid"
import RaidInProgress from "./RaidInProgress"

const rewardImages = {
  STARS: "/images/stars.png",
  XP: "/images/xp.png",
  REP: "/images/rep.png",
}

const SingleRaid = ({ raid }: { raid?: Raid }) => {
  const dispatch = useAppDispatch()
  const { data: aliens } = useAliens()
  const { data: raidHistory } = useRaidHistory()

  const handleLaunchRaid = async () => {
    if (!raid?.id) return

    try {
      const response = await launchRaid({
        raidId: raid?.id,
        alienIds: aliens?.map((alien) => alien.id) || [],
      })

      if (response.data && response.data.success) {
        if (response.data) {
          dispatch(addRaidHistory(response.data))
        }
        toast.success("Raid launched successfully")
      } else {
        toast.error(response.data?.error?.message)
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  if (!raid) return <NoRaid />

  if (isRaidLaunched(raid, raidHistory)) {
    return <RaidInProgress raid={raid} />
  }

  return (
    <div className="bg-white/10 rounded-sm lg:rounded-2xl p-2 lg:p-4 flex-1">
      <div className="lg:bg-white/10  rounded-xl lg:p-4 mb-4">
        <div className="flex lg:items-center gap-4 flex-col lg:flex-row">
          <div className="lg:bg-white/10  rounded-lg lg:p-4 max-lg:w-full ">
            <Image
              src={raid.image}
              alt={raid.title}
              width={500}
              height={500}
              className="object-cover lg:aspect-auto lg:max-w-[190px] lg:h-[190px] rounded-lg max-lg:h-32"
            />
          </div>
          <div>
            <div className="flex items-center gap-4 max-lg:justify-between">
              <div className="flex  gap-4 items-center">
                <h2 className=" lg:text-3xl font-inter  lg:font-volkhov ">
                  {raid?.title}
                </h2>

                <span className="text-xs text-white/50 font-inter">
                  {formatDuration(raid?.duration)}
                </span>
              </div>
              <div className=" bg-white/10 rounded-full p-px">
                <Image
                  src={raid?.element?.image}
                  alt={raid.title}
                  width={30}
                  height={30}
                  className="object-cover size-4 lg:size-6"
                />
              </div>
            </div>
            <p className="text-white/50 text-sm mt-3">{raid?.description}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 lg:border p-4 rounded-lg max-lg:bg-white/10">
        <h2 className="text-xs lg:text-lg font-inter mb-4">Rewards</h2>
        <div className="grid grid-cols-4 gap-2 lg:gap-4">
          {raid?.rewards.map((reward, index) => (
            <div
              key={index}
              className="glass-effect p-2 lg:p-4 rounded-xl flex flex-col items-center relative overflow-hidden  lg:min-h-[150px] justify-center"
            >
              <Image
                src={rewardImages[reward.type]}
                alt={reward.type}
                width={500}
                height={500}
                className="object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 lg:size-[400px] opacity-10"
              />
              <div className="relative size-8 lg:size-20 mb-2">
                <Image
                  src={rewardImages[reward.type]}
                  alt={reward.type}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[8px] lg:text-sm">
                + {reward.amount} {reward.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BrandButton
        className="w-full"
        blurColor="bg-[#EF98E6]"
        onClick={handleLaunchRaid}
        disabled={isRaidLaunched(raid, raidHistory)}
      >
        Launch Raid
      </BrandButton>
    </div>
  )
}

export default SingleRaid
