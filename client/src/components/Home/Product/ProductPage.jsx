import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../Header/Header'
import NavBar from '../Header/NavBar'

const ProductPage = () => {
  const { id } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)

  // Sample products database - In real app, this would come from API
  const productsDatabase = {
    1: {
      title: 'Mirage Wireless RGB Gaming Controller Gamepad',
      price: 1999,
      mrp: 4500,
      discount: 55,
      rating: 4.5,
      reviews: 52,
      sold: '5K+',
      brand: 'KREO',
      images: [
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800'
      ],
      features: [
        'Wireless',
        'RGB Lighting',
        'Dual Vibration'
      ],
      detailedFeatures: [
        {
          title: 'Wireless Connectivity:',
          description: 'Seamless wireless connection with minimal latency for responsive gaming.'
        },
        {
          title: 'RGB Customization:',
          description: 'Fully customizable RGB lighting with multiple preset modes and effects.'
        },
        {
          title: 'Ergonomic Design:',
          description: 'Comfortable grip designed for extended gaming sessions without fatigue.'
        },
        {
          title: 'Dual Vibration Motors:',
          description: 'Immersive haptic feedback for enhanced gaming experience.'
        },
        {
          title: 'Long Battery Life:',
          description: 'Up to 20 hours of continuous gameplay on a single charge.'
        }
      ]
    },
    2: {
      title: 'Professional Gaming Keyboard RGB Mechanical',
      price: 2499,
      mrp: 4599,
      discount: 46,
      rating: 4.3,
      reviews: 38,
      sold: '3K+',
      brand: 'KREO',
      images: [
        'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800',
        'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
        'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'
      ],
      features: [
        'Mechanical Switches',
        'RGB Backlit',
        'Full Size Layout'
      ],
      detailedFeatures: [
        {
          title: 'Mechanical Switches:',
          description: 'Premium mechanical switches with tactile feedback and 50 million keystroke durability.'
        },
        {
          title: 'Per-Key RGB Lighting:',
          description: 'Individually customizable keys with vivid, dynamic lighting effects.'
        },
        {
          title: 'Full Size Layout:',
          description: 'Complete keyboard with numpad for productivity and gaming.'
        },
        {
          title: 'Detachable USB-C Cable:',
          description: 'Easy to plug in, pack, and move—perfect for flexible setups.'
        },
        {
          title: 'Anti-Ghosting Technology:',
          description: 'N-key rollover ensures every keypress is registered accurately.'
        }
      ]
    }
    // Add more products as needed
  }

  // Get product data or use default
  const productData = productsDatabase[id] || {
    title: 'Product Not Found',
    price: 0,
    mrp: 0,
    discount: 0,
    rating: 0,
    reviews: 0,
    sold: '0',
    brand: 'KREO',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800'
    ],
    features: [],
    detailedFeatures: []
  }

  const benefits = [
    {
      icon: '🛡️',
      title: '400 Days',
      subtitle: 'Warranty'
    },
    {
      icon: '📦',
      title: '7 Days',
      subtitle: 'Return'
    },
    {
      icon: '🚚',
      title: 'Free',
      subtitle: 'Shipping'
    },
    {
      icon: '💳',
      title: 'No Cost',
      subtitle: 'EMIs'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Force dark text since background is white */}
      <NavBar forceDark={true} />
      
      {/* Product Section - Added top padding to account for fixed navbar */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 pt-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Images */}
          <div className="flex gap-3">
            {/* Thumbnail Gallery */}
            <div className="flex flex-col gap-2">
              {productData.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-purple-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 rounded-2xl p-6 flex items-center justify-center">
              <img
                src={productData.images[selectedImage]}
                alt={productData.title}
                className="w-full h-full object-contain max-h-[400px]"
              />
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-4">
            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {productData.title}
            </h1>

            {/* Price Section */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹ {productData.price.toLocaleString()}
              </span>
              <span className="text-lg text-gray-400 line-through">
                MRP ₹ {productData.mrp.toLocaleString()}
              </span>
              <span className="bg-black text-white px-3 py-1 rounded text-sm font-semibold">
                {productData.discount}% OFF
              </span>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star text-xs ${
                      i < Math.floor(productData.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  ></i>
                ))}
                <span className="text-gray-700 font-semibold text-sm ml-1">
                  {productData.rating}
                </span>
              </div>
              <span className="text-gray-600 text-sm">
                {productData.reviews} reviews
              </span>
            </div>

            {/* Features Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              {productData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* Reviews Count */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star text-orange-500 text-sm"></i>
              ))}
              <span className="text-gray-700 font-semibold text-sm ml-2">
                {productData.reviews} reviews
              </span>
            </div>

            {/* Sold Count */}
            <div className="text-gray-700 text-sm font-medium">
              {productData.sold} keyboards sold 🚀
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <button className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm">
                Add to cart
              </button>
              <button className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm">
                Buy Now
              </button>
            </div>

            {/* Benefits Icons */}
            <div className="grid grid-cols-4 gap-3 pt-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl mb-1">{benefit.icon}</div>
                  <div className="font-semibold text-gray-900 text-xs">{benefit.title}</div>
                  <div className="text-xs text-gray-600">{benefit.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-10">
          <div className="bg-gray-50 rounded-2xl p-6">
            <button className="w-full flex items-center justify-between text-left">
              <h2 className="text-xl font-bold text-gray-900">Features:</h2>
              <i className="fas fa-chevron-down text-gray-600"></i>
            </button>
            
            <div className="mt-4 space-y-4">
              {productData.detailedFeatures.map((feature, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
