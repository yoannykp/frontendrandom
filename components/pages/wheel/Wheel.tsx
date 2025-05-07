import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import frameImageSrc from "@/public/images/wheel/frame.png"
import toast from "react-hot-toast"

import { spinWheel } from "@/lib/api"

// Define a mapping between item types and colors
const itemColorMap = {
  // Basic types
  STARS: "#FF8A00",

  // Item types
  CUT: "#FFD600", // Bronze Cut
  KNIFE: "#FF69B4", // Silver Knife
  SHEARS: "#FF99CC", // Golden Shears

  // Rune types
  UNCOMMON: "#FF4444",
  COMMON: "#7FFF00",
  RARE: "#00BFFF",
  EPIC: "#4169E1",
  LEGENDARY: "#FF0000",
}

// First, let's define interfaces for the API response types
interface StarsPrize {
  type: "stars"
  amount: number
  message: string
}

interface ItemPrize {
  type: "item"
  itemType: string // CUT, KNIFE, SHEARS
  itemQuality: string // BRONZE, SILVER, GOLDEN
  message: string
}

interface RunePrize {
  type: "rune"
  itemType: string // UNCOMMON, COMMON, RARE, EPIC, LEGENDARY
  message: string
}

type WheelPrize = StarsPrize | ItemPrize | RunePrize

// Simulate API call to get winning item
const getWinningItem = async (
  items: Array<{ color: string; name: string }>
) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Random selection for demonstration - in production this would be an API call
  const randomIndex = Math.floor(Math.random() * items.length)
  return {
    success: true,
    data: {
      winningItem: items[randomIndex],
      winningIndex: randomIndex,
    },
  }
}

interface WheelProps {
  isSpinning?: boolean
  onSpinComplete?: (item: { color: string; name: string }) => void
  items?: Array<{ color: string; name: string }>
  setIsError: (isError: boolean) => void
}

const Wheel = ({
  isSpinning,
  onSpinComplete,
  items,
  setIsError,
}: WheelProps) => {
  const [currentItem, setCurrentItem] = useState<{
    color: string
    name: string
  } | null>(null)
  const [isFinished, setFinished] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null)
  const [spinWheelResponse, setSpinWheelResponse] = useState<any>(null)

  // Configuration constants
  const WINNING_ANGLE = Math.PI * 2 // 180 degrees (bottom of wheel)
  const SPIN_DURATION = 5000 // 5 seconds for smoother animation
  const MIN_ROTATIONS = 12 // Increased minimum rotations for more excitement

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>(0)
  const angleCurrent = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const segmentsRef = useRef<Array<{ color: string; name: string }>>([])
  const winningSegmentIndexRef = useRef<number>(-1)
  const randomPositionRef = useRef<number>(0)

  // Add spin request flag to prevent multiple calls
  const spinRequestedRef = useRef<boolean>(false)

  // Add a new state to track if we've received a response
  const [apiResponseReceived, setApiResponseReceived] = useState(false)

  const segmentItems = items

  // Load frame image using the imported source
  useEffect(() => {
    const img = new window.Image()
    img.src = frameImageSrc.src
    img.onload = () => {
      setFrameImage(img)
      drawWheel()
    }
  }, [])

  // Initialize wheel
  useEffect(() => {
    segmentsRef.current = segmentItems || []
    drawWheel()

    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      drawWheel()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current)
      }
      cancelAnimationFrame(requestRef.current)
    }
  }, [segmentItems])

  // Handle spin state change
  useEffect(() => {
    if (isSpinning && !isAnimating && !spinRequestedRef.current) {
      // Set flag to prevent multiple calls
      spinRequestedRef.current = true

      // Call startSpin with API call
      startSpin().catch((error) => {
        console.error("Error in spin effect:", error)
        // Reset flag on error
        spinRequestedRef.current = false
      })
    } else if (!isSpinning) {
      // Reset flag when spinning state is turned off
      spinRequestedRef.current = false
    }
  }, [isSpinning, isAnimating])

  const drawWheel = () => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size - limit to max 450px on large screens
    const containerSize = Math.min(
      container.offsetWidth,
      container.offsetHeight,
      600
    )
    // Ensure size is positive and at least 40px
    const size = Math.max(containerSize - 40, 40) // Padding for pointer
    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    const centerX = size / 2
    const centerY = size / 2
    // Ensure radius is positive and at least 10px
    const radius = Math.max(size / 2 - 10, 10) // Smaller to leave space for border

    // Draw segments with improved styling
    const segments = segmentsRef.current
    const segmentAngle = (2 * Math.PI) / segments.length

    // First, draw a black background circle for the wheel
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "#000000"
    ctx.fill()

    // Draw each segment with enhanced styling
    segments.forEach((segment, index) => {
      const startAngle = index * segmentAngle + angleCurrent.current
      const endAngle = (index + 1) * segmentAngle + angleCurrent.current

      // Draw segment with gradient for better visual appeal
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      // Create gradient that goes from lighter at center to deeper at edge
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      )

      // Create a more vibrant gradient like in the reference image
      gradient.addColorStop(0, lightenColor(segment.color, 40)) // Much lighter at center
      gradient.addColorStop(0.5, segment.color) // Original color in middle
      gradient.addColorStop(1, darkenColor(segment.color, 20)) // Darker at edge

      ctx.fillStyle = gradient
      ctx.fill()

      // Draw thicker black lines between segments for more definition
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.lineTo(centerX, centerY)
      ctx.closePath()
      ctx.strokeStyle = "rgba(0, 0, 0, 0.8)" // Deep black lines
      ctx.lineWidth = 3 // Thicker lines
      ctx.stroke()

      // Draw text with improved styling
      if (radius > 30) {
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(startAngle + segmentAngle / 2)
        ctx.textAlign = "right"
        ctx.fillStyle = "white"
        ctx.font = `bold ${Math.min(16, radius / 8)}px Arial`

        // Add text shadow for better visibility
        ctx.shadowColor = "rgba(0, 0, 0, 0.9)"
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1

        // Position text in the middle of the segment
        // ctx.fillText(segment.name, radius - 20, 5)
        ctx.restore()
      }
    })

    // Draw center circle for better appearance - make it larger and white like in reference
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // Helper function to lighten colors
  function lightenColor(color: string, percent: number) {
    const num = parseInt(color.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt
    return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`
  }

  // Add a function to darken colors
  const darkenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = Math.max((num >> 16) - amt, 0),
      G = Math.max(((num >> 8) & 0x00ff) - amt, 0),
      B = Math.max((num & 0x0000ff) - amt, 0)
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
  }

  // Update the startSpin function to better handle the API response
  const startSpin = async () => {
    // Don't start spinning if already in progress
    if (isAnimating) {
      spinRequestedRef.current = false
      return
    }

    setIsAnimating(true)
    setApiResponseReceived(false) // Reset the response received flag

    try {
      // Call the API to get the winning item BEFORE starting the animation
      const response = await spinWheel()

      // Store the response and mark as received
      setSpinWheelResponse(response)
      setApiResponseReceived(true)

      // Determine the winning segment based on API response
      let winningIndex = 0

      if (response?.data?.success && response?.data?.result) {
        const result = response.data.result as WheelPrize

        // Find the winning item based on the API response type
        let matchingSegmentIndex = -1

        if (result.type === "stars") {
          // Match stars prize
          matchingSegmentIndex = segmentsRef.current.findIndex((item) =>
            item.name.toLowerCase().includes("stars")
          )
        } else if (result.type === "item") {
          // Match item prize by itemType (CUT, KNIFE, SHEARS)
          matchingSegmentIndex = segmentsRef.current.findIndex((item) =>
            item.name.toLowerCase().includes(result.itemType.toLowerCase())
          )
        } else if (result.type === "rune") {
          // Match rune prize by itemType (UNCOMMON, COMMON, RARE, EPIC, LEGENDARY)
          matchingSegmentIndex = segmentsRef.current.findIndex((item) =>
            item.name.toLowerCase().includes(result.itemType.toLowerCase())
          )
        }

        // If we found a matching item, use that index
        if (matchingSegmentIndex >= 0) {
          winningIndex = matchingSegmentIndex
        } else {
          // Fallback to a random index if no match found
          winningIndex = Math.floor(Math.random() * segmentsRef.current.length)
          console.warn("No matching segment found for prize:", result)
        }
      } else {
        // If API call failed, use a random index
        winningIndex = Math.floor(Math.random() * segmentsRef.current.length)
      }

      // Store the winning index in a ref so it persists through renders
      winningSegmentIndexRef.current = winningIndex

      // Start the animation
      startAnimation()
    } catch (error) {
      setIsAnimating(false)
      spinRequestedRef.current = false
      console.error("Error starting spin:", error)
      toast.error("Failed to start the wheel")
    }
  }

  // New function to start the animation separately from the API call
  const startAnimation = () => {
    setCurrentItem(null) // Clear any previous result
    setFinished(false)

    // Determine the winning segment based on the winning angle
    const segmentAngle = (2 * Math.PI) / segmentsRef.current.length

    // Randomize starting position to make it unpredictable
    const randomStartAngle = Math.random() * 2 * Math.PI
    angleCurrent.current = randomStartAngle

    // Generate random position within segment (0 to segmentAngle)
    randomPositionRef.current = Math.random() * segmentAngle

    // Start animation
    startTimeRef.current = performance.now()
    requestRef.current = requestAnimationFrame(animateSpin)
  }

  const finishSpin = async () => {
    try {
      // Call the API when the animation is finishing
      const response = await spinWheel()
      setSpinWheelResponse(response)

      // Use the API response to determine the actual winning item
      if (response?.data?.success) {
        const result = response.data.result as WheelPrize

        // Find the winning item based on the API response type
        let matchingSegmentIndex = -1

        if (result.type === "stars") {
          // Match stars prize
          matchingSegmentIndex = segmentsRef.current.findIndex((item) =>
            item.name.toLowerCase().includes("stars")
          )
        } else if (result.type === "item") {
          // Match item prize by itemType (CUT, KNIFE, SHEARS)
          matchingSegmentIndex = segmentsRef.current.findIndex((item) =>
            item.name.toLowerCase().includes(result.itemType.toLowerCase())
          )
        } else if (result.type === "rune") {
          // Match rune prize by itemType (UNCOMMON, COMMON, RARE, EPIC, LEGENDARY)
          matchingSegmentIndex = segmentsRef.current.findIndex((item) =>
            item.name.toLowerCase().includes(result.itemType.toLowerCase())
          )
        }

        // If we found a matching item, update the winning index
        if (matchingSegmentIndex >= 0) {
          winningSegmentIndexRef.current = matchingSegmentIndex
        } else {
          // Fallback to a random index if no match found
          winningSegmentIndexRef.current = Math.floor(
            Math.random() * segmentsRef.current.length
          )
          console.warn("No matching segment found for prize:", result)
        }

        if (response?.data?.result) {
          toast.success(response?.data?.result?.message, {
            icon: "🎉",
            duration: 5000,
          })
        }
      } else {
        toast.error("An error occurred while retrieving your prize")
        setIsError(true)
      }
    } catch (error) {
      console.error("Error getting winning item:", error)
      toast.error("An error occurred while retrieving your prize")
    } finally {
      setIsAnimating(false)
      setFinished(true)

      // Reset spin request flag
      spinRequestedRef.current = false

      // Get winning item
      const winningItem = segmentsRef.current[winningSegmentIndexRef.current]

      setCurrentItem(winningItem)

      if (onSpinComplete) {
        onSpinComplete(winningItem)
      }
    }
  }

  const animateSpin = (timestamp: number) => {
    const runtime = timestamp - startTimeRef.current
    const progress = Math.min(runtime / SPIN_DURATION, 1)

    // Improved easing function for more natural deceleration
    const easeOut = (t: number) => {
      return 1 - Math.pow(1 - t, 5) // Changed to quintic for even smoother deceleration
    }

    // Calculate stopping position based on winning angle
    const segmentAngle = (2 * Math.PI) / segmentsRef.current.length
    const segmentOffset = winningSegmentIndexRef.current * segmentAngle

    // Use the stored random position within segment for consistent animation
    const randomPositionWithinSegment = randomPositionRef.current

    // Target angle: min rotations + angle needed to align winning segment with pointer at 0 degrees (right side)
    // Note: We're using 0 as the pointer angle since our arrow is on the right
    const spinAngle = MIN_ROTATIONS * (2 * Math.PI)
    const targetAngle =
      spinAngle + (0 - segmentOffset - randomPositionWithinSegment)
    const angle = easeOut(progress) * targetAngle

    // Update current angle
    angleCurrent.current = angle
    drawWheel()

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animateSpin)
    } else {
      // Animation complete
      setIsAnimating(false)
      setFinished(true)

      // Get winning item
      const winningItem = segmentsRef.current[winningSegmentIndexRef.current]
      setCurrentItem(winningItem)

      // Call the completion callback
      if (onSpinComplete) {
        onSpinComplete(winningItem)
      }

      // Show success message if we have one from the API
      if (apiResponseReceived && spinWheelResponse?.data?.result?.message) {
        toast.success(spinWheelResponse.data.result.message, {
          icon: "🎉",
          duration: 5000,
        })
      } else {
        // Fallback message if API response is not available
        toast.success(`You won ${winningItem.name}!`, {
          icon: "🎉",
          duration: 5000,
        })
      }

      // Reset spin request flag
      spinRequestedRef.current = false
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex-1 flex justify-center items-center z-10 relative mx-auto max-w-[550px]"
      // style={{ maxWidth: "550px" }}
    >
      {/* Frame image that's always visible */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src={frameImageSrc.src}
          alt="Wheel frame"
          width={550}
          height={550}
          className="w-full h-full object-contain z-20"
          priority
        />
      </div>

      {/* Wheel container with arrow indicator */}
      <div ref={wheelRef} className="relative">
        <canvas ref={canvasRef} className="will-change-transform" />

        {/* Arrow indicator on the right side */}
        {/* <div className="absolute top-1/2 right-[8.15rem] transform -translate-y-1/2 translate-x-1/2 z-10">
          <Image
            src="/images/arrow.png"
            alt="Wheel pointer"
            width={600}
            height={600}
            className="filter drop-shadow-lg"
          />
        </div> */}
        <div
          ref={pointerRef}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 z-30"
          style={{
            right: "-4.15rem",
          }}
        >
          <Image
            src="/images/arrow.png"
            alt="Wheel pointer"
            width={450}
            height={450}
            className="filter drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}

export default Wheel
