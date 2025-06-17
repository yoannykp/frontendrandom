"use client"

import { cn } from "@/lib/utils"

const PreviousStepButton = ({
  className,
  current,
  moveToPreviousStep,
}: any) => {
  return (
    <div
      className={cn(
        "border border-gray-light group rounded-normal p-2.5 cursor-pointer backdrop-blur-[40px]",
        className
      )}
      onClick={() => moveToPreviousStep(current - 1)}
    >
      <div
        className={cn(
          "border border-gray-light rounded-sm bg-glass group-hover:bg-glass/15 transition-colors duration-500 p-2",
          className
        )}
      >
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
        >
          <path
            d="M13.0193 3.96895H3.44637L5.67421 1.73337C5.86722 1.54465 5.97607 1.2857 5.97607 1.01528C5.97607 0.744858 5.86722 0.485904 5.67421 0.297183C5.27885 -0.099061 4.63836 -0.099061 4.24299 0.297183L0.286901 4.26703C0.195371 4.361 0.122107 4.47128 0.0708687 4.5922C-0.0236229 4.8409 -0.0236229 5.1158 0.0708687 5.3645C0.118654 5.49123 0.192228 5.60659 0.286901 5.70322L4.24299 9.67307C4.43586 9.85892 4.69127 9.96531 4.9586 9.97114C5.2265 9.96802 5.48286 9.86124 5.67421 9.67307C5.86722 9.48435 5.97607 9.22539 5.97607 8.95497C5.97607 8.68455 5.86722 8.4256 5.67421 8.23688L3.44637 6.0013H13.0193C15.7784 6.0013 18.0151 8.24575 18.0151 11.0144V13.9545C18.0311 16.6565 15.8995 18.8796 13.2083 18.9677H2.54174C1.98247 18.9677 1.52909 19.4226 1.52909 19.9838C1.52909 20.545 1.98247 21 2.54174 21H13.2488C17.0299 20.8752 20.0239 17.7508 19.9999 13.9545V11.0144C19.9999 7.13913 16.8811 3.99131 13.0193 3.96895Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  )
}

export default PreviousStepButton
