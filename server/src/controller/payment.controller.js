import Coupon from "../models/Coupon.model.js";
import Order from "../models/Order.model.js";
import { User } from "../models/User.model.js";
import { razorpay } from "../lib/razorpay.js";
import crypto from "crypto";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode, addressId } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		// Validate shipping address
		if (!addressId) {
			return res.status(400).json({ error: "Shipping address is required" });
		}

		const user = await User.findById(req.user._id);
		const shippingAddress = user.addresses.id(addressId);

		if (!shippingAddress) {
			return res.status(404).json({ error: "Address not found" });
		}

		let totalAmount = 0;

		// Calculate total amount
		products.forEach((product) => {
			totalAmount += product.price * product.quantity;
		});

		let coupon = null;
		let discountAmount = 0;
		
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				discountAmount = Math.round((totalAmount * coupon.discountPercentage) / 100);
				totalAmount -= discountAmount;
			}
		}

		// (smallest currency unit)
		const amountInPaise = Math.round(totalAmount * 100);

		// Create Razorpay order
		const razorpayOrder = await razorpay.orders.create({
			amount: amountInPaise,
			currency: "INR",  
			receipt: `order_${req.user._id}_${Date.now()}`,
			notes: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				discountAmount: discountAmount,
				addressId: addressId,
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({ 
			orderId: razorpayOrder.id,
			amount: razorpayOrder.amount,
			currency: razorpayOrder.currency,
			keyId: process.env.RAZORPAY_KEY_ID,
			totalAmount: totalAmount,
			discountAmount: discountAmount
		});
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { 
			razorpay_order_id, 
			razorpay_payment_id, 
			razorpay_signature 
		} = req.body;

		// Verify payment signature
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature !== expectedSign) {
			return res.status(400).json({ message: "Invalid payment signature" });
		}

		// Fetch order details from Razorpay
		const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);

		if (razorpayOrder.status === "paid") {
			// Get user and shipping address
			const user = await User.findById(razorpayOrder.notes.userId);
			const shippingAddress = user.addresses.id(razorpayOrder.notes.addressId);

			if (!shippingAddress) {
				return res.status(404).json({ message: "Shipping address not found" });
			}

			// Deactivate coupon if used
			if (razorpayOrder.notes.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: razorpayOrder.notes.couponCode,
						userId: razorpayOrder.notes.userId,
					},
					{
						isActive: false,
					}
				);
			}

			// Create a new Order
			const products = JSON.parse(razorpayOrder.notes.products);
			const newOrder = new Order({
				user: razorpayOrder.notes.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: razorpayOrder.amount / 100, // convert from paise to rupees
				shippingAddress: {
					fullName: shippingAddress.fullName,
					phone: shippingAddress.phone,
					addressLine1: shippingAddress.addressLine1,
					addressLine2: shippingAddress.addressLine2,
					city: shippingAddress.city,
					state: shippingAddress.state,
					pincode: shippingAddress.pincode,
					country: shippingAddress.country,
				},
				razorpayOrderId: razorpay_order_id,
				razorpayPaymentId: razorpay_payment_id,
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 5,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}
