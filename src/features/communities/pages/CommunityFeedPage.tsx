// src/features/communities/pages/CommunityFeedPage.tsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  useCommunityPosts, 
  useAllCommunities, 
  useJoinedCommunities, 
  useJoinCommunity, 
  useLeaveCommunity 
} from '../hooks/useCommunity';
import { PostCard } from '../components/PostCard';
import { CreatePostBox } from '../components/CreatePostBox';
import { PostDetailsModal } from '../components/PostDetailsModal'; // <-- IMPORT MODAL
import { useMyProfile } from '../../profile/hooks/useProfile'; 

export const CommunityFeedPage = () => {
  const { id: communityId } = useParams<{ id: string }>();
  const { data: currentUser } = useMyProfile();

  // 1. ADD STATE FOR THE MODAL
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Fetch Data
  const { data: allCommunities, isLoading: isLoadingAll } = useAllCommunities();
  const { data: joinedCommunities, isLoading: isLoadingJoined } = useJoinedCommunities(currentUser?.userId);
  
  // Notice we grab the error object here to see if the backend is blocking us
  const { data: posts, isLoading: isLoadingPosts, error: postsError } = useCommunityPosts(communityId);

  const joinMutation = useJoinCommunity();
  const leaveMutation = useLeaveCommunity();

  const isLoading = isLoadingAll || isLoadingJoined || isLoadingPosts;
  
  const currentCommunity = allCommunities?.find(
    c => c.id.toLowerCase() === communityId?.toLowerCase()
  );
  
  const isJoined = joinedCommunities?.some(c => {
    const compareId = typeof c === 'string' ? c : c.id;
    return compareId?.toLowerCase() === communityId?.toLowerCase();
  }) || false;
  
  const handleToggleJoin = () => {
    if (!communityId || !currentUser?.userId) return; 
    
    if (isJoined) {
      leaveMutation.mutate({ 
        communityId: communityId, 
        userId: currentUser.userId 
      });
    } else {
      joinMutation.mutate({ 
        communityId: communityId, 
        userId: currentUser.userId 
      });
    }
  };

  // 1. Loading State
  if (isLoading) { 
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white">
        <div className="relative w-16 h-16 flex items-center justify-center mb-6">
          <div className="absolute inset-0 border-4 border-[#D97706]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // 2. We only show "Not Found" if we successfully loaded the communities list, but this ID isn't in it.
  if (!isLoadingAll && allCommunities && !currentCommunity) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white p-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-red-500">Community Not Found</h2>
          <p className="text-gray-400 mb-6">This community does not exist or you do not have access to view its details.</p>
          <Link to="/explore" className="px-6 py-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold rounded-xl transition-colors inline-block">Back to Explore</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#E5E5E5] font-sans selection:bg-[#D97706]/30">
      
      {/* HEADER */}
      <div className="w-full bg-gradient-to-b from-[#1A1A1A] to-[#121212] border-b border-white/5 pt-12 pb-8 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D97706]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link to="/explore" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D97706] transition-colors mb-6 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Explore Communities
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              {currentCommunity?.name || "Community"}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
              {currentCommunity?.description || "Welcome to the discussion."}
            </p>
          </div>

          <button
            onClick={handleToggleJoin}
            disabled={joinMutation.isPending || leaveMutation.isPending}
            className={`px-8 py-3.5 rounded-xl font-semibold transition-all shrink-0 shadow-lg ${
              isJoined 
                ? 'bg-white/5 border border-white/10 text-white hover:bg-red-500/10 hover:text-red-400' 
                : 'bg-[#D97706] text-white hover:bg-[#B45309]'
            }`}
          >
            {joinMutation.isPending || leaveMutation.isPending 
              ? 'Updating...' 
              : isJoined ? 'Leave Community' : 'Join Community'}
          </button>
        </div>
      </div>

      {/* FEED CONTENT */}
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        
        {currentUser && communityId && (
          <CreatePostBox 
            communityId={communityId}
            currentUserId={currentUser.userId}
            currentUserAvatarUrl={currentUser.avatarUrl || undefined}
            isJoined={isJoined}
            onJoinClick={handleToggleJoin}
          />
        )}

        <div className="flex flex-col gap-6">
          {postsError ? (
            <div className="text-center py-10 bg-red-500/10 border border-red-500/20 rounded-[1.5rem]">
              <p className="text-red-400 font-medium">Failed to load posts from the server.</p>
              <p className="text-sm text-red-400/70 mt-1">Check your API or Network tab. Does your backend require you to be a member to view posts?</p>
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUserId={currentUser?.userId} 
                isJoined={isJoined}
                onCardClick={() => setSelectedPostId(post.id)} // 2. SET THE MODAL STATE ON CLICK
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[1.5rem]">
              <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400">There are no discussions here right now.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. RENDER THE MODAL OVERLAY */}
      {selectedPostId && (
        <PostDetailsModal 
          postId={selectedPostId} 
          onClose={() => setSelectedPostId(null)} 
          currentUserId={currentUser?.userId}
          isJoined={isJoined}
        />
      )}
    </div>
  );
};