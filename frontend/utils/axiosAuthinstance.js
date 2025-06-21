// axiosAuthInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackendURL } from './constants';
import { router } from 'expo-router';

const axiosAuthInstance = axios.create({
  baseURL: BackendURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add access token
axiosAuthInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosAuthInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry){

      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosAuthInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('@refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh token endpoint
        const response = await axios.post(`${BackendURL}/users/refreshToken`, {
          refreshToken
        });

        const { accessToken } = response.data;

        // Store new access token
        await AsyncStorage.setItem('@accessToken', accessToken);

        // Update the authorization header for the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);

        // Retry the original request
        return axiosAuthInstance(originalRequest);

      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        processQueue(refreshError, null);
        
        await AsyncStorage.multiRemove(['@accessToken', '@refreshToken']);
        
        // You might want to emit an event or use a navigation service here
        // to redirect user to login screen
        // Example: NavigationService.navigate('Login');
        router.replace('/');
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { axiosAuthInstance };