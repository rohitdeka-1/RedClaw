import axiosInstance from "./axios";

// Get all billing addresses
export const getBillingAddresses = async () => {
    try {
        const response = await axiosInstance.get("/billing-address");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch billing addresses" };
    }
};

// Add a new billing address
export const addBillingAddress = async (addressData) => {
    try {
        const response = await axiosInstance.post("/billing-address", addressData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to add billing address" };
    }
};

// Update a billing address
export const updateBillingAddress = async (id, addressData) => {
    try {
        const response = await axiosInstance.put(`/billing-address/${id}`, addressData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update billing address" };
    }
};

// Delete a billing address
export const deleteBillingAddress = async (id) => {
    try {
        const response = await axiosInstance.delete(`/billing-address/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete billing address" };
    }
};

// Set default billing address
export const setDefaultBillingAddress = async (id) => {
    try {
        const response = await axiosInstance.patch(`/billing-address/${id}/default`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to set default billing address" };
    }
};
