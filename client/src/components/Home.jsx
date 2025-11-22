import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ShoppingCart, User, Package, LogOut } from "lucide-react";
import { isAuthenticated, getUserFromStorage, logoutUser } from "../utils/auth";
import { getCartItems, addToCartAPI, clearCart as clearServerCart } from "../utils/cart";
import axiosInstance from "../utils/axios";
import Footer from "./Footer";
import { toast } from 'react-toastify';
import { LoadingButton } from "./LoadingButton";

// UI-only data for the 3 products (bgColor, logo, etc.)
const productUIData = {
    "RedClaw ASTRA": {
        tagline: "Precision Performance",
        show: "ASTRA",
        bgColor: "#0f172a",
        midColor: "#9ca3af",
        logo: "/temp.png",
        colors: ["black", "white", "gray"],
        flavor: "Gaming Beast",
    },
    "RedClaw BLADE": {
        tagline: "Silent Assassin",
        show: "BLADE",
        bgColor: "#7c3aed",
        midColor: "#c4b5fd",
        logo: "/white-temp.png",
        colors: ["black", "white", "gray"],
        flavor: "Stealth Mode",
    },
    "RedClaw KATANA": {
        tagline: "Flame Warrior",
        show: "KATANA",
        bgColor: "#ea580c",
        midColor: "#fed7aa",
        logo: "/temp2.png",
        colors: ["Black", "white", "gray"],
        flavor: "Fire Power",
    },
};

export default function Home() {
    const navigate = useNavigate();
    const [currentProduct, setCurrentProduct] = useState(0);
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState("black");
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const containerRef = useRef(null);
    const lastScrollTime = useRef(0);
    const [scrollLocked, setScrollLocked] = useState(true);
    const isTransitioning = useRef(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const dropdownRef = useRef(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const product = products[currentProduct] || {};

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get("/product");
                const fetchedProducts = response.data.products.map(p => ({
                    ...p,
                    ...(productUIData[p.name] || {}),
                }));
                setProducts(fetchedProducts);
                setSelectedColor(fetchedProducts[0]?.colors?.[0] || "black");
                setLoading(false);
                // Disable initial load flag after a brief moment
                setTimeout(() => setIsInitialLoad(false), 100);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Check authentication and load cart
    useEffect(() => {
        const checkAuth = async () => {
            const loggedIn = isAuthenticated();
            setIsLoggedIn(loggedIn);
            
            if (loggedIn) {
                const userData = getUserFromStorage();
                setUser(userData);
                try {
                    const cartData = await getCartItems();
                    setCart(cartData);
                } catch (error) {
                    console.error("Error loading cart:", error);
                    if (error.response?.status === 401) {
                        setIsLoggedIn(false);
                        setUser(null);
                        localStorage.removeItem("user");
                        localStorage.removeItem("isLoggedIn");
                    }
                }
            }
        };
        checkAuth();
    }, []);

    // Load cart from server
    const loadCartFromServer = async () => {
        try {
            const cartData = await getCartItems();
            setCart(cartData);
        } catch (error) {
            console.error("Error loading cart from server:", error);
            if (error.response?.status === 401) {
                setIsLoggedIn(false);
                setUser(null);
                setCart([]);
                localStorage.removeItem("user");
                localStorage.removeItem("isLoggedIn");
            }
        }
    };

    // Handle scroll to change products
    useEffect(() => {
        let touchStartY = 0;
        let touchEndY = 0;

        const handleWheel = (e) => {
            // If scroll is unlocked, allow normal scrolling
            if (!scrollLocked) {
                // Check if user is scrolling back up to re-lock
                if (e.deltaY < 0 && window.scrollY <= 0) {
                    e.preventDefault();
                    setScrollLocked(true);
                    // When coming back from footer, allow immediate scrolling
                    // Just a brief delay to ensure smooth re-lock
                    isTransitioning.current = true;
                    setTimeout(() => {
                        isTransitioning.current = false;
                    }, 300); // Reduced to 300ms for immediate response
                }
                return;
            }

            // Prevent action if currently transitioning
            if (isTransitioning.current) {
                e.preventDefault();
                return;
            }

            // If we're at the last product and scrolling down, unlock scroll
            if (currentProduct === products.length - 1 && e.deltaY > 0) {
                setScrollLocked(false);
                return;
            }

            // Lock scrolling for product navigation
            e.preventDefault();
            const now = Date.now();
            
            // Throttle scroll events
            if (now - lastScrollTime.current < 500) return;
            lastScrollTime.current = now;

            if (e.deltaY > 0) {
                // Scrolling down
                if (currentProduct < products.length - 1) {
                    isTransitioning.current = true;
                    setCurrentProduct((prev) => prev + 1);
                    // Reset transition flag after animation completes
                    setTimeout(() => {
                        isTransitioning.current = false;
                    }, 600);
                }
            } else {
                // Scrolling up
                if (currentProduct > 0) {
                    isTransitioning.current = true;
                    setCurrentProduct((prev) => prev - 1);
                    // Reset transition flag after animation completes
                    setTimeout(() => {
                        isTransitioning.current = false;
                    }, 600);
                }
            }
        };

        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            if (!scrollLocked) return;
            e.preventDefault();
        };

        const handleTouchEnd = (e) => {
            touchEndY = e.changedTouches[0].clientY;
            const swipeDistance = touchStartY - touchEndY;
            const minSwipeDistance = 50; // Minimum swipe distance in pixels

            if (Math.abs(swipeDistance) < minSwipeDistance) return;

            // If scroll is unlocked, check for re-lock
            if (!scrollLocked) {
                if (swipeDistance < 0 && window.scrollY <= 0) {
                    setScrollLocked(true);
                    isTransitioning.current = true;
                    setTimeout(() => {
                        isTransitioning.current = false;
                    }, 300);
                }
                return;
            }

            // Prevent action if currently transitioning
            if (isTransitioning.current) return;

            // If at last product and swiping up (scrolling down), unlock scroll
            if (currentProduct === products.length - 1 && swipeDistance > 0) {
                setScrollLocked(false);
                return;
            }

            const now = Date.now();
            if (now - lastScrollTime.current < 500) return;
            lastScrollTime.current = now;

            if (swipeDistance > 0) {
                // Swiped up - go to next product
                if (currentProduct < products.length - 1) {
                    isTransitioning.current = true;
                    setCurrentProduct((prev) => prev + 1);
                    setTimeout(() => {
                        isTransitioning.current = false;
                    }, 600);
                }
            } else {
                // Swiped down - go to previous product
                if (currentProduct > 0) {
                    isTransitioning.current = true;
                    setCurrentProduct((prev) => prev - 1);
                    setTimeout(() => {
                        isTransitioning.current = false;
                    }, 600);
                }
            }
        };

        const container = containerRef.current;
        if (container && products.length > 0) {
            container.addEventListener("wheel", handleWheel, { passive: false });
            container.addEventListener("touchstart", handleTouchStart, { passive: false });
            container.addEventListener("touchmove", handleTouchMove, { passive: false });
            container.addEventListener("touchend", handleTouchEnd, { passive: false });
            
            return () => {
                container.removeEventListener("wheel", handleWheel);
                container.removeEventListener("touchstart", handleTouchStart);
                container.removeEventListener("touchmove", handleTouchMove);
                container.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [currentProduct, products.length, scrollLocked]);

    // Update selected color when product changes
    useEffect(() => {
        if (product?.colors) {
            setSelectedColor(product.colors[0]);
        }
    }, [currentProduct, product?.colors]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addToCart = async () => {
        if (!isLoggedIn) {
            toast.error("Please login to add items to cart");
            navigate("/login");
            return;
        }

        if (!product || !product._id) {
            toast.error("Product not loaded yet");
            return;
        }

        setIsAddingToCart(true);
        
        try {
            // Optimistic UI update - add immediately
            const tempItem = {
                product: {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                },
                quantity: 1,
                _id: `temp-${Date.now()}`,
            };
            setCart(prev => [...prev, tempItem]);
            toast.success("Added to cart!", { autoClose: 1500 });

            // Then sync with server in background
            await addToCartAPI(product._id);
            await loadCartFromServer(); // Get actual cart with proper IDs
        } catch (error) {
            console.error("Error adding to cart:", error);
            // Revert optimistic update on error
            setCart(prev => prev.filter(item => !item._id.startsWith('temp-')));
            
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
                setIsLoggedIn(false);
                setUser(null);
                localStorage.removeItem("user");
                localStorage.removeItem("isLoggedIn");
                navigate("/login");
            } else {
                toast.error("Failed to add to cart. Please try again.");
            }
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.warning("Your cart is empty!");
            return;
        }
        navigate("/checkout");
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            setIsLoggedIn(false);
            setUser(null);
            setCart([]);
            setShowDropdown(false);
            toast.success("Logged out successfully!");
        } catch (error) {
            console.error("Logout error:", error);
            setIsLoggedIn(false);
            setUser(null);
            setCart([]);
            toast.error("Logout failed, but you've been signed out locally.");
        }
    };

    const handleAuthAction = () => {
        if (isLoggedIn) {
            handleLogout();
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen w-full relative">
            {/* Loading Overlay with smooth fade */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-radial bg-gray-900  transition-all duration-700 ease-in-out">
                    <div className="text-7xl md:text-9xl font-black text-white/40 select-none tracking-tighter animate-pulse" 
                         style={{ 
                             fontSize: 'clamp(4rem, 12vw, 10rem)',
                             animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                         }}>
                        LOADING
                    </div>
                </div>
            )}
            
            <div
                ref={containerRef}
                className={`min-h-screen w-full relative ${scrollLocked ? 'overflow-hidden' : 'overflow-auto'} ${!isInitialLoad ? 'transition-all duration-1000' : ''}`}
                style={{
                    background: `radial-gradient(circle at center, ${product?.midColor || '#0f172a'} 0%, ${product?.bgColor || '#9ca3af'} 100%)`,
                }}
            >
                {/* Navbar */}
                <div className="w-full px-4 md:px-8">
                    <nav className="flex items-center justify-between py-4 md:py-6 max-w-full mx-auto">
                        <div className="flex items-center gap-2 md:gap-3">
                            <img src={product?.logo || '/temp.png'} alt="RedClaw Logo" className="h-10 md:h-16 object-contain" />
                        </div>
                        <div className="flex items-center gap-3 md:gap-8">
                            <div className="hidden md:flex gap-6 text-white items-center">
                                <a href="#" className="hover:opacity-80 transition">
                                    Contact
                                </a>
                                <button onClick={handleCheckout} className="hover:opacity-80 transition relative">
                                    <ShoppingCart size={24} />
                                    {cart.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {cart.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                            {isLoggedIn ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        onMouseEnter={() => setShowDropdown(true)}
                                        className="bg-white text-gray-900 px-3 py-1.5 md:px-3 md:py-2 rounded-full font-semibold hover:opacity-90 transition text-sm md:text-base flex items-center gap-2"
                                    >
                                        {user?.name || "Account"}
                                        <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {showDropdown && (
                                        <div 
                                            className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100"
                                            onMouseLeave={() => setShowDropdown(false)}
                                        >
                                            <button
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    navigate('/account');
                                                }}
                                                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                                            >
                                                <User size={18} />
                                                <span className="font-medium">My Account</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    navigate('/orders');
                                                }}
                                                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                                            >
                                                <Package size={18} />
                                                <span className="font-medium">Order History</span>
                                            </button>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition flex items-center gap-3"
                                            >
                                                <LogOut size={18} />
                                                <span className="font-medium">Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={() => navigate("/login")}
                                    className="bg-white text-gray-900 px-4 py-1.5 md:px-6 md:py-2 rounded-full font-semibold hover:opacity-90 transition text-sm md:text-base"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </nav>
                </div>

            {/* Product and Contact Buttons - Above Main Content */}
            <div className="flex justify-center gap-3 md:gap-4 px-4 md:px-16 pt-4 md:pt-8">
                <button className="bg-white text-gray-900 px-4 py-1.5 md:px-6 md:py-2 rounded-full font-semibold hover:opacity-90 transition w-24 md:w-32 text-center text-sm md:text-base">
                    {product?.name?.split(" ")[1] || "Product"}
                </button>
                <button
                    className="border border-white/30 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-white/10 transition w-24 md:w-32 text-center text-sm md:text-base"
                    style={{ backgroundColor: `${product?.bgColor || '#0f172a'}80` }} 
                >
                    Contact
                </button>
            </div>

            {/* Main Content - Centered - Adjusted for better mobile spacing */}
            <div className="flex flex-col md:flex-row min-h-[calc(100vh-220px)] md:min-h-[calc(100vh-200px)] items-center justify-between px-4 md:px-8 gap-4 md:gap-0 -mt-8 md:mt-0">
                {/* Left Column - Product Info */}
                <div className="flex flex-col justify-center w-full md:w-1/4 text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-2 md:mb-4 leading-tight">
                        {product?.tagline || "Loading..."}
                    </h1>
                    <p className="text-white/80 text-sm md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">{product?.description || ""}</p>
                </div>

                {/* Center Column - Product Image */}
                <div className="flex flex-col items-center justify-end md:justify-center flex-1 order-first md:order-none mt-2 md:mt-0 pb-8 md:pb-0">
                    {/* Product Image */}
                    <div className="relative flex items-center justify-center w-64 h-64 md:w-96 md:h-96">
                        <div className="absolute text-9xl md:text-9xl font-black text-white/50 select-none tracking-tighter -translate-y-12 md:-translate-y-16" style={{ fontSize: 'clamp(8rem, 18vw, 14rem)', lineHeight: '1' }}>
                            {product?.show || ""}
                        </div>
                        <img
                            src={product?.coverImage || "/placeholder.svg"}
                            alt={product?.name || "Product"}
                            className="w-full h-full object-contain drop-shadow-2xl animate-fade-in relative z-10"
                        />
                    </div>
                </div>

                {/* Right Column - Product Actions */}
                <div className="flex flex-col justify-center space-y-3 md:space-y-6 scale-100 md:scale-90 origin-center md:origin-right w-full md:w-1/4 items-center md:items-start -mt-4 md:mt-0">
                    <p className="text-white/70 text-xs md:text-sm tracking-widest uppercase">{product?.flavor || ""}</p>

                    <div className="space-y-2 md:space-y-3">
                        <p className="text-white/50 text-xs md:text-sm">Select Color</p>
                        <div className="flex gap-2 md:gap-3 justify-center md:justify-start">
                            {(product?.colors || ["black", "white", "gray"]).map((color, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedColor(color)}
                                    className={`rounded-full w-10 h-10 md:w-12 md:h-12 transition-all border-2 ${color === selectedColor
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

                    <div className="flex flex-col gap-2.5 md:gap-3 pt-2 md:pt-4 w-full max-w-xs px-4 md:px-0">
                        <LoadingButton
                            onClick={addToCart}
                            isLoading={isAddingToCart}
                            loadingText="Adding..."
                            className="bg-white text-gray-900 px-6 py-3.5 md:px-6 md:py-3 rounded-full font-bold hover:opacity-90 transition flex items-center justify-center gap-2 text-base md:text-sm shadow-lg"
                        >
                            <ShoppingCart size={20} className="md:w-[18px] md:h-[18px]" />
                            Add to Cart
                        </LoadingButton>
                        <button 
                            onClick={handleCheckout}
                            className="bg-white text-gray-900 px-6 py-3.5 md:px-6 md:py-3 rounded-full font-bold hover:opacity-90 transition flex items-center justify-center gap-2 text-base md:text-sm shadow-lg"
                        >
                            Checkout →
                        </button>
                    </div>
                </div>
            </div>

            {/* Social Icons - Bottom Left */}
            {scrollLocked && (
                <div className="hidden md:flex fixed bottom-8 left-8 gap-6 text-white/60">
                    <a href="#" className="hover:text-green-400 transition">
                        <i className="fab fa-whatsapp text-2xl"></i>
                    </a>
                    <a href="#" className="hover:text-pink-400 transition">
                        <i className="fab fa-instagram text-2xl"></i>
                    </a>
                    <a href="#" className="hover:text-indigo-400 transition">
                        <i className="fab fa-discord text-2xl"></i>
                    </a>
                    <a href="#" className="hover:text-white transition">
                        <i className="fab fa-x-twitter text-2xl"></i>
                    </a>
                </div>
            )}

            {/* Product Navigation Dots - Right */}
            {scrollLocked && (
                <div className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 md:gap-4">
                    {products.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentProduct(idx)}
                            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-500 ${idx === currentProduct ? "bg-white w-6 h-2.5 md:w-8 md:h-3" : "bg-white/30 hover:bg-white/60"
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Footer Section - Appears after scrolling past all products */}
            {!scrollLocked && (
                <Footer 
                    products={products} 
                    setCurrentProduct={setCurrentProduct} 
                    setScrollLocked={setScrollLocked} 
                />
            )}
            </div>
        </div>
    );
}
