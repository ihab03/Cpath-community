// src/lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '../features/auth/stores/useAuthStore';


export const axiosInstance = axios.create({

  baseURL: import.meta.env.VITE_API_URL , 
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {

    const token = useAuthStore.getState().token;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);