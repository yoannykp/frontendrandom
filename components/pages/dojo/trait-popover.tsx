import { useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { GradientBorder } from "@/components/ui/gradient-border"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

// Image loader to handle S3 images with proper CORS
const imageLoader = ({ src, width }: { src: string; width: number }) => {
  // Add cache busting parameter to force reload of images
  return `${src}?w=${width}&cb=${Date.now()}`
}

export interface TraitItem {
  id: number
  type: string
  image: string
  name: string
  description?: string
  price?: number
  power?: number
  isDefault?: boolean
  isForgeable?: boolean
  forgeRuneType?: string | null
  forgeRuneAmount?: number | null
  starBoost?: number
  xpBoost?: number
  raidTimeBoost?: number
  createdAt?: string
  updatedAt?: string
}

interface TraitPopoverProps {
  item: {
    id: number
    value: string
    label: string
    image: string
  }
  traits: TraitItem[]
  selectedId: number
  onSelect: (trait: TraitItem) => void
  disabled?: boolean
}

const TraitPopover = ({
  item,
  traits,
  selectedId,
  onSelect,
  disabled = false,
}: TraitPopoverProps) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>(
    {}
  )

  // Handle image load error
  const handleImageError = (traitId: number) => {
    setImageErrors((prev) => ({
      ...prev,
      [traitId]: true,
    }))
    setLoadingImages((prev) => ({
      ...prev,
      [traitId]: false,
    }))
    console.error(`Failed to load image for trait ID: ${traitId}`)
  }

  // Reset error when image successfully loads
  const handleImageLoad = (traitId: number) => {
    setLoadingImages((prev) => ({
      ...prev,
      [traitId]: false,
    }))
    if (imageErrors[traitId]) {
      setImageErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[traitId]
        return newErrors
      })
    }
  }

  // Start loading state when image starts loading
  const handleImageStartLoad = (traitId: number) => {
    setLoadingImages((prev) => ({
      ...prev,
      [traitId]: true,
    }))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center flex-col gap-2 bg-white/10 rounded-xl p-2 border border-white/10 aspect-square relative hover:bg-white/20 transition-all duration-300 shadow-lg",
            disabled ? "opacity-50 cursor-not-allowed" : "",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          )}
          disabled={disabled}
        >
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.label}
            className="w-24 h-24 opacity-30"
            width={100}
            height={100}
            crossOrigin="anonymous"
            unoptimized
          />
          <span className="text-[8px] absolute bottom-3 left-1/2 -translate-x-1/2">
            {item.label}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-3 rounded-xl border border-gray-light backdrop-blur-[40px] glass-effect"
        side="right"
        align="start"
      >
        <ScrollArea className="h-[150px]">
          <div className="grid grid-cols-3 gap-2">
            {traits.map((trait) => (
              <GradientBorder
                key={trait.id}
                isSelected={selectedId === trait.id}
                className="transition-colors duration-300"
              >
                <div
                  className="aspect-square bg-white/10 rounded-lg p-1 hover:bg-white/20 cursor-pointer transition-all relative"
                  onClick={() => onSelect(trait)}
                >
                  <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                    {imageErrors[trait.id] ? (
                      // Fallback content for failed images
                      <div className="text-xs text-center text-white/70 flex items-center justify-center h-full">
                        {trait.name?.slice(0, 3) || "⚠️"}
                      </div>
                    ) : (
                      <>
                        <Image
                          src={`/api/image-proxy?url=${trait.image}`}
                          alt={trait.name || `Trait ${trait.id}`}
                          width={50}
                          height={50}
                          className={cn(
                            "object-cover",
                            loadingImages[trait.id] && "opacity-30"
                          )}
                          crossOrigin="anonymous"
                          onError={() => handleImageError(trait.id)}
                          onLoad={() => handleImageLoad(trait.id)}
                          onLoadingComplete={() => handleImageLoad(trait.id)}
                          onLoadStart={() => handleImageStartLoad(trait.id)}
                          unoptimized
                        />
                        {loadingImages[trait.id] && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </GradientBorder>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

export default TraitPopover
