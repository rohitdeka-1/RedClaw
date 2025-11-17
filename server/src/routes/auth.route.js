import express from "express";
import { login, signup, logout, refreshToken, getProfile } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { signupValidation } from "../middleware/authValidation.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup",signupValidation, signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.get("/profile", protectRoute, getProfile);

export default authRoutes;