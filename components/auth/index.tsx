"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthUserData, CreateAlienData, Traits } from "@/types"
import { AnimatePresence, motion } from "framer-motion"

import { getOnboardingData } from "@/lib/api"
import BrandButton from "@/components/ui/brand-button"
import BackgroundCover from "@/components/common/background-cover"
import Footer from "@/components/common/footer"
import Header from "@/components/common/header"

import ConnectModal from "./connect-modal"
import CreateAlien from "./create-alien"
import InfoModal from "./info-modal"
import Sliders from "./sliders"

function ReferralCodeHandler({
  setUserData,
}: {
  setUserData: React.Dispatch<React.SetStateAction<AuthUserData>>
}) {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const refferalCode = searchParams.get("refferalCode")
    const refferalCodeFromLocalStorage = localStorage.getItem("refferalCode")

    if (refferalCode) {
      setUserData((prev: AuthUserData) => ({ ...prev, refferalCode }))
      localStorage.setItem("refferalCode", refferalCode)
      router.replace("/auth")
    } else if (refferalCodeFromLocalStorage) {
      setUserData((prev: AuthUserData) => ({
        ...prev,
        refferalCode: refferalCodeFromLocalStorage,
      }))
    }
  }, [searchParams, router, setUserData])

  return null
}

const Auth = ({ deviceType }: { deviceType: "mobile" | "desktop" }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [traits, setTraits] = useState<Traits | null>(null)
  const router = useRouter()

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
  }>({
    hair: "",
    eyes: "",
    mouth: "",
    hairId: -1,
    eyesId: -1,
    mouthId: -1,
  })

  const [isTwitterLinked, setIsTwitterLinked] = useState(false)
  useEffect(() => {
    getOnboardingData().then((res) => {
      if (res.data) {
        setTraits(res.data)
        setCreateAlienData({
          ...createAlienData,
          elementId: res.data.elements[0].id,
        })
        setSelectedTraits({
          hair: res.data.alienParts.HAIR[0].image,
          eyes: res.data.alienParts.EYES[0].image,
          mouth: res.data.alienParts.MOUTH[0].image,
          hairId: res.data.alienParts.HAIR[0].id,
          eyesId: res.data.alienParts.EYES[0].id,
          mouthId: res.data.alienParts.MOUTH[0].id,
        })
      }
    })
  }, [])
  useEffect(() => {
    audioRef.current = new Audio("/music.mp3")
    audioRef.current.loop = true
  }, [])

  const moveToPreviousStep = () => {
    if (currentStep === 0) return
    setCurrentStep((previous) => previous - 1)
  }

  const moveToNextStep = () => {
    if (currentStep === 3) {
      router.push("/?showDailyReward=true")
      return
    }

    if (currentStep < 4) {
      setCurrentStep((previous) => previous + 1)
    } else {
      setCurrentStep(0)
    }
  }

  const moveToStep = (step: number) => {
    if (step > 0 && step < 4) {
      setCurrentStep(step)
    } else {
      setCurrentStep(0)
    }
  }

  const handleButtonClick = () => {
    // if (deviceType === "mobile") {
    if (!isPlaying && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
    // }
    setCurrentStep((previous) => previous + 1)
  }

  console.log("selectedTraits ===>", selectedTraits)

  return (
    <main className="w-full h-screen relative">
      {deviceType === "mobile" ? (
        <BackgroundCover url="/images/auth/mobile-bg.jpeg" />
      ) : (
        <video
          src="/images/auth/desktop-bg.mov"
          autoPlay
          muted
          loop
          className="w-full h-full object-cover fixed top-0 left-0"
        />
      )}
      {currentStep > 0 ? (
        <div className="fixed w-[100vw] h-[100vh] backdrop-blur-[10px] z-10 max-lg:bg-black/50"></div>
      ) : null}

      <Suspense fallback={null}>
        <ReferralCodeHandler setUserData={setUserData} />
      </Suspense>

      <div className="w-full min-h-screen relative max-w-7xl overflow-hidden mx-auto py-10 px-3 lg:px-6 flex flex-col justify-between items-center">
        {currentStep !== 3 ? <Header /> : null}
        <AnimatePresence mode="wait">
          {currentStep > 0 && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="z-50 w-full flex flex-col items-center justify-center"
            >
              {currentStep === 1 ? (
                <ConnectModal
                  current={currentStep}
                  moveToPreviousStep={moveToPreviousStep}
                  moveToStep={moveToStep}
                />
              ) : currentStep === 2 ? (
                <InfoModal
                  current={currentStep}
                  moveToPreviousStep={moveToPreviousStep}
                  moveToNextStep={moveToNextStep}
                  setUserData={setUserData}
                  userData={userData}
                  isTwitterLinked={isTwitterLinked}
                />
              ) : currentStep === 3 ? (
                <CreateAlien
                  current={currentStep}
                  moveToPreviousStep={moveToPreviousStep}
                  moveToNextStep={moveToNextStep}
                  setUserData={setUserData}
                  userData={userData}
                  createAlienData={createAlienData}
                  setCreateAlienData={setCreateAlienData}
                  traits={traits}
                  selectedTraits={selectedTraits}
                  setSelectedTraits={setSelectedTraits}
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full flex flex-col items-center justify-center">
          <BrandButton
            className="items-center hover:scale-105 duration-500 transition-transform active:scale-95 lg:fixed lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
            blurColor="bg-[#9E96F4]"
            onClick={handleButtonClick}
          >
            Tap here
          </BrandButton>
          {currentStep > 0 ? <Sliders current={currentStep} /> : null}
          <Footer />
        </div>
      </div>
    </main>
  )
}

export default Auth
