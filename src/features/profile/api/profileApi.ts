import { axiosInstance } from '../../../lib/axios';

// Adjust these fields to match your C# DTOs!
export interface Profile {
  userId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  type: string;
  primarySectorId: number | null;
  targetCareerId: string | null;
  latestAssessmentId: string | null;
  reputationScore: number;
  isAcceptingDirectMessages: boolean;
}

// GET /api/Profiles/me
export const getMyProfile = async (): Promise<Profile> => {
  const response = await axiosInstance.get('/Profiles/me');
  return response.data;
};

// PUT /api/Profiles/me
export const updateMyProfile = async (profileData: Partial<Profile>): Promise<Profile> => {
  const response = await axiosInstance.put('/Profiles/me', profileData);
  return response.data;
};

// GET /api/Profiles/{userId}
export const getUserProfile = async (userId: string): Promise<Profile> => {
  const response = await axiosInstance.get(`/Profiles/${userId}`);
  return response.data;
};