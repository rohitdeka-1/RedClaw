import React, { useState } from 'react'
import AdStrip from './AdStrip'
import ProductCard from '../Product/ProductCard'
import ProductCategory from '../Product/ProductCategory'

const Main = () => {
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('Best selling')

  // Sample product data
  const products = [
    {
      id: 1,
      image: 'https://p7.hiclipart.com/preview/622/549/230/earth-planet-4k-resolution-desktop-wallpaper-earth-cartoon.jpg',
      discount: 56,
      rating: 4.5,
      brand: 'KREO',
      title: 'Mirage Wireless RGB Gaming Controller Gamepad',
      price: 1999,
      mrp: 4500,
      discountPercent: 55,
      emiPrice: 666
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
      discount: 45,
      rating: 4.3,
      brand: 'KREO',
      title: 'Professional Gaming Keyboard RGB Mechanical',
      price: 2499,
      mrp: 4599,
      discountPercent: 46,
      emiPrice: 833
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
      discount: 50,
      rating: 4.7,
      brand: 'KREO',
      title: 'Precision Gaming Mouse with RGB Lighting',
      price: 1499,
      mrp: 2999,
      discountPercent: 50,
      emiPrice: 500
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500',
      discount: 60,
      rating: 4.8,
      brand: 'KREO',
      title: 'Professional Drone with 4K Camera',
      price: 8999,
      mrp: 22499,
      discountPercent: 60,
      emiPrice: 2999
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500',
      discount: 40,
      rating: 4.6,
      brand: 'KREO',
      title: 'Ergonomic Gaming Chair with Lumbar Support',
      price: 12999,
      mrp: 21999,
      discountPercent: 41,
      emiPrice: 4333
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500',
      discount: 52,
      rating: 4.4,
      brand: 'KREO',
      title: 'Premium Wireless Headset with Noise Cancelling',
      price: 3499,
      mrp: 7299,
      discountPercent: 52,
      emiPrice: 1166
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=500',
      discount: 48,
      rating: 4.2,
      brand: 'KREO',
      title: 'RGB Gaming Mousepad Extended XXL',
      price: 899,
      mrp: 1749,
      discountPercent: 49,
      emiPrice: 300
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
      discount: 55,
      rating: 4.9,
      brand: 'KREO',
      title: 'Mini Racing Drone FPV Ready to Fly',
      price: 5999,
      mrp: 13499,
      discountPercent: 56,
      emiPrice: 1999
    },
     {
      id: 9,
      image: 'https://img.freepik.com/premium-psd/flying-drone-with-camera-cutout-isolated-transparent-background_84443-1808.jpg',
      discount: 55,
      rating: 4.9,
      brand: 'KREO',
      title: 'Mini Racing Drone FPV Ready to Fly',
      price: 5999,
      mrp: 13499,
      discountPercent: 56,
      emiPrice: 1999
    }
  ]

  return (
    <div className="max-w-full mx-auto px-4 z-10 lg:px-8 py-8 -mt-7 rounded-t-[2.02rem] bg-white relative">
      {/* Filter and Sort Section */}
      <div className="flex items-center justify-between mb-8">
        {/* Show filters button */}
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-3 px-6 py-3 border-2 border-gray-900 rounded-full hover:bg-gray-50 transition-colors duration-200"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor"   
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
            />
          </svg>
          <span className="font-medium">Show filters</span>
        </button>

        {/* Sort by dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">Sort by:</span>
          <button 
            className="flex items-center gap-3 px-6 py-3 border-2 border-gray-900 rounded-full hover:bg-gray-50 transition-colors duration-200 min-w-[180px] justify-between"
          >
            <span className="font-medium">{sortBy}</span>
            <span className="text-2xl">•</span>
          </button>
        </div>
      </div>

      <ProductCategory/>

      {/* Featured Products Header */}
      <div className="mb-12 mt-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
          Featured Products
          <div className="h-1 w-40 bg-purple-600 mt-2 rounded-full"></div>
        </h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            discount={product.discount}
            rating={product.rating}
            brand={product.brand}
            title={product.title}
            price={product.price}
            mrp={product.mrp}
            discountPercent={product.discountPercent}
            emiPrice={product.emiPrice}
          />
        ))}
      </div>
    </div>
  )
}

export default Main
