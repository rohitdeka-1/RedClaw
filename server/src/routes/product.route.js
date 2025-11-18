import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { 
	createProduct, 
	deleteProduct, 
	getAllProducts, 
	getFeaturedProducts, 
	getProductsByCategory, 
	getRecommendedProducts, 
	toggleFeaturedProduct,
	updateProduct,
	updateStock,
	addProductImages,
	removeProductImage,
	updateMainImage
} from "../controller/product.controller.js";

const prodRoute = express.Router();

// Public routes
prodRoute.get("/", getAllProducts);
prodRoute.get("/featured", getFeaturedProducts);
prodRoute.get("/category/:category", getProductsByCategory);
prodRoute.get("/recommendations", getRecommendedProducts);

// Admin only routes - Product CRUD
prodRoute.post("/", protectRoute, adminRoute, createProduct);
prodRoute.patch("/:id", protectRoute, adminRoute, updateProduct);
prodRoute.delete("/:id", protectRoute, adminRoute, deleteProduct);
prodRoute.patch("/:id/featured", protectRoute, adminRoute, toggleFeaturedProduct);

// Admin only routes - Stock management
prodRoute.patch("/:id/stock", protectRoute, adminRoute, updateStock);

// Admin only routes - Image management
prodRoute.post("/:id/images", protectRoute, adminRoute, addProductImages);
prodRoute.delete("/:id/images", protectRoute, adminRoute, removeProductImage);
prodRoute.patch("/:id/main-image", protectRoute, adminRoute, updateMainImage);

export default prodRoute;