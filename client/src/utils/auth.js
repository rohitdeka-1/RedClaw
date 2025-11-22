import axiosInstance from './axios';

// Get user from localStorage
export const getUserFromStorage = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Save user to localStorage
export const saveUserToStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
};

// Remove user from localStorage
export const removeUserFromStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
};

// Check if user is logged in
export const isAuthenticated = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
};

// Login API call
export const loginUser = async (email, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email,
            password
        });
        
        if (response.data) {
            saveUserToStorage(response.data);
        }
        
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

// Signup API call
export const signupUser = async (name, email, password) => {
    try {
        const response = await axiosInstance.post('/auth/signup', {
            name,
            email,
            password
        });
        
        if (response.data) {
            saveUserToStorage(response.data);
        }
        
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Signup failed' };
    }
};

// Logout API call
export const logoutUser = async () => {
    try {
        await axiosInstance.post('/auth/logout');
        removeUserFromStorage();
    } catch (error) {
        // Even if logout fails on server, clear local storage
        removeUserFromStorage();
        throw error.response?.data || { message: 'Logout failed' };
    }
};

// Get user profile
export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get('/auth/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get profile' };
    }
};

// Refresh token
export const refreshToken = async () => {
    try {
        const response = await axiosInstance.post('/auth/refresh-token');
        return response.data;
    } catch (error) {
        removeUserFromStorage();
        window.location.href = '/';
        throw error.response?.data || { message: 'Token refresh failed' };
    }
};
