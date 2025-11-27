import axios from 'axios'
import { BASE_URL } from './apiPaths.js'; // include extension for Vite

// 👇 ADD THIS LINE — it helps us check if the frontend is using the correct backend URL
console.log("🚀 FRONTEND BASE_URL =", BASE_URL);

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request integration
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = '/login';
            } else if (error.response.status === 500) {
                console.error('Server error: Please try again later.');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timed out. Please try again later.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
