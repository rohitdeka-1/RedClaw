import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { loginUser } from "../utils/auth";
import { toast } from "react-toastify";

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await loginUser(formData.email, formData.password);
            console.log("Login successful:", response);
            
            // Show success message
            toast.success(response.message);    
            
            // Navigate to home
            navigate("/");

        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(255 255 255) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }}></div>
                
                {/* Content */}
                <div className="relative z-10">
                    <img 
                        src="/logo.png" 
                        alt="RedClaw" 
                        className="h-12 mb-8 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate("/")}
                    />
                    <h1 className="text-white text-5xl font-bold mb-4" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                        Welcome Back
                    </h1>
                    <p className="text-gray-300 text-lg max-w-md">
                        Sign in to access your account and continue your premium shopping experience.
                    </p>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <p className="text-gray-400 text-sm">© 2024 RedClaw. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <img 
                            src="/logo.png" 
                            alt="RedClaw" 
                            className="h-10 mx-auto mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate("/")}
                        />
                        <h1 className="text-gray-900 text-2xl font-semibold mb-2" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                            Welcome Back
                        </h1>
                        <p className="text-gray-500">Sign in to your account</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white">
                        <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full bg-gray-50 text-gray-900 pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400 text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 text-gray-900 pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-purple-600 hover:text-purple-700 text-xs font-medium transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-gray-400 text-xs">or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{" "}
                            <Link 
                                to="/register" 
                                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate("/")}
                        className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium inline-flex items-center gap-1.5 group"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to home
                    </button>
                </div>
            </div>
            </div>
        </div>
    );
}