import { useQuery } from '@tanstack/react-query';
import { getCommunities } from '../api/communities';

export const useCommunities = () => {
  return useQuery({
    queryKey: ['communities'],
    queryFn: getCommunities,
  });
};