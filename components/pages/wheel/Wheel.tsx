import { useEffect, useRef, useState } from "react"
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
  const SPIN_DURATION = 5000 // 5 seconds
  const MIN_ROTATIONS = 10 // Minimum number of full rotations

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
  // useEffect(() => {
  //   if (isSpinning && !isAnimating && !spinRequestedRef.current) {
  //     // Set flag to prevent multiple calls
  //     spinRequestedRef.current = true

  //     // Call startSpin but don't wait for it to complete in the effect
  //     startSpin().catch((error) => {
  //       console.error("Error in spin effect:", error)
  //       // Reset flag on error
  //       spinRequestedRef.current = false
  //     })
  //   } else if (!isSpinning) {
  //     // Reset flag when spinning state is turned off
  //     spinRequestedRef.current = false
  //   }
  // }, [isSpinning, isAnimating])

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

    // Draw segments
    const segments = segmentsRef.current
    const segmentAngle = (2 * Math.PI) / segments.length

    segments.forEach((segment, index) => {
      const startAngle = index * segmentAngle + angleCurrent.current
      const endAngle = (index + 1) * segmentAngle + angleCurrent.current

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = segment.color
      ctx.fill()

      // Draw segment border
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text only if radius is large enough
      // if (radius > 30) {
      //   ctx.save()
      //   ctx.translate(centerX, centerY)
      //   ctx.rotate(startAngle + segmentAngle / 2)
      //   ctx.textAlign = "right"
      //   ctx.fillStyle = "white"
      //   ctx.font = `bold ${Math.min(14, radius / 10)}px Arial`
      //   // Add text shadow for better visibility
      //   ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      //   ctx.shadowBlur = 3
      //   ctx.shadowOffsetX = 1
      //   ctx.shadowOffsetY = 1
      //   // Position text in the middle of the segment, leaving room for center circle
      //   ctx.fillText(segment.name, radius - 20, 0)
      //   ctx.restore()
      // }
    })

    // Draw frame image if loaded
    if (frameImage) {
      ctx.save()
      ctx.translate(centerX, centerY)
      // Don't rotate the frame with the wheel
      ctx.rotate(angleCurrent.current)
      const frameSize = radius * 2 + 10
      ctx.drawImage(
        frameImage,
        -frameSize / 2,
        -frameSize / 2,
        frameSize,
        frameSize
      )
      ctx.restore()
    }

    // // Draw outer circle
    // ctx.beginPath()
    // ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    // ctx.strokeStyle = "white"
    // ctx.lineWidth = 4
    // ctx.stroke()
  }

  // Handle spin state change
  useEffect(() => {
    if (isSpinning && !isAnimating && !spinRequestedRef.current) {
      // Set flag to prevent multiple calls
      spinRequestedRef.current = true

      // Call startSpin without the API call here
      startSpinWithoutAPI().catch((error) => {
        console.error("Error in spin effect:", error)
        // Reset flag on error
        spinRequestedRef.current = false
      })
    } else if (!isSpinning) {
      // Reset flag when spinning state is turned off
      spinRequestedRef.current = false
    }
  }, [isSpinning, isAnimating])

  // New method that starts the animation without calling the API
  const startSpinWithoutAPI = async () => {
    // Don't start spinning if already in progress
    if (isAnimating) {
      spinRequestedRef.current = false
      return
    }

    setIsAnimating(true)

    try {
      // Set the winning segment based on a random index for now
      // The actual result will be fetched in finishSpin
      const randomIndex = Math.floor(Math.random() * segmentsRef.current.length)
      winningSegmentIndexRef.current = randomIndex
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
    } catch (error) {
      setIsAnimating(false)
      spinRequestedRef.current = false
      console.error("Error starting spin:", error)
    }
  }

  const finishSpin = async () => {
    try {
      // Call the API when the animation is finishing
      const response = await spinWheel()
      setSpinWheelResponse(response.data)

      // Use the API response to determine the actual winning item
      if (response?.data?.success) {
        // If API provides a winning index, update it
        // if (response.data?.winningIndex !== undefined) {
        const randomIndex = Math.floor(Math.random() * 9)
        winningSegmentIndexRef.current = randomIndex
        // }
        if (response?.data?.result) {
          // @ts-expect-error 'error' is not defined in the response
          toast.success(response?.data?.result?.message)
        }
      } else {
        toast.error(
          // @ts-expect-error 'error' is not defined in the response
          response?.data?.error ||
            "An error occurred while retrieving your prize"
        )
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

  const startSpin = async () => {
    // Don't start spinning if already in progress
    if (isAnimating) {
      spinRequestedRef.current = false
      return
    }

    setIsAnimating(true)

    try {
      const response = await spinWheel()

      if (response?.data?.success && response.data) {
        setSpinWheelResponse(response.data)

        // Set the winning segment based on API response
        const randomIndex = Math.floor(Math.random() * 9)
        winningSegmentIndexRef.current = randomIndex
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
      } else {
        // Handle API error
        setIsAnimating(false)
        spinRequestedRef.current = false
        console.error("Failed to get winning item from API")
      }

      // Get winning item from API (simulated)
      // const response = await getWinningItem(segmentsRef.current)
      // console.log("response", response)
      // if (response.success && response.data) {
      //   // Set the winning segment based on API response
      //   winningSegmentIndexRef.current = response.data.winningIndex
      //   setCurrentItem(null) // Clear any previous result
      //   setFinished(false)

      //   // Determine the winning segment based on the winning angle
      //   const segmentAngle = (2 * Math.PI) / segmentsRef.current.length

      //   // Randomize starting position to make it unpredictable
      //   const randomStartAngle = Math.random() * 2 * Math.PI
      //   angleCurrent.current = randomStartAngle

      //   // Generate random position within segment (0 to segmentAngle)
      //   randomPositionRef.current = Math.random() * segmentAngle

      //   // Start animation
      //   startTimeRef.current = performance.now()
      //   requestRef.current = requestAnimationFrame(animateSpin)
      // } else {
      //   // Handle API error
      //   setIsAnimating(false)
      //   spinRequestedRef.current = false
      //   console.error("Failed to get winning item from API")
      // }
    } catch (error) {
      setIsAnimating(false)
      spinRequestedRef.current = false
      console.error("Error getting winning item:", error)
    }
  }

  const animateSpin = (timestamp: number) => {
    const runtime = timestamp - startTimeRef.current
    const progress = Math.min(runtime / SPIN_DURATION, 1)

    // Ease out function for natural deceleration
    const easeOut = (t: number) => {
      return 1 - Math.pow(1 - t, 3)
    }

    // Calculate stopping position based on winning angle
    const segmentAngle = (2 * Math.PI) / segmentsRef.current.length
    const segmentOffset = winningSegmentIndexRef.current * segmentAngle

    // Use the stored random position within segment for consistent animation
    const randomPositionWithinSegment = randomPositionRef.current

    // Target angle: min rotations + angle needed to align winning segment with winning angle
    const spinAngle = MIN_ROTATIONS * (2 * Math.PI)
    const targetAngle =
      spinAngle + (WINNING_ANGLE - segmentOffset - randomPositionWithinSegment)
    const angle = easeOut(progress) * targetAngle

    // Update current angle
    angleCurrent.current = angle
    drawWheel()

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animateSpin)
    } else {
      // Animation complete
      finishSpin()
    }
  }

  // const finishSpin = () => {
  //   setIsAnimating(false)
  //   setFinished(true)

  //   // Reset spin request flag
  //   spinRequestedRef.current = false

  //   // Get winning item
  //   const winningItem = segmentsRef.current[winningSegmentIndexRef.current]
  //   console.log("winningItem", winningItem.name)
  //   // toast.success(`You won ${winningItem.name}`)
  //   toast.success(`You won ${spinWheelResponse.data.message}`)
  //   setCurrentItem(winningItem)

  //   if (onSpinComplete) {
  //     onSpinComplete(winningItem)
  //   }
  // }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex-1 flex justify-center items-center z-10 relative mx-auto"
      style={{ maxWidth: "600px" }}
    >
      {/* Frame image that's always visible */}
      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <Image
          src={"/images/wheel/fire.png"}
          alt="Wheel frame"
          width={600}
          height={600}
          className="w-full h-full object-contain"
          priority
        />
      </div> */}

      <div ref={wheelRef} className="relative">
        <canvas ref={canvasRef} className="will-change-transform" />
      </div>
    </div>
  )
}

export default Wheel
