import axiosInstance from "./axios";

// Get all cart items from server
export const getCartItems = async () => {
    const response = await axiosInstance.get("/cart");
    return response.data;
};

// Add item to cart
export const addToCartAPI = async (productId) => {
    const response = await axiosInstance.post("/cart", { productId });
    return response.data;
};

// Update cart item quantity
export const updateCartQuantity = async (productId, quantity) => {
    const response = await axiosInstance.put(`/cart/${productId}`, { quantity });
    return response.data;
};

// Remove item from cart
export const removeFromCart = async (productId) => {
    const response = await axiosInstance.delete("/cart", { data: { productId } });
    return response.data;
};

// Clear entire cart
export const clearCart = async () => {
    const response = await axiosInstance.delete("/cart");
    return response.data;
};
