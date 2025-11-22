import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle token expiration
let isRefreshing = false;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Prevent infinite loop - don't retry if this IS the refresh-token request
            if (originalRequest.url?.includes('/auth/refresh-token')) {
                console.error('Refresh token expired, logging out...');
                localStorage.removeItem('user');
                localStorage.removeItem('isLoggedIn');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            // Prevent multiple simultaneous refresh attempts
            if (isRefreshing) {
                return Promise.reject(error);
            }

            isRefreshing = true;

            try {
                // Try to refresh the token
                await axiosInstance.post('/auth/refresh-token');
                isRefreshing = false;
                
                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Token refresh failed, redirect to login page
                isRefreshing = false;
                console.error('Token refresh failed, redirecting to login...');
                localStorage.removeItem('user');
                localStorage.removeItem('isLoggedIn');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
