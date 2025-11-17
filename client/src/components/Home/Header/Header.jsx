import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bannerImage from'../../../assets/banner.jpg';
import NavBar from './NavBar';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
        <NavBar/>

        {/* Hero Section */}
        <section 
            className="relative h-[90vh] w-full bg-cover bg-center bg-no-repeat flex items-end justify-start  overflow-hidden"
            style={{
                backgroundImage: `url(${bannerImage})`,
            }}
        >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 text-left text-white max-w-4xl px-10 lg:px-16 pb-16">


                <p className="text-sm md:text-2xl mb-8 text-white/90">
                    Experience the future of aerial technology with our premium drone collection
                </p>
                <h1 className="text-5xl md:text-7xl  mb-6">
                    Shop All
                </h1>
                
                {/* <div className="flex gap-4">
                    <Link 
                        to="/drones" 
                        className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Shop Drones
                    </Link>
                    <Link 
                        to="/about" 
                        className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                    >
                        Learn More
                    </Link>
                </div> */}
            </div>
        </section>
        </>
    )
}

export default Header
