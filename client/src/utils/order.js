import axiosInstance from "./axios";

// Get user's orders (last 15 days)
export const getUserOrders = async () => {
    try {
        const response = await axiosInstance.get("/orders");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch orders" };
    }
};

// Get single order details
export const getOrderById = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch order details" };
    }
};
