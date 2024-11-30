"use client"

import { useState } from "react"
import { FaXTwitter } from "react-icons/fa6"

import BackgroundCover from "../common/background-cover"
import Footer from "../common/footer"
import Header from "../common/header"
import BrandButton from "../ui/brand-button"
import ConnectModal from "./connect-modal"
import CreateAlien from "./create-alien"
import InfoModal from "./info-modal"
import InviteCodeModal from "./invite-code-modal"
import LinkTwitter from "./link-twitter"
import Sliders from "./sliders"

const MODAL_TYPES = [
  "connect",
  "invite",
  "create-alien",
  "information-modal",
  "link-twitter",
]

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState("")
  const [currentStep, setCurrentStep] = useState(0)

  const moveToPreviousStep = (step: number) => {
    setCurrentStep(step)
    if (step >= 1 && step <= 4) setModalType(MODAL_TYPES[step - 1])

    if (step <= 0) {
      setIsModalOpen(false)
      setModalType("")
      setCurrentStep(0)
    }
  }

  const moveToNextStep = (step: number) => {
    console.log("step ===>", step)

    setCurrentStep(step)
    if (step >= 1 && step <= 5) setModalType(MODAL_TYPES[step - 1])
    else {
      setIsModalOpen(false)
      setModalType("")
      setCurrentStep(0)
    }
  }

  return (
    <main className="w-full h-screen relative">
      <BackgroundCover />
      {isModalOpen ? (
        <div className="fixed w-[100vw] h-[100vh] backdrop-blur-[10px] z-10"></div>
      ) : null}

      <div className="w-full h-screen relative max-w-7xl mx-auto py-10 px-6 flex flex-col justify-between items-center">
        <Header />
        {isModalOpen ? (
          modalType == MODAL_TYPES[0] && currentStep == 1 ? (
            <ConnectModal
              current={currentStep}
              moveToPreviousStep={moveToPreviousStep}
              moveToNextStep={moveToNextStep}
            />
          ) : modalType == MODAL_TYPES[1] && currentStep == 2 ? (
            <InviteCodeModal
              current={currentStep}
              moveToPreviousStep={moveToPreviousStep}
              moveToNextStep={moveToNextStep}
            />
          ) : modalType == MODAL_TYPES[2] && currentStep == 3 ? (
            <CreateAlien
              current={currentStep}
              moveToPreviousStep={moveToPreviousStep}
              moveToNextStep={moveToNextStep}
            />
          ) : modalType == MODAL_TYPES[3] && currentStep == 4 ? (
            <InfoModal
              current={currentStep}
              moveToPreviousStep={moveToPreviousStep}
              moveToNextStep={moveToNextStep}
            />
          ) : modalType == MODAL_TYPES[4] && currentStep == 5 ? (
            <LinkTwitter
              current={currentStep}
              moveToPreviousStep={moveToPreviousStep}
              moveToNextStep={moveToNextStep}
            />
          ) : null
        ) : null}

        <div className="space-y-10 relative w-full flex flex-col items-center justify-center">
          <BrandButton
            className="items-center hover:scale-105 duration-500 transition-transform active:scale-95"
            blurColor="bg-purple-300"
            onClick={() => {
              setIsModalOpen(true)
              setModalType(MODAL_TYPES[0])
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
