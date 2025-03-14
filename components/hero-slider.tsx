"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    image: "/placeholder.svg?height=600&width=1600",
    title: "New Summer Collection",
    description: "Discover our latest designs perfect for the season",
    link: "/collection/summer",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=600&width=1600",
    title: "Festive Season Sale",
    description: "Up to 40% off on selected items",
    link: "/sale",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=600&width=1600",
    title: "Exclusive Saree Collection",
    description: "Handcrafted with love & tradition",
    link: "/category/saree",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, []) // Removed nextSlide from dependencies

  return (
    <div className="relative w-full overflow-hidden h-[60vh]">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative flex-shrink-0 w-full h-full">
            <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-cover" priority />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/30">
              <h2 className="mb-2 text-3xl font-semibold text-white md:text-4xl lg:text-5xl">{slide.title}</h2>
              <p className="mb-6 text-white md:text-lg">{slide.description}</p>
              <Link
                href={slide.link}
                className="px-6 py-2 text-sm font-medium text-primary-foreground transition-colors bg-primary hover:bg-primary/90"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute p-2 transform -translate-y-1/2 bg-white/80 rounded-full left-4 top-1/2 hover:bg-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute p-2 transform -translate-y-1/2 bg-white/80 rounded-full right-4 top-1/2 hover:bg-white"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

