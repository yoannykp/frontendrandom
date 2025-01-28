"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthUserData, CreateAlienData, Traits } from "@/types"
import { AnimatePresence, motion } from "framer-motion"
import { FaXTwitter } from "react-icons/fa6"

import { getAllTraits } from "@/lib/api"
import { useIsMobile } from "@/hooks/useIsMobile"
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

const Home = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [traits, setTraits] = useState<Traits | null>(null)
  const router = useRouter()
  const isMObile = useIsMobile()
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
    element: "/images/elements/element-1.png",
    image: "/images/characters/character-1.png",
    strengthPoints: 87,
  })

  const [isTwitterLinked, setIsTwitterLinked] = useState(false)

  useEffect(() => {
    getAllTraits().then((res) => {
      setTraits(res.data)
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
      router.push("/")
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
    if (isMObile) {
      if (!isPlaying && audioRef.current) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
    setCurrentStep((previous) => previous + 1)
  }

  return (
    <main className="w-full h-screen relative">
      <BackgroundCover url="/images/auth/bg.png" />
      {currentStep > 0 ? (
        <div className="fixed w-[100vw] h-[100vh] backdrop-blur-[10px] z-10"></div>
      ) : null}

      <Suspense fallback={null}>
        <ReferralCodeHandler setUserData={setUserData} />
      </Suspense>

      <div className="w-full h-screen relative max-w-7xl mx-auto py-10 px-6 flex flex-col justify-between items-center">
        <Header />
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
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-10 relative w-full flex flex-col items-center justify-center">
          <BrandButton
            className="items-center hover:scale-105 duration-500 transition-transform active:scale-95"
            blurColor="bg-[#9E96F4]"
            onClick={handleButtonClick}
          >
            {isMObile ? (
              "Tap here"
            ) : (
              <>
                Log In with <FaXTwitter className="w-5 h-5" />
              </>
            )}
          </BrandButton>
          {currentStep > 0 ? (
            <Sliders current={currentStep} moveToNextStep={moveToNextStep} />
          ) : null}
          <Footer />
        </div>
      </div>
    </main>
  )
}

export default Home
