import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/communityApi';
import { axiosInstance } from '../../../lib/axios';

// ============================================================================
// 1. COMMUNITY QUERIES & MUTATIONS
// ============================================================================

export const useAllCommunities = () => {
  return useQuery({
    queryKey: ['communities', 'all'],
    queryFn: api.getCommunities,
  });
};



export const useJoinedCommunities = (userId?: string) => {
  return useQuery({
    queryKey: ['communities', 'joined', userId],
    enabled: !!userId, // Only run if we actually have the user ID
    queryFn: () => api.getJoinedCommunities(userId!),
    staleTime: 0, // Always fetch fresh data on reload
  });
};

export const useJoinCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.joinCommunity,
    onSuccess: (_, variables) => {
      // variables now contains BOTH communityId and userId
      queryClient.setQueriesData({ queryKey: ['communities', 'joined'] }, (old: any) => {
        const safeOld = Array.isArray(old) ? old : [];
        
        // Handle both object {id: ...} and raw string "..." formats safely
        if (safeOld.some(c => {
          const compareId = typeof c === 'string' ? c : c.id;
          return compareId?.toLowerCase() === variables.communityId.toLowerCase();
        })) return safeOld;
        
        return [...safeOld, { id: variables.communityId }];
      });

      queryClient.invalidateQueries({ queryKey: ['communities', 'suggested'] });
    },
  });
};

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.leaveCommunity,
    onSuccess: (_, variables) => {
      // Instantly rip the ID out of the cache using the safe string/object check
      queryClient.setQueriesData({ queryKey: ['communities', 'joined'] }, (old: any) => {
        if (!Array.isArray(old)) return [];
        return old.filter(c => {
          const compareId = typeof c === 'string' ? c : c.id;
          return compareId?.toLowerCase() !== variables.communityId.toLowerCase();
        });
      });

      queryClient.invalidateQueries({ queryKey: ['communities', 'suggested'] });
    },
  });
};

// ============================================================================
// 2. POST QUERIES & MUTATIONS
// ============================================================================

export const useCommunityPosts = (communityId: string | undefined) => {
  return useQuery({
    queryKey: ['posts', 'community', communityId],
    queryFn: () => api.getCommunityPosts(communityId!),
    enabled: !!communityId,
  });
};


export const usePostDetails = (postId?: string) => {
  return useQuery({
    queryKey: ['post', postId],
    enabled: !!postId, // Only run if we actually have a URL parameter
    queryFn: () => api.getPostDetails(postId!),
  });
};


export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createComment,
    onSuccess: () => {
      // Instantly tell React Query to refetch this specific post
      // This will grab the new comment AND the updated CommentCount!
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      
      // Also invalidate the main feed so the comment count updates there too
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createPost,
    onSuccess: (_, variables) => {
      // THE FIX: Do not inject the backend response into the UI.
      // Just tell React Query to fetch the fresh, perfectly formed list of posts!
      // Using a fuzzy match to invalidate ANY post queries.
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useSuggestedCommunities = (userId?: string) => {
  return useQuery({
    queryKey: ['communities', 'suggested', userId],
    enabled: !!userId, // Only fetch if we have a logged-in user
    queryFn: () => api.getSuggestedCommunities(userId!),
  });
};

export const useVoteComment = () => {
  return useMutation({
    mutationFn: api.castCommentVote,
  });
};

export const useRemoveCommentVote = () => {
  return useMutation({
    mutationFn: api.removeCommentVote,
  });
};


export const useVotePost = () => {
  return useMutation({
    mutationFn: ({ postId, userId, isUpvote }: { postId: string; userId: string; isUpvote: boolean }) => 
      api.castPostVote({ postId, userId, isUpvote }),
    onSuccess: () => {
      // NOTHING HERE! 
      // The local React State handles the number change instantly.
      // We no longer trigger a full page data refresh!
    },
  });
};

export const useRemovePostVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.removePostVote,
    onSuccess: () => {
      // Refresh the vote states so the arrows correctly reset to gray
      queryClient.invalidateQueries({ queryKey: ['posts', 'vote-states'] });
    },
  });
};

// ============================================================================
// 3. MEDIA UPLOAD MUTATION
// ============================================================================

export const useUploadMediaBatch = () => {
  return useMutation({
    mutationFn: api.uploadMediaBatch,
    // We don't need to invalidate anything here. This just returns the URLs
    // which the frontend will then attach to the useCreatePost mutation.
  });
};





