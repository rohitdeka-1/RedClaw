import Razorpay from "razorpay";
import envConfig from "../config/env.config.js";

export const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("Razorpay Config:", {
	key_id: process.env.RAZORPAY_KEY_ID ? "✅ Set" : "❌ Missing",
	key_secret: process.env.RAZORPAY_KEY_SECRET ? "✅ Set" : "❌ Missing"
});
