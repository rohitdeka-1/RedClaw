import Coupon from "../models/Coupon.model.js";
import Order from "../models/Order.model.js";
import { User } from "../models/User.model.js";
import {Product} from "../models/Product.model.js";
import { razorpay } from "../lib/razorpay.js";
import { transporter } from "../services/mailer.services.js";
import crypto from "crypto";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode, addressId, billingAddressId } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		// Validate shipping address
		if (!addressId) {
			return res.status(400).json({ error: "Shipping address is required" });
		}

		// Validate billing address
		if (!billingAddressId) {
			return res.status(400).json({ error: "Billing address is required" });
		}

		const user = await User.findById(req.user._id);
		const shippingAddress = user.addresses.id(addressId);

		if (!shippingAddress) {
			return res.status(404).json({ error: "Shipping address not found" });
		}

		// Validate billing address (can be same as shipping or from billingAddresses)
		let billingAddress;
		if (billingAddressId === addressId) {
			// Same as shipping address
			billingAddress = shippingAddress;
		} else {
			billingAddress = user.billingAddresses.id(billingAddressId);
			if (!billingAddress) {
				return res.status(404).json({ error: "Billing address not found" });
			}
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

		// Create Razorpay order with short receipt (max 40 chars)
		const shortReceipt = `ord_${Date.now().toString().slice(-10)}`;

		const razorpayOrder = await razorpay.orders.create({
			amount: amountInPaise,
			currency: "INR",  
			receipt: shortReceipt,
			notes: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				discountAmount: discountAmount,
				addressId: addressId,
				billingAddressId: billingAddressId,
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

			// Get billing address
			let billingAddress;
			if (razorpayOrder.notes.billingAddressId === razorpayOrder.notes.addressId) {
				// Same as shipping
				billingAddress = shippingAddress;
			} else {
				billingAddress = user.billingAddresses.id(razorpayOrder.notes.billingAddressId);
				if (!billingAddress) {
					return res.status(404).json({ message: "Billing address not found" });
				}
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
				billingAddress: {
					fullName: billingAddress.fullName,
					phone: billingAddress.phone,
					addressLine1: billingAddress.addressLine1,
					addressLine2: billingAddress.addressLine2,
					city: billingAddress.city,
					state: billingAddress.state,
					pincode: billingAddress.pincode,
					country: billingAddress.country,
				},
				razorpayOrderId: razorpay_order_id,
				razorpayPaymentId: razorpay_payment_id,
			});

			await newOrder.save();

			// Fetch product details for email
			const productDetails = await Promise.all(
				products.map(async (product) => {
					const productData = await Product.findById(product.id);
					return {
						name: productData?.name || "Product",
						image: `${process.env.FRONTEND_URL}${productData?.coverImage || "/mouse.png"}`,
						quantity: product.quantity,
						price: product.price,
					};
				})
			);

			// Calculate totals for email
			const subtotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
			const tax = Math.round(subtotal * 0.18);
			const discount = razorpayOrder.notes.discountAmount || 0;

			// Send order confirmation email
			try {
				await transporter.sendMail({
					from: `"RedClaw" <${process.env.EMAIL_USER}>`,
					to: user.email,
					subject: `Order Confirmation - #${newOrder._id.toString().slice(-8).toUpperCase()}`,
					template: "orderConfirmation",
					context: {
						customerName: user.name,
						orderId: newOrder._id.toString().slice(-8).toUpperCase(),
						orderDate: new Date().toLocaleDateString("en-IN", {
							day: "numeric",
							month: "long",
							year: "numeric",
						}),
						paymentId: razorpay_payment_id,
						products: productDetails,
						shippingAddress: shippingAddress,
						billingAddress: billingAddress,
						subtotal: subtotal,
						tax: tax,
						discount: discount > 0 ? discount : null,
						totalAmount: razorpayOrder.amount / 100,
						frontendUrl: process.env.FRONTEND_URL,
					},
				});
				console.log("Order confirmation email sent to:", user.email);
			} catch (emailError) {
				console.error("Error sending order confirmation email:", emailError);
				// Don't fail the order if email fails
			}

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
