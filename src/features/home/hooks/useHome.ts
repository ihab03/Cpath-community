import { useQuery } from '@tanstack/react-query';
import { getHomePosts } from '../api/homeApi';

export const useHomeFeed = (userId?: string) => {
  return useQuery({
    queryKey: ['posts', 'home-feed', userId],
    enabled: !!userId, // Wait until we know who the user is before fetching
    queryFn: () => getHomePosts(userId!),
  });
};