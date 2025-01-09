"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/context/wallet"
import { AuthUserData, CreateAlienData } from "@/types"
import { AnimatePresence, motion } from "framer-motion"
import { FaXTwitter } from "react-icons/fa6"

import BrandButton from "@/components/ui/brand-button"
import BackgroundCover from "@/components/common/background-cover"
import Footer from "@/components/common/footer"
import Header from "@/components/common/header"

import ConnectModal from "./connect-modal"
import CreateAlien from "./create-alien"
import InfoModal from "./info-modal"
import Sliders from "./sliders"

const Home = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const [userData, setUserData] = useState<AuthUserData>({
    name: "",
    code: "random",
    country: "",
    twitterId: "random",
    image: "/images/user.png",
  })

  const [createAlienData, setCreateAlienData] = useState<CreateAlienData>({
    name: "",
    element: "/images/elements/element-1.png",
    image: "/images/characters/character-1.png",
    strengthPoints: 87,
    hair: "0",
    face: "0",
  })

  const [isTwitterLinked, setIsTwitterLinked] = useState(false)
  const router = useRouter()

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

  return (
    <main className="w-full h-screen relative">
      <BackgroundCover url="/images/auth/bg.png" />
      {currentStep > 0 ? (
        <div className="fixed w-[100vw] h-[100vh] backdrop-blur-[10px] z-10"></div>
      ) : null}

      <div className="w-full h-screen relative max-w-7xl mx-auto py-10 px-6 flex flex-col justify-between items-center ">
        <Header />
        <AnimatePresence mode="wait">
          {currentStep > 0 && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="z-50 "
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
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-10 relative w-full flex flex-col items-center justify-center">
          <BrandButton
            className="items-center hover:scale-105 duration-500 transition-transform active:scale-95"
            blurColor="bg-[#9E96F4]"
            onClick={() => {
              setCurrentStep((previous) => previous + 1)
            }}
          >
            Log In with <FaXTwitter className="w-5 h-5" />
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
