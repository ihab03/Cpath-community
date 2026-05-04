import axios from 'axios'; // Standard axios for direct-to-cloud Azure uploads
import { axiosInstance } from '../../../lib/axios'; // Intercepted axios for your backend
import type { Post, PostDetails, UploadTicket } from '../types/community';
import type { Community } from '../../explore/types/explore'; // Re-using the community interface

// ============================================================================
// 1. COMMUNITIES ENDPOINTS
// ============================================================================

export const getCommunities = async (): Promise<Community[]> => {
  const response = await axiosInstance.get('/Communities');
  return response.data;
};

export const getJoinedCommunities = async (userId: string): Promise<any[]> => {
  // Hitting the exact endpoint from your Swagger screenshot
  const response = await axiosInstance.get(`/Communities/joined/${userId}`);
  
  // Safely return the data array
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return Array.isArray(response.data) ? response.data : [];
};

export const joinCommunity = async (data: { communityId: string; userId: string }): Promise<void> => {
  // We now send the exact payload your Swagger documentation expects!
  const payload = {
    userId: data.userId,
    communityId: data.communityId
  };

  await axiosInstance.post(`/Communities/${data.communityId}/join`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const leaveCommunity = async (data: { communityId: string; userId: string }): Promise<void> => {
  // Pass the exact same payload we used for joining, but inside the DELETE 'data' property
  const payload = {
    userId: data.userId,
    communityId: data.communityId
  };

  await axiosInstance.delete(`/Communities/${data.communityId}/leave`, {
    data: payload, // <-- Sending the IDs to the backend so it knows who to remove!
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// ============================================================================
// 2. POSTS ENDPOINTS
// ============================================================================



export const createPost = async (data: {
  communityId: string;
  userId: string;
  title: string;
  content: string; // We use 'content' in the UI
  mediaUrls: string[];
  careerTag: string; // <-- NEW
}): Promise<any> => { 
  
  const payload = {
    communityId: data.communityId,
    userId: data.userId,
    title: data.title,
    body: data.content,        
    mediaUrls: data.mediaUrls,
    careerTag: data.careerTag,  
  };

  const response = await axiosInstance.post('/Posts', payload);
  return response.data;
};

export const getCommunityPosts = async (communityId: string): Promise<Post[]> => {
  const response = await axiosInstance.get(`/Posts/community/${communityId}`);
  return response.data;
};

export const getHomePosts = async (userId: string): Promise<Post[]> => {
  const response = await axiosInstance.get(`/Posts/home/${userId}`);
  return response.data;
};

export const getPostDetails = async (postId: string) => {
  const response = await axiosInstance.get(`/Posts/${postId}`);
  return response.data; // Returns PostDetailsDto: { post: PostDto, comments: CommentDto[] }
};

export const pinPost = async (postId: string): Promise<void> => {
  await axiosInstance.put(`/Posts/${postId}/pin`, {});
};

export const castPostVote = async (data: { postId: string; userId: string; isUpvote: boolean }): Promise<boolean> => {
  const payload = {
    userId: data.userId,     // Order doesn't strictly matter in JSON, but we match Swagger!
    postId: data.postId,
    isUpvote: data.isUpvote
  };
  
  // FIXED: Hitting the exact endpoint from your screenshot
  const response = await axiosInstance.post('/Posts/votes', payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};

export const removePostVote = async (data: { postId: string; userId: string }): Promise<void> => {
  await axiosInstance.delete(`/Posts/${data.postId}/votes`, {
    data: {
      postId: data.postId,
      userId: data.userId
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
};


export const getUserVoteStates = async (userId: string, postIds: string[]) => {
  const response = await axiosInstance.post('/Posts/votes/user-states', { userId, postIds });
  return response.data; // Expected backend format: [{ postId: "...", isUpvote: true/false }]
};


export const createComment = async (data: { 
  userId: string; 
  postId: string; 
  body: string; 
  parentCommentId?: string | null;
}) => {
  const payload = {
    userId: data.userId,
    postId: data.postId,
    body: data.body,
    // Send null if it's a top-level comment, or the ID if it's a reply
    parentCommentId: data.parentCommentId || null 
  };

  const response = await axiosInstance.post('/Comments', payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};

export const getSuggestedCommunities = async (userId: string) => {
  const response = await axiosInstance.get(`/Communities/suggested/${userId}`);
  return response.data;
};

// Cast or change a vote on a comment
export const castCommentVote = async (data: { commentId: string; userId: string; isUpvote: boolean }) => {
  const response = await axiosInstance.post(`/Comments/${data.commentId}/votes`, {
    userId: data.userId,
    isUpvote: data.isUpvote
  });
  return response.data;
};

// Remove a vote from a comment
export const removeCommentVote = async (data: { commentId: string; userId: string }) => {
  await axiosInstance.delete(`/Comments/${data.commentId}/votes`, {
    data: { userId: data.userId },
    headers: { 'Content-Type': 'application/json' }
  });
};
// ============================================================================
// 3. MEDIA UPLOAD (VALET KEY PATTERN)
// ============================================================================
export const uploadMediaBatch = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  // Helper to force Azurite internal URLs to use your public DuckDNS domain
  const formatPublicUrl = (rawUrl: string) => {
    if (!rawUrl) return rawUrl;
    
    // Find where the Azurite container path starts
    const azuritePathIndex = rawUrl.indexOf('/devstoreaccount1');
    if (azuritePathIndex === -1) return rawUrl;

    const pathAndQuery = rawUrl.substring(azuritePathIndex);
    const baseUrl = import.meta.env.VITE_API_BASE_URL; // e.g., https://cpath-backend.duckdns.org
    
    return `${baseUrl}${pathAndQuery}`;
  };

  
  const ticketRequest = {
    files: files.map((f) => ({ fileName: f.name, contentType: f.type })),
  };

  const { data: tickets } = await axiosInstance.post<UploadTicket[]>(
    '/Media/upload-tickets',
    ticketRequest
  );

  const finalMediaUrls: string[] = [];

 
  const uploadPromises = files.map((file, index) => {
    const ticket = tickets[index];
    
    
    const publicFinalUrl = formatPublicUrl(ticket.finalUrl);
    const publicUploadUrl = formatPublicUrl(ticket.uploadUrl);

    finalMediaUrls.push(publicFinalUrl); 


    return axios.put(publicUploadUrl, file, {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
    });
  });


  await Promise.all(uploadPromises);

  return finalMediaUrls;
};