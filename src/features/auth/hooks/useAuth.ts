import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { loginUser, registerUser, verifyEmail } from '../api/auth';
import { axiosInstance } from '../../../lib/axios';

// 1. The Login Hook
export const useLogin = () => {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // The backend returned the token, fullName, and email. Save it to Zustand!
      setCredentials(data.token, data.userId, data.fullName, data.email, data.avatarUrl);
      
      // Send them to the community app feed
      navigate('/explore'); 
    },
    onError: (error: any) => {
      console.error("Login Failed:", error.response?.data?.message || error.message);
    }
  });
};

// 2. The Register Hook
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (_, variables) => {
      // Registration successful! Send them to the verify page.
      // We can pass the email in the URL state so they don't have to type it again.
      navigate('/verify-email', { state: { email: variables.email } });
    },
    onError: (error: any) => {
      console.error("Registration Failed:", error.response?.data?.message || error.message);
    }
  });
};

// 3. The Verify Email Hook
export const useVerifyEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      // Verification successful! Send them to login.
      // (Or if your backend auto-logs them in here, you would call setCredentials instead)
      navigate('/login', { state: { message: 'Email verified successfully! Please log in.' } });
    },
    onError: (error: any) => {
      console.error("Verification Failed:", error.response?.data?.message || error.message);
    }
  });
};

// --- FORGOT PASSWORD ---
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      // The backend should return a 200 OK even if the email doesn't exist!
      const response = await axiosInstance.post('/auth/forgot-password', data);
      return response.data;
    }
  });
};

// --- RESET PASSWORD ---
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string; token: string; newPassword: string }) => {
      const response = await axiosInstance.post('/auth/reset-password', data);
      return response.data;
    }
  });
};