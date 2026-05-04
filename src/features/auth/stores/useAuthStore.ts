import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function to securely crack open a JWT token
const parseJwt = (token: string) => {
  try {
    // Splits the token, grabs the payload (middle part), and decodes it from Base64
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

interface AuthState {
  token: string | null;
  userId: string | null;
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
  isAuthenticated: boolean;
  
  setCredentials: (token: string, userId: string | undefined, fullName: string, email: string, avatarUrl?: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      fullName: null,
      email: null,
      avatarUrl: null,
      isAuthenticated: false,

      // Called when Login or Register succeeds
      setCredentials: (token, userId, fullName, email, avatarUrl = null) => {
        // Decode the token to guarantee we get the ID, even if 'userId' is passed as undefined!
        const decodedToken = parseJwt(token);
        const extractedUserId = userId || decodedToken?.sub || null;

        set({ 
          token, 
          userId: extractedUserId, // <-- Bulletproof ID assignment
          fullName, 
          email, 
          avatarUrl, 
          isAuthenticated: true 
        });
      },

      // Called when the user clicks "Log Out"
      logout: () => 
        set({ 
          token: null, 
          userId: null, 
          fullName: null, 
          email: null, 
          avatarUrl: null,
          isAuthenticated: false 
        }),
    }),
    {
      name: 'cpath-auth-storage', // The secret key used in localStorage
    }
  )
);