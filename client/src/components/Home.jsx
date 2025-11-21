import { useState, useEffect, useRef } from "react";
import { ChevronDown, ShoppingCart } from "lucide-react";

const products = [
    {
        id: 1,
        name: "RedClaw Viper",
        tagline: "Precision Performance",
        description:
            "Engineered for speed and accuracy, every click delivers pure performance. Designed to dominate your gameplay, unleash your potential.",
        bgColor: "#7c3aed",
        midColor: "#c4b5fd",
        colors: ["black", "white", "gray"],
        flavor: "Gaming Beast",
        image: "/mouse.png",
    },
    {
        id: 2,
        name: "RedClaw Phantom",
        tagline: "Silent Assassin",
        description:
            "Ultra-silent clicks with devastating accuracy, moving unseen through the digital realm. Built for stealth and speed.",
        bgColor: "#1f2937",
        midColor: "#9ca3af",
        colors: ["black", "white", "gray"],
        flavor: "Stealth Mode",
        image: "/mouse2.png",
    },
    {
        id: 3,
        name: "RedClaw Inferno",
        tagline: "Flame Warrior",
        description:
            "Blazing fast response time with molten performance. Ignite your potential and conquer every competition.",
        bgColor: "#ea580c",
        midColor: "#fed7aa",
        colors: ["Black", "white", "gray"],
        flavor: "Fire Power",
        image: "/mouse.png",
    },
];

export default function Home() {
    const [currentProduct, setCurrentProduct] = useState(0);
    const [cart, setCart] = useState([]);
    const [selectedColor, setSelectedColor] = useState(products[0].colors[0]);
    const containerRef = useRef(null);
    const lastScrollTime = useRef(0);

    const product = products[currentProduct];

    // Handle scroll to change products
    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();
            const now = Date.now();
            if (now - lastScrollTime.current < 800) return;
            lastScrollTime.current = now;

            if (e.deltaY > 0) {
                setCurrentProduct((prev) => (prev + 1) % products.length);
            } else {
                setCurrentProduct((prev) => (prev - 1 + products.length) % products.length);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
            return () => container.removeEventListener("wheel", handleWheel);
        }
    }, []);

    // Update selected color when product changes
    useEffect(() => {
        setSelectedColor(product.colors[0]);
    }, [currentProduct]);

    const addToCart = () => {
        setCart([...cart, { ...product, selectedDPI: selectedColor }]);
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full overflow-hidden transition-all duration-1000 relative"
            style={{
                background: `radial-gradient(circle at center, ${product.midColor} 0%, ${product.bgColor} 100%)`,
            }}
        >
            {/* Navbar */}
            <div className="w-full px-8">
                <nav className="flex items-center justify-between py-6 max-w-full mx-auto">
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
            </div>

            {/* Product and Contact Buttons - Above Main Content */}
            <div className="flex justify-center gap-4 px-16 pt-8">
                <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:opacity-90 transition w-32 text-center">
                    {product.name.split(" ")[1]}
                </button>
                <button
                    className="border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white/10 transition w-32 text-center"
                    style={{ backgroundColor: `${product.bgColor}80` }} 
                >
                    Contact
                </button>
            </div>

            {/* Main Content - Centered */}
            <div className="flex min-h-[calc(100vh-200px)] items-center justify-between px-8">
                {/* Left Column - Product Info */}
                <div className="flex flex-col justify-center w-1/4">
                    <h1 className="text-5xl font-black text-white mb-4 leading-tight">
                        {product.tagline}
                    </h1>
                    <p className="text-white/80 text-lg leading-relaxed max-w-md">{product.description}</p>
                </div>

                {/* Center Column - Product Image */}
                <div className="flex flex-col items-center justify-center flex-1">
                    {/* Product Image */}
                    <div className="relative flex items-center justify-center w-96 h-96">
                        <div className="absolute text-9xl font-black text-white/50 select-none tracking-tighter -translate-y-16" style={{ fontSize: '16rem', lineHeight: '1' }}>
                            STEEL
                        </div>
                        <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-2xl animate-fade-in relative z-10"
                        />
                    </div>
                </div>

                {/* Right Column - Product Actions */}
                <div className="flex flex-col justify-center space-y-6 scale-90 origin-right w-1/4">
                    <p className="text-white/70 text-sm tracking-widest uppercase">{product.flavor}</p>

                    <div className="space-y-3">
                        <p className="text-white/50 text-sm">Select Color</p>
                        <div className="flex gap-3">
                            {product.colors.map((color, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedColor(color)}
                                    className={`rounded-full w-12 h-12 transition-all border-2 ${color === selectedColor
                                            ? "border-white scale-110"
                                            : "border-white/30 hover:border-white/50"
                                        }`}
                                    style={{
                                        backgroundColor: color.toLowerCase(),
                                        filter: color === selectedColor ? "brightness(0.7)" : "brightness(1)"
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={addToCart}
                            className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-sm"
                        >
                            <ShoppingCart size={18} />
                            Add to Cart
                        </button>
                        <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-sm">
                            Checkout →
                        </button>
                    </div>
                </div>
            </div>

            {/* Social Icons - Bottom Left */}
            <div className="fixed bottom-8 left-8 flex gap-6 text-white/60">
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

            {/* Product Navigation Dots - Right */}
            <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
                {products.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentProduct(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-500 ${idx === currentProduct ? "bg-white w-8 h-3" : "bg-white/30 hover:bg-white/60"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
