"use client"

import React from "react"
import Image from "next/image"
import type { EmblaCarouselType } from "embla-carousel"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const slides = [
  {
    title: "Lorem Ipsum dolor",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In blandit, dolor eu condimentum fringilla, est arcu aliquet urna, non egestas elit tellus a urna. ",
    image: "/images/carousel/slide-1.jpg",
  },
  {
    title: "Second Slide",
    description: "Another beautiful description goes here.",
    image: "/images/carousel/slide-1.jpg",
  },
  {
    title: "Third Slide",
    description: "Third slide with engaging content.",
    image: "/images/carousel/slide-1.jpg",
  },
]

const HomeCarousel = () => {
  const [api, setApi] = React.useState<EmblaCarouselType | undefined>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="relative">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="rounded-lg overflow-hidden relative">
                <div className="relative h-[234px]">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    className="object-cover"
                    fill
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(266.01deg, rgba(0, 0, 0, 0) -31.57%, rgba(0, 0, 0, 0.8) 100.11%)",
                    }}
                  />
                  <div className="absolute top-10 left-10 space-y-2 max-w-[60%]">
                    <h2 className="text-lg font-bold text-white">
                      {slide.title}
                    </h2>
                    <p className="text-xs">{slide.description}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Dots */}
        <div className="flex gap-2 justify-center absolute bottom-8 left-10 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`size-2 rounded-full transition-colors ${
                current === index ? "bg-white scale-110" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}

export default HomeCarousel
