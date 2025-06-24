import { useState } from "react"
import useSound from "use-sound"

const useHoverSound = (soundUrl: string, volume: number = 0.5) => {
  const [isHovering, setIsHovering] = useState(false)
  const [play, { stop }] = useSound(soundUrl, { volume })

  const handleMouseEnter = () => {
    setIsHovering(true)
    play()
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    stop()
  }

  return { isHovering, handleMouseEnter, handleMouseLeave }
}

export default useHoverSound
