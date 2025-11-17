import React, { useRef } from 'react'

const ProductCategory = () => {
  const scrollRef = useRef(null)

  const categories = [
    {
      id: 1,
      title: 'Keyboards',
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Gaming Mouse',
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Audio & Video Devices',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Gaming Chairs',
      image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'Lighting',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop'
    },
    {
      id: 6,
      title: 'Drones',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop'
    },
    {
      id: 7,
      title: 'Controllers',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=400&fit=crop'
    }
  ]

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="max-w-full mx-auto px-4 lg:px-8 py-16 bg-white">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
          Go Beyond Limits
          <div className="h-1 w-32 bg-purple-600 mt-2 rounded-full"></div>
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Categories Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 pt-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex-shrink-0 w-[320px] group/card cursor-pointer"
            >
              {/* Card */}
              <div className="bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-[280px] relative group-hover/card:-translate-y-2">
                {/* Product Image */}
                <div className="h-full w-full flex items-center justify-center p-8 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Category Name with Hover Effects */}
              <div className="mt-6 flex items-center gap-3">
                <div className="relative group/text">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.title}
                  </h3>
                  
                  {/* Animated Underline */}
                  <div className="absolute -bottom-1 left-0 h-0.5 bg-purple-600 w-0 group-hover/card:w-full transition-all duration-300 ease-in-out"></div>
                </div>

                {/* Animated Arrow Icon - Right to Down */}
                <div className="transition-transform duration-300 ease-in-out group-hover/card:rotate-90">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ProductCategory
