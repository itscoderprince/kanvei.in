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
      desktopImage: "/2.jpg",
      mobileImage: "/m4.png",
      alt: "Fashion & Clothing"
    },
    {
      id: "stationery",
      desktopImage: "/3.jpg",
      mobileImage: "/m5.png",
      alt: "Premium Stationery"
    },
    {
      id: "jewellery",
      desktopImage: "/4.jpg",
      mobileImage: "/m6.png",
      alt: "Elegant Jewellery"
    },
  ]

  return (
    <div className="relative w-full h-[240px] md:h-[60vh] group overflow-hidden bg-black">
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
        pagination={{
          clickable: true,
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
              {/* Desktop Image */}
              <div className="hidden md:block w-full h-full relative">
                <Image
                  src={slide.desktopImage}
                  alt={slide.alt}
                  fill
                  className="object-cover object-center"
                  priority
                  quality={90}
                />
              </div>
              {/* Mobile Image */}
              <div className="block md:hidden w-full h-full relative">
                <Image
                  src={slide.mobileImage}
                  alt={slide.alt}
                  fill
                  className="object-cover object-center"
                  priority
                  quality={90}
                />
              </div>
            </div>

            {/* 2. Advanced Overlay - Removed as per request */}
            {/* <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply opacity-70`} />
            <div className="absolute inset-0 bg-black/40" /> */}


          </SwiperSlide>
        ))}

        {/* 4. Professional Navigation UI - Only Visible on Desktop */}
        <div className="hidden md:flex absolute bottom-10 right-10 z-20 items-center gap-6">

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

        {/* Mobile Pagination (Dots) - Hidden on desktop via CSS or custom styles if needed, but Swiper pagination is usually global. We can style it to be hidden on md screens via global CSS or inline styles if Swiper allows. 
            Swiper's default pagination is at the bottom. We can use Tailwind to hide it on md screens by targeting the class.
            Since we can't easily modify global CSS for Swiper classes from here, we will render it but use CSS in a style tag or classNames if possible.
            Swiper React allows pagination prop to take an object. We can pass a clickable true and maybe a renderBullet or just rely on default and hide via CSS injection or specific class on the container. 
        */}
        <style jsx global>{`
          .swiper-pagination-bullet {
            width: 24px;
            height: 3px;
            background: white;
            opacity: 0.5;
            border-radius: 2px;
            transition: all 0.3s;
          }
          .swiper-pagination-bullet-active {
            width: 32px;
            background: white;
            opacity: 1;
          }
          @media (min-width: 768px) {
            .swiper-pagination {
              display: none;
            }
          }
        `}</style>

      </Swiper>
    </div>
  )
}