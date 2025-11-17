import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ 
  id,
  image, 
  discount, 
  rating, 
  brand, 
  title, 
  price, 
  mrp, 
  discountPercent,
  emiPrice 
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/product/${id}`)
  }

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      {/* Product Image Section */}
      <div className="relative bg-gradient-to-br from-purple-300 to-purple-400 aspect-square p-4 overflow-hidden">
        {/* Discount Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
            Save {discount}%
          </span>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-white text-gray-900 px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
            <i className="fas fa-star text-yellow-400 text-xs"></i>
            {rating}
          </span>
        </div>

        {/* Product Image */}
        <div className="flex items-center justify-center h-full">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
        </div>
      </div>

      {/* Product Info Section */}
      <div className="p-4 space-y-2">
        {/* Brand */}
        <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
          {brand}
        </p>

        {/* Product Title */}
        <h3 className="text-gray-900 font-semibold text-base leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
          {title}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
            ₹ {price.toLocaleString()}
          </span>
          <span className="text-gray-400 line-through text-sm">
            MRP ₹ {mrp.toLocaleString()}
          </span>
        </div>

        {/* Discount Percentage */}
        <p className="text-green-600 font-semibold text-xs">
          {discountPercent}% OFF
        </p>

        
      </div>
    </div>
  )
}

export default ProductCard
