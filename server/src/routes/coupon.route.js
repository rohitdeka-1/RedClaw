import express from "express";
import { getCoupon, validateCoupon } from "../controller/coupon.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const couponRoute = express.Router();

couponRoute.get("/",protectRoute,getCoupon);
couponRoute.post("/validate", protectRoute, validateCoupon);

export default couponRoute;