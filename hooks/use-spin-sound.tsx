import { useEffect, useRef } from "react"
import useSound from "use-sound"

type PlayFunction = () => void
type HookOptions = {
  stop: () => void
}

const useSpinSound = (
  soundPath: string,
  volume: number = 0.5,
  duration: number = 5000 // Duration in milliseconds
): [PlayFunction, HookOptions] => {
  const [play, { sound, stop }] = useSound(soundPath, {
    volume,
    loop: true,
    interrupt: true,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const startSound = () => {
    startTimeRef.current = Date.now()
    play()

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Update playback rate every 50ms
    intervalRef.current = setInterval(() => {
      if (!sound) return

      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Speed control based on progress
      if (progress < 0.2) {
        // First 1s (20%): Start slow (0.5) and speed up to 1.5
        sound.playbackRate = 0.5 + progress * 5
        sound.volume = volume
      } else if (progress < 0.6) {
        // Middle 2s (40%): Maintain fast speed
        sound.playbackRate = 1.5
        sound.volume = volume
      } else {
        // Last 2s (40%): Gradually slow down from 1.5 to 0.5 and fade out
        const slowdownProgress = (progress - 0.6) / 0.4 // Normalize to 0-1 for the slowdown phase
        sound.playbackRate = 1.5 - slowdownProgress
        // Also gradually reduce volume
        sound.volume = volume * (1 - slowdownProgress)
      }

      // Stop at the end
      if (progress >= 1) {
        stop()
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }, 50)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [stop])

  return [startSound, { stop }]
}

export default useSpinSound
