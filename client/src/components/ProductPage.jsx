"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ShoppingCart } from "lucide-react"

const products = [
  {
    id: 1,
    name: "RedClaw Viper",
    tagline: "Precision Performance",
    description:
      "Engineered for speed and accuracy, every click delivers pure performance. Designed to dominate your gameplay, unleash your potential.",
    color: "from-red-600 to-red-800",
    bgColor: "#1f2937",
    lightBg: "#ef4444",
    midColor: "#fca5a5",
    sizes: ["16000", "8000", "3200"],
    sizeLabel: "DPI",
    flavor: "Gaming Beast",
    image: "/red-gaming-mouse.jpg",
  },
  {
    id: 2,
    name: "RedClaw Phantom",
    tagline: "Silent Assassin",
    description:
      "Ultra-silent clicks with devastating accuracy, moving unseen through the digital realm. Built for stealth and speed.",
    color: "from-gray-700 to-gray-900",
    bgColor: "#dc2626",
    lightBg: "#4b5563",
    midColor: "#9ca3af",
    sizes: ["16000", "8000", "3200"],
    sizeLabel: "DPI",
    flavor: "Stealth Mode",
    image: "/black-gaming-mouse-stealth.jpg",
  },
  {
    id: 3,
    name: "RedClaw Inferno",
    tagline: "Flame Warrior",
    description:
      "Blazing fast response time with molten performance. Ignite your potential and conquer every competition.",
    color: "from-orange-600 to-orange-800",
    bgColor: "#ea580c",
    lightBg: "#fb923c",
    midColor: "#fed7aa",
    sizes: ["16000", "8000", "3200"],
    sizeLabel: "DPI",
    flavor: "Fire Power",
    image: "/orange-gaming-mouse-fire.jpg",
  },
]

export default function App() {
  const [currentProduct, setCurrentProduct] = useState(0)
  const [cart, setCart] = useState([])
  const containerRef = useRef(null)

  let lastScrollTime = 0
  const handleWheel = (e) => {
    e.preventDefault()
    const now = Date.now()
    if (now - lastScrollTime < 800) return
    lastScrollTime = now

    if (e.deltaY > 0) {
      setCurrentProduct((prev) => (prev + 1) % products.length)
    } else {
      setCurrentProduct((prev) => (prev - 1 + products.length) % products.length)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
      return () => container.removeEventListener("wheel", handleWheel)
    }
  }, [])

  const addToCart = (product, size) => {
    setCart([...cart, { ...product, selectedDPI: size }])
  }

  const product = products[currentProduct]

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full overflow-hidden transition-all duration-1000"
      style={{
        background: `radial-gradient(circle at center, ${product.midColor} 0%, ${product.bgColor} 100%)`,
      }}
    >
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-white text-4xl font-bold tracking-wider">RedClaw</div>
        <div className="flex items-center gap-8">
          <div className="flex gap-6 text-white">
            <a href="#" className="hover:opacity-80 transition">
              Contact
            </a>
            <a href="#" className="hover:opacity-80 transition">
              Cart ({cart.length})
            </a>
          </div>
          <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:opacity-90 transition">
            Login
          </button>
        </div>
      </nav>

      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-8">
        <div className="w-full max-w-6xl flex items-center gap-16">
          <div className="space-y-8 flex-1">
            <div>
              <h1 className="text-7xl font-black text-white mb-4 leading-tight">{product.tagline}</h1>
              <p className="text-white/80 text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="flex gap-4">
              <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:opacity-90 transition">
                {product.name.split(" ")[1]}
              </button>
              <button
                className="border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white/10 transition"
                style={{ backgroundColor: `${product.bgColor}80` }}
              >
                Contact
              </button>
            </div>

            <div className="flex gap-6 text-white/60">
              <a href="#" className="hover:text-white transition">
                <span className="text-2xl">📱</span>
              </a>
              <a href="#" className="hover:text-white transition">
                <span className="text-2xl">f</span>
              </a>
              <a href="#" className="hover:text-white transition">
                <span className="text-2xl">⚙️</span>
              </a>
              <a href="#" className="hover:text-white transition">
                <span className="text-2xl">🎨</span>
              </a>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="relative h-96 flex items-center justify-center w-full">
              <div className="absolute text-8xl font-black text-white/10 select-none">
                {product.name.split(" ")[0].substring(0, 2)}
              </div>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-96 object-contain drop-shadow-2xl animate-fade-in"
              />
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <p className="text-white/70 text-sm tracking-widest uppercase">{product.flavor}</p>

            <div className="space-y-3">
              <p className="text-white/50 text-sm">Select DPI</p>
              <div className="flex flex-col gap-2">
                {product.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    className={`${
                      idx === 0 ? "bg-white text-gray-900" : "bg-white/20 text-white hover:bg-white/30"
                    } px-6 py-2 rounded-full font-semibold transition w-full`}
                  >
                    {size} {product.sizeLabel}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => addToCart(product, product.sizes[0])}
                className="flex-1 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="flex-1 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Checkout →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <p className="text-xs uppercase tracking-wider">Scroll or click</p>
        <ChevronDown className="animate-bounce" size={24} />
      </div>

      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentProduct(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              idx === currentProduct ? "bg-white w-8 h-3" : "bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
