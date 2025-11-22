import { useState, useEffect } from "react";
import { KeyRound } from "lucide-react";
import { toast } from 'react-toastify';
import axiosInstance from "../utils/axios";

export default function OTPVerification({ email, onVerificationSuccess, onBack }) {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
    const [canResend, setCanResend] = useState(false);

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.post("/auth/verify-otp", {
                email: email,
                otp: otp
            });

            toast.success("Account verified successfully! Welcome!");
            if (onVerificationSuccess) {
                onVerificationSuccess(response.data);
            }

        } catch (error) {
            console.error("OTP verification error:", error);
            toast.error(error.response?.data?.message || "Invalid or expired OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;

        setLoading(true);

        try {
            const response = await axiosInstance.post("/auth/resend-otp", {
                email: email
            });

            toast.success("New OTP sent to your email!");
            setTimeLeft(900); // Reset timer to 15 minutes
            setCanResend(false);
            setOtp(""); // Clear OTP input

        } catch (error) {
            console.error("Resend OTP error:", error);
            toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* OTP Input */}
                <div>
                    <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                        Enter OTP
                    </label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            required
                            placeholder="123456"
                            maxLength={6}
                            className="w-full bg-gray-50 text-gray-900 pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400 text-center text-2xl font-mono tracking-widest"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">
                        A 6-digit code has been sent to {email}
                    </p>
                </div>

                {/* Timer */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">
                        {timeLeft > 0 ? 'OTP expires in:' : 'OTP expired'}
                    </span>
                    <span className={`text-sm font-mono font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

                {/* Verify Button */}
                <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                {/* Resend OTP */}
                <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || loading}
                    className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {canResend ? "Resend OTP" : `Resend available in ${formatTime(timeLeft)}`}
                </button>
            </form>

            {/* Back Button */}
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                >
                    ← Back to registration
                </button>
            )}
        </div>
    );
}
