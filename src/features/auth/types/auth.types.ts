
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}


export interface AuthResponse {
  token: string;
  userId: string;        // <-- Add this
  fullName: string;
  email: string;
  avatarUrl?: string | null; // <-- Add this (optional/nullable)
}