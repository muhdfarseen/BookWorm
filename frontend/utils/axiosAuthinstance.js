// axiosAuthInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackendURL } from './constants';

const axiosAuthInstance = axios.create({
  baseURL: BackendURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default axiosAuthInstance;
