import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Set the base URL for your Spring Boot backend
const API_BASE_URL = 'http://192.168.1.60:8080/api';

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add interceptor to attach JWT token if user is logged in
api.interceptors.request.use(
    async (config) => {
        const token = await getToken(); // Implement getToken() to read token from storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Example function to get token from AsyncStorage (React Native)
export const getToken = async () => {
    return await AsyncStorage.getItem('userToken');
};

export default api;
