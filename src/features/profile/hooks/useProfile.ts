import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile, getUserProfile } from '../api/profileApi';

// Hook to get the logged-in user's profile
// Update this hook to accept an optional 'enabled' flag
export const useMyProfile = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: getMyProfile,
    enabled: enabled, // Only runs if true
  });
};

// Hook to update the logged-in user's profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      // Force React Query to refresh the 'me' profile data
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
};

// Hook to get any user's profile by ID
export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId, // Only run the query if a userId actually exists
  });
};