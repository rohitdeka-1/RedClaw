import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
	getUserOrders,
	getOrderById,
	getAllOrders,
	updateOrderStatus,
} from "../controller/order.controller.js";

const orderRouter = express.Router();

// User routes
orderRouter.get("/", protectRoute, getUserOrders);
orderRouter.get("/:orderId", protectRoute, getOrderById);

// Admin routes
orderRouter.get("/admin/all", protectRoute, adminRoute, getAllOrders);
orderRouter.patch("/:orderId/status", protectRoute, adminRoute, updateOrderStatus);

export default orderRouter;
