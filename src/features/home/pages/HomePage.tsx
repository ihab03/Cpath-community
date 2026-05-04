import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Data Hooks
import { useHomeFeed } from '../hooks/useHome';
import { useMyProfile } from '../../profile/hooks/useProfile';

// Reusing your beautifully crafted community components!
import { PostCard } from '../../communities/components/PostCard';
import { PostDetailsModal } from '../../communities/components/PostDetailsModal';

// Assuming you exported this from communityApi.ts to color the arrows!
import { getUserVoteStates } from '../../communities/api/communityApi'; 

export const HomePage = () => {
  const { data: currentUser, isLoading: isProfileLoading } = useMyProfile();
  
  // Modal State
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Fetch the personalized home feed
  const { data: posts, isLoading: isPostsLoading, error } = useHomeFeed(currentUser?.userId);

  // Fetch what the user previously voted on so the arrows load with correct colors
  const { data: voteStates } = useQuery({
    queryKey: ['vote-states', 'home-feed', currentUser?.userId],
    enabled: !!posts?.length && !!currentUser?.userId,
    queryFn: () => getUserVoteStates(currentUser!.userId, posts!.map(p => p.id))
  });

  const isLoading = isProfileLoading || isPostsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center">
        <div className="w-16 h-16 relative flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-[#D97706]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#E5E5E5] font-sans">
      
      {/* Header Area */}
  <div className=" w-full border-b border-white/5 pt-5 pb-12 px-4 md:px-8 bg-[#0A0A0A]/50  top-0 z-10">
        
        {/* Blurred Background Glowing Orbs */}
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-[#D97706]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          
          {/* Animated Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-6 backdrop-blur-md shadow-lg shadow-black/50">
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse shadow-[0_0_8px_rgba(217,119,6,0.8)]"></span>
            Live Feed
          </div>
          
          {/* Gradient Text Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-gray-400">
            Welcome back.
          </h1>
          
          {/* Refined Subtitle */}
          <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
            Catch up on the latest insights, discussions, and opportunities from your communities.
          </p>
          
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {error ? (
          <div className="text-center py-10 bg-red-500/10 border border-red-500/20 rounded-[1.5rem]">
            <p className="text-red-400 font-medium">Failed to load your feed.</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="flex flex-col gap-6">
            {posts.map((post) => {
              // Map the correct arrow color from the backend
              const stateRecord = voteStates?.find((vs: any) => vs.postId === post.id);
              const initialVote = stateRecord ? (stateRecord.isUpvote ? 'up' : 'down') : null;

              return (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  currentUserId={currentUser?.userId} 
                  isJoined={true} // Safe to assume true on the home feed!
                  initialVoteState={initialVote}
                  onCardClick={() => setSelectedPostId(post.id)} 
                />
              );
            })}
          </div>
        ) : (
          // Empty State (User hasn't joined communities or communities are empty)
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[1.5rem] flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">It's quiet in here...</h3>
            <p className="text-gray-400 max-w-md mb-6">
              Your feed is empty. Explore communities to find discussions that match your career path!
            </p>
            <Link to="/explore" className="px-6 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold rounded-xl transition-all">
              Discover Communities
            </Link>
          </div>
        )}
      </div>

      {/* Render the Modal Overlay */}
      {selectedPostId && (
        <PostDetailsModal 
          postId={selectedPostId} 
          onClose={() => setSelectedPostId(null)} 
          currentUserId={currentUser?.userId}
          isJoined={true} // Safe to assume true on the home feed!
        />
      )}
    </div>
  );
};