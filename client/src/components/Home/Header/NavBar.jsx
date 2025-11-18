import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NavBar = ({ forceDark = false }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, []);                                     
                                              
  const useDarkText = forceDark || isScrolled   

  return (
    <div>
      <header className={`fixed top-3 left-0 right-0 z-50 transition-all duration-300 ${
            useDarkText 
                ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm' 
                : 'bg-transparent'
        }`}>
            <div className="max-w-7xl  mx-auto px-4 lg:px-10 py-8">
                <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center justify-center w-32">
                        <Link to="/" className={`text-4xl font-bold tracking-tight transition-colors duration-300 ${
                            useDarkText ? 'text-gray-900' : 'text-white'
                        }`}>
                            RedClaw.
                        </Link>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-3 flex-1">
                        <nav className="flex items-center font-bold space-x-8">
                            <Link
                                to="/best-sellers"
                                className={`relative text-base font-semibold transition-colors duration-200 group ${
                                    useDarkText 
                                        ? 'text-gray-700 hover:text-gray-900' 
                                        : 'text-white/90 hover:text-white'
                                }`}>
                                <span className="relative z-10">Best Sellers</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 -m-2"></div>
                            </Link>

                            <Link
                                to="/keyboards"
                                className={`relative text-base font-semibold transition-colors duration-200 group ${
                                    useDarkText 
                                        ? 'text-gray-700 hover:text-gray-900' 
                                        : 'text-white/90 hover:text-white'
                                }`}>
                                <span className="relative z-10">Keyboards</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -m-2"></div>
                            </Link>

                            <Link
                                to="/mouse-mousepads"
                                className={`relative text-base font-semibold transition-colors duration-200 group ${
                                    useDarkText 
                                        ? 'text-gray-700 hover:text-gray-900' 
                                        : 'text-white/90 hover:text-white'
                                }`}>
                                <span className="relative z-10">Mouse & Mousepads</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -m-2"></div>
                            </Link>

                            <Link
                                to="/drones"
                                className={`relative text-base font-semibold transition-colors duration-200 group ${
                                    useDarkText 
                                        ? 'text-gray-700 hover:text-gray-900' 
                                        : 'text-white/90 hover:text-white'
                                }`}>
                                <span className="relative z-10">Dreo X Drones</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -m-2"></div>
                            </Link>

                            <Link
                                to="/chairs"
                                className={`relative text-base font-semibold transition-colors duration-200 group ${
                                    useDarkText 
                                        ? 'text-gray-700 hover:text-gray-900' 
                                        : 'text-white/90 hover:text-white'
                                }`}>
                                <span className="relative z-10">Ergo Chairs</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -m-2"></div>
                            </Link>

                            <Link
                                to="/controllers"
                                className={`relative text-base font-semibold transition-colors duration-200 group ${
                                    useDarkText 
                                        ? 'text-gray-700 hover:text-gray-900' 
                                        : 'text-white/90 hover:text-white'
                                }`}>
                                <span className="relative z-10">Controllers</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -m-2"></div>
                            </Link>
                        </nav>

                        <nav className="flex items-center space-x-8">
                            <Link
                                to="/monitor"
                                className={`relative text-base font-medium transition-colors duration-200 group ${
                                    useDarkText 
                                        ? 'text-gray-600 hover:text-gray-900' 
                                        : 'text-white/80 hover:text-white'
                                }`}>
                                <span className="relative z-10">Monitor</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-teal-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 -m-2"></div>
                            </Link>

                            <Link
                                to="/audio-video"
                                className={`relative text-base font-medium transition-colors duration-200 group ${
                                    useDarkText 
                                        ? 'text-gray-600 hover:text-gray-900' 
                                        : 'text-white/80 hover:text-white'
                                }`}>
                                <span className="relative z-10">Audio & Lights</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-red-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 -m-2"></div>
                            </Link>

                            <Link
                                to="/downloads"
                                className={`relative text-base font-medium transition-colors duration-200 group ${
                                    useDarkText 
                                        ? 'text-gray-600 hover:text-gray-900' 
                                        : 'text-white/80 hover:text-white'
                                }`}>
                                <span className="relative z-10">Downloads</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-purple-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 -m-2"></div>
                            </Link>

                            <Link
                                to="/control"
                                className={`relative text-base font-medium transition-colors duration-200 group ${
                                    useDarkText 
                                        ? 'text-gray-600 hover:text-gray-900' 
                                        : 'text-white/80 hover:text-white'
                                }`}>
                                <span className="relative z-10">Kontrol</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-blue-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 -m-2"></div>
                            </Link>

                            <Link
                                to="/contact"
                                className={`relative text-base font-medium transition-colors duration-200 group ${
                                    useDarkText 
                                        ? 'text-gray-600 hover:text-gray-900' 
                                        : 'text-white/80 hover:text-white'
                                }`}>
                                <span className="relative z-10">Contact Us</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-200 to-pink-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 -m-2"></div>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center  justify-center w-32">
                        <div className="flex items-center space-x-3">
                            <button className={`p-2 transition-colors duration-300 ${
                                useDarkText 
                                    ? 'text-gray-600 hover:text-gray-900' 
                                    : 'text-white/80 hover:text-white'
                            }`}>
                                <i className="fas fa-search text-lg"></i>
                            </button>

                            <button className={`p-2 transition-colors duration-300 ${
                                useDarkText 
                                    ? 'text-gray-600 hover:text-gray-900' 
                                    : 'text-white/80 hover:text-white'
                            }`}>
                                <i className="fas fa-user text-lg"></i>
                            </button>

                            <button className={`p-2 transition-colors duration-300 relative ${
                                useDarkText 
                                    ? 'text-gray-600 hover:text-gray-900' 
                                    : 'text-white/80 hover:text-white'
                            }`}>
                                <i className="fas fa-shopping-cart text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </div>
  )
}

export default NavBar
