import { useEffect, useState } from "react"
import Image from "next/image"
import { AppDispatch } from "@/store"
import { useCharacters } from "@/store/hooks"
import { fetchUserProfile } from "@/store/slices/userProfileSlice"
import { Character, Gear } from "@/types"
import { Loader2 } from "lucide-react"
import { createPortal } from "react-dom"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"

import {
  multiSummonCharacter,
  multiSummonGear,
  summonCharacter,
  summonGear,
} from "@/lib/api"
import BrandButton from "@/components/ui/brand-button"

import SummonModal from "./SummonModal"

const VideoPlayerModal = ({
  isOpen,
  setIsOpen,
  videoUrl,
  onEnded,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  videoUrl: string
  onEnded?: () => void
}) => {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const { fetchCharacters } = useCharacters()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Reset loading state when video URL changes
  useEffect(() => {
    if (videoUrl) {
      setIsLoading(true)
      setHasError(false)
    }
  }, [videoUrl])

  // Handle closing the modal
  const handleClose = () => {
    setIsOpen(false)
    // Refresh characters when modal is closed
    fetchCharacters()
  }

  if (!isOpen || !mounted) return null

  const handleEnded = () => {
    if (onEnded) {
      onEnded()
    } else {
      toast.success("Character summoned successfully")
      handleClose()
    }
  }

  // Using createPortal to render the modal outside the normal DOM hierarchy
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black"
      style={{ zIndex: 2147483647 }} // Maximum possible z-index value
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-xl">Failed to load video</p>
          <button
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            onClick={handleEnded}
          >
            Close
          </button>
        </div>
      )}

      <BrandButton
        blurColor="bg-[#EF98E6]"
        className="absolute bottom-4 right-4 z-30 "
        onClick={handleEnded}
      >
        Skip
      </BrandButton>

      {!hasError && (
        <video
          src={videoUrl}
          autoPlay
          className="w-full h-full object-cover"
          onEnded={handleEnded}
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
          controls={false}
          // onClick={handleClose}
          playsInline
        />
      )}
    </div>,
    document.body
  )
}

const DrawPage = ({ portal }: { portal: number }) => {
  const [loading, setLoading] = useState({ single: false, multi: false })
  const [isOpen, setIsOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [characterVideoUrl, setCharacterVideoUrl] = useState("")
  const [summonType, setSummonType] = useState<"character" | "gear">(
    "character"
  )
  const [summonItems, setSummonItems] = useState<Character[] | Gear[]>([])
  const [singleSummonItem, setSingleSummonItem] = useState<
    Character | Gear | null
  >(null)
  const [isMinted, setIsMinted] = useState(false)
  // const { fetchUserProfile } = useProfile()
  const dispatch = useDispatch<AppDispatch>()

  // Get the fetchCharacters function from the useCharacters hook
  const { fetchCharacters } = useCharacters()

  useEffect(() => {
    if (isOpen) {
      setIsMinted(false)
    }
  }, [isOpen])

  // Handle video end for single character summon
  const handleVideoEnded = () => {
    if (singleSummonItem) {
      // Since we're only showing videos for characters, we know this is a Character type
      setSummonItems([singleSummonItem as Character])
      setIsOpen(true)
    }
    setVideoModalOpen(false)
  }

  const handleSummonCharacter = async () => {
    try {
      setLoading({ ...loading, single: true })
      const response = await summonCharacter({ portal })
      console.log(response)
      if (!response?.data?.success || response.error) {
        toast.error(
          response?.data?.error?.message || "Error summoning character"
        )
        return
      }

      // Refresh characters list after successful summon
      fetchCharacters()
      // fetchUserProfile()
      dispatch(fetchUserProfile())

      // Set summon type to character
      setSummonType("character")

      // Check if character has a video and play it
      if (response.data?.character?.video) {
        setSingleSummonItem(response.data.character)
        setCharacterVideoUrl(response.data.character.video)
        setVideoModalOpen(true)
        dispatch(fetchUserProfile())
      } else if (response.data?.character) {
        // If no video, show the summon modal directly
        setSummonItems([response.data.character])
        setIsOpen(true)
        toast.success("Character summoned successfully")
      }
    } catch (error) {
      toast.error("Error summoning character")
      console.log(error)
    } finally {
      setLoading({ ...loading, single: false })
    }
  }

  const handleMultiSummon = async () => {
    try {
      setLoading({ ...loading, multi: true })
      const response = await multiSummonCharacter({ portal })
      if (!response?.data?.success || response.error) {
        toast.error(
          response?.data?.error?.message || "Error summoning character"
        )
        return
      }

      // Refresh characters list after successful multi-summon
      fetchCharacters()
      // fetchUserProfile()
      // Set summon type to character
      setSummonType("character")

      const characters = response.data?.summonResults.map(
        (result) => result.character
      )
      setSummonItems(characters || [])
      setIsOpen(true)
      toast.success("Characters summoned successfully")
    } catch (error) {
      toast.error("Error summoning character")
      console.log(error)
    } finally {
      setLoading({ ...loading, multi: false })
    }
  }

  const handleSummonGear = async () => {
    try {
      setLoading({ ...loading, single: true })
      const response = await summonGear()
      if (!response?.data?.success || response.error) {
        toast.error(
          response?.data?.error?.message || "Error summoning character"
        )
        return
      }

      // Set summon type to gear
      setSummonType("gear")

      // Show the gear in the summon modal
      if (response.data && "gear" in response.data) {
        setSummonItems([response.data.gear as Gear])
        setIsOpen(true)
        dispatch(fetchUserProfile())
        toast.success("Gear summoned successfully")
      }
    } catch (error) {
      toast.error("Error summoning gear")
      console.log(error)
    } finally {
      setLoading({ ...loading, single: false })
    }
  }

  const handleMultiSummonGear = async () => {
    try {
      setLoading({ ...loading, multi: true })
      const response = await multiSummonGear()
      if (!response?.data?.success || response.error) {
        toast.error(
          response?.data?.error?.message || "Error summoning character"
        )
        return
      }

      // Set summon type to gear
      setSummonType("gear")

      // Show the gears in the summon modal
      if (response.data && "gears" in response.data) {
        setSummonItems(response.data.gears as Gear[])
        setIsOpen(true)
        dispatch(fetchUserProfile())
        toast.success("Gear summoned successfully")
      }
    } catch (error) {
      toast.error("Error summoning gear")
      console.log(error)
    } finally {
      setLoading({ ...loading, multi: false })
    }
  }

  const handleSummon = async (isMulti: boolean) => {
    if (portal === 1) {
      if (isMulti) {
        handleMultiSummon()
      } else {
        handleSummonCharacter()
      }
    } else {
      if (isMulti) {
        handleMultiSummonGear()
      } else {
        handleSummonGear()
      }
    }
  }

  return (
    <>
      <div
        className={` bg-cover bg-center bg-no-repeat w-full h-full p-3 lg:p-10 rounded-xl ${
          portal === 1
            ? "bg-[url('/images/pages/draw-bg-1.png')]"
            : "bg-[url('/images/pages/draw-bg-2.png')]"
        }`}
        style={{
          backgroundImage: `url('/images/pages/draw-bg-${portal}.png')`,
        }}
      >
        <div className="items-end flex justify-center gap-3 lg:gap-5    h-full z-10 relative">
          <div className="bg-white/10 px-4 py-2 rounded-xl relative overflow-hidden border border-white/10">
            <h3 className=" lg:text-lg font-medium">Single Summon</h3>
            <button
              className="group  mt-1 w-full  bg-white/10 px-3 py-2 rounded-lg relative overflow-hidden border border-white/10"
              onClick={() => handleSummon(false)}
              disabled={loading.single}
            >
              <div className="flex items-center gap-2 justify-between z-10 w-full relative">
                {loading.single && (
                  <div className="w-full flex items-center justify-center absolute top-0 left-0">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                )}
                <span>{portal === 1 ? 100 : 50}</span>
                <span className="size-6 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center border border-white/10">
                  <Image
                    src="/images/stars.png"
                    alt="Star"
                    width={16}
                    height={16}
                  />
                </span>
              </div>
              <Image
                src="/images/stars.png"
                alt="Star"
                width={100}
                height={100}
                className="absolute -right-7 -top-7 opacity-20"
              />
            </button>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[50px] blur-[15px] z-[-1] group-hover:h-[40px] duration-500 transition-all bg-[#EF9898]"></div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl relative overflow-hidden border border-white/10">
            <h3 className="lg:text-lg font-medium">Consecutive Summon</h3>
            <button
              className="group  mt-1 w-full  bg-white/10 px-3 py-2 rounded-lg relative overflow-hidden border border-white/10"
              onClick={() => handleSummon(true)}
              disabled={loading.multi}
            >
              <div className="flex items-center gap-2 justify-between z-10 w-full relative">
                {loading.multi && (
                  <div className="w-full flex items-center justify-center absolute top-0 left-0">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                )}
                <span>{portal === 1 ? 1000 : 500}</span>
                <span className="size-6 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center border border-white/10">
                  <Image
                    src="/images/stars.png"
                    alt="Star"
                    width={16}
                    height={16}
                  />
                </span>
              </div>
              <Image
                src="/images/stars.png"
                alt="Star"
                width={100}
                height={100}
                className="absolute -right-7 -top-7 opacity-20"
              />
            </button>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[50px] blur-[15px] z-[-1] group-hover:h-[40px] duration-500 transition-all bg-[#EF98E6]"></div>
          </div>
        </div>

        <div
          style={{
            background:
              "linear-gradient(337.55deg, #000000 -0.35%, rgba(0, 0, 0, 0) 66.9%, #000000 92.55%)",
          }}
          className="absolute inset-0"
        ></div>
      </div>

      <SummonModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        summonType={summonType}
        summonItems={summonItems}
        handleMultiSummon={() => handleSummon(true)}
        loading={loading.single || loading.multi}
        showCloseButton
        showMintButton={summonType === "character"}
        isMinted={isMinted}
        setIsMinted={setIsMinted}
      />
      <VideoPlayerModal
        isOpen={videoModalOpen}
        setIsOpen={setVideoModalOpen}
        videoUrl={characterVideoUrl}
        onEnded={handleVideoEnded}
      />
    </>
  )
}

export default DrawPage
