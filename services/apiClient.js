import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { authStorage } from '../utils/authStorage';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            return Promise.reject(new Error(errorMessage));
        } else if (error.request) {
            return Promise.reject(
                new Error(`Network error at ${error.config?.url}. Please check if the backend is running at ${API_BASE_URL}`),
            );
        } else {
            return Promise.reject(error);
        }
    },
);

export default apiClient;
