import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { toast } from 'react-toastify';
import axiosInstance from "../utils/axios";
import OTPVerification from "./OTPVerification";

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        userPhone: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            return;
        }

        setLoading(true);

        try {
             const response = await axiosInstance.post("/auth/signup", {
                name: formData.name,
                email: formData.email,
                userPhone: formData.userPhone,
                password: formData.password
            });
            
            toast.success(response.data.message || "OTP sent to your email!");
            setOtpSent(true);

        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSuccess = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        
         navigate("/");
    };

    const handleBackToRegister = () => {
        setOtpSent(false);
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
                        {otpSent ? "Verify Your Email" : "Create Account"}
                    </h1>
                    <p className="text-gray-300 text-lg max-w-md">
                        {otpSent 
                            ? "We've sent a verification code to your email. Enter it to complete your registration." 
                            : "Join RedClaw today and start your premium shopping experience."}
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
                            {otpSent ? "Verify Email" : "Create Account"}
                        </h1>
                        <p className="text-gray-500">
                            {otpSent ? "Enter the OTP sent to your email" : "Sign up to get started"}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white">
                        {!otpSent ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="text-gray-700 text-sm font-medium mb-1 block">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 text-gray-900 pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400 text-sm"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-gray-700 text-sm font-medium mb-1 block">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full bg-gray-50 text-gray-900 pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400 text-sm"
                                />
                            </div>
                        </div>

                        {/* userPhone */}
                        <div>
                            <label className="text-gray-700 text-sm font-medium mb-1 block">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="tel"
                                    value={formData.userPhone}
                                     maxLength={10}
                                    onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                                    required
                                    placeholder="+91"
                                    className="w-full bg-gray-50 text-gray-900 pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400 text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-gray-700 text-sm font-medium mb-1 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 text-gray-900 pl-9 pr-9 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-gray-700 text-sm font-medium mb-1 block">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 text-gray-900 pl-9 pr-9 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                    ) : (
                        <OTPVerification 
                            email={formData.email}
                            onVerificationSuccess={handleVerificationSuccess}
                            onBack={handleBackToRegister}
                        />
                    )}

                    {!otpSent && (
                        <>
                            {/* Divider */}
                            <div className="flex items-center gap-3 my-4">
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span className="text-gray-400 text-xs">or</span>
                                <div className="flex-1 h-px bg-gray-200"></div>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <p className="text-gray-600 text-sm">
                                    Already have an account?{" "}
                                    <Link 
                                        to="/login" 
                                        className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
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
