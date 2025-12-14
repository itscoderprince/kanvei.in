"use client"
import Link from "next/link"
import React, { useRef } from 'react'
import Image from "next/image"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade, Parallax } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

import { ArrowRight, ArrowLeft } from "lucide-react"

export default function HeroCarousel() {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty('--progress', String(1 - progress));
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  const slides = [
    {
      id: "clothing",
      image: "/cloth2.webp",
      link: "/categories/clothing",
      title: "Fashion & Clothing",
      subtitle: "Discover Latest Trends",
      color: "from-[#5A0117]/90 to-[#8C6141]/80",
      description: "Elevate your style with our premium collection of contemporary fashion."
    },
    {
      id: "stationery",
      image: "/sationary.jpg",
      link: "/categories/stationery",
      title: "Premium Stationery",
      subtitle: "Writing Essentials",
      color: "from-[#8C6141]/90 to-[#DBCCB7]/80",
      description: "Craft your thoughts with our exquisite range of quality stationery."
    },
    {
      id: "jewellery",
      image: "/jewelery.webp",
      link: "/categories/jewellery",
      title: "Elegant Jewellery",
      subtitle: "Timeless Pieces",
      color: "from-[#AFABAA]/90 to-[#5A0117]/80",
      description: "Adorn yourself with handcrafted pieces that tell a unique story."
    },
    {
      id: "cosmetics",
      image: "/cosmetic.webp",
      link: "/categories/cosmetics",
      title: "Beauty & Cosmetics",
      subtitle: "Enhance Your Beauty",
      color: "from-[#5A0117]/80 to-[#E4A0B7]/80",
      description: "Discover the secret to radiant skin with our tailored beauty solutions."
    },
  ]

  return (
    <div className="relative w-full h-[320px] md:h-[54vh] group overflow-hidden bg-black">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        speed={1500}
        parallax={true}
        effect="fade"
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: '.custom-prev',
          nextEl: '.custom-next',
        }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        modules={[Autoplay, Pagination, Navigation, Parallax, EffectFade]}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full overflow-hidden">

            {/* 1. Parallax Background Image using Next.js Image */}
            <div className="absolute inset-0 w-full h-full" data-swiper-parallax="-20%">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority
                quality={90}
              />
            </div>

            {/* 2. Advanced Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply opacity-70`} />
            <div className="absolute inset-0 bg-black/40" />


          </SwiperSlide>
        ))}

        {/* 4. Professional Navigation UI */}
        <div className="absolute bottom-10 right-10 z-20 flex items-center gap-6">

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button className="custom-prev w-12 h-12 flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all rounded-full cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="custom-next w-12 h-12 flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all rounded-full cursor-pointer">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Autoplay Progress Circle */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24" cy="24" r="20"
                className="stroke-white/10 fill-none"
                strokeWidth="2"
              />
              <circle
                ref={progressCircle}
                cx="24" cy="24" r="20"
                className="stroke-white fill-none"
                strokeWidth="2"
                strokeDasharray="125.6"
                strokeDashoffset="calc(125.6px * (1 - var(--progress)))"
              />
            </svg>
            <span ref={progressContent} className="absolute text-[10px] font-bold text-white"></span>
          </div>
        </div>

      </Swiper>
    </div>
  )
}