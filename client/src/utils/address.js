import axiosInstance from "./axios";

// Get all addresses
export const getAddresses = async () => {
	const response = await axiosInstance.get("/address");
	return response.data;
};

// Add a new address
export const addAddress = async (addressData) => {
	const response = await axiosInstance.post("/address", addressData);
	return response.data;
};

// Update an existing address
export const updateAddress = async (addressId, addressData) => {
	const response = await axiosInstance.put(`/address/${addressId}`, addressData);
	return response.data;
};

// Delete an address
export const deleteAddress = async (addressId) => {
	const response = await axiosInstance.delete(`/address/${addressId}`);
	return response.data;
};

// Set an address as default
export const setDefaultAddress = async (addressId) => {
	const response = await axiosInstance.patch(`/address/${addressId}/default`);
	return response.data;
};
