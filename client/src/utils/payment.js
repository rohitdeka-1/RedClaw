import axiosInstance from "./axios";

// Create checkout session
export const createCheckoutSession = async (products, addressId, billingAddressId, couponCode = "") => {
    try {
        const response = await axiosInstance.post("/payment/create-checkout-session", {
            products,
            addressId,
            billingAddressId,
            couponCode
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to create checkout session" };
    }
};

// Verify payment success
export const verifyPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post("/payment/checkout-success", paymentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to verify payment" };
    }
};
