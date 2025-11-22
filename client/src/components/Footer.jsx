export default function Footer({ products, setCurrentProduct, setScrollLocked }) {
    const handleProductClick = (idx) => {
        setCurrentProduct(idx);
        setScrollLocked(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="w-full bg-gray-900 text-white py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/temp.png" alt="RedClaw Logo" className="h-12 object-contain" />
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                            Premium gaming peripherals designed for champions. Experience precision, performance, and style.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-green-400 transition">
                                <i className="fab fa-whatsapp text-2xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-pink-400 transition">
                                <i className="fab fa-instagram text-2xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                                <i className="fab fa-discord text-2xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <i className="fab fa-x-twitter text-2xl"></i>
                            </a>
                        </div>
                    </div>

                    {/* Products Column */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Products</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            {products.map((prod, idx) => (
                                <li key={idx}>
                                    <button 
                                        onClick={() => handleProductClick(idx)}
                                        className="hover:text-white transition"
                                    >
                                        {prod.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
                            <li><a href="#" className="hover:text-white transition">Returns</a></li>
                            <li><a href="#" className="hover:text-white transition">Warranty</a></li>
                            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2025 RedClaw. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-gray-500 text-sm">
                        <a href="#" className="hover:text-white transition">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition">Terms of Service</a>
                        <a href="#" className="hover:text-white transition">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
