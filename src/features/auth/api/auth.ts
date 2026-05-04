import { axiosInstance } from '../../../lib/axios';
import type { RegisterRequest, LoginRequest, VerifyEmailRequest, AuthResponse } from '../types/auth.types';

// 1. REGISTER USER
export const registerUser = async (data: RegisterRequest): Promise<void> => {
  // Sending: { firstName, lastName, email, password }
  // Expecting: 200 OK (Check email)
  await axiosInstance.post('/auth/register', data);
  
  // We return nothing (void) because a 200 OK means success. 
  // If it fails (e.g., email exists), Axios will automatically throw an error 
  // that React Query will catch!
};

// 2. VERIFY EMAIL (Placeholder route until you give me the exact one)
export const verifyEmail = async (data: VerifyEmailRequest): Promise<void> => {
  // Assuming the route is /auth/verify or similar. 
  // Update this route if your C# backend uses something different!
  await axiosInstance.post('/auth/verify-email', data);
};

// 3. LOGIN USER
export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  // Expecting the C# backend to return the JWT Token and User Info
  const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
  
  return response.data;
};