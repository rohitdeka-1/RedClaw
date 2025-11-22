import { redis } from "../lib/redis.js";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../services/mailer.services.js";
import { getClientIp, parseUserAgent, getLocationFromIp, formatDate } from "../services/getIP.js";
import envConfig from "../config/env.config.js";
import { generateOTP, getOTPExpiry } from "../utils/otp.js";

const generateTokens = (userId) => {

    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
    
};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const signup = async (req, res) => {
    const { email, password, name,userPhone } = req.body;
    try {
        const userExists = await User.findOne({ email });

        // If user exists and is already verified, return error
        if (userExists && userExists.isVerified) {
            return res.status(400).json({ message: "User already exists. Please login instead." });
        }

        if (userExists && !userExists.isVerified) {
            
            const otp = generateOTP();
            const otpExpires = getOTPExpiry();

            userExists.name = name;
            userExists.password = password; // Will be hashed by pre-save middleware
            userExists.verificationOTP = otp;
            userExists.userPhone = userPhone;
            userExists.otpExpires = otpExpires;
            await userExists.save();

            
            try {
                sendMail(
                    userExists.email,
                    "Verify Your Email - New OTP Code",
                    "otp",
                    {
                        name: userExists.name,
                        otp: otp,
                        expiryMinutes: 15,
                        year: new Date().getFullYear()
                    }
                );
                console.log("New OTP email sent to existing unverified user:", userExists.email);
            } catch (emailError) {
                console.error("Failed to send OTP email:", emailError.message);
                return res.status(500).json({ message: "Failed to send verification email. Please try again." });
            }

            return res.status(200).json({
                message: "You have an unverified account. A new OTP has been sent to your email.",
                email: userExists.email
            });
        }

         
        const otp = generateOTP();
        const otpExpires = getOTPExpiry();

        const user = await User.create({ 
            name, 
            email, 
            userPhone,
            password,
            isVerified: false,
            verificationOTP: otp,
            otpExpires: otpExpires
        });

        try {
            sendMail(
                user.email,
                "Verify Your Email - OTP Code",
                "otp",
                {
                    name: user.name,
                    otp: otp,
                    expiryMinutes: 15,
                    year: new Date().getFullYear()
                }
            );
            console.log("OTP email sent successfully to:", user.email);
        } catch (emailError) {
            console.error(" Failed to send OTP email:", emailError.message);
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ message: "Failed to send verification email. Please try again." });
        }

        res.status(201).json({
            message: "OTP sent to your email. Please verify to complete registration.",
            email: user.email
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        // Check if OTP matches
        if (user.verificationOTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpExpires < new Date()) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        user.isVerified = true;
        user.verificationOTP = undefined;
        user.otpExpires = undefined;
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        // Send welcome email
        try {
            sendMail(
                user.email,
                "Welcome to RedClaw - Your Account is Ready! 🎉",
                "welcome",
                {
                    name: user.name,
                    email: user.email,
                    registrationDate: formatDate(),
                    role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
                    frontendUrl: envConfig.FRONT_END || "http://localhost:5173",
                    year: new Date().getFullYear()
                }
            );
            console.log("Welcome email sent successfully to:", user.email);
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError.message);
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: "Email verified successfully! Welcome aboard!"
        });
    } catch (error) {
        console.log("Error in verifyOTP controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const resendOTP = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpires = getOTPExpiry();

        user.verificationOTP = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP email
        try {
            sendMail(
                user.email,
                "Verify Your Email - New OTP Code",
                "otp",
                {
                    name: user.name,
                    otp: otp,
                    expiryMinutes: 15,
                    year: new Date().getFullYear()
                }
            );
            console.log("✅ New OTP email sent successfully to:", user.email);
        } catch (emailError) {
            console.error("❌ Failed to send OTP email:", emailError.message);
            return res.status(500).json({ message: "Failed to send verification email. Please try again." });
        }

        res.status(200).json({
            message: "New OTP sent to your email",
            email: user.email
        });
    } catch (error) {
        console.log("Error in resendOTP controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            // Check if user is verified
            if (!user.isVerified) {
                return res.status(403).json({ 
                    message: "Please verify your email before logging in. Check your inbox for the OTP code.",
                    requiresVerification: true
                });
            }

            const { accessToken, refreshToken } = generateTokens(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            const ipAddress = getClientIp(req);
            const userAgent = req.headers['user-agent'] || '';
            const { browser, os, deviceInfo } = parseUserAgent(userAgent);
            const location = getLocationFromIp(ipAddress);

            
            try {
                sendMail(
                    user.email,
                    "🔐 New Login Alert - RedClaw Account",
                    "login",
                    {
                        name: user.name,
                        email: user.email,
                        loginTime: formatDate(),
                        ipAddress: ipAddress,
                        deviceInfo: deviceInfo,
                        browser: browser,
                        os: os,
                        location: location,
                        frontendUrl: envConfig.FRONT_END || "http://localhost:5173",
                        year: new Date().getFullYear()
                    }
                );
            } catch (emailError) {
                console.error("Failed to send login notification:", emailError.message);
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                message: "Login successful"
            });
        } else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken"); 
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.json({ message: "Token refreshed successfully" });
    } catch (error) {
        console.log("Error in refreshToken controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};