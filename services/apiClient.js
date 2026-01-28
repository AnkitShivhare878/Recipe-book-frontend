import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { authStorage } from '../utils/authStorage';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - automatically add token to requests
apiClient.interceptors.request.use(
    async (config) => {
        const token = await authStorage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        // Return data directly for successful responses
        return response.data;
    },
    (error) => {
        console.error('API Error details:', {
            message: error.message,
            config: error.config,
            response: error.response?.data
        });
        if (error.response) {
            // Server responded with error status
            const errorMessage = error.response.data?.message || 'An error occurred';
            return Promise.reject(new Error(errorMessage));
        } else if (error.request) {
            // Request was made but no response received
            return Promise.reject(
                new Error(`Network error at ${error.config?.url}. Please check if the backend is running at ${API_BASE_URL}`),
            );
        } else {
            // Something else happened
            return Promise.reject(error);
        }
    },
);

export default apiClient;
